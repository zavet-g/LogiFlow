import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  ActivityIndicator,
  Searchbar,
  Menu,
  Divider,
} from 'react-native-paper';
import { deliveryAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);

  useEffect(() => {
    loadDeliveries();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [searchQuery, deliveries]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Ошибка загрузки доставок:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить доставки');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  const filterDeliveries = () => {
    if (!searchQuery.trim()) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const filtered = deliveries.filter(delivery => 
      delivery.transport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address_to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.status?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDeliveries(filtered);
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

  const handleDeliveryPress = (delivery) => {
    navigation.navigate('DeliveryDetails', { deliveryId: delivery.id });
  };

  const handleDeleteDelivery = async (deliveryId) => {
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
              await loadDeliveries();
              Alert.alert('Успех', 'Доставка удалена');
            } catch (error) {
              console.error('Ошибка удаления доставки:', error);
              Alert.alert('Ошибка', 'Не удалось удалить доставку');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка доставок...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Заголовок */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>LogiFlow</Title>
            <Paragraph>Управление доставками</Paragraph>
          </Card.Content>
        </Card>

        {/* Поиск */}
        <Searchbar
          placeholder="Поиск доставок..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Статистика */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Статистика</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{deliveries.length}</Text>
                <Text style={styles.statLabel}>Всего доставок</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {deliveries.filter(d => d.status?.name === 'В пути').length}
                </Text>
                <Text style={styles.statLabel}>В пути</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {deliveries.filter(d => d.status?.name === 'Доставлено').length}
                </Text>
                <Text style={styles.statLabel}>Доставлено</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Список доставок */}
        {filteredDeliveries.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>Нет доставок</Title>
              <Paragraph>
                {searchQuery ? 'По вашему запросу ничего не найдено' : 'Создайте первую доставку'}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          filteredDeliveries.map((delivery) => (
            <Card
              key={delivery.id}
              style={styles.deliveryCard}
              onPress={() => handleDeliveryPress(delivery)}
            >
              <Card.Content>
                <View style={styles.deliveryHeader}>
                  <Title style={styles.deliveryTitle}>
                    {delivery.transport_model?.name} - {delivery.transport_number}
                  </Title>
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

                <View style={styles.deliveryInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Отправление:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(delivery.send_time)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Доставка:</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(delivery.delivery_time)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Дистанция:</Text>
                    <Text style={styles.infoValue}>
                      {delivery.distance_km} км
                    </Text>
                  </View>
                </View>

                <View style={styles.addressSection}>
                  <Text style={styles.addressLabel}>Маршрут:</Text>
                  <Text style={styles.addressText}>
                    {delivery.address_from || 'Адрес не указан'} → {delivery.address_to || 'Адрес не указан'}
                  </Text>
                </View>

                <View style={styles.tagsRow}>
                  {delivery.service && (
                    <Chip style={styles.tagChip} mode="outlined">
                      {delivery.service.name}
                    </Chip>
                  )}
                  {delivery.package_type && (
                    <Chip style={styles.tagChip} mode="outlined">
                      {delivery.package_type.name}
                    </Chip>
                  )}
                  <Chip style={styles.tagChip} mode="outlined">
                    {delivery.tech_state}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* FAB для создания новой доставки */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('CreateDelivery')}
        label="Новая доставка"
      />
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
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 2,
  },
  statsCard: {
    marginBottom: 16,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyCard: {
    marginTop: 32,
    elevation: 4,
  },
  deliveryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
  },
  deliveryInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  addressSection: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    height: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen; 