import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../store';
import DriverMap from '../screens/driver/DriverMap';
import ActiveJourney from '../screens/driver/ActiveJourney';
import StartJourney from '../screens/driver/StartJourney';
import FinishJourney from '../screens/driver/FinishJourney';
import FuelRegister from '../screens/driver/FuelRegister';
import EmergencyReport from '../screens/driver/EmergencyReport';
import DriverHistory from '../screens/driver/DriverHistory';
import BottomTab from '../components/ui/BottomTab';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DriverTabs() {
  const logout = useAuthStore((s) => s.logout);
  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontWeight: '600' },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: spacing.md }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen name="DriverMap" component={DriverMap} options={{ title: 'Mi Ruta' }} />
      <Tab.Screen name="ActiveJourney" component={ActiveJourney} options={{ title: 'Viaje' }} />
      <Tab.Screen name="DriverHistory" component={DriverHistory} options={{ title: 'Historial' }} />
    </Tab.Navigator>
  );
}

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="StartJourney" component={StartJourney} />
      <Stack.Screen name="FinishJourney" component={FinishJourney} />
      <Stack.Screen name="FuelRegister" component={FuelRegister} />
      <Stack.Screen name="EmergencyReport" component={EmergencyReport} />
    </Stack.Navigator>
  );
}
