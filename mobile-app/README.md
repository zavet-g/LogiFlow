# LogiFlow Mobile App

Мобильное приложение для управления доставками LogiFlow, разработанное на React Native.

## 🚀 Возможности

- **Создание новых доставок** - полная форма с выбором из справочников
- **Просмотр списка доставок** - с поиском и фильтрацией
- **Детальный просмотр доставок** - полная информация о каждой доставке
- **Современный UI** - Material Design 3 с красивым интерфейсом
- **Офлайн поддержка** - кэширование данных
- **Навигация по картам** - интеграция с Google Maps

## 📱 Экран "Создание новой доставки"

### Поля формы:
- **Модель и номер транспорта** - выбор из справочника + ручной ввод
- **Время в пути** - дата/время отправки и доставки с расчетом продолжительности
- **Дистанция** - ввод расстояния в км
- **Адреса** - отправления и доставки
- **Медиафайл** - загрузка PDF или изображений
- **Услуга** - выбор из справочника
- **Статус доставки** - выбор из справочника
- **Упаковка** - выбор типа упаковки
- **Тип груза** - опциональный выбор
- **Техническое состояние** - "Исправно" / "Неисправно"

## 🛠 Технологии

- **React Native** - мобильная разработка
- **React Navigation** - навигация между экранами
- **React Native Paper** - Material Design компоненты
- **Axios** - HTTP клиент для API
- **AsyncStorage** - локальное хранение данных
- **React Native Image Picker** - загрузка медиафайлов
- **React Native Date Picker** - выбор дат и времени

## 📋 Требования

- Node.js 16+
- React Native CLI
- Android Studio (для Android)
- Xcode (для iOS, только macOS)

## 🔧 Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/zavet-g/LogiFlow.git
cd LogiFlow/mobile-app
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Для iOS (только macOS):**
```bash
cd ios && pod install && cd ..
```

## 🚀 Запуск

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Metro Bundler
```bash
npm start
```

## 🔗 Настройка API

Убедитесь, что Django backend запущен на `http://localhost:8000`.

Для изменения URL API отредактируйте файл `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:8000/api';
```

## 📁 Структура проекта

```
mobile-app/
├── src/
│   ├── screens/           # Экраны приложения
│   │   ├── HomeScreen.js
│   │   ├── CreateDeliveryScreen.js
│   │   └── DeliveryDetailsScreen.js
│   ├── components/        # Переиспользуемые компоненты
│   ├── services/          # API сервисы
│   │   └── api.js
│   ├── navigation/        # Навигация
│   │   └── AppNavigator.js
│   ├── utils/            # Утилиты
│   └── assets/           # Статические ресурсы
├── App.js                # Главный компонент
├── index.js              # Точка входа
└── package.json          # Зависимости
```

## 🎨 Дизайн

Приложение использует Material Design 3 с:
- Современными карточками и тенями
- Цветовой схемой LogiFlow (синий #2196F3)
- Адаптивным дизайном для разных размеров экранов
- Интуитивной навигацией

## 📱 Поддерживаемые платформы

- ✅ Android 6.0+ (API 23+)
- ✅ iOS 12.0+

## 🔒 Безопасность

- Токен-аутентификация через API
- Безопасное хранение токенов в AsyncStorage
- Валидация данных на клиенте и сервере

## 🐛 Отладка

Для отладки используйте:
- React Native Debugger
- Flipper
- Chrome DevTools

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📞 Поддержка

По вопросам обращайтесь к команде разработки LogiFlow. 