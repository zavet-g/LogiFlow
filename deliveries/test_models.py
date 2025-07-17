import pytest
from django.test import TestCase
from django.contrib.auth.models import User
from .models import (
    TransportModel, PackageType, Service, DeliveryStatus, 
    CargoType, Delivery
)
from .factories import (
    UserFactory, TransportModelFactory, PackageTypeFactory,
    ServiceFactory, DeliveryStatusFactory, CargoTypeFactory,
    DeliveryFactory
)


class TransportModelTest(TestCase):
    def test_create_transport_model(self):
        """Тест создания модели транспорта"""
        transport = TransportModelFactory()
        self.assertIsNotNone(transport.id)
        self.assertIsNotNone(transport.name)

    def test_transport_model_str(self):
        """Тест строкового представления модели транспорта"""
        transport = TransportModelFactory(name="Газель")
        self.assertEqual(str(transport), "Газель")


class PackageTypeTest(TestCase):
    def test_create_package_type(self):
        """Тест создания типа упаковки"""
        package_type = PackageTypeFactory()
        self.assertIsNotNone(package_type.id)
        self.assertIsNotNone(package_type.name)

    def test_package_type_str(self):
        """Тест строкового представления типа упаковки"""
        package_type = PackageTypeFactory(name="Коробка")
        self.assertEqual(str(package_type), "Коробка")


class ServiceTest(TestCase):
    def test_create_service(self):
        """Тест создания услуги"""
        service = ServiceFactory()
        self.assertIsNotNone(service.id)
        self.assertIsNotNone(service.name)

    def test_service_str(self):
        """Тест строкового представления услуги"""
        service = ServiceFactory(name="До клиента")
        self.assertEqual(str(service), "До клиента")


class DeliveryStatusTest(TestCase):
    def test_create_delivery_status(self):
        """Тест создания статуса доставки"""
        status = DeliveryStatusFactory()
        self.assertIsNotNone(status.id)
        self.assertIsNotNone(status.name)

    def test_delivery_status_str(self):
        """Тест строкового представления статуса доставки"""
        status = DeliveryStatusFactory(name="В пути")
        self.assertEqual(str(status), "В пути")


class CargoTypeTest(TestCase):
    def test_create_cargo_type(self):
        """Тест создания типа груза"""
        cargo_type = CargoTypeFactory()
        self.assertIsNotNone(cargo_type.id)
        self.assertIsNotNone(cargo_type.name)

    def test_cargo_type_str(self):
        """Тест строкового представления типа груза"""
        cargo_type = CargoTypeFactory(name="Хрупкий")
        self.assertEqual(str(cargo_type), "Хрупкий")


class DeliveryTest(TestCase):
    def test_create_delivery(self):
        """Тест создания доставки"""
        delivery = DeliveryFactory()
        self.assertIsNotNone(delivery.id)
        self.assertIsNotNone(delivery.name)
        self.assertIsNotNone(delivery.transport_model)
        self.assertIsNotNone(delivery.service)
        self.assertIsNotNone(delivery.status)
        self.assertIsNotNone(delivery.created_by)

    def test_delivery_str(self):
        """Тест строкового представления доставки"""
        delivery = DeliveryFactory(name="Тестовая доставка")
        self.assertEqual(str(delivery), "Тестовая доставка")

    def test_delivery_distance_validation(self):
        """Тест валидации расстояния"""
        delivery = DeliveryFactory(distance_km=100)
        self.assertEqual(delivery.distance_km, 100)

    def test_delivery_technical_condition(self):
        """Тест технического состояния"""
        delivery = DeliveryFactory(technical_condition="Исправно")
        self.assertEqual(delivery.technical_condition, "Исправно")

    def test_delivery_relationships(self):
        """Тест связей между моделями"""
        user = UserFactory()
        transport = TransportModelFactory()
        service = ServiceFactory()
        status = DeliveryStatusFactory()
        package_type = PackageTypeFactory()
        cargo_type = CargoTypeFactory()

        delivery = DeliveryFactory(
            created_by=user,
            transport_model=transport,
            service=service,
            status=status,
            package_type=package_type,
            cargo_type=cargo_type
        )

        self.assertEqual(delivery.created_by, user)
        self.assertEqual(delivery.transport_model, transport)
        self.assertEqual(delivery.service, service)
        self.assertEqual(delivery.status, status)
        self.assertEqual(delivery.package_type, package_type)
        self.assertEqual(delivery.cargo_type, cargo_type)


@pytest.mark.unit
class DeliveryModelUnitTests:
    """Модульные тесты для модели Delivery"""
    
    def test_delivery_default_values(self):
        """Тест значений по умолчанию"""
        delivery = DeliveryFactory()
        assert delivery.name is not None
        assert delivery.transport_number is not None
        assert delivery.departure_address is not None
        assert delivery.delivery_address is not None

    def test_delivery_time_validation(self):
        """Тест валидации времени доставки"""
        delivery = DeliveryFactory()
        assert delivery.departure_time is not None
        assert delivery.delivery_time is not None

    def test_delivery_user_relationship(self):
        """Тест связи с пользователем"""
        user = UserFactory()
        delivery = DeliveryFactory(created_by=user)
        assert delivery.created_by == user
        assert delivery.created_by.username is not None 