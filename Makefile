# Makefile для LogiFlow (Django + Poetry)

.PHONY: install migrate run test test-cov shell superuser docs

install:
	poetry install

migrate:
	poetry run python manage.py migrate

run:
	poetry run python manage.py runserver

shell:
	poetry run python manage.py shell

superuser:
	poetry run python manage.py createsuperuser

test:
	poetry run pytest

test-cov:
	poetry run pytest --cov=deliveries --cov=users --cov-report=html

docs:
	open docs/README.md || xdg-open docs/README.md || start docs/README.md 