# 🚚 LogiFlow

<div align="center">

## Система управления логистикой доставок

**Современная платформа для управления доставками с веб-интерфейсом, REST API и аналитикой**

**👨‍💻 Автор:** [Артём Букарев](https://github.com/zavet-g) | [💬 Telegram](https://t.me/bcdbcddd)

---

### 🛠️ Технологический стек

<table>
<tr>
<td align="center" width="96">
  <a href="https://python.org">
    <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://djangoproject.com">
    <img src="https://img.shields.io/badge/Django-4.2.7-green?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://postgresql.org">
    <img src="https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://docker.com">
    <img src="https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </a>
</td>
</tr>
<tr>
<td align="center" width="96">
  <a href="https://python-poetry.org">
    <img src="https://img.shields.io/badge/Poetry-Dependency%20Manager-orange?style=for-the-badge&logo=poetry&logoColor=white" alt="Poetry" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://github.com/zavet-g/LogiFlow">
    <img src="https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge" alt="Tests" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://github.com/zavet-g/LogiFlow">
    <img src="https://img.shields.io/badge/Coverage-80%25+-brightgreen?style=for-the-badge" alt="Coverage" />
  </a>
</td>
<td align="center" width="96">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
  </a>
</td>
</tr>
</table>

</div>

---

## 📋 Содержание

- [🚀 Быстрый старт](#-быстрый-старт)
- [🏗️ Архитектура](#️-архитектура)
- [🛠️ Технологический стек](#️-технологический-стек)
- [📁 Структура проекта](#-структура-проекта)
- [🔧 Установка и настройка](#-установка-и-настройка)
- [🐳 Docker развертывание](#-docker-развертывание)
- [🧪 Тестирование](#-тестирование)
- [📚 API документация](#-api-документация)
- [📄 Лицензия](#-лицензия)

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонирование репозитория
git clone https://github.com/zavet-g/LogiFlow.git
cd LogiFlow

# Установка зависимостей
make install

# Настройка базы данных
make migrate

# Создание суперпользователя
make superuser

# Запуск сервера
make run
```

### Docker развертывание

```bash
# Запуск в Docker
make up

# Просмотр логов
make logs

# Остановка
make down
```

**🌐 Приложение доступно по адресу:** http://localhost:8000/

**🔐 Данные для входа:**
- **Логин:** `admin`
- **Пароль:** `admin123`

---

## 🏗️ Архитектура

LogiFlow построен на современной архитектуре с использованием Django и REST API:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Django API    │    │   PostgreSQL    │
│   (Templates)   │◄──►│   (Views)       │◄──►│   (Database)    │
│   + Chart.js    │    │   + DRF         │    │   + Migrations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Django Admin  │◄─────────────┘
                        │   (Interface)   │
                        └─────────────────┘
```

### Основные компоненты:

- **🎯 Django Views** - Обработка HTTP запросов
- **📊 Django Templates** - Веб-интерфейс с Chart.js
- **🔌 REST API** - JSON API для интеграций
- **👨‍💼 Django Admin** - Административная панель
- **🗄️ PostgreSQL** - Надежная база данных
- **🐳 Docker** - Контейнеризация

---

## 🛠️ Технологический стек

<div align="center">

### 🐍 Backend & API

<table>
<tr>
<td align="center" width="96">
  <a href="https://python.org">
    <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://djangoproject.com">
    <img src="https://img.shields.io/badge/Django-4.2.7-green?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://www.django-rest-framework.org/">
    <img src="https://img.shields.io/badge/DRF-3.14.0-red?style=for-the-badge&logo=django&logoColor=white" alt="DRF" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://postgresql.org">
    <img src="https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </a>
</td>
</tr>
</table>

### 🎨 Frontend & UI

<table>
<tr>
<td align="center" width="96">
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://www.chartjs.org/">
    <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js" />
  </a>
</td>
</tr>
</table>

### 🚀 DevOps & Tools

<table>
<tr>
<td align="center" width="96">
  <a href="https://docker.com">
    <img src="https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://python-poetry.org">
    <img src="https://img.shields.io/badge/Poetry-Dependency%20Manager-orange?style=for-the-badge&logo=poetry&logoColor=white" alt="Poetry" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://www.gnu.org/software/make/">
    <img src="https://img.shields.io/badge/Make-Automation-yellow?style=for-the-badge&logo=gnu&logoColor=white" alt="Make" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://git-scm.com/">
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  </a>
</td>
</tr>
</table>

### 🧪 Testing & Quality

<table>
<tr>
<td align="center" width="96">
  <a href="https://pytest.org/">
    <img src="https://img.shields.io/badge/Pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white" alt="Pytest" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://coverage.readthedocs.io/">
    <img src="https://img.shields.io/badge/Coverage-80%25+-brightgreen?style=for-the-badge" alt="Coverage" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://factoryboy.readthedocs.io/">
    <img src="https://img.shields.io/badge/Factory%20Boy-Test%20Data-purple?style=for-the-badge" alt="Factory Boy" />
  </a>
</td>
<td align="center" width="96">
  <a href="https://github.com/zavet-g/LogiFlow">
    <img src="https://img.shields.io/badge/Tests-Passing-brightgreen?style=for-the-badge" alt="Tests" />
  </a>
</td>
</tr>
</table>

</div>

---

## 📁 Структура проекта

```
logiflow/
├── 📁 delivery_project/          # Основные настройки Django
│   ├── __init__.py
│   ├── settings.py               # Конфигурация проекта
│   ├── urls.py                   # Главные URL маршруты
│   ├── wsgi.py                   # WSGI конфигурация
│   ├── asgi.py                   # ASGI конфигурация
│   └── test_settings.py          # Настройки для тестов
├── 📁 deliveries/                # Основное приложение доставок
│   ├── __init__.py
│   ├── apps.py                   # Конфигурация приложения
│   ├── models.py                 # Модели данных доставок
│   ├── views.py                  # Представления и API
│   ├── serializers.py            # Сериализаторы DRF
│   ├── admin.py                  # Админ-панель
│   ├── urls.py                   # URL маршруты
│   ├── factories.py              # Factory Boy фабрики
│   ├── tests.py                  # Основные тесты
│   ├── test_models.py            # Тесты моделей
│   ├── test_views.py             # Тесты представлений
│   ├── test_serializers.py       # Тесты сериализаторов
│   ├── test_admin.py             # Тесты админ-панели
│   ├── test_urls.py              # Тесты URL маршрутов
│   ├── templates/                # HTML шаблоны
│   │   └── deliveries/
│   │       ├── login.html        # Страница входа
│   │       └── report.html       # Страница отчета
│   ├── management/               # Django management команды
│   └── migrations/               # Миграции базы данных
├── 📁 users/                     # Пользователи и аутентификация
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py                 # Кастомная модель пользователя
│   ├── views.py                  # Представления пользователей
│   ├── serializers.py            # Сериализаторы пользователей
│   ├── admin.py                  # Админ-панель пользователей
│   ├── urls.py                   # URL маршруты пользователей
│   └── migrations/
├── 📁 orders/                    # Приложение заказов
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py                 # Модели заказов
│   ├── views.py                  # Представления заказов
│   ├── serializers.py            # Сериализаторы заказов
│   ├── admin.py                  # Админ-панель заказов
│   ├── urls.py                   # URL маршруты заказов
│   └── migrations/
├── 📁 restaurants/               # Приложение ресторанов
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py                 # Модели ресторанов
│   ├── views.py                  # Представления ресторанов
│   ├── serializers.py            # Сериализаторы ресторанов
│   ├── admin.py                  # Админ-панель ресторанов
│   ├── urls.py                   # URL маршруты ресторанов
│   ├── management/               # Management команды
│   └── migrations/
├── 📁 docs/                      # Документация проекта
│   ├── README.md                 # Основная документация
│   ├── STRUCTURE.md              # Структура проекта
│   ├── DOCKER.md                 # Docker инструкции
│   ├── TESTING.md                # Руководство по тестированию
│   ├── POETRY_SETUP.md           # Настройка Poetry
│   └── .gitignore
├── 📁 static/                    # Статические файлы
├── 📁 staticfiles/               # Собранные статические файлы
├── 📁 media/                     # Загружаемые файлы
├── 📁 fixtures/                  # Начальные данные
├── 📁 venv/                      # Виртуальное окружение
├── 🐳 Dockerfile                 # Docker образ
├── 🐳 docker-compose.yml         # Docker Compose
├── 🐳 docker-init.sh             # Скрипт инициализации Docker
├── 🐳 .dockerignore              # Исключения для Docker
├── 📋 requirements.txt           # Python зависимости
├── 📋 pyproject.toml             # Poetry конфигурация
├── 📋 poetry.lock                # Lock файл Poetry
├── 🔧 Makefile                   # Автоматизация команд
├── 🔧 pytest.ini                 # Конфигурация тестов
├── 🔧 conftest.py                # Конфигурация pytest
├── 🔧 setup.py                   # Установка пакета
├── 📄 env.example                # Пример переменных окружения
├── 📄 .gitignore                 # Git исключения
├── 📄 package.json               # Node.js зависимости (если есть)
├── 📄 test_app.py                # Тестовое приложение
├── 📄 init_admin.py              # Скрипт создания админа
├── 📄 init_data.py               # Скрипт создания тестовых данных
├── 📄 manage.py                  # Django management
└── 📖 README.md                  # Документация
```

---

## 🔧 Установка и настройка

### Предварительные требования

- Python 3.11+
- PostgreSQL 14+
- Poetry (для управления зависимостями)
- Docker (опционально)

### Пошаговая установка

1. **Клонирование репозитория**
   ```bash
   git clone https://github.com/zavet-g/LogiFlow.git
   cd LogiFlow
   ```

2. **Установка зависимостей**
   ```bash
   make install
   ```

3. **Настройка базы данных**
   ```bash
   # Создание базы данных PostgreSQL
   createdb logiflow_db
   
   # Применение миграций
   make migrate
   ```

4. **Создание суперпользователя**
   ```bash
   make superuser
   ```

5. **Запуск сервера**
   ```bash
   make run
   ```

### Переменные окружения

Создайте файл `.env` на основе `env.example`:

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database
DB_NAME=logiflow_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

---

## 🐳 Docker развертывание

### Быстрый запуск

```bash
# Сборка и запуск
make up

# Просмотр логов
make logs

# Остановка
make down
```

### Ручное управление

```bash
# Сборка образов
docker-compose build

# Запуск сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f web
```

### Доступные порты

- **8000** - Django приложение
- **5433** - PostgreSQL (внешний доступ)

---

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
make test

# С покрытием кода
make test-cov

# Быстрые тесты
poetry run pytest -m "not slow"
```

### Покрытие кода

```bash
# Генерация отчета
poetry run pytest --cov=deliveries --cov=users --cov-report=html

# Открытие отчета
open htmlcov/index.html
```

### Типы тестов

- ✅ **Unit тесты** - Тестирование отдельных функций
- ✅ **Integration тесты** - Тестирование взаимодействия компонентов
- ✅ **API тесты** - Тестирование REST endpoints
- ✅ **Model тесты** - Тестирование моделей данных
- ✅ **Admin тесты** - Тестирование админ-панели

---

## 📚 API документация

### Основные endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/api/` | Информация об API |
| `GET` | `/api/deliveries/` | Список доставок |
| `POST` | `/api/deliveries/` | Создание доставки |
| `GET` | `/api/deliveries/{id}/` | Детали доставки |
| `PUT` | `/api/deliveries/{id}/` | Обновление доставки |
| `DELETE` | `/api/deliveries/{id}/` | Удаление доставки |
| `GET` | `/api/deliveries/report/` | Отчет по доставкам |

### Примеры запросов

```bash
# Получение списка доставок
curl http://localhost:8000/api/deliveries/

# Создание новой доставки
curl -X POST http://localhost:8000/api/deliveries/ \
  -H "Content-Type: application/json" \
  -d '{
    "transport_number": "A123AA",
    "distance_km": 150,
    "address_from": "Москва",
    "address_to": "Санкт-Петербург"
  }'
```

---

## 🎯 Основные функции

### 📊 Управление доставками
- ✅ Создание и редактирование доставок
- ✅ Отслеживание статуса доставки
- ✅ Фильтрация и поиск
- ✅ Экспорт данных

### 📈 Аналитика и отчеты
- ✅ Визуализация данных с Chart.js
- ✅ Статистика по доставкам
- ✅ Фильтры по датам и параметрам
- ✅ Экспорт отчетов

### 👥 Пользователи и права
- ✅ Система аутентификации
- ✅ Роли и разрешения
- ✅ Административная панель
- ✅ API токены

### 🏢 Управление контентом
- ✅ Модели транспорта
- ✅ Типы грузов
- ✅ Услуги доставки
- ✅ Статусы доставки

---

## 🚀 Производительность

### Оптимизации

- ✅ **Database indexing** - Индексы для быстрого поиска
- ✅ **Query optimization** - Оптимизированные запросы
- ✅ **Caching** - Кэширование статических файлов
- ✅ **Pagination** - Пагинация для больших списков

### Мониторинг

- ✅ **Logging** - Подробное логирование
- ✅ **Error tracking** - Отслеживание ошибок
- ✅ **Performance metrics** - Метрики производительности

---

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

## 👨‍💻 Автор проекта

<div align="center">

### 🚀 **Артём Букарев**

**Разработчик и создатель LogiFlow**

[![Author](https://img.shields.io/badge/Author-Артём%20Букарев-blue.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zavet-g)
[![Telegram](https://img.shields.io/badge/Telegram-@bcdbcddd-blue.svg?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/bcdbcddd)
[![GitHub](https://img.shields.io/badge/GitHub-zavet--g-black.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zavet-g)

---

### 📞 **Связаться со мной**

[![Contact](https://img.shields.io/badge/💬%20Telegram-@bcdbcddd-blue.svg?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/bcdbcddd)
[![GitHub Profile](https://img.shields.io/badge/🐙%20GitHub-zavet--g-black.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zavet-g)

**💡 Есть вопросы по проекту? Напиши в ТГ!**

</div>

---

<div align="center">


[![Stars](https://img.shields.io/github/stars/zavet-g/LogiFlow?style=social)](https://github.com/zavet-g/LogiFlow)
[![Forks](https://img.shields.io/github/forks/zavet-g/LogiFlow?style=social)](https://github.com/zavet-g/LogiFlow)
[![Issues](https://img.shields.io/github/issues/zavet-g/LogiFlow)](https://github.com/zavet-g/LogiFlow/issues)

</div> 
