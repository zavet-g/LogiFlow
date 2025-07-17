import pytest
import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .factories import (
    UserFactory, DeliveryFactory, ServiceFactory, 
    CargoTypeFactory, DeliveryStatusFactory
)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = UserFactory(username='testuser', password='testpass123')
        self.login_url = reverse('login')

    def test_login_page_get(self):
        """Тест GET запроса на страницу авторизации"""
        response = self.client.get(reverse('login_page'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'deliveries/login.html')

    def test_login_success(self):
        """Тест успешной авторизации"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])

    def test_login_invalid_credentials(self):
        """Тест неуспешной авторизации с неверными данными"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertIn('error', response_data)

    def test_login_missing_data(self):
        """Тест авторизации с отсутствующими данными"""
        data = {'username': 'testuser'}
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertIn('error', response_data)


class ReportViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.client.force_login(self.user)
        self.report_url = reverse('report')
        
        # Создаем тестовые данные
        self.service = ServiceFactory()
        self.cargo_type = CargoTypeFactory()
        self.status = DeliveryStatusFactory()
        self.delivery = DeliveryFactory(
            service=self.service,
            cargo_type=self.cargo_type,
            status=self.status,
            created_by=self.user
        )

    def test_report_page_authenticated(self):
        """Тест доступа к странице отчета для авторизованного пользователя"""
        response = self.client.get(self.report_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'deliveries/report.html')

    def test_report_page_unauthenticated(self):
        """Тест доступа к странице отчета для неавторизованного пользователя"""
        self.client.logout()
        response = self.client.get(self.report_url)
        self.assertEqual(response.status_code, 302)  # Редирект на логин

    def test_report_page_with_filters(self):
        """Тест страницы отчета с фильтрами"""
        response = self.client.get(self.report_url, {
            'service': self.service.id,
            'cargo_type': self.cargo_type.id,
            'status': self.status.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('deliveries', response.context)
        self.assertIn('services', response.context)
        self.assertIn('cargo_types', response.context)
        self.assertIn('statuses', response.context)
        self.assertIn('chart_data', response.context)

    def test_report_page_with_date_filters(self):
        """Тест страницы отчета с фильтрами по дате"""
        from datetime import date, timedelta
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        response = self.client.get(self.report_url, {
            'date_from': yesterday.strftime('%Y-%m-%d'),
            'date_to': today.strftime('%Y-%m-%d')
        })
        self.assertEqual(response.status_code, 200)

    def test_report_page_context_data(self):
        """Тест контекстных данных страницы отчета"""
        response = self.client.get(self.report_url)
        
        # Проверяем наличие всех необходимых данных в контексте
        self.assertIn('deliveries', response.context)
        self.assertIn('services', response.context)
        self.assertIn('cargo_types', response.context)
        self.assertIn('statuses', response.context)
        self.assertIn('chart_data', response.context)
        self.assertIn('filters', response.context)
        
        # Проверяем, что доставка присутствует в контексте
        deliveries = response.context['deliveries']
        self.assertIn(self.delivery, deliveries)


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.client.force_login(self.user)
        self.logout_url = reverse('logout')

    def test_logout_success(self):
        """Тест успешного выхода из системы"""
        response = self.client.get(self.logout_url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])


class DeliveryDataAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.client.force_login(self.user)
        self.api_url = reverse('delivery_data_api')
        
        # Создаем тестовые данные
        self.service = ServiceFactory()
        self.cargo_type = CargoTypeFactory()
        self.status = DeliveryStatusFactory()
        self.delivery = DeliveryFactory(
            service=self.service,
            cargo_type=self.cargo_type,
            status=self.status,
            created_by=self.user
        )

    def test_delivery_data_api_get(self):
        """Тест GET запроса к API данных доставок"""
        response = self.client.get(self.api_url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_delivery_data_api_with_filters(self):
        """Тест API с фильтрами"""
        response = self.client.get(self.api_url, {
            'service': self.service.id,
            'cargo_type': self.cargo_type.id,
            'status': self.status.id
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_delivery_data_api_with_date_filters(self):
        """Тест API с фильтрами по дате"""
        from datetime import date, timedelta
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        response = self.client.get(self.api_url, {
            'date_from': yesterday.strftime('%Y-%m-%d'),
            'date_to': today.strftime('%Y-%m-%d')
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)


@pytest.mark.integration
class DeliveryViewsIntegrationTest(TestCase):
    """Интеграционные тесты для views доставок"""
    
    def setUp(self):
        self.client = Client()
        self.user = UserFactory()
        self.client.force_login(self.user)

    def test_full_delivery_workflow(self):
        """Тест полного workflow работы с доставками"""
        # 1. Создаем доставку
        delivery = DeliveryFactory(created_by=self.user)
        
        # 2. Проверяем, что она отображается в отчете
        response = self.client.get(reverse('report'))
        self.assertEqual(response.status_code, 200)
        self.assertIn(delivery, response.context['deliveries'])
        
        # 3. Проверяем, что она доступна через API
        api_response = self.client.get(reverse('delivery_data_api'))
        self.assertEqual(api_response.status_code, 200)
        api_data = api_response.json()
        delivery_ids = [item['id'] for item in api_data]
        self.assertIn(delivery.id, delivery_ids)

    def test_filtering_integration(self):
        """Тест интеграции фильтрации"""
        # Создаем доставки с разными параметрами
        service1 = ServiceFactory(name="Услуга 1")
        service2 = ServiceFactory(name="Услуга 2")
        
        delivery1 = DeliveryFactory(service=service1, created_by=self.user)
        delivery2 = DeliveryFactory(service=service2, created_by=self.user)
        
        # Фильтруем по первой услуге
        response = self.client.get(reverse('report'), {'service': service1.id})
        self.assertEqual(response.status_code, 200)
        deliveries = response.context['deliveries']
        
        self.assertIn(delivery1, deliveries)
        self.assertNotIn(delivery2, deliveries) 