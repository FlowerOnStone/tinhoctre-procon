# Generated by Django 4.2 on 2024-07-17 08:09

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_match_testcase'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='submission_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]