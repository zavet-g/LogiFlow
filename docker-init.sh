#!/bin/bash

echo "🚀 Инициализация LogiFlow в Docker..."

# Ждем, пока база данных будет готова
echo "⏳ Ожидание готовности базы данных..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ База данных готова!"

# Применяем миграции
echo "📦 Применение миграций..."
python manage.py migrate

# Создаем суперпользователя, если его нет
echo "👤 Создание суперпользователя..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser('admin', 'admin@logiflow.com', 'admin123')
    print('✅ Суперпользователь создан: admin / admin123')
else:
    print('✅ Суперпользователь уже существует')
"

# Создаем тестовые данные
echo "📊 Создание тестовых данных..."
python manage.py shell -c "
from deliveries.models import *
from django.utils import timezone
from datetime import timedelta

# Создаем справочные данные
TransportModel.objects.get_or_create(name='Газель')[0]
TransportModel.objects.get_or_create(name='Фургон')[0]

PackageType.objects.get_or_create(name='Коробка')[0]
PackageType.objects.get_or_create(name='Пакет')[0]

Service.objects.get_or_create(name='До клиента')[0]
Service.objects.get_or_create(name='Хрупкий груз')[0]

DeliveryStatus.objects.get_or_create(name='В пути')[0]
DeliveryStatus.objects.get_or_create(name='Доставлено')[0]

CargoType.objects.get_or_create(name='Продукты')[0]
CargoType.objects.get_or_create(name='Электроника')[0]

# Создаем тестовые доставки
if Delivery.objects.count() == 0:
    for i in range(1, 11):
        delivery = Delivery.objects.create(
            transport_model=TransportModel.objects.first(),
            transport_number=f'A {i:03d} AA',
            package_type=PackageType.objects.first(),
            service=Service.objects.first(),
            status=DeliveryStatus.objects.first(),
            cargo_type=CargoType.objects.first(),
            distance_km=100 + i * 10,
            address_from=f'Адрес отправления {i}',
            address_to=f'Адрес доставки {i}',
            send_time=timezone.now() - timedelta(days=i),
            delivery_time=timezone.now() + timedelta(days=i),
            tech_state='Отличное'
        )
    print(f'✅ Создано {Delivery.objects.count()} тестовых доставок')
else:
    print(f'✅ Тестовые данные уже существуют ({Delivery.objects.count()} доставок)')
"

# Собираем статические файлы
echo "📁 Сбор статических файлов..."
python manage.py collectstatic --noinput

echo "🎉 Инициализация завершена!"
echo "🌐 Приложение доступно по адресу: http://localhost:8000/"
echo "🔐 Логин: admin / admin123" 