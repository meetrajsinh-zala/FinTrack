from django.contrib import admin
from .models import PlaidAccount, Dwolla_customer_details,FundingSource

# Register your models here.

admin.site.register(PlaidAccount)
admin.site.register(Dwolla_customer_details)
admin.site.register(FundingSource)
