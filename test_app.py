#!/usr/bin/env python3
"""
Тестовый скрипт для проверки работоспособности LogiFlow
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_endpoints():
    """Тестирование всех endpoints"""
    print("🌐 ТЕСТИРОВАНИЕ LOGIFLOW")
    print("=" * 50)
    
    # 1. Тест корневого URL
    print("1. Тест корневого URL:")
    response = requests.get(f"{BASE_URL}/")
    print(f"   Статус: {response.status_code}")
    print(f"   Редирект: {response.url if response.history else 'Нет'}")
    
    # 2. Тест API корневого endpoint
    print("\n2. Тест API корневого endpoint:")
    response = requests.get(f"{BASE_URL}/api/")
    print(f"   Статус: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Сообщение: {data.get('message')}")
        print(f"   Версия: {data.get('version')}")
    
    # 3. Тест API доставок (без аутентификации)
    print("\n3. Тест API доставок (без аутентификации):")
    response = requests.get(f"{BASE_URL}/api/deliveries/deliveries/")
    print(f"   Статус: {response.status_code}")
    if response.status_code == 401:
        print("   ✅ Правильно требует аутентификации")
    
    # 4. Тест входа в систему
    print("\n4. Тест входа в систему:")
    login_data = {"username": "admin", "password": "admin123"}
    response = requests.post(
        f"{BASE_URL}/api/deliveries/login/",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Статус: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Успех: {data.get('success')}")
        print(f"   Пользователь: {data.get('user', {}).get('username')}")
    
    # 5. Тест админ-панели
    print("\n5. Тест админ-панели:")
    response = requests.get(f"{BASE_URL}/admin/")
    print(f"   Статус: {response.status_code}")
    if response.status_code == 302:
        print("   ✅ Редирект на страницу входа")
    
    print("\n" + "=" * 50)
    print("✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО")

if __name__ == "__main__":
    test_endpoints() 