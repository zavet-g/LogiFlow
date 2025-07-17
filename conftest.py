import os
import django
from django.conf import settings

# Настройка Django для тестов
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'delivery_project.settings')
django.setup()

# Импорты для тестов
import pytest
from django.test import TestCase
from django.contrib.auth.models import User 