from django.urls import path
from .views import get_all_accounts

urlpatterns = [
    path('getAllAccounts/',get_all_accounts,name='get_all_accounts'),
]
