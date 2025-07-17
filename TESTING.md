# Тестирование LogiFlow

Документация по тестированию системы логистики доставок LogiFlow.

## 🧪 Технологии тестирования

- **pytest** - основной фреймворк тестирования
- **pytest-django** - интеграция с Django
- **pytest-cov** - измерение покрытия кода
- **factory-boy** - создание тестовых данных

## 📁 Структура тестов

```
deliveries/
├── test_models.py      # Тесты моделей
├── test_views.py       # Тесты представлений
├── test_serializers.py # Тесты сериализаторов
├── test_urls.py        # Тесты URL маршрутов
├── test_admin.py       # Тесты админки
└── factories.py        # Фабрики тестовых данных
```

## 🚀 Запуск тестов

### Базовые команды

```bash
# Все тесты
poetry run pytest

# Тесты с подробным выводом
poetry run pytest -v

# Тесты с покрытием кода
poetry run pytest --cov=deliveries --cov-report=html

# Конкретный тест
poetry run pytest deliveries/test_models.py::TransportModelTest::test_create_transport_model -v
```

### Фильтрация тестов

```bash
# Только модульные тесты
poetry run pytest -m unit

# Только интеграционные тесты
poetry run pytest -m integration

# Исключить медленные тесты
poetry run pytest -m "not slow"

# Тесты конкретного файла
poetry run pytest deliveries/test_models.py
```

### Настройки тестов

```bash
# Использование тестовых настроек Django
export DJANGO_SETTINGS_MODULE=delivery_project.test_settings

# Запуск с тестовыми настройками
poetry run pytest --ds=delivery_project.test_settings
```

## 📊 Покрытие кода

### Генерация отчета о покрытии

```bash
# HTML отчет
poetry run pytest --cov=deliveries --cov=users --cov-report=html

# Консольный отчет
poetry run pytest --cov=deliveries --cov-report=term-missing

# XML отчет (для CI/CD)
poetry run pytest --cov=deliveries --cov-report=xml
```

### Минимальное покрытие

Проект настроен на минимальное покрытие 80%. Если покрытие ниже, тесты не пройдут:

```bash
poetry run pytest --cov-fail-under=80
```

## 🏭 Фабрики тестовых данных

### Доступные фабрики

- `UserFactory` - создание пользователей
- `TransportModelFactory` - создание моделей транспорта
- `PackageTypeFactory` - создание типов упаковки
- `ServiceFactory` - создание услуг
- `DeliveryStatusFactory` - создание статусов доставки
- `CargoTypeFactory` - создание типов груза
- `DeliveryFactory` - создание доставок

### Пример использования

```python
from deliveries.factories import DeliveryFactory, UserFactory

# Создание простой доставки
delivery = DeliveryFactory()

# Создание доставки с конкретными параметрами
user = UserFactory(username='testuser')
delivery = DeliveryFactory(
    created_by=user,
    distance_km=100,
    tech_state='Исправно'
)
```

## 🧩 Типы тестов

### Модульные тесты (`@pytest.mark.unit`)

Тестируют отдельные компоненты системы:

- Создание и валидация моделей
- Работа сериализаторов
- URL маршрутизация
- Строковые представления объектов

### Интеграционные тесты (`@pytest.mark.integration`)

Тестируют взаимодействие компонентов:

- Полный workflow создания доставки
- Фильтрация данных
- API endpoints
- Админка Django

### Тесты Django

- `TestCase` - для тестов с базой данных
- `SimpleTestCase` - для тестов без базы данных
- `TransactionTestCase` - для тестов с транзакциями

## 🔧 Конфигурация тестов

### pytest.ini

```ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = delivery_project.test_settings
python_files = tests.py test_*.py *_tests.py
python_classes = Test*
python_functions = test_*
addopts = 
    --strict-markers
    --strict-config
    --cov=deliveries
    --cov=users
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
testpaths = 
    deliveries
    users
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

### Тестовые настройки Django

Файл `delivery_project/test_settings.py` содержит:

- SQLite база данных в памяти
- Отключенное кэширование
- Ускоренные хешеры паролей
- Отключенное логирование

## 📈 Метрики качества

### Покрытие кода

- **Цель**: минимум 80% покрытия
- **Текущее покрытие**: проверяется автоматически
- **Отчеты**: HTML, консоль, XML

### Время выполнения

- **Модульные тесты**: < 1 секунды
- **Интеграционные тесты**: < 5 секунд
- **Полный набор тестов**: < 30 секунд

### Надежность

- Все тесты должны проходить стабильно
- Нет flaky тестов
- Четкие assertions и сообщения об ошибках

## 🚨 Отладка тестов

### Полезные флаги pytest

```bash
# Остановка на первой ошибке
poetry run pytest -x

# Подробный вывод ошибок
poetry run pytest -vv

# Показать локальные переменные при ошибке
poetry run pytest -l

# Запуск в режиме отладки
poetry run pytest --pdb
```

### Логирование

```bash
# Включить логирование
poetry run pytest --log-cli-level=DEBUG

# Логирование в файл
poetry run pytest --log-file=test.log
```

## 🔄 CI/CD интеграция

### GitHub Actions

```yaml
- name: Run tests
  run: |
    poetry install
    poetry run pytest --cov=deliveries --cov-report=xml
```

### Локальная проверка перед коммитом

```bash
# Запуск всех тестов
poetry run pytest

# Проверка покрытия
poetry run pytest --cov=deliveries --cov-fail-under=80

# Проверка стиля кода
poetry run flake8 deliveries/
```

## 📝 Написание новых тестов

### Структура теста

```python
import pytest
from django.test import TestCase
from deliveries.factories import DeliveryFactory

class DeliveryTest(TestCase):
    def test_create_delivery(self):
        """Тест создания доставки"""
        delivery = DeliveryFactory()
        self.assertIsNotNone(delivery.id)
        self.assertIsNotNone(delivery.transport_model)

@pytest.mark.unit
def test_delivery_str():
    """Модульный тест строкового представления"""
    delivery = DeliveryFactory()
    assert str(delivery) is not None
```

### Лучшие практики

1. **Именование**: `test_<что_тестируем>_<условие>`
2. **Документация**: каждый тест должен иметь docstring
3. **Изоляция**: тесты не должны зависеть друг от друга
4. **Данные**: используйте фабрики для создания тестовых данных
5. **Assertions**: используйте четкие и информативные assertions

## ✅ Чек-лист перед коммитом

- [ ] Все тесты проходят
- [ ] Покрытие кода >= 80%
- [ ] Нет новых предупреждений
- [ ] Тесты написаны для новой функциональности
- [ ] Документация обновлена

---

**LogiFlow Testing** - качество кода превыше всего! 🧪✨ 