# Generated by Django 4.2 on 2024-07-17 08:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_submission_submission_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='first_submission',
        ),
        migrations.RemoveField(
            model_name='match',
            name='second_submission',
        ),
    ]