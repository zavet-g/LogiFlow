# Dockerfile для LogiFlow (Django + Poetry)
FROM python:3.11-slim

# Установить Poetry
ENV POETRY_VERSION=1.8.2
RUN pip install "poetry==$POETRY_VERSION"

# Создать рабочую директорию
WORKDIR /app

# Копировать pyproject.toml и poetry.lock для установки зависимостей
COPY pyproject.toml poetry.lock* ./

# Установить зависимости (без создания виртуального окружения внутри контейнера)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Копировать проект
COPY . .

# Открыть порт
EXPOSE 8000

# Переменные окружения для Django
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=delivery_project.settings \
    PYTHONDONTWRITEBYTECODE=1

# Команда по умолчанию
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"] 