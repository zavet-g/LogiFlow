// Константы для мобильного приложения LogiFlow

// API конфигурация
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Цвета приложения
export const COLORS = {
  PRIMARY: '#2196F3',
  PRIMARY_DARK: '#1976D2',
  PRIMARY_LIGHT: '#BBDEFB',
  SECONDARY: '#FF9800',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  LIGHT: '#F5F5F5',
  DARK: '#212121',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#757575',
  LIGHT_GRAY: '#E0E0E0',
  TRANSPARENT: 'transparent',
};

// Статусы доставки и их цвета
export const DELIVERY_STATUS_COLORS = {
  'В ожидании': '#2196F3',
  'В пути': '#FFA000',
  'Доставлено': '#4CAF50',
  'Отменено': '#F44336',
  'Возврат': '#9C27B0',
  'Задержка': '#FF5722',
};

// Технические состояния
export const TECH_STATES = {
  WORKING: 'Исправно',
  BROKEN: 'Неисправно',
};

// Лимиты файлов
export const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
  ],
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],
};

// Валидация
export const VALIDATION_RULES = {
  TRANSPORT_NUMBER: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
  },
  DISTANCE: {
    MIN: 0.1,
    MAX: 10000,
  },
  ADDRESS: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
};

// Навигация
export const SCREENS = {
  HOME: 'Home',
  CREATE_DELIVERY: 'CreateDelivery',
  DELIVERY_DETAILS: 'DeliveryDetails',
  EDIT_DELIVERY: 'EditDelivery',
  LOGIN: 'Login',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

// Сообщения
export const MESSAGES = {
  SUCCESS: {
    DELIVERY_CREATED: 'Доставка успешно создана',
    DELIVERY_UPDATED: 'Доставка успешно обновлена',
    DELIVERY_DELETED: 'Доставка успешно удалена',
    FILE_UPLOADED: 'Файл успешно загружен',
  },
  ERROR: {
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету',
    SERVER_ERROR: 'Ошибка сервера. Попробуйте позже',
    VALIDATION_ERROR: 'Проверьте правильность заполнения полей',
    FILE_TOO_LARGE: 'Файл слишком большой',
    INVALID_FILE_TYPE: 'Неподдерживаемый тип файла',
    LOADING_ERROR: 'Ошибка загрузки данных',
    SAVE_ERROR: 'Ошибка сохранения данных',
    DELETE_ERROR: 'Ошибка удаления данных',
  },
  CONFIRM: {
    DELETE_DELIVERY: 'Вы уверены, что хотите удалить эту доставку?',
    DISCARD_CHANGES: 'Вы уверены, что хотите отменить изменения?',
  },
  PLACEHOLDERS: {
    SEARCH: 'Поиск доставок...',
    TRANSPORT_NUMBER: 'V01, №123',
    ADDRESS: 'Введите адрес',
    DISTANCE: '0.0',
  },
};

// Анимации
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Размеры
export const SIZES = {
  PADDING: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
  },
  MARGIN: {
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
  },
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
  },
  FONT_SIZE: {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 18,
    XXLARGE: 24,
  },
};

// Локальное хранилище
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  SETTINGS: 'settings',
  CACHE_DELIVERIES: 'cacheDeliveries',
  CACHE_REFERENCES: 'cacheReferences',
};

// Кэширование
export const CACHE_CONFIG = {
  DELIVERIES_TTL: 5 * 60 * 1000, // 5 минут
  REFERENCES_TTL: 30 * 60 * 1000, // 30 минут
  USER_DATA_TTL: 24 * 60 * 60 * 1000, // 24 часа
};

// Настройки по умолчанию
export const DEFAULT_SETTINGS = {
  THEME: 'light',
  LANGUAGE: 'ru',
  NOTIFICATIONS: true,
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 30, // секунды
};

// Форматы дат
export const DATE_FORMATS = {
  DISPLAY: 'DD.MM.YYYY HH:mm',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  SHORT: 'DD.MM.YYYY',
  TIME: 'HH:mm',
};

// Регулярные выражения
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  TRANSPORT_NUMBER: /^[A-Z0-9\-\s№]+$/i,
  DISTANCE: /^\d+(\.\d{1,2})?$/,
};

// Типы действий
export const ACTION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  LIST: 'list',
};

// Фильтры
export const FILTERS = {
  STATUS: 'status',
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  TRANSPORT_MODEL: 'transport_model',
  SERVICE: 'service',
  SEARCH: 'search',
};

// Сортировка
export const SORT_OPTIONS = {
  CREATED_AT_DESC: '-created_at',
  CREATED_AT_ASC: 'created_at',
  SEND_TIME_DESC: '-send_time',
  SEND_TIME_ASC: 'send_time',
  DELIVERY_TIME_DESC: '-delivery_time',
  DELIVERY_TIME_ASC: 'delivery_time',
  DISTANCE_DESC: '-distance_km',
  DISTANCE_ASC: 'distance_km',
}; 