from django.urls import path
from .views import create_link_token, exchange_public_token, get_account

urlpatterns = [
    path("create_link_token/", create_link_token, name="create_link_token"),
    path("exchange_public_token/", exchange_public_token, name="exchange_public_token"),
    path("get_account/", get_account, name="get_account"),
]
