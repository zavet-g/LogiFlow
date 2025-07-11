from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from deliveries.models import (
    TransportModel, PackageType, Service, DeliveryStatus, CargoType, Delivery
)
from datetime import datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Загружает тестовые данные для системы доставок'

    def handle(self, *args, **options):
        self.stdout.write('Загрузка тестовых данных...')
        
        # Создаем суперпользователя
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Администратор',
                last_name='Системы',
                phone='+7 (999) 123-45-67',
                address='г. Москва, ул. Примерная, д. 1'
            )
            self.stdout.write(self.style.SUCCESS('Создан суперпользователь: admin/admin123'))
        
        # Создаем модели транспорта
        transport_models = [
            'Газель',
            'Грузовик 5 тонн',
            'Грузовик 10 тонн',
            'Фургон',
            'Пикап'
        ]
        
        for name in transport_models:
            TransportModel.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Созданы модели транспорта'))
        
        # Создаем типы упаковки
        package_types = [
            'Пакет до 1 кг',
            'Целофан',
            'Коробка',
            'Паллет',
            'Контейнер'
        ]
        
        for name in package_types:
            PackageType.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Созданы типы упаковки'))
        
        # Создаем услуги
        services = [
            'До клиента',
            'Хрупкий груз',
            'Мед.товары',
            'Срочная доставка',
            'Доставка в выходные'
        ]
        
        for name in services:
            Service.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Созданы услуги'))
        
        # Создаем статусы доставки
        statuses = [
            'В ожидании',
            'В пути',
            'Доставлено',
            'Отменено',
            'Проведено'
        ]
        
        for name in statuses:
            DeliveryStatus.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Созданы статусы доставки'))
        
        # Создаем типы груза
        cargo_types = [
            'Обычный груз',
            'Хрупкий груз',
            'Опасный груз',
            'Скоропортящийся',
            'Крупногабаритный'
        ]
        
        for name in cargo_types:
            CargoType.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Созданы типы груза'))
        
        # Создаем тестовые доставки
        admin_user = User.objects.get(username='admin')
        transport = TransportModel.objects.first()
        package = PackageType.objects.first()
        service = Service.objects.first()
        status = DeliveryStatus.objects.first()
        cargo = CargoType.objects.first()
        
        # Создаем несколько тестовых доставок
        for i in range(1, 6):
            send_time = datetime.now() + timedelta(hours=i)
            delivery_time = send_time + timedelta(hours=2)
            
            Delivery.objects.get_or_create(
                transport_number=f'А{i:03d}БВ{i:02d}',
                defaults={
                    'created_by': admin_user,
                    'transport_model': transport,
                    'package_type': package,
                    'service': service,
                    'status': status,
                    'cargo_type': cargo,
                    'distance_km': 10.5 + i,
                    'address_from': f'г. Москва, ул. Отправления, д. {i}',
                    'address_to': f'г. Москва, ул. Доставки, д. {i}',
                    'send_time': send_time,
                    'delivery_time': delivery_time,
                    'tech_state': 'Хорошее'
                }
            )
        
        self.stdout.write(self.style.SUCCESS('Созданы тестовые доставки'))
        self.stdout.write(self.style.SUCCESS('Тестовые данные загружены успешно!'))
        
        self.stdout.write('\nДоступные аккаунты:')
        self.stdout.write('- Админ: admin/admin123') 