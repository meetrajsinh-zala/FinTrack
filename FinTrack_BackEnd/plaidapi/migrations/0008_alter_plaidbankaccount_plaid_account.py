# Generated by Django 5.1.1 on 2024-09-16 05:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plaidapi', '0007_plaidaccount_institution_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plaidbankaccount',
            name='plaid_account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bank_accounts', to='plaidapi.plaidaccount'),
        ),
    ]
