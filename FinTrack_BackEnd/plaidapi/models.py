from django.db import models
from django.contrib.auth.models import User


class PlaidAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.CharField(max_length=255)
    item_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Track when the token was created/added
    updated_at = models.DateTimeField(
        auto_now=True
    )  # Track when the token was last updated

    def __str__(self):
        return f"{self.user.username}'s Plaid Account"
