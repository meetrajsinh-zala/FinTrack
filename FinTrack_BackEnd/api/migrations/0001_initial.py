# Generated by Django 5.1 on 2024-08-26 04:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Signup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('First_Name', models.CharField(max_length=70)),
                ('Last_Name', models.CharField(max_length=70)),
                ('Address', models.CharField(max_length=500)),
                ('State', models.CharField(max_length=50)),
                ('Zip_Code', models.IntegerField(max_length=6)),
                ('DOB', models.DateField(max_length=10)),
                ('Email', models.EmailField(max_length=200)),
                ('Password', models.CharField(max_length=16)),
            ],
        ),
    ]
