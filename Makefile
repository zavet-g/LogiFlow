# Makefile для LogiFlow (Django + Poetry + Docker)

.PHONY: install migrate run test test-cov shell superuser docs build up down logs d-shell d-migrate d-superuser

install:
	poetry install

migrate:
	poetry run python3 manage.py migrate

run:
	poetry run python3 manage.py runserver

shell:
	poetry run python3 manage.py shell

superuser:
	poetry run python3 manage.py createsuperuser

test:
	poetry run pytest

test-cov:
	poetry run pytest --cov=deliveries --cov=users --cov=orders --cov=restaurants --cov-report=html

docs:
	open docs/README.md || xdg-open docs/README.md || start docs/README.md

# Docker
build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

# Docker: команды внутри контейнера web
# Пример: make d-shell

d-shell:
	docker compose exec web poetry run python3 manage.py shell

d-migrate:
	docker compose exec web poetry run python3 manage.py migrate

d-superuser:
	docker compose exec web poetry run python3 manage.py createsuperuser 