# Generated by Django 4.2 on 2024-07-21 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_rename_participant_tournament_participants'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='creators',
        ),
        migrations.AddField(
            model_name='group',
            name='status',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='tournament',
            name='num_group',
            field=models.IntegerField(default=8),
        ),
    ]
