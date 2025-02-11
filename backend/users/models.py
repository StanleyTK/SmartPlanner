from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    # Store hashed passwords
    password = models.CharField(max_length=128)  

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
