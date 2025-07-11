import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // при необходимости заменить на продакшн

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDeliveries = async (params = {}) => {
  // params: { date_from, date_to, type, cargo, ... }
  const response = await api.get('/deliveries/deliveries/', { params });
  return response.data;
};

export const fetchDeliveryTypes = async () => {
  const response = await api.get('/deliveries/services/');
  return response.data;
};

export const fetchCargoTypes = async () => {
  const response = await api.get('/deliveries/cargo-types/');
  return response.data;
};

export const fetchServices = async () => {
  const response = await api.get('/deliveries/services/');
  return response.data;
};

export const fetchStatuses = async () => {
  const response = await api.get('/deliveries/delivery-statuses/');
  return response.data;
};

export default api; 