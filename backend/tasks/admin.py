from django.contrib import admin
from .models import Task, CustomUser

admin.site.register(Task)
admin.site.register(CustomUser)