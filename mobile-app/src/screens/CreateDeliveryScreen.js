import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  Divider,
  ActivityIndicator,
  Portal,
  Modal,
  List,
  RadioButton,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { referenceAPI, deliveryAPI } from '../services/api';

const CreateDeliveryScreen = ({ navigation }) => {
  // Состояние формы
  const [formData, setFormData] = useState({
    transport_model: null,
    transport_number: '',
    send_time: new Date(),
    delivery_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2 часа
    distance_km: '',
    address_from: '',
    address_to: '',
    service: null,
    status: null,
    package_type: null,
    cargo_type: null,
    tech_state: 'Исправно',
    media: null,
  });

  // Состояние справочников
  const [references, setReferences] = useState({
    transportModels: [],
    packageTypes: [],
    services: [],
    deliveryStatuses: [],
    cargoTypes: [],
  });

  // Состояние UI
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('send');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Загрузка справочников при монтировании компонента
  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setLoading(true);
      const [
        transportModels,
        packageTypes,
        services,
        deliveryStatuses,
        cargoTypes,
      ] = await Promise.all([
        referenceAPI.getTransportModels(),
        referenceAPI.getPackageTypes(),
        referenceAPI.getServices(),
        referenceAPI.getDeliveryStatuses(),
        referenceAPI.getCargoTypes(),
      ]);

      setReferences({
        transportModels: transportModels.data,
        packageTypes: packageTypes.data,
        services: services.data,
        deliveryStatuses: deliveryStatuses.data,
        cargoTypes: cargoTypes.data,
      });
    } catch (error) {
      console.error('Ошибка загрузки справочников:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить справочники');
    } finally {
      setLoading(false);
    }
  };

  // Обработчики изменения полей
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Обработчик выбора даты
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerMode === 'send') {
        updateFormData('send_time', selectedDate);
        // Автоматически устанавливаем время доставки через 2 часа
        const deliveryTime = new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000);
        updateFormData('delivery_time', deliveryTime);
      } else {
        updateFormData('delivery_time', selectedDate);
      }
    }
  };

  // Обработчик загрузки медиафайла
  const handleMediaUpload = async () => {
    try {
      const options = {
        mediaType: 'mixed',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      const result = await launchImageLibrary(options);
      
      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        updateFormData('media', {
          uri: file.uri,
          type: file.type,
          name: file.fileName || 'media.jpg',
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки медиафайла:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить файл');
    }
  };

  // Обработчик выбора из справочника
  const handleReferenceSelect = (type, item) => {
    updateFormData(type, item);
    setShowModal(false);
  };

  // Открытие модального окна для выбора
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Получение названия выбранного элемента
  const getSelectedName = (type) => {
    const item = formData[type];
    return item ? item.name : 'Не выбрано';
  };

  // Расчет продолжительности
  const getDuration = () => {
    const diff = formData.delivery_time.getTime() - formData.send_time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}мин`;
  };

  // Валидация формы
  const validateForm = () => {
    if (!formData.transport_model) {
      Alert.alert('Ошибка', 'Выберите модель транспорта');
      return false;
    }
    if (!formData.transport_number.trim()) {
      Alert.alert('Ошибка', 'Введите номер транспорта');
      return false;
    }
    if (!formData.distance_km.trim()) {
      Alert.alert('Ошибка', 'Введите дистанцию');
      return false;
    }
    if (!formData.service) {
      Alert.alert('Ошибка', 'Выберите услугу');
      return false;
    }
    if (!formData.status) {
      Alert.alert('Ошибка', 'Выберите статус доставки');
      return false;
    }
    if (!formData.package_type) {
      Alert.alert('Ошибка', 'Выберите тип упаковки');
      return false;
    }
    return true;
  };

  // Создание доставки
  const handleCreateDelivery = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Подготовка данных для отправки
      const deliveryData = {
        transport_model: formData.transport_model.id,
        transport_number: formData.transport_number,
        send_time: formData.send_time.toISOString(),
        delivery_time: formData.delivery_time.toISOString(),
        distance_km: parseFloat(formData.distance_km),
        address_from: formData.address_from,
        address_to: formData.address_to,
        service: formData.service.id,
        status: formData.status.id,
        package_type: formData.package_type.id,
        cargo_type: formData.cargo_type?.id || null,
        tech_state: formData.tech_state,
      };

      // Создание доставки
      const response = await deliveryAPI.createDelivery(deliveryData);

      // Загрузка медиафайла, если есть
      if (formData.media) {
        await deliveryAPI.uploadMedia(formData.media);
      }

      Alert.alert(
        'Успех',
        'Доставка успешно создана',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Ошибка создания доставки:', error);
      Alert.alert('Ошибка', 'Не удалось создать доставку');
    } finally {
      setLoading(false);
    }
  };

  if (loading && references.transportModels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка справочников...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Новая доставка</Title>
            <Paragraph>Заполните данные о доставке</Paragraph>
          </Card.Content>
        </Card>

        {/* Модель и номер транспорта */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Транспорт</Title>
            <Button
              mode="outlined"
              onPress={() => openModal('transport_model')}
              style={styles.selectButton}
            >
              {getSelectedName('transport_model')}
            </Button>
            <TextInput
              label="Номер транспорта"
              value={formData.transport_number}
              onChangeText={(text) => updateFormData('transport_number', text)}
              style={styles.input}
              placeholder="V01, №123"
            />
          </Card.Content>
        </Card>

        {/* Время в пути */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Время в пути</Title>
            <Button
              mode="outlined"
              onPress={() => {
                setDatePickerMode('send');
                setShowDatePicker(true);
              }}
              style={styles.selectButton}
            >
              Отправка: {formData.send_time.toLocaleString()}
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                setDatePickerMode('delivery');
                setShowDatePicker(true);
              }}
              style={styles.selectButton}
            >
              Доставка: {formData.delivery_time.toLocaleString()}
            </Button>
            <Chip style={styles.chip}>
              Продолжительность: {getDuration()}
            </Chip>
          </Card.Content>
        </Card>

        {/* Дистанция и адреса */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Маршрут</Title>
            <TextInput
              label="Дистанция (км)"
              value={formData.distance_km}
              onChangeText={(text) => updateFormData('distance_km', text)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Адрес отправления"
              value={formData.address_from}
              onChangeText={(text) => updateFormData('address_from', text)}
              style={styles.input}
              multiline
            />
            <TextInput
              label="Адрес доставки"
              value={formData.address_to}
              onChangeText={(text) => updateFormData('address_to', text)}
              style={styles.input}
              multiline
            />
          </Card.Content>
        </Card>

        {/* Медиафайл */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Медиафайл</Title>
            <Button
              mode="outlined"
              onPress={handleMediaUpload}
              style={styles.selectButton}
              icon="camera"
            >
              {formData.media ? 'Файл загружен' : 'Загрузить файл'}
            </Button>
            {formData.media && (
              <Paragraph style={styles.fileInfo}>
                {formData.media.name}
              </Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Услуга */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Услуга</Title>
            <Button
              mode="outlined"
              onPress={() => openModal('service')}
              style={styles.selectButton}
            >
              {getSelectedName('service')}
            </Button>
          </Card.Content>
        </Card>

        {/* Статус доставки */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Статус доставки</Title>
            <Button
              mode="outlined"
              onPress={() => openModal('status')}
              style={styles.selectButton}
            >
              {getSelectedName('status')}
            </Button>
          </Card.Content>
        </Card>

        {/* Упаковка */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Упаковка</Title>
            <Button
              mode="outlined"
              onPress={() => openModal('package_type')}
              style={styles.selectButton}
            >
              {getSelectedName('package_type')}
            </Button>
          </Card.Content>
        </Card>

        {/* Тип груза (опционально) */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Тип груза (опционально)</Title>
            <Button
              mode="outlined"
              onPress={() => openModal('cargo_type')}
              style={styles.selectButton}
            >
              {getSelectedName('cargo_type')}
            </Button>
          </Card.Content>
        </Card>

        {/* Техническое состояние */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Техническое состояние</Title>
            <RadioButton.Group
              onValueChange={(value) => updateFormData('tech_state', value)}
              value={formData.tech_state}
            >
              <RadioButton.Item label="Исправно" value="Исправно" />
              <RadioButton.Item label="Неисправно" value="Неисправно" />
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Кнопка создания */}
        <Button
          mode="contained"
          onPress={handleCreateDelivery}
          style={styles.createButton}
          loading={loading}
          disabled={loading}
        >
          Создать
        </Button>
      </ScrollView>

      {/* Модальное окно для выбора справочников */}
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>
            {modalType === 'transport_model' && 'Выберите модель транспорта'}
            {modalType === 'package_type' && 'Выберите тип упаковки'}
            {modalType === 'service' && 'Выберите услугу'}
            {modalType === 'status' && 'Выберите статус доставки'}
            {modalType === 'cargo_type' && 'Выберите тип груза'}
          </Title>
          <ScrollView style={styles.modalScroll}>
            {modalType === 'transport_model' &&
              references.transportModels.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => handleReferenceSelect('transport_model', item)}
                  right={() => <List.Icon icon="chevron-right" />}
                />
              ))}
            {modalType === 'package_type' &&
              references.packageTypes.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => handleReferenceSelect('package_type', item)}
                  right={() => <List.Icon icon="chevron-right" />}
                />
              ))}
            {modalType === 'service' &&
              references.services.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => handleReferenceSelect('service', item)}
                  right={() => <List.Icon icon="chevron-right" />}
                />
              ))}
            {modalType === 'status' &&
              references.deliveryStatuses.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => handleReferenceSelect('status', item)}
                  right={() => <List.Icon icon="chevron-right" />}
                />
              ))}
            {modalType === 'cargo_type' &&
              references.cargoTypes.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  onPress={() => handleReferenceSelect('cargo_type', item)}
                  right={() => <List.Icon icon="chevron-right" />}
                />
              ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'send' ? formData.send_time : formData.delivery_time}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  selectButton: {
    marginBottom: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalScroll: {
    flex: 1,
  },
  fileInfo: {
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default CreateDeliveryScreen; 