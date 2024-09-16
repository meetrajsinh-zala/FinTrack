from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone 

class PlaidAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    item_id = models.CharField(max_length=255, null=True, blank=True)
    account_id = models.CharField(max_length=255,blank=True,null=True)
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    institution_id = models.CharField(max_length=255, null=True, blank=True)   

class Dwolla_customer_details(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    customer_id = models.CharField(max_length=255)

class FundingSource(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    funding_source_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50)
    type = models.CharField(max_length=50,default='unknown')
    name = models.CharField(max_length=255)
    created = models.DateTimeField(default=timezone.now)
    removed = models.BooleanField(default=False)
    bank_name = models.CharField(max_length=255, null=True, blank=True)
    fingerprint = models.CharField(max_length=255, null=True, blank=True)