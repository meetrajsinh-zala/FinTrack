import os, datetime, json
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from plaidapi.models import PlaidAccount
from django.contrib.auth.models import User
from .models import transectionCursor, Transaction
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
import plaid
from plaid.api import plaid_api
from django.http import JsonResponse
import logging
from plaidapi.models import DwollaTransaction
from rest_framework.response import Response
from .serializers import TransactionSerializer

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


@api_view(["GET"])
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
            account_data["institution_name"] = institution_name
            all_accounts.append(account_data)

    return JsonResponse(all_accounts, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_transections(request):
    body = json.loads(request.body)
    account_id = body["selectedBankId"]
    plaid_account = PlaidAccount.objects.get(account_id=account_id)
    try:
        cursor_obj = transectionCursor.objects.get(plaid_account=plaid_account)
        cursor = cursor_obj.cursor
    except transectionCursor.DoesNotExist:
        cursor = ""

    added = []
    modified = []
    removed = []
    has_more = True

    while has_more:
        req = TransactionsSyncRequest(
            access_token=plaid_account.access_token, cursor=cursor, count=100
        )
        response = client.transactions_sync(req)

        added.extend(response["added"])
        modified.extend(response["modified"])
        removed.extend(response["removed"])
        has_more = response["has_more"]
        cursor = response["next_cursor"]

    transectionCursor.objects.update_or_create(
        plaid_account=plaid_account, defaults={"cursor": cursor}
    )

    for trans in added:
        transaction_data = {
            "transaction_id": trans["transaction_id"],
            "amount": trans.get("amount"),
            "date": trans.get("authorized_date"),
            "name": f"{request.user.first_name} {request.user.last_name}",
            "status": trans.get("pending", False),
            "category": trans.get("category"),
        }

        Transaction.objects.update_or_create(
            transaction_id=transaction_data["transaction_id"],
            defaults={
                "user": request.user,
                "plaid_account": plaid_account,
                "amount": transaction_data["amount"],
                "date": transaction_data["date"],
                "name": transaction_data["name"],
                "status": "Pending" if transaction_data["status"] else "Completed",
                "category": transaction_data["category"],
            },
        )

    return JsonResponse({"message": "Transactions saved successfully!"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    body = json.loads(request.body)
    account_id = body["selectedBankId"]
    plaid_account = PlaidAccount.objects.get(account_id=account_id)
    transactions = Transaction.objects.filter(plaid_account=plaid_account)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transfers(request):
    user = request.user
    try:
        # Fetch transactions for the user
        transactions = DwollaTransaction.objects.filter(user=user)

        # Check if transactions are found
        if not transactions.exists():
            return Response({"message": "No transactions found"}, status=404)

        # Serialize transactions (you might want to use a serializer here)
        transaction_list = list(
            transactions.values()
        )  # or use a serializer for better control

        return Response(
            {"transactions": transaction_list, "fname": user.first_name}, status=200
        )

    except Exception as e:
        logger.error(f"Error fetching transactions: {e}")
        return Response(
            {"error": "An error occurred while fetching transactions"}, status=500
        )
