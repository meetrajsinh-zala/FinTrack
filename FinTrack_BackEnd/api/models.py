from django.contrib.auth.models import User
from django.db import models


class UserDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    date_of_birth = models.DateField(null=True, blank=True)
