# tasks/utils.py

from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(user, token):
    verification_link = f'https://yourdomain.com/verify-email/ {token}'
    subject = "Verify Your Email"
    message = f"Click the link to verify your email: {verification_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])