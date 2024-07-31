# Generated by Django 4.2 on 2024-07-30 07:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_alter_testdata_generator_alter_testdata_referee_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='status',
            field=models.CharField(choices=[('F', 'First Win'), ('S', 'Second Win'), ('D', 'Draw'), ('Q', 'In Queue'), ('P', 'Processing')], default='Q', max_length=1),
        ),
    ]