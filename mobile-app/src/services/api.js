import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Базовый URL для API
const API_BASE_URL = 'http://localhost:8000/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API методы для справочников
export const referenceAPI = {
  // Получить модели транспорта
  getTransportModels: () => api.get('/deliveries/transport-models/'),
  
  // Получить типы упаковки
  getPackageTypes: () => api.get('/deliveries/package-types/'),
  
  // Получить услуги
  getServices: () => api.get('/deliveries/services/'),
  
  // Получить статусы доставки
  getDeliveryStatuses: () => api.get('/deliveries/delivery-statuses/'),
  
  // Получить типы груза
  getCargoTypes: () => api.get('/deliveries/cargo-types/'),
};

// API методы для доставок
export const deliveryAPI = {
  // Получить список доставок
  getDeliveries: () => api.get('/deliveries/deliveries/'),
  
  // Создать новую доставку
  createDelivery: (data) => api.post('/deliveries/deliveries/', data),
  
  // Получить детали доставки
  getDelivery: (id) => api.get(`/deliveries/deliveries/${id}/`),
  
  // Обновить доставку
  updateDelivery: (id, data) => api.put(`/deliveries/deliveries/${id}/`, data),
  
  // Удалить доставку
  deleteDelivery: (id) => api.delete(`/deliveries/deliveries/${id}/`),
  
  // Загрузить медиафайл
  uploadMedia: (file) => {
    const formData = new FormData();
    formData.append('media', file);
    return api.post('/deliveries/upload-media/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// API методы для пользователей
export const userAPI = {
  // Авторизация
  login: (credentials) => api.post('/users/login/', credentials),
  
  // Регистрация
  register: (userData) => api.post('/users/users/', userData),
  
  // Получить профиль пользователя
  getProfile: () => api.get('/users/users/me/'),
  
  // Обновить профиль
  updateProfile: (data) => api.put('/users/users/me/', data),
};

export default api; 