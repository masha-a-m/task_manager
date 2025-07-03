from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    has_completed_onboarding = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']




class Task(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title