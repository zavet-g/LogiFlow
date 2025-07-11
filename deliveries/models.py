from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class TransportModel(models.Model):
    name = models.CharField('Модель транспорта', max_length=100)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Модель транспорта'
        verbose_name_plural = 'Модели транспорта'

class PackageType(models.Model):
    name = models.CharField('Тип упаковки', max_length=100)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Тип упаковки'
        verbose_name_plural = 'Типы упаковки'

class Service(models.Model):
    name = models.CharField('Услуга', max_length=100)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

class DeliveryStatus(models.Model):
    name = models.CharField('Статус доставки', max_length=100)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Статус доставки'
        verbose_name_plural = 'Статусы доставки'

class CargoType(models.Model):
    name = models.CharField('Тип груза', max_length=100)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = 'Тип груза'
        verbose_name_plural = 'Типы груза'

class Delivery(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Кто создал')
    transport_model = models.ForeignKey(TransportModel, on_delete=models.PROTECT, verbose_name='Модель транспорта')
    transport_number = models.CharField('Номер транспорта', max_length=50)
    package_type = models.ForeignKey(PackageType, on_delete=models.PROTECT, verbose_name='Тип упаковки')
    service = models.ForeignKey(Service, on_delete=models.PROTECT, verbose_name='Услуга')
    status = models.ForeignKey(DeliveryStatus, on_delete=models.PROTECT, verbose_name='Статус доставки')
    cargo_type = models.ForeignKey(CargoType, on_delete=models.PROTECT, null=True, blank=True, verbose_name='Тип груза')
    distance_km = models.DecimalField('Дистанция (км)', max_digits=6, decimal_places=2)
    address_from = models.CharField('Адрес отправления', max_length=255, blank=True)
    address_to = models.CharField('Адрес доставки', max_length=255, blank=True)
    send_time = models.DateTimeField('Время отправки')
    delivery_time = models.DateTimeField('Время доставки')
    media = models.FileField('Медиафайл', upload_to='deliveries/', blank=True, null=True)
    tech_state = models.CharField('Техническое состояние', max_length=100, blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    def __str__(self):
        return f"Доставка #{self.id} — {self.service} ({self.status})"
    class Meta:
        verbose_name = 'Доставка'
        verbose_name_plural = 'Доставки'
        ordering = ['-created_at']
