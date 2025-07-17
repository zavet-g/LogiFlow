import pytest
from django.test import TestCase
from django.urls import reverse, resolve
from .views import (
    report_view, login_page_view, login_view, 
    logout_view, delivery_data_api
)


class UrlsTest(TestCase):
    """Тесты для URL маршрутов"""

    def test_login_page_url(self):
        """Тест URL страницы авторизации"""
        url = reverse('login_page')
        self.assertEqual(url, '/')
        resolver = resolve(url)
        self.assertEqual(resolver.func, login_page_view)

    def test_report_url(self):
        """Тест URL страницы отчета"""
        url = reverse('report')
        self.assertEqual(url, '/deliveries/report/')
        resolver = resolve(url)
        self.assertEqual(resolver.func, report_view)

    def test_login_api_url(self):
        """Тест URL API авторизации"""
        url = reverse('login')
        self.assertEqual(url, '/deliveries/login/')
        resolver = resolve(url)
        self.assertEqual(resolver.func, login_view)

    def test_logout_url(self):
        """Тест URL выхода из системы"""
        url = reverse('logout')
        self.assertEqual(url, '/deliveries/logout/')
        resolver = resolve(url)
        self.assertEqual(resolver.func, logout_view)

    def test_delivery_data_api_url(self):
        """Тест URL API данных доставок"""
        url = reverse('delivery_data_api')
        self.assertEqual(url, '/deliveries/api/delivery-data/')
        resolver = resolve(url)
        self.assertEqual(resolver.func, delivery_data_api)

    def test_delivery_api_urls(self):
        """Тест URL API доставок (DRF)"""
        # Тестируем базовые URL для DRF
        from rest_framework.routers import DefaultRouter
        from .views import DeliveryViewSet
        
        router = DefaultRouter()
        router.register(r'deliveries', DeliveryViewSet, basename='delivery')
        
        # Проверяем, что URL генерируются корректно
        urls = router.urls
        self.assertGreater(len(urls), 0)


@pytest.mark.unit
class UrlPatternsTest:
    """Модульные тесты для паттернов URL"""
    
    def test_url_patterns_exist(self):
        """Тест существования всех необходимых URL паттернов"""
        expected_urls = [
            'login_page',
            'report', 
            'login',
            'logout',
            'delivery_data_api'
        ]
        
        for url_name in expected_urls:
            try:
                url = reverse(url_name)
                assert url is not None
            except Exception as e:
                pytest.fail(f"URL {url_name} не найден: {e}")

    def test_url_resolution(self):
        """Тест разрешения URL в правильные view функции"""
        url_mappings = {
            'login_page': login_page_view,
            'report': report_view,
            'login': login_view,
            'logout': logout_view,
            'delivery_data_api': delivery_data_api
        }
        
        for url_name, expected_view in url_mappings.items():
            try:
                url = reverse(url_name)
                resolver = resolve(url)
                assert resolver.func == expected_view
            except Exception as e:
                pytest.fail(f"Ошибка разрешения URL {url_name}: {e}") 