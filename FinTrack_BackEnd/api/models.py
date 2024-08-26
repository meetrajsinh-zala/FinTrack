from django.db import models


# Create your models here.
class Signup(models.Model):
    First_Name = models.CharField(max_length=70)
    Last_Name = models.CharField(max_length=70)
    Address = models.CharField(max_length=500)
    State = models.CharField(max_length=50)
    Zip_Code = models.CharField(max_length=6)
    DOB = models.DateField(max_length=10)
    username = models.CharField(max_length=70, default="user")
    Email = models.EmailField(max_length=200)
    Password = models.CharField(max_length=16)
