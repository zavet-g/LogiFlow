// Типы данных для мобильного приложения LogiFlow

// Модель транспорта
export const TransportModel = {
  id: Number,
  name: String,
  description: String,
};

// Тип упаковки
export const PackageType = {
  id: Number,
  name: String,
  description: String,
};

// Услуга
export const Service = {
  id: Number,
  name: String,
  description: String,
  price: Number,
};

// Статус доставки
export const DeliveryStatus = {
  id: Number,
  name: String,
  color: String,
};

// Тип груза
export const CargoType = {
  id: Number,
  name: String,
  description: String,
};

// Доставка
export const Delivery = {
  id: Number,
  transport_model: TransportModel,
  transport_number: String,
  send_time: String, // ISO date string
  delivery_time: String, // ISO date string
  distance_km: Number,
  address_from: String,
  address_to: String,
  service: Service,
  status: DeliveryStatus,
  package_type: PackageType,
  cargo_type: CargoType,
  tech_state: String, // "Исправно" | "Неисправно"
  media: {
    id: Number,
    file: String,
    name: String,
  },
  created_at: String, // ISO date string
  updated_at: String, // ISO date string
};

// Пользователь
export const User = {
  id: Number,
  username: String,
  email: String,
  first_name: String,
  last_name: String,
  phone: String,
  address: String,
  is_courier: Boolean,
  date_joined: String, // ISO date string
};

// Форма создания доставки
export const CreateDeliveryForm = {
  transport_model: TransportModel,
  transport_number: String,
  send_time: Date,
  delivery_time: Date,
  distance_km: String,
  address_from: String,
  address_to: String,
  service: Service,
  status: DeliveryStatus,
  package_type: PackageType,
  cargo_type: CargoType,
  tech_state: String,
  media: {
    uri: String,
    type: String,
    name: String,
  },
};

// API Response
export const ApiResponse = {
  data: Array | Object,
  status: Number,
  message: String,
};

// Навигационные параметры
export const NavigationParams = {
  deliveryId: Number,
  delivery: Delivery,
}; 