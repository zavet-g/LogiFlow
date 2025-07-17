# Docker для LogiFlow

Полная инструкция по запуску и разработке LogiFlow в Docker-контейнерах.

---

## 📦 Состав

- **Dockerfile** — сборка образа Django + Poetry
- **docker-compose.yml** — запуск Django + PostgreSQL
- **.dockerignore** — исключения для сборки
- **Makefile** — удобные команды для Docker

---

## 🚀 Быстрый старт

1. **Собрать образы**
   ```bash
   make build
   ```
2. **Запустить проект**
   ```bash
   make up
   ```
3. **Применить миграции**
   ```bash
   make d-migrate
   ```
4. **Создать суперпользователя**
   ```bash
   make d-superuser
   ```
5. **Открыть сайт**
   - http://localhost:8000
   - Админка: http://localhost:8000/admin/

---

## 🛠 Основные команды Makefile

| Команда         | Описание                                 |
|----------------|------------------------------------------|
| make build     | Собрать Docker-образы                    |
| make up        | Запустить проект в фоне                  |
| make down      | Остановить и удалить контейнеры          |
| make logs      | Логи всех сервисов                       |
| make d-shell   | Открыть Django shell в контейнере        |
| make d-migrate | Применить миграции в контейнере          |
| make d-superuser | Создать суперпользователя в контейнере  |

---

## ⚙️ Переменные окружения

- Все переменные для базы и Django можно задать через `.env` или в `docker-compose.yml`.
- По умолчанию:
  - POSTGRES_DB=logiflow
  - POSTGRES_USER=logiflow
  - POSTGRES_PASSWORD=logiflow
  - POSTGRES_HOST=db
  - POSTGRES_PORT=5432

---

## 🐘 База данных

- Используется официальный образ PostgreSQL.
- Данные сохраняются в volume `pgdata` (не теряются при перезапуске).
- Для доступа к базе можно использовать любой клиент PostgreSQL:
  - host: localhost
  - port: 5432
  - user: logiflow
  - password: logiflow
  - db: logiflow

---

## 🧑‍💻 Разработка

- Код монтируется в контейнер (`volumes: - .:/app`), изменения видны сразу.
- Для установки новых зависимостей:
  ```bash
  docker compose exec web poetry add <package>
  ```
- Для запуска тестов:
  ```bash
  docker compose exec web poetry run pytest
  ```

---

## 🧹 Остановка и очистка

- Остановить контейнеры:
  ```bash
  make down
  ```
- Удалить volume базы (полная очистка данных!):
  ```bash
  docker compose down -v
  ```

---

## 📝 Примечания

- Для production рекомендуется использовать отдельный файл настроек и запускать через WSGI (gunicorn/uwsgi).
- Для локальной разработки достаточно текущей конфигурации.
- Все команды можно запускать как через Makefile, так и напрямую через docker compose.

---

**LogiFlow + Docker** — быстро, удобно, современно! 🐳🚀 