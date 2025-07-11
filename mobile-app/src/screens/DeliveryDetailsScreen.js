import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  ActivityIndicator,
  Divider,
  IconButton,
} from 'react-native-paper';
import { deliveryAPI } from '../services/api';

const DeliveryDetailsScreen = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeliveryDetails();
  }, [deliveryId]);

  const loadDeliveryDetails = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getDelivery(deliveryId);
      setDelivery(response.data);
    } catch (error) {
      console.error('Ошибка загрузки деталей доставки:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить детали доставки');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.name) {
      case 'В пути':
        return '#FFA000';
      case 'Доставлено':
        return '#4CAF50';
      case 'Отменено':
        return '#F44336';
      case 'Ожидает':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const getDuration = () => {
    if (!delivery) return '';
    const sendTime = new Date(delivery.send_time);
    const deliveryTime = new Date(delivery.delivery_time);
    const diff = deliveryTime.getTime() - sendTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}мин`;
  };

  const handleEdit = () => {
    navigation.navigate('EditDelivery', { deliveryId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление доставки',
      'Вы уверены, что хотите удалить эту доставку?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deliveryAPI.deleteDelivery(deliveryId);
              Alert.alert('Успех', 'Доставка удалена', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Ошибка удаления доставки:', error);
              Alert.alert('Ошибка', 'Не удалось удалить доставку');
            }
          },
        },
      ]
    );
  };

  const openMap = (address) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка деталей...</Text>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.errorContainer}>
        <Text>Доставка не найдена</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Заголовок */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Title>Доставка #{delivery.id}</Title>
                <Paragraph>
                  {delivery.transport_model?.name} - {delivery.transport_number}
                </Paragraph>
              </View>
              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(delivery.status) }
                ]}
                textStyle={{ color: 'white' }}
              >
                {delivery.status?.name || 'Неизвестно'}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Основная информация */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Основная информация</Title>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Модель транспорта:</Text>
                <Text style={styles.infoValue}>
                  {delivery.transport_model?.name || 'Не указано'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Номер транспорта:</Text>
                <Text style={styles.infoValue}>{delivery.transport_number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Дистанция:</Text>
                <Text style={styles.infoValue}>{delivery.distance_km} км</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Техническое состояние:</Text>
                <Text style={styles.infoValue}>{delivery.tech_state}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Время */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Время доставки</Title>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Время отправления:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(delivery.send_time)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Время доставки:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(delivery.delivery_time)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Продолжительность:</Text>
                <Text style={styles.infoValue}>{getDuration()}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Маршрут */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Маршрут</Title>
            <View style={styles.addressSection}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Откуда:</Text>
                <View style={styles.addressRow}>
                  <Text style={styles.addressText}>
                    {delivery.address_from || 'Адрес не указан'}
                  </Text>
                  {delivery.address_from && (
                    <IconButton
                      icon="map-marker"
                      size={20}
                      onPress={() => openMap(delivery.address_from)}
                    />
                  )}
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Куда:</Text>
                <View style={styles.addressRow}>
                  <Text style={styles.addressText}>
                    {delivery.address_to || 'Адрес не указан'}
                  </Text>
                  {delivery.address_to && (
                    <IconButton
                      icon="map-marker"
                      size={20}
                      onPress={() => openMap(delivery.address_to)}
                    />
                  )}
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Услуги и упаковка */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Услуги и упаковка</Title>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Услуга:</Text>
                <Text style={styles.infoValue}>
                  {delivery.service?.name || 'Не указано'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Тип упаковки:</Text>
                <Text style={styles.infoValue}>
                  {delivery.package_type?.name || 'Не указано'}
                </Text>
              </View>
              {delivery.cargo_type && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Тип груза:</Text>
                  <Text style={styles.infoValue}>
                    {delivery.cargo_type.name}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Медиафайлы */}
        {delivery.media && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Медиафайлы</Title>
              <View style={styles.mediaSection}>
                <Text style={styles.mediaText}>
                  Прикреплен файл: {delivery.media.name || 'Файл'}
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Здесь можно добавить просмотр файла
                    Alert.alert('Просмотр файла', 'Функция просмотра файла');
                  }}
                >
                  Просмотреть
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Дополнительная информация */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Дополнительная информация</Title>
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Создано:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(delivery.created_at)}
                </Text>
              </View>
              {delivery.updated_at && delivery.updated_at !== delivery.created_at && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Обновлено:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(delivery.updated_at)}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Кнопки действий */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.actionButton}
            icon="pencil"
          >
            Редактировать
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            icon="delete"
            textColor="#F44336"
          >
            Удалить
          </Button>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  statusChip: {
    height: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  infoSection: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  addressSection: {
    marginTop: 8,
  },
  addressItem: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
  },
  mediaSection: {
    marginTop: 8,
    alignItems: 'center',
  },
  mediaText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default DeliveryDetailsScreen; 