# Generated by Django 4.2.7 on 2025-07-11 13:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CargoType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Тип груза')),
            ],
            options={
                'verbose_name': 'Тип груза',
                'verbose_name_plural': 'Типы груза',
            },
        ),
        migrations.CreateModel(
            name='DeliveryStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Статус доставки')),
            ],
            options={
                'verbose_name': 'Статус доставки',
                'verbose_name_plural': 'Статусы доставки',
            },
        ),
        migrations.CreateModel(
            name='PackageType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Тип упаковки')),
            ],
            options={
                'verbose_name': 'Тип упаковки',
                'verbose_name_plural': 'Типы упаковки',
            },
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Услуга')),
            ],
            options={
                'verbose_name': 'Услуга',
                'verbose_name_plural': 'Услуги',
            },
        ),
        migrations.CreateModel(
            name='TransportModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Модель транспорта')),
            ],
            options={
                'verbose_name': 'Модель транспорта',
                'verbose_name_plural': 'Модели транспорта',
            },
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transport_number', models.CharField(max_length=50, verbose_name='Номер транспорта')),
                ('distance_km', models.DecimalField(decimal_places=2, max_digits=6, verbose_name='Дистанция (км)')),
                ('address_from', models.CharField(blank=True, max_length=255, verbose_name='Адрес отправления')),
                ('address_to', models.CharField(blank=True, max_length=255, verbose_name='Адрес доставки')),
                ('send_time', models.DateTimeField(verbose_name='Время отправки')),
                ('delivery_time', models.DateTimeField(verbose_name='Время доставки')),
                ('media', models.FileField(blank=True, null=True, upload_to='deliveries/', verbose_name='Медиафайл')),
                ('tech_state', models.CharField(blank=True, max_length=100, verbose_name='Техническое состояние')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
                ('cargo_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='deliveries.cargotype', verbose_name='Тип груза')),
            ],
            options={
                'verbose_name': 'Доставка',
                'verbose_name_plural': 'Доставки',
                'ordering': ['-created_at'],
            },
        ),
    ]
