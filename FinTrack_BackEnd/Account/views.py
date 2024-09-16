import os,datetime
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from plaidapi.models import PlaidAccount
from django.contrib.auth.models import User
from plaid.model.accounts_get_request import AccountsGetRequest
import plaid
from plaid.api import plaid_api
from django.http import JsonResponse
from plaid.model.transactions_get_request import TransactionsGetRequest
import logging

load_dotenv()

logger = logging.getLogger(__name__)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_accounts(request):
    user = request.user
    plaid_accounts = PlaidAccount.objects.filter(user=user)
    
    all_accounts = []
    institution_name = None 

    for account in plaid_accounts:
        request_data = AccountsGetRequest(access_token=account.access_token)
        response = client.accounts_get(request_data)
        institution_name = account.institution_name  
        for account_data in response.to_dict()["accounts"]:
            account_data['institution_name'] = institution_name
            all_accounts.append(account_data)
        
    return JsonResponse(all_accounts,safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transections(request):
    user = request.user
    plaid_accounts = PlaidAccount.objects.filter(user=user)
    transactions = []
    
    for account in plaid_accounts:
        try:
            request_params = TransactionsGetRequest(
                access_token=account.access_token,
                start_date=datetime.date(2023, 1, 1),
                end_date=datetime.date(2024, 1, 1)
            )
            response = client.transactions_get(request_params)
            response_data = response.to_dict()
            logger.info(f"Transactions response for account {account.account_id}: {response_data}")
            transactions.extend(response_data.get('transactions', []))
        except Exception as e:
            logger.error(f"Error fetching transactions for account {account.account_id}: {e}")
    
    return JsonResponse(transactions, safe=False)
    