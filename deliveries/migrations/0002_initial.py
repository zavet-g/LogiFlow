# Generated by Django 4.2.7 on 2025-07-11 13:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('deliveries', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='delivery',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Кто создал'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='package_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='deliveries.packagetype', verbose_name='Тип упаковки'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='service',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='deliveries.service', verbose_name='Услуга'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='deliveries.deliverystatus', verbose_name='Статус доставки'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='transport_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='deliveries.transportmodel', verbose_name='Модель транспорта'),
        ),
    ]
