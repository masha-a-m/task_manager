# Generated by Django 5.2.3 on 2025-07-02 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_alter_customuser_email_alter_customuser_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='has_completed_onboarding',
            field=models.BooleanField(default=False),
        ),
    ]
