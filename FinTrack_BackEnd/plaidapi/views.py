from rest_framework import status
from rest_framework.response import Response
import os
from dotenv import load_dotenv
import jwt
from django.conf import settings
import json
import logging
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

load_dotenv()

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")

configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)


@csrf_exempt
def create_link_token(request):
    user = request.user
    client_user_id = str(user.id)
    print(client_user_id)
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
    try:
        body = json.loads(request.body)
        public_token = body.get("public_token")
        access_token = body.get("access_token")

        if access_token:
            try:
                payload = jwt.decode(
                    access_token, settings.SECRET_KEY, algorithms=["HS256"]
                )
                user_id = payload.get("user_id")

                if not user_id:
                    raise jwt.InvalidTokenError("User ID not found in token")

                user = User.objects.get(id=user_id)
                request.user = user  # Set the user on the request object
            except (
                jwt.ExpiredSignatureError,
                jwt.InvalidTokenError,
                User.DoesNotExist,
            ) as e:
                return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        if not public_token:
            return JsonResponse({"error": "public_token not provided"}, status=400)

        # Exchange public token for access token
        req = ItemPublicTokenExchangeRequest(public_token=public_token)
        res = client.item_public_token_exchange(req)

        access_token = res["access_token"]
        item_id = res["item_id"]

        # Save the access token and item_id to the PlaidAccount model
        user = request.user
        plaid_account, created = PlaidAccount.objects.get_or_create(user=user)
        plaid_account.access_token = access_token
        plaid_account.item_id = item_id
        plaid_account.save()

        return JsonResponse({"status": "success"})

    except plaid.ApiException as e:
        error_response = json.loads(e.body)
        logging.error(f"Plaid API Error: {error_response}")
        return JsonResponse({"error": error_response}, status=e.status)

    except Exception as e:
        logging.error(f"Error exchanging public token: {str(e)}")
        return JsonResponse({"error": "Something went wrong"}, status=500)
