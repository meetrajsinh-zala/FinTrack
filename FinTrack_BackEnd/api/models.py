from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class CustomUser(AbstractUser):
    address = models.CharField(max_length=255)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    date_of_birth = models.DateField(null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # Avoid conflict with the default 'user_set'
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions_set",  # Avoid conflict with the default 'user_set'
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
