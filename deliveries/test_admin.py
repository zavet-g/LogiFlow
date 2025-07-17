import pytest
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from .factories import (
    UserFactory, DeliveryFactory, TransportModelFactory,
    ServiceFactory, DeliveryStatusFactory, PackageTypeFactory,
    CargoTypeFactory
)


class AdminTest(TestCase):
    """Тесты для Django Admin"""

    def setUp(self):
        self.client = Client()
        # Создаем суперпользователя
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.client.login(username='admin', password='adminpass123')

    def test_admin_login(self):
        """Тест входа в админку"""
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 200)

    def test_delivery_admin_list(self):
        """Тест списка доставок в админке"""
        # Создаем тестовую доставку
        delivery = DeliveryFactory(created_by=self.admin_user)
        
        response = self.client.get(reverse('admin:deliveries_delivery_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, delivery.name)

    def test_transport_model_admin_list(self):
        """Тест списка моделей транспорта в админке"""
        transport = TransportModelFactory()
        
        response = self.client.get(reverse('admin:deliveries_transportmodel_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, transport.name)

    def test_service_admin_list(self):
        """Тест списка услуг в админке"""
        service = ServiceFactory()
        
        response = self.client.get(reverse('admin:deliveries_service_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, service.name)

    def test_delivery_status_admin_list(self):
        """Тест списка статусов доставки в админке"""
        status = DeliveryStatusFactory()
        
        response = self.client.get(reverse('admin:deliveries_deliverystatus_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, status.name)

    def test_package_type_admin_list(self):
        """Тест списка типов упаковки в админке"""
        package_type = PackageTypeFactory()
        
        response = self.client.get(reverse('admin:deliveries_packagetype_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, package_type.name)

    def test_cargo_type_admin_list(self):
        """Тест списка типов груза в админке"""
        cargo_type = CargoTypeFactory()
        
        response = self.client.get(reverse('admin:deliveries_cargotype_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, cargo_type.name)

    def test_delivery_admin_detail(self):
        """Тест детальной страницы доставки в админке"""
        delivery = DeliveryFactory(created_by=self.admin_user)
        
        response = self.client.get(
            reverse('admin:deliveries_delivery_change', args=[delivery.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, delivery.name)

    def test_delivery_admin_add(self):
        """Тест добавления доставки через админку"""
        response = self.client.get(reverse('admin:deliveries_delivery_add'))
        self.assertEqual(response.status_code, 200)

    def test_admin_search(self):
        """Тест поиска в админке"""
        delivery = DeliveryFactory(name="Тестовая доставка", created_by=self.admin_user)
        
        response = self.client.get(
            reverse('admin:deliveries_delivery_changelist'),
            {'q': 'Тестовая'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, delivery.name)

    def test_admin_filter(self):
        """Тест фильтрации в админке"""
        service = ServiceFactory()
        delivery = DeliveryFactory(service=service, created_by=self.admin_user)
        
        response = self.client.get(
            reverse('admin:deliveries_delivery_changelist'),
            {'service__id__exact': service.id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, delivery.name)


@pytest.mark.integration
class AdminIntegrationTest(TestCase):
    """Интеграционные тесты для админки"""

    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.client.login(username='admin', password='adminpass123')

    def test_admin_full_workflow(self):
        """Тест полного workflow в админке"""
        # 1. Создаем справочники
        transport = TransportModelFactory()
        service = ServiceFactory()
        status = DeliveryStatusFactory()
        package_type = PackageTypeFactory()
        cargo_type = CargoTypeFactory()
        
        # 2. Проверяем, что они отображаются в админке
        for model, factory in [
            (transport, TransportModelFactory),
            (service, ServiceFactory),
            (status, DeliveryStatusFactory),
            (package_type, PackageTypeFactory),
            (cargo_type, CargoTypeFactory)
        ]:
            response = self.client.get(
                reverse(f'admin:deliveries_{model._meta.model_name}_changelist')
            )
            self.assertEqual(response.status_code, 200)
            self.assertContains(response, model.name)
        
        # 3. Создаем доставку
        delivery = DeliveryFactory(
            created_by=self.admin_user,
            transport_model=transport,
            service=service,
            status=status,
            package_type=package_type,
            cargo_type=cargo_type
        )
        
        # 4. Проверяем, что доставка отображается в админке
        response = self.client.get(reverse('admin:deliveries_delivery_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, delivery.name)

    def test_admin_permissions(self):
        """Тест прав доступа к админке"""
        # Создаем обычного пользователя
        regular_user = UserFactory()
        self.client.logout()
        self.client.login(username=regular_user.username, password='testpass123')
        
        # Обычный пользователь не должен иметь доступ к админке
        response = self.client.get(reverse('admin:index'))
        self.assertEqual(response.status_code, 302)  # Редирект на логин админки 