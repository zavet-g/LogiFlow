# 🐳 Docker развертывание LogiFlow

Руководство по развертыванию LogiFlow с использованием Docker и Docker Compose.

## 📋 Содержание

- [🚀 Быстрый старт](#-быстрый-старт)
- [🏗️ Архитектура Docker](#️-архитектура-docker)
- [🔧 Конфигурация](#-конфигурация)
- [🚀 Развертывание](#-развертывание)
- [📊 Мониторинг](#-мониторинг)
- [🔧 Устранение неполадок](#-устранение-неполадок)
- [🚀 Production](#-production)

---

## 🚀 Быстрый старт

### Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- Минимум 2GB RAM
- 10GB свободного места

### Быстрый запуск

```bash
# Клонирование репозитория
git clone https://github.com/your-username/logiflow.git
cd logiflow

# Запуск в Docker
make up

# Проверка статуса
docker-compose ps

# Просмотр логов
make logs
```

**🌐 Приложение доступно по адресу:** http://localhost:8000/  
**🔐 Данные для входа:** admin / admin123

---

## 🏗️ Архитектура Docker

### Структура контейнеров

```
┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Django App    │
│   (Port 80)     │◄──►│   (Port 8000)   │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   (Port 5433)   │
                       └─────────────────┘
```

### Сервисы

1. **web** - Django приложение
   - Образ: `deliveryproject-web`
   - Порт: 8000
   - Зависимости: db

2. **db** - PostgreSQL база данных
   - Образ: `postgres:14`
   - Порт: 5433 (внешний)
   - Volume: `postgres_data`

3. **nginx** - Веб-сервер (production)
   - Образ: `nginx:alpine`
   - Порт: 80
   - Профиль: production

### Volumes

- `postgres_data` - Данные PostgreSQL
- `static_volume` - Статические файлы Django

---

## 🔧 Конфигурация

### Dockerfile

```dockerfile
# Используем официальный Python образ
FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Копируем файлы зависимостей
COPY requirements.txt .
COPY pyproject.toml .

# Устанавливаем Python зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY . .

# Создаем пользователя для безопасности
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app

# Делаем скрипт инициализации исполняемым
RUN chmod +x docker-init.sh

USER app

# Открываем порт
EXPOSE 8000

# Команда для запуска
CMD ["./docker-init.sh"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL база данных
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: logiflow_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Django приложение
  web:
    build: .
    command: >
      sh -c "python manage.py migrate &&
             python init_admin.py &&
             python init_data.py &&
             python manage.py collectstatic --noinput &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - SECRET_KEY=django-insecure-logiflow-secret-key-for-docker-2024
      - DB_NAME=logiflow_db
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
```

### .dockerignore

```
# Git
.git
.gitignore

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/

# Docker
Dockerfile
.dockerignore
docker-compose.yml

# Documentation
docs/
*.md
!README.md

# Tests
.pytest_cache/
.coverage
htmlcov/

# Temporary files
*.tmp
*.temp
```

---

## 🚀 Развертывание

### Команды Make

```bash
# Сборка образов
make build

# Запуск контейнеров
make up

# Остановка контейнеров
make down

# Просмотр логов
make logs

# Shell в контейнере
make d-shell

# Миграции в контейнере
make d-migrate

# Создание суперпользователя в контейнере
make d-superuser
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

# Остановка сервисов
docker-compose down

# Удаление volumes
docker-compose down -v
```

### Инициализация

При первом запуске автоматически выполняется:

1. **Миграции базы данных**
   ```bash
   python manage.py migrate
   ```

2. **Создание суперпользователя**
   ```bash
   python init_admin.py
   ```

3. **Создание тестовых данных**
   ```bash
   python init_data.py
   ```

4. **Сбор статических файлов**
   ```bash
   python manage.py collectstatic --noinput
   ```

---

## 📊 Мониторинг

### Проверка статуса

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Логи приложения
docker-compose logs web

# Логи базы данных
docker-compose logs db
```

### Health checks

```bash
# Проверка здоровья базы данных
docker-compose exec db pg_isready -U postgres

# Проверка Django приложения
curl http://localhost:8000/api/
```

### Backup базы данных

```bash
# Создание бэкапа
docker-compose exec db pg_dump -U postgres logiflow_db > backup.sql

# Восстановление из бэкапа
docker-compose exec -T db psql -U postgres logiflow_db < backup.sql
```

---

## 🔧 Устранение неполадок

### Частые проблемы

#### 1. Порт 5432 занят

```bash
# Измените порт в docker-compose.yml
ports:
  - "5433:5432"  # Вместо "5432:5432"
```

#### 2. Проблемы с правами доступа

```bash
# Пересоберите образ
docker-compose build --no-cache

# Проверьте права на файлы
ls -la docker-init.sh
```

#### 3. Ошибки миграции

```bash
# Сбросьте базу данных
docker-compose down -v
docker-compose up -d

# Или примените миграции вручную
docker-compose exec web python manage.py migrate
```

#### 4. Проблемы с зависимостями

```bash
# Пересоберите образ с обновленными зависимостями
docker-compose build --no-cache web

# Проверьте requirements.txt
cat requirements.txt
```

### Логи и отладка

```bash
# Подробные логи
docker-compose logs -f --tail=100 web

# Логи с временными метками
docker-compose logs -f -t web

# Логи всех сервисов
docker-compose logs -f
```

---

## 🚀 Production

### Production конфигурация

Создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build: .
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn delivery_project.wsgi:application --bind 0.0.0.0:8000 --workers 3"
    volumes:
      - static_volume:/app/staticfiles
    environment:
      - DEBUG=False
      - SECRET_KEY=${SECRET_KEY}
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - static_volume:/app/staticfiles
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
```

### Production переменные окружения

Создайте `.env.prod`:

```bash
# Django
SECRET_KEY=your-super-secret-production-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database
DB_NAME=logiflow_prod
DB_USER=logiflow_user
DB_PASSWORD=super-secure-password
DB_HOST=db
DB_PORT=5432

# Security
CSRF_TRUSTED_ORIGINS=https://your-domain.com
```

### SSL сертификаты

```bash
# Создание SSL сертификатов
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/nginx.key -out ssl/nginx.crt
```

### Nginx конфигурация

Создайте `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream django {
        server web:8000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;

        location /static/ {
            alias /app/staticfiles/;
        }

        location / {
            proxy_pass http://django;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Запуск production

```bash
# Запуск production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps

# Логи
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 📈 Производительность

### Оптимизации

1. **Многослойная сборка**
   - Кэширование зависимостей
   - Минимизация размера образа

2. **Health checks**
   - Автоматическая проверка состояния
   - Перезапуск при сбоях

3. **Volumes**
   - Персистентность данных
   - Разделение данных и кода

4. **Resource limits**
   ```yaml
   services:
     web:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '0.5'
   ```

### Мониторинг

```bash
# Использование ресурсов
docker stats

# Размер образов
docker images

# Использование диска
docker system df
```

---

**Docker развертывание LogiFlow** - простое и надежное развертывание в контейнерах! 🐳✨ 