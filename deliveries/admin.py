from django.contrib import admin
from .models import (
    TransportModel, PackageType, Service, DeliveryStatus, CargoType, Delivery
)

@admin.register(TransportModel)
class TransportModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(PackageType)
class PackageTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(DeliveryStatus)
class DeliveryStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(CargoType)
class CargoTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'created_by', 'transport_model', 'transport_number', 'package_type',
        'service', 'status', 'cargo_type', 'distance_km', 'send_time', 'delivery_time', 'created_at'
    )
    list_filter = ('status', 'service', 'package_type', 'transport_model', 'cargo_type')
    search_fields = ('transport_number', 'address_from', 'address_to')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'send_time'
