from django.urls import path
from .views import create_link_token, exchange_public_token, make_transaction

urlpatterns = [
    path("create_link_token/", create_link_token, name="create_link_token"),
    path("exchange_public_token/", exchange_public_token, name="exchange_public_token"),
    path("make-transaction/", make_transaction, name="make_transaction"),
]
