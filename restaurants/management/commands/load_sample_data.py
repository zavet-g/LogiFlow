from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from restaurants.models import Restaurant, Category, Dish
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Загружает тестовые данные в базу данных'

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
        
        # Создаем курьера
        if not User.objects.filter(username='courier1').exists():
            User.objects.create_user(
                username='courier1',
                email='courier1@example.com',
                password='courier123',
                first_name='Иван',
                last_name='Курьер',
                phone='+7 (999) 234-56-78',
                address='г. Москва, ул. Курьерская, д. 2',
                is_delivery_man=True
            )
            self.stdout.write(self.style.SUCCESS('Создан курьер: courier1/courier123'))
        
        # Создаем рестораны
        restaurant1, created = Restaurant.objects.get_or_create(
            name='Пиццерия "У Итальянца"',
            defaults={
                'description': 'Аутентичная итальянская пицца и паста',
                'address': 'г. Москва, ул. Итальянская, д. 10',
                'phone': '+7 (495) 123-45-67',
                'rating': Decimal('4.50'),
                'delivery_time': 30,
                'min_order': Decimal('500.00')
            }
        )
        
        restaurant2, created = Restaurant.objects.get_or_create(
            name='Суши-бар "Сакура"',
            defaults={
                'description': 'Свежие суши и роллы',
                'address': 'г. Москва, ул. Японская, д. 15',
                'phone': '+7 (495) 234-56-78',
                'rating': Decimal('4.30'),
                'delivery_time': 25,
                'min_order': Decimal('800.00')
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Созданы рестораны'))
        
        # Создаем категории для первого ресторана
        pizza_category, created = Category.objects.get_or_create(
            name='Пицца',
            restaurant=restaurant1,
            defaults={'description': 'Классическая итальянская пицца'}
        )
        
        pasta_category, created = Category.objects.get_or_create(
            name='Паста',
            restaurant=restaurant1,
            defaults={'description': 'Итальянская паста'}
        )
        
        # Создаем категории для второго ресторана
        sushi_category, created = Category.objects.get_or_create(
            name='Суши',
            restaurant=restaurant2,
            defaults={'description': 'Классические суши'}
        )
        
        rolls_category, created = Category.objects.get_or_create(
            name='Роллы',
            restaurant=restaurant2,
            defaults={'description': 'Японские роллы'}
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Созданы категории'))
        
        # Создаем блюда
        dishes_data = [
            {
                'name': 'Маргарита',
                'description': 'Классическая пицца с томатами и моцареллой',
                'price': Decimal('650.00'),
                'category': pizza_category,
                'preparation_time': 15
            },
            {
                'name': 'Пепперони',
                'description': 'Пицца с пепперони и моцареллой',
                'price': Decimal('750.00'),
                'category': pizza_category,
                'preparation_time': 15
            },
            {
                'name': 'Карбонара',
                'description': 'Паста с беконом, яйцом и пармезаном',
                'price': Decimal('450.00'),
                'category': pasta_category,
                'preparation_time': 12
            },
            {
                'name': 'Филадельфия',
                'description': 'Ролл с лососем и сливочным сыром',
                'price': Decimal('350.00'),
                'category': rolls_category,
                'preparation_time': 10
            },
            {
                'name': 'Калифорния',
                'description': 'Ролл с крабом и авокадо',
                'price': Decimal('300.00'),
                'category': rolls_category,
                'preparation_time': 10
            }
        ]
        
        for dish_data in dishes_data:
            dish, created = Dish.objects.get_or_create(
                name=dish_data['name'],
                category=dish_data['category'],
                defaults=dish_data
            )
        
        self.stdout.write(self.style.SUCCESS('Созданы блюда'))
        self.stdout.write(self.style.SUCCESS('Тестовые данные загружены успешно!'))
        
        self.stdout.write('\nДоступные аккаунты:')
        self.stdout.write('- Админ: admin/admin123')
        self.stdout.write('- Курьер: courier1/courier123') 