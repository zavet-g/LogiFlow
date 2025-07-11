// Утилиты для валидации данных

/**
 * Проверяет, является ли строка пустой или содержит только пробелы
 * @param {string} value - строка для проверки
 * @returns {boolean} true если строка пустая
 */
export const isEmpty = (value) => {
  return !value || value.trim().length === 0;
};

/**
 * Проверяет минимальную длину строки
 * @param {string} value - строка для проверки
 * @param {number} minLength - минимальная длина
 * @returns {boolean} true если длина достаточна
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Проверяет максимальную длину строки
 * @param {string} value - строка для проверки
 * @param {number} maxLength - максимальная длина
 * @returns {boolean} true если длина не превышает лимит
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Проверяет, является ли строка валидным email
 * @param {string} email - email для проверки
 * @returns {boolean} true если email валиден
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Проверяет, является ли строка валидным номером телефона
 * @param {string} phone - номер телефона для проверки
 * @returns {boolean} true если номер валиден
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Убираем все символы кроме цифр
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Проверяем длину (10-15 цифр)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * Проверяет, является ли значение числом
 * @param {any} value - значение для проверки
 * @returns {boolean} true если значение является числом
 */
export const isNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Проверяет, является ли число положительным
 * @param {number} value - число для проверки
 * @returns {boolean} true если число положительное
 */
export const isPositive = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

/**
 * Проверяет, находится ли число в заданном диапазоне
 * @param {number} value - число для проверки
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {boolean} true если число в диапазоне
 */
export const isInRange = (value, min, max) => {
  const numValue = parseFloat(value);
  return isNumber(value) && numValue >= min && numValue <= max;
};

/**
 * Проверяет, является ли дата валидной
 * @param {string|Date} date - дата для проверки
 * @returns {boolean} true если дата валидна
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Проверяет, что конечная дата больше начальной
 * @param {string|Date} startDate - начальная дата
 * @param {string|Date} endDate - конечная дата
 * @returns {boolean} true если конечная дата больше начальной
 */
export const isEndDateAfterStart = (startDate, endDate) => {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return end > start;
};

/**
 * Проверяет, что файл не превышает максимальный размер
 * @param {File|Object} file - файл для проверки
 * @param {number} maxSizeMB - максимальный размер в МБ
 * @returns {boolean} true если файл не превышает лимит
 */
export const isFileSizeValid = (file, maxSizeMB) => {
  if (!file || !file.size) return false;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Проверяет, является ли файл изображением
 * @param {File|Object} file - файл для проверки
 * @returns {boolean} true если файл является изображением
 */
export const isImageFile = (file) => {
  if (!file || !file.type) return false;
  
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return imageTypes.includes(file.type);
};

/**
 * Проверяет, является ли файл PDF
 * @param {File|Object} file - файл для проверки
 * @returns {boolean} true если файл является PDF
 */
export const isPdfFile = (file) => {
  if (!file || !file.type) return false;
  
  return file.type === 'application/pdf';
};

/**
 * Проверяет, является ли файл допустимым типом
 * @param {File|Object} file - файл для проверки
 * @param {Array} allowedTypes - массив допустимых MIME типов
 * @returns {boolean} true если файл допустимого типа
 */
export const isAllowedFileType = (file, allowedTypes) => {
  if (!file || !file.type) return false;
  
  return allowedTypes.includes(file.type);
};

/**
 * Валидация формы создания доставки
 * @param {Object} formData - данные формы
 * @returns {Object} объект с ошибками валидации
 */
export const validateDeliveryForm = (formData) => {
  const errors = {};

  // Проверка модели транспорта
  if (!formData.transport_model) {
    errors.transport_model = 'Выберите модель транспорта';
  }

  // Проверка номера транспорта
  if (isEmpty(formData.transport_number)) {
    errors.transport_number = 'Введите номер транспорта';
  } else if (!hasMinLength(formData.transport_number, 2)) {
    errors.transport_number = 'Номер транспорта должен содержать минимум 2 символа';
  }

  // Проверка дистанции
  if (isEmpty(formData.distance_km)) {
    errors.distance_km = 'Введите дистанцию';
  } else if (!isPositive(formData.distance_km)) {
    errors.distance_km = 'Дистанция должна быть положительным числом';
  } else if (!isInRange(formData.distance_km, 0.1, 10000)) {
    errors.distance_km = 'Дистанция должна быть от 0.1 до 10000 км';
  }

  // Проверка времени
  if (!isValidDate(formData.send_time)) {
    errors.send_time = 'Укажите корректное время отправления';
  }
  if (!isValidDate(formData.delivery_time)) {
    errors.delivery_time = 'Укажите корректное время доставки';
  }
  if (formData.send_time && formData.delivery_time && 
      !isEndDateAfterStart(formData.send_time, formData.delivery_time)) {
    errors.delivery_time = 'Время доставки должно быть позже времени отправления';
  }

  // Проверка адресов
  if (isEmpty(formData.address_from)) {
    errors.address_from = 'Введите адрес отправления';
  }
  if (isEmpty(formData.address_to)) {
    errors.address_to = 'Введите адрес доставки';
  }

  // Проверка услуги
  if (!formData.service) {
    errors.service = 'Выберите услугу';
  }

  // Проверка статуса
  if (!formData.status) {
    errors.status = 'Выберите статус доставки';
  }

  // Проверка типа упаковки
  if (!formData.package_type) {
    errors.package_type = 'Выберите тип упаковки';
  }

  // Проверка технического состояния
  if (!formData.tech_state || !['Исправно', 'Неисправно'].includes(formData.tech_state)) {
    errors.tech_state = 'Выберите техническое состояние';
  }

  // Проверка медиафайла (опционально)
  if (formData.media) {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf'
    ];
    
    if (!isAllowedFileType(formData.media, allowedTypes)) {
      errors.media = 'Поддерживаются только изображения и PDF файлы';
    } else if (!isFileSizeValid(formData.media, 10)) { // 10MB лимит
      errors.media = 'Размер файла не должен превышать 10 МБ';
    }
  }

  return errors;
};

/**
 * Проверяет, есть ли ошибки в объекте ошибок
 * @param {Object} errors - объект с ошибками
 * @returns {boolean} true если есть ошибки
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
}; 