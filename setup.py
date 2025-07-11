#!/usr/bin/env python3
"""
Скрипт для быстрой настройки проекта LogiFlow
"""

import os
import subprocess
import sys


def run_command(command, description):
    """Выполняет команду и выводит результат"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} выполнено успешно")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка при {description.lower()}: {e}")
        print(f"Вывод ошибки: {e.stderr}")
        return False


def main():
    print("🚀 Настройка проекта LogiFlow")
    print("=" * 50)
    
    # Проверяем наличие Python
    if not run_command("python --version", "Проверка версии Python"):
        print("❌ Python не найден. Установите Python 3.8+")
        return
    
    # Создаем виртуальное окружение
    if not os.path.exists("venv"):
        if not run_command("python -m venv venv", "Создание виртуального окружения"):
            return
    else:
        print("✅ Виртуальное окружение уже существует")
    
    # Активируем виртуальное окружение и устанавливаем зависимости
    if sys.platform == "win32":
        activate_cmd = "venv\\Scripts\\activate"
    else:
        activate_cmd = "source venv/bin/activate"
    
    if not run_command(f"{activate_cmd} && pip install -r requirements.txt", "Установка зависимостей"):
        return
    
    # Копируем файл с переменными окружения
    if not os.path.exists(".env"):
        if os.path.exists("env.example"):
            if not run_command("cp env.example .env", "Копирование файла переменных окружения"):
                return
        else:
            print("⚠️  Файл env.example не найден")
    
    print("\n" + "=" * 50)
    print("✅ Настройка завершена!")
    print("\nСледующие шаги:")
    print("1. Отредактируйте файл .env с настройками базы данных")
    print("2. Создайте базу данных PostgreSQL")
    print("3. Выполните миграции: python manage.py makemigrations && python manage.py migrate")
    print("4. Создайте суперпользователя: python manage.py createsuperuser")
    print("5. Запустите сервер: python manage.py runserver")
    print("\nДокументация: README.md")


if __name__ == "__main__":
    main() 