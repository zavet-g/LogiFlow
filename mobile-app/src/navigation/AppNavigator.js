import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Импорт экранов
import HomeScreen from '../screens/HomeScreen';
import CreateDeliveryScreen from '../screens/CreateDeliveryScreen';
import DeliveryDetailsScreen from '../screens/DeliveryDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'LogiFlow',
                headerTitle: 'LogiFlow',
              }}
            />
            <Stack.Screen
              name="CreateDelivery"
              component={CreateDeliveryScreen}
              options={{
                title: 'Новая доставка',
                headerTitle: 'Новая доставка',
              }}
            />
            <Stack.Screen
              name="DeliveryDetails"
              component={DeliveryDetailsScreen}
              options={{
                title: 'Детали доставки',
                headerTitle: 'Детали доставки',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default AppNavigator; 