# Generated by Django 4.2 on 2024-07-22 09:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_tournament_problem'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='name',
            field=models.CharField(default='123', max_length=64),
            preserve_default=False,
        ),
    ]
