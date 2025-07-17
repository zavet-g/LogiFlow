import factory
from factory.django import DjangoModelFactory
from django.contrib.auth.models import User
from .models import (
    TransportModel, PackageType, Service, DeliveryStatus, 
    CargoType, Delivery
)


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')


class TransportModelFactory(DjangoModelFactory):
    class Meta:
        model = TransportModel

    name = factory.Faker('random_element', elements=[
        'Газель', 'Грузовик 5 тонн', 'Фургон', 'Пикап', 'Микроавтобус'
    ])


class PackageTypeFactory(DjangoModelFactory):
    class Meta:
        model = PackageType

    name = factory.Faker('random_element', elements=[
        'Пакет до 1 кг', 'Целофан', 'Коробка', 'Контейнер', 'Паллета'
    ])


class ServiceFactory(DjangoModelFactory):
    class Meta:
        model = Service

    name = factory.Faker('random_element', elements=[
        'До клиента', 'Хрупкий груз', 'Мед.товары', 'Экспресс доставка', 'Сборный груз'
    ])


class DeliveryStatusFactory(DjangoModelFactory):
    class Meta:
        model = DeliveryStatus

    name = factory.Faker('random_element', elements=[
        'В ожидании', 'В пути', 'Доставлено', 'Отменено', 'Возврат'
    ])


class CargoTypeFactory(DjangoModelFactory):
    class Meta:
        model = CargoType

    name = factory.Faker('random_element', elements=[
        'Обычный', 'Хрупкий', 'Опасный', 'Скоропортящийся', 'Габаритный'
    ])


class DeliveryFactory(DjangoModelFactory):
    class Meta:
        model = Delivery

    transport_model = factory.SubFactory(TransportModelFactory)
    transport_number = factory.Faker('license_plate')
    send_time = factory.Faker('date_time_this_year')
    delivery_time = factory.Faker('date_time_this_year')
    distance_km = factory.Faker('random_int', min=10, max=500)
    address_from = factory.Faker('address')
    address_to = factory.Faker('address')
    service = factory.SubFactory(ServiceFactory)
    status = factory.SubFactory(DeliveryStatusFactory)
    package_type = factory.SubFactory(PackageTypeFactory)
    cargo_type = factory.SubFactory(CargoTypeFactory)
    tech_state = factory.Faker('random_element', elements=['Исправно', 'Неисправно'])
    created_by = factory.SubFactory(UserFactory) 