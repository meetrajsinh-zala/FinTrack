# Generated by Django 5.1 on 2024-08-26 05:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_signup_user_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='signup',
            old_name='User_Name',
            new_name='username',
        ),
    ]
