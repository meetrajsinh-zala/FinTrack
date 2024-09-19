from django.db import models
from plaidapi.models import PlaidAccount
from django.contrib.auth.models import User


# Create your models here.
class transectionCursor(models.Model):
    plaid_account = models.ForeignKey(
        PlaidAccount,
        on_delete=models.CASCADE,
        related_name="transaction_cursor",
        null=True,
        blank=True,
    )
    cursor = models.CharField(max_length=500)


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plaid_account = models.ForeignKey(PlaidAccount, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True,null=True,blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=155)
