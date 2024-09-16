from django.urls import path
from .views import get_all_accounts,get_transections

urlpatterns = [
    path('getAllAccounts/',get_all_accounts,name='get_all_accounts'),
    path('getTransections/',get_transections,name='get_transections')
]
