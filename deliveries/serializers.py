from rest_framework import serializers
from .models import Delivery, TransportModel, PackageType, Service, DeliveryStatus, CargoType

class TransportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportModel
        fields = ['id', 'name']

class PackageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageType
        fields = ['id', 'name']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']

class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatus
        fields = ['id', 'name']

class CargoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoType
        fields = ['id', 'name']

class DeliverySerializer(serializers.ModelSerializer):
    transport_model = TransportModelSerializer(read_only=True)
    package_type = PackageTypeSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    status = DeliveryStatusSerializer(read_only=True)
    cargo_type = CargoTypeSerializer(read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = Delivery
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at'] 