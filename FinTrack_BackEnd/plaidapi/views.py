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
from django.http import JsonResponse

from .models import Dwolla_customer_details
from .models import PlaidAccount
from api.models import UserDetails
from django.contrib.auth.models import User

from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.processor_token_create_request import ProcessorTokenCreateRequest
from dwollav2 import Client

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
def create_link_token(request):
    body = json.loads(request.body)
    username = body["username"]
    user = User.objects.get(username=username)
    client_user_id = str(user.id)
    Link_token = LinkTokenCreateRequest(
        products=[Products("auth"), Products("transactions")],
        client_name="FinTrack",
        country_codes=[CountryCode("US")],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=client_user_id),
    )
    response = client.link_token_create(Link_token)
    return JsonResponse(response.to_dict())


@csrf_exempt
def exchange_public_token(request):
    body = json.loads(request.body)
    public_token = body["public_token"]
    username = body["username"]
    user = User.objects.get(username=username)

    req = ItemPublicTokenExchangeRequest(public_token=public_token)
    res = client.item_public_token_exchange(req)

    access_token = res["access_token"]
    item_id = res["item_id"]

    PlaidAccount.objects.create(
        user=user,
        access_token=access_token,
        item_id=item_id,
    )

    processor_token = get_account(username)
    dwolla_access_token(username, processor_token)
    return JsonResponse({"public_token_exchange": "complete"})


def get_account(username):
    user = User.objects.get(username=username)
    user = PlaidAccount.objects.get(user=user.id)
    access_token = user.access_token

    req = AccountsGetRequest(
        access_token=access_token,
    )
    accounts_response = client.accounts_get(req)

    processor_token = create_processor_token(
        access_token, accounts_response["accounts"][0]["account_id"]
    )
    return processor_token


def create_processor_token(access_token, account_id):
    create_request = ProcessorTokenCreateRequest(
        access_token=access_token, account_id=account_id, processor="dwolla"
    )
    create_response = client.processor_token_create(create_request)
    processor_token = create_response["processor_token"]
    return processor_token


def dwolla_access_token(username, processor_token):
    credentials = f"{DWOLLA_KEY}:{DWOLLA_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    # Prepare the request
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
        create_dwolla_personal_verified_customer(access_token, username)
        create_funding_source(processor_token, access_token, username)


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
    print(data)
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        print("Customer created successfully!")
        customer_id = response.headers.get("Location").split("/customers/")[1]
        Dwolla_customer_details.objects.create(user=user, customer_id=customer_id)
    else:
        print(f"Failed to create customer. Status code: {response.status_code}")
        print(response.text)


def create_funding_source(processor_token, access_token, username):
    user = User.objects.get(username=username)
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


# getAccounts to get multiple accounts
# getAccount to get one bank account
# getInstitution to get bank info
# getTransaction to get transections
