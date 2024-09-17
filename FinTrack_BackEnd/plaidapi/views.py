import requests
import base64
import os
from dotenv import load_dotenv
import json
from django.views.decorators.csrf import csrf_exempt
import plaid.configuration
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import (
    ItemPublicTokenExchangeRequest,
)
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
import plaid
from plaid.api import plaid_api
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .models import Dwolla_customer_details, PlaidAccount, FundingSource
from api.models import UserDetails
from django.contrib.auth.models import User

from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.processor_token_create_request import ProcessorTokenCreateRequest
from dwollav2 import Client
from .models import DwollaTransaction
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


load_dotenv()

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")

DWOLLA_KEY = os.getenv("DWOLLA_KEY")
DWOLLA_SECRET = os.getenv("DWOLLA_SECRET")

configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

dwolla_client = Client(
    key=DWOLLA_KEY,
    secret=DWOLLA_SECRET,
    environment="sandbox",
)


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_link_token(request):
    user = request.user
    client_user_id = str(user.id)
    Link_token = LinkTokenCreateRequest(
        products=[Products("auth"), Products("transactions")],
        client_name=f"{request.user.first_name} | FinTrack",
        country_codes=[CountryCode("US")],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=client_user_id),
    )
    response = client.link_token_create(Link_token)
    return JsonResponse(response.to_dict())


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def exchange_public_token(request):
    body = json.loads(request.body)
    public_token = body["public_token"]
    user = User.objects.get(username=request.user)

    req = ItemPublicTokenExchangeRequest(public_token=public_token)
    res = client.item_public_token_exchange(req)

    access_token = res["access_token"]
    item_id = res["item_id"]

    plaid_account, created = PlaidAccount.objects.get_or_create(
        user=user, item_id=item_id, defaults={"access_token": access_token}
    )

    if not created:
        plaid_account.access_token = access_token
        plaid_account.save()

    accounts_get_request = AccountsGetRequest(access_token=access_token)
    accounts_response = client.accounts_get(accounts_get_request)
    accounts = accounts_response["accounts"]

    institution_id = accounts_response["item"]["institution_id"]
    institutions_get_request = InstitutionsGetByIdRequest(
        institution_id=institution_id, country_codes=[CountryCode("US")]
    )
    institution_response = client.institutions_get_by_id(institutions_get_request)
    institution_name = institution_response["institution"]["name"]
    institution_id = institution_response["institution"]["institution_id"]

    plaid_account.institution_name = institution_name
    plaid_account.institution_id = institution_id
    plaid_account.save()

    if accounts:
        account = accounts[0]
        plaid_account.account_id = account["account_id"]
        plaid_account.save()
        create_processor_token(access_token, account["account_id"], request.user)

    return JsonResponse({"public_token_exchange": "complete"})


def create_processor_token(access_token, account_id, username):
    create_request = ProcessorTokenCreateRequest(
        access_token=access_token, account_id=account_id, processor="dwolla"
    )
    create_response = client.processor_token_create(create_request)
    processor_token = create_response["processor_token"]
    dwolla_access_token(username, processor_token, account_id)


def dwolla_access_token(username, processor_token, account_id):
    user = User.objects.get(username=username)
    credentials = f"{DWOLLA_KEY}:{DWOLLA_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    url = "https://api-sandbox.dwolla.com/token"
    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    payload = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=payload)

    if response.status_code == 200:
        response_json = response.json()
        access_token = response_json.get("access_token", None)
        try:
            Dwolla_customer_details.objects.get(user=user)
        except Dwolla_customer_details.DoesNotExist:
            create_dwolla_personal_verified_customer(access_token, username)

        create_funding_source(processor_token, access_token, username, account_id)


def create_dwolla_personal_verified_customer(access_token, username):
    user = User.objects.get(username=username)
    user_details = UserDetails.objects.get(user_id=user.id)
    url = "https://api-sandbox.dwolla.com/customers"
    headers = {
        "Content-Type": "application/vnd.dwolla.v1.hal+json",
        "Accept": "application/vnd.dwolla.v1.hal+json",
        "Authorization": f"Bearer {access_token}",
    }
    data = {
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "type": "personal",
        "address1": user_details.address,
        "city": "Anytown",
        "state": user_details.state,
        "postalCode": user_details.zip_code,
        "dateOfBirth": user_details.date_of_birth.isoformat(),
        "ssn": "1234",
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        print("Customer created successfully!")
        customer_id = response.headers.get("Location").split("/customers/")[1]
        Dwolla_customer_details.objects.create(user=user, customer_id=customer_id)
    else:
        print(f"Failed to create customer. Status code: {response.status_code}")
        print(response.text)


def create_funding_source(processor_token, access_token, username, account_id):
    user = User.objects.get(username=username)
    plaid_account = PlaidAccount.objects.get(account_id=account_id)
    customer_id = Dwolla_customer_details.objects.get(user_id=user.id).customer_id
    url = f"https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources"
    headers = {
        "Content-Type": "application/vnd.dwolla.v1.hal+json",
        "Accept": "application/vnd.dwolla.v1.hal+json",
        "Authorization": f"Bearer {access_token}",
    }
    data = {
        "plaidToken": f"{processor_token}",
        "name": f"{user.first_name} {user.last_name}",
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        store_funding_source_info(user, access_token, customer_id, plaid_account)
        print("Funding source created and stored successfully!")
    else:
        print(f"Failed to create funding source. Status code: {response.status_code}")
        print(response.text)


def store_funding_source_info(user, access_token, customer_id, plaid_account):
    url = f"https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources"
    headers = {
        "Content-Type": "application/vnd.dwolla.v1.hal+json",
        "Accept": "application/vnd.dwolla.v1.hal+json",
        "Authorization": f"Bearer {access_token}",
    }
    res = requests.get(url, headers=headers)
    response_json = res.json()
    funding_sources = response_json.get("_embedded", {}).get("funding-sources", [])

    for source in funding_sources:
        FundingSource.objects.update_or_create(
            funding_source_id=source["id"],
            defaults={
                "user": user,
                "plaid_account": plaid_account,
                "status": source["status"],
                "type": source["type"],
                "name": source["name"],
                "created": source["created"],
                "removed": source["removed"],
                "bank_name": source.get("bankName", ""),
                "fingerprint": source.get("fingerprint", ""),
            },
        )


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests
from decimal import Decimal
import logging

# Configure logger
logger = logging.getLogger(__name__)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests
from decimal import Decimal
import logging

# Configure logger
logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def make_transaction(request):
    dwolla_app_token = dwolla_client.Auth.client()
    try:
        user = request.user
        source_account = request.data.get("source_account")
        recipient_email = request.data.get("recipient_email")
        recipient_account_number = request.data.get("recipient_account_number")
        amount = request.data.get("amount")
        transfer_note = request.data.get("transfer_note", "")

        # Get funding source IDs
        source_account_funding_id = FundingSource.objects.get(
            plaid_account=PlaidAccount.objects.get(account_id=source_account)
        ).funding_source_id

        destination_account_funding_id = FundingSource.objects.get(
            plaid_account=PlaidAccount.objects.get(account_id=recipient_account_number)
        ).funding_source_id

        url = "https://api-sandbox.dwolla.com/transfers"

        # Prepare request body
        transfer_request_body = {
            "_links": {
                "source": {
                    "href": f"https://api-sandbox.dwolla.com/funding-sources/{source_account_funding_id}"
                },
                "destination": {
                    "href": f"https://api-sandbox.dwolla.com/funding-sources/{destination_account_funding_id}"
                },
            },
            "amount": {"currency": "USD", "value": str(Decimal(amount))},
        }

        # Set headers
        headers = {
            "Authorization": f"Bearer {dwolla_app_token.access_token}",
            "Accept": "application/vnd.dwolla.v1.hal+json",
            "Content-Type": "application/vnd.dwolla.v1.hal+json",
        }

        # Make POST request
        response = requests.post(url, json=transfer_request_body, headers=headers)

        # Log response details
        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"Response Body: {response.text}")

        # Check response status
        if response.status_code == 201:
            # Transaction successful, save to database
            transaction_id = response.headers.get("Location").split("/")[
                -1
            ]  # Extract transaction ID from headers
            transaction = DwollaTransaction.objects.create(
                user=user,
                dwolla_transaction_id=transaction_id,
                source_account=source_account,
                recipient_email=recipient_email,
                recipient_account_number=recipient_account_number,
                amount=Decimal(amount),
                transfer_note=transfer_note,
                status="pending",
            )
            return Response(
                {
                    "message": "Transaction initiated successfully",
                    "transaction_id": transaction.dwolla_transaction_id,
                    "amount": transaction.amount,
                }
            )
        else:
            # Log error and return response
            logger.error(f"Dwolla API error: {response.status_code} - {response.text}")
            return Response({"error": response.json()}, status=response.status_code)

    except requests.exceptions.RequestException as e:
        # Handle network errors
        logger.error(f"Request error: {e}")
        return Response({"error": "Network error occurred"}, status=500)
    except Exception as e:
        # Handle other errors
        logger.error(f"Error initiating transaction: {e}")
        return Response({"error": str(e)}, status=500)
