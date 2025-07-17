import pytest
from django.test import TestCase
from .serializers import DeliverySerializer
from .factories import (
    DeliveryFactory, UserFactory, TransportModelFactory,
    ServiceFactory, DeliveryStatusFactory, PackageTypeFactory,
    CargoTypeFactory
)


class DeliverySerializerTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.transport_model = TransportModelFactory()
        self.service = ServiceFactory()
        self.status = DeliveryStatusFactory()
        self.package_type = PackageTypeFactory()
        self.cargo_type = CargoTypeFactory()
        
        self.delivery = DeliveryFactory(
            created_by=self.user,
            transport_model=self.transport_model,
            service=self.service,
            status=self.status,
            package_type=self.package_type,
            cargo_type=self.cargo_type
        )

    def test_delivery_serializer_fields(self):
        """Тест полей сериализатора доставки"""
        serializer = DeliverySerializer(self.delivery)
        data = serializer.data
        
        # Проверяем наличие всех необходимых полей
        expected_fields = [
            'id', 'name', 'transport_model', 'transport_number',
            'departure_time', 'delivery_time', 'distance_km',
            'departure_address', 'delivery_address', 'service',
            'status', 'package_type', 'cargo_type', 'technical_condition',
            'created_by', 'created_at', 'updated_at'
        ]
        
        for field in expected_fields:
            self.assertIn(field, data)

    def test_delivery_serializer_related_fields(self):
        """Тест связанных полей в сериализаторе"""
        serializer = DeliverySerializer(self.delivery)
        data = serializer.data
        
        # Проверяем, что связанные поля содержат правильные данные
        self.assertEqual(data['transport_model']['name'], self.transport_model.name)
        self.assertEqual(data['service']['name'], self.service.name)
        self.assertEqual(data['status']['name'], self.status.name)
        self.assertEqual(data['package_type']['name'], self.package_type.name)
        self.assertEqual(data['cargo_type']['name'], self.cargo_type.name)
        self.assertEqual(data['created_by']['username'], self.user.username)

    def test_delivery_serializer_validation(self):
        """Тест валидации сериализатора"""
        valid_data = {
            'name': 'Тестовая доставка',
            'transport_model': self.transport_model.id,
            'transport_number': 'A123BC',
            'departure_time': '2024-01-01T10:00:00Z',
            'delivery_time': '2024-01-01T12:00:00Z',
            'distance_km': 100,
            'departure_address': 'Москва, ул. Тестовая, 1',
            'delivery_address': 'Москва, ул. Тестовая, 2',
            'service': self.service.id,
            'status': self.status.id,
            'package_type': self.package_type.id,
            'cargo_type': self.cargo_type.id,
            'technical_condition': 'Исправно'
        }
        
        serializer = DeliverySerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())

    def test_delivery_serializer_invalid_data(self):
        """Тест валидации с неверными данными"""
        invalid_data = {
            'name': '',  # Пустое имя
            'distance_km': -10,  # Отрицательное расстояние
        }
        
        serializer = DeliverySerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertIn('distance_km', serializer.errors)

    def test_delivery_serializer_multiple_objects(self):
        """Тест сериализации нескольких объектов"""
        # Создаем несколько доставок
        deliveries = [
            DeliveryFactory(created_by=self.user),
            DeliveryFactory(created_by=self.user),
            DeliveryFactory(created_by=self.user)
        ]
        
        serializer = DeliverySerializer(deliveries, many=True)
        data = serializer.data
        
        self.assertEqual(len(data), 3)
        for item in data:
            self.assertIn('id', item)
            self.assertIn('name', item)
            self.assertIn('service', item)

    def test_delivery_serializer_datetime_format(self):
        """Тест формата дат в сериализаторе"""
        serializer = DeliverySerializer(self.delivery)
        data = serializer.data
        
        # Проверяем, что даты в правильном формате
        self.assertIn('departure_time', data)
        self.assertIn('delivery_time', data)
        self.assertIn('created_at', data)
        self.assertIn('updated_at', data)

    def test_delivery_serializer_nested_objects(self):
        """Тест вложенных объектов в сериализаторе"""
        serializer = DeliverySerializer(self.delivery)
        data = serializer.data
        
        # Проверяем структуру вложенных объектов
        transport_model = data['transport_model']
        self.assertIn('id', transport_model)
        self.assertIn('name', transport_model)
        self.assertIn('description', transport_model)
        
        service = data['service']
        self.assertIn('id', service)
        self.assertIn('name', service)
        self.assertIn('description', service)


@pytest.mark.unit
class DeliverySerializerUnitTests:
    """Модульные тесты для сериализатора доставок"""
    
    def test_serializer_creates_valid_instance(self):
        """Тест создания валидного экземпляра через сериализатор"""
        user = UserFactory()
        transport_model = TransportModelFactory()
        service = ServiceFactory()
        status = DeliveryStatusFactory()
        package_type = PackageTypeFactory()
        cargo_type = CargoTypeFactory()
        
        data = {
            'name': 'Новая доставка',
            'transport_model': transport_model.id,
            'transport_number': 'B456DE',
            'departure_time': '2024-01-01T10:00:00Z',
            'delivery_time': '2024-01-01T12:00:00Z',
            'distance_km': 150,
            'departure_address': 'Санкт-Петербург, ул. Новая, 1',
            'delivery_address': 'Санкт-Петербург, ул. Новая, 2',
            'service': service.id,
            'status': status.id,
            'package_type': package_type.id,
            'cargo_type': cargo_type.id,
            'technical_condition': 'Исправно'
        }
        
        serializer = DeliverySerializer(data=data)
        assert serializer.is_valid()
        
        delivery = serializer.save(created_by=user)
        assert delivery.name == 'Новая доставка'
        assert delivery.transport_model == transport_model
        assert delivery.service == service
        assert delivery.created_by == user 