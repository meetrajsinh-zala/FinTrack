from django.urls import path
from .views import get_all_accounts, get_transections, transfers, get_transactions

urlpatterns = [
    path("getAllAccounts/", get_all_accounts, name="get_all_accounts"),
    path("getTransections/", get_transections, name="get_transections"),
    path("transfer/", transfers, name="transfers"),
    path("fetchTransaction/", get_transactions, name="get_transactions"),
]
