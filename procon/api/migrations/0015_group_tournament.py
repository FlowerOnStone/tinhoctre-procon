# Generated by Django 4.2 on 2024-07-17 08:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_match_first_submission_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='tournament',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.tournament'),
        ),
    ]
