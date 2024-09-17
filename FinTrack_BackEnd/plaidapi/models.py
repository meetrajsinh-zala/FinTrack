from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class PlaidAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    item_id = models.CharField(max_length=255, null=True, blank=True)
    account_id = models.CharField(max_length=255, blank=True, null=True)
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    institution_id = models.CharField(max_length=255, null=True, blank=True)


class Dwolla_customer_details(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    customer_id = models.CharField(max_length=255)


class FundingSource(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plaid_account = models.ForeignKey(
        PlaidAccount,
        on_delete=models.CASCADE,
        related_name="funding_sources",
        null=True,
        blank=True,
    )
    funding_source_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50)
    type = models.CharField(max_length=50, default="unknown")
    name = models.CharField(max_length=255)
    created = models.DateTimeField(default=timezone.now)
    removed = models.BooleanField(default=False)
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    fingerprint = models.CharField(max_length=255, null=True, blank=True)


from django.db import models
from django.contrib.auth.models import User


class DwollaTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dwolla_transaction_id = models.CharField(max_length=255, unique=True)
    source_account = models.CharField(max_length=255)  # Bank account details
    recipient_email = models.EmailField()  # Recipient's email
    recipient_account_number = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transfer_note = models.TextField(blank=True, null=True)  # Optional note
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dwolla_transaction_id} - {self.amount}"
