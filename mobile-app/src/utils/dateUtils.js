// Утилиты для работы с датами

/**
 * Форматирует дату в локальный формат
 * @param {string|Date} date - дата для форматирования
 * @param {boolean} includeTime - включать ли время
 * @returns {string} отформатированная дата
 */
export const formatDate = (date, includeTime = true) => {
  if (!date) return 'Не указано';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('ru-RU', options);
};

/**
 * Форматирует дату в короткий формат (только дата)
 * @param {string|Date} date - дата для форматирования
 * @returns {string} отформатированная дата
 */
export const formatDateShort = (date) => {
  return formatDate(date, false);
};

/**
 * Форматирует время
 * @param {string|Date} date - дата для форматирования
 * @returns {string} отформатированное время
 */
export const formatTime = (date) => {
  if (!date) return 'Не указано';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Неверное время';
  }

  return dateObj.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Вычисляет продолжительность между двумя датами
 * @param {string|Date} startDate - начальная дата
 * @param {string|Date} endDate - конечная дата
 * @returns {string} продолжительность в формате "Xч Yмин"
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Не указано';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Неверные даты';
  }

  const diff = end.getTime() - start.getTime();
  
  if (diff < 0) {
    return 'Отрицательная продолжительность';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}мин`;
  }
  
  return `${hours}ч ${minutes}мин`;
};

/**
 * Проверяет, является ли дата сегодняшней
 * @param {string|Date} date - дата для проверки
 * @returns {boolean} true если дата сегодняшняя
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Проверяет, является ли дата вчерашней
 * @param {string|Date} date - дата для проверки
 * @returns {boolean} true если дата вчерашняя
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.toDateString() === yesterday.toDateString();
};

/**
 * Получает относительное время (сегодня, вчера, дата)
 * @param {string|Date} date - дата для форматирования
 * @returns {string} относительное время
 */
export const getRelativeTime = (date) => {
  if (!date) return 'Не указано';
  
  if (isToday(date)) {
    return `Сегодня, ${formatTime(date)}`;
  }
  
  if (isYesterday(date)) {
    return `Вчера, ${formatTime(date)}`;
  }
  
  return formatDate(date);
};

/**
 * Добавляет часы к дате
 * @param {string|Date} date - исходная дата
 * @param {number} hours - количество часов для добавления
 * @returns {Date} новая дата
 */
export const addHours = (date, hours) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

/**
 * Проверяет, прошла ли дата
 * @param {string|Date} date - дата для проверки
 * @returns {boolean} true если дата в прошлом
 */
export const isPast = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  return dateObj < now;
};

/**
 * Проверяет, является ли дата будущей
 * @param {string|Date} date - дата для проверки
 * @returns {boolean} true если дата в будущем
 */
export const isFuture = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  return dateObj > now;
}; 