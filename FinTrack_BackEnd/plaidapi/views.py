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

from .models import PlaidAccount
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

    plaid_account = PlaidAccount.objects.create(
        user=user,
        access_token=access_token,
        item_id=item_id,
    )

    return JsonResponse({"public_token_exchange": "complete"})


def get_account(request):
    user = User.objects.get(username="newuser")
    user = PlaidAccount.objects.get(user=user.id)
    access_token = user.access_token
    req = AccountsGetRequest(
        access_token=access_token,
    )
    accounts_response = client.accounts_get(req)
    print(accounts_response["accounts"][0]["account_id"])
    create_processor_token(access_token, accounts_response["accounts"][0]["account_id"])
    return JsonResponse(accounts_response.to_dict())


def create_processor_token(access_token, account_id):
    create_request = ProcessorTokenCreateRequest(
        access_token=access_token, account_id=account_id, processor="dwolla"
    )
    create_response = client.processor_token_create(create_request)
    processor_token = create_response["processor_token"]
    print(create_response)


def dwollo_req():
    pass
