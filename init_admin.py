#!/usr/bin/env python3
"""
Скрипт для создания суперпользователя
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'delivery_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser('admin', 'admin@logiflow.com', 'admin123')
    print('✅ Суперпользователь создан: admin / admin123')
else:
    print('✅ Суперпользователь уже существует') 