from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from plaidapi.models import PlaidAccount

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_accounts(request):
    pass

# getAccounts to get multiple accounts
# getAccount to get one bank account
# getInstitution to get bank info
# getTransaction to get transections