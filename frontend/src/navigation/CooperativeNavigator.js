import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import CoopDashboard from '../screens/cooperative/CoopDashboard';
import Vehicles from '../screens/cooperative/Vehicles';
import Drivers from '../screens/cooperative/Drivers';
import Monitoring from '../screens/cooperative/Monitoring';
import CoopMenu from '../screens/cooperative/CoopMenu';
import ManageLines from '../screens/cooperative/ManageLines';
import ManageStops from '../screens/cooperative/ManageStops';
import ManagePois from '../screens/cooperative/ManagePois';
import Alerts from '../screens/cooperative/Alerts';
import Maintenance from '../screens/cooperative/Maintenance';
import CoopStatistics from '../screens/cooperative/CoopStatistics';
import Emergencies from '../screens/cooperative/Emergencies';
import FuelHistory from '../screens/cooperative/FuelHistory';
import MapScreen from '../screens/MapScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CooperativeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.textPrimary, headerTitleStyle: { fontWeight: '600' } }}>
      <Tab.Screen name="CoopDashboard" component={CoopDashboard} options={{ title: 'Dashboard', tabBarIcon: () => <Text>📊</Text> }} />
      <Tab.Screen name="Vehicles" component={Vehicles} options={{ title: 'Vehículos', tabBarIcon: () => <Text>🚌</Text> }} />
      <Tab.Screen name="Drivers" component={Drivers} options={{ title: 'Conductores', tabBarIcon: () => <Text>👤</Text> }} />
      <Tab.Screen name="Monitoring" component={Monitoring} options={{ title: 'Monitoreo', tabBarIcon: () => <Text>🛰️</Text> }} />
      <Tab.Screen name="CoopMenu" component={CoopMenu} options={{ title: 'Menú', tabBarIcon: () => <Text>☰</Text> }} />
    </Tab.Navigator>
  );
}

export default function CooperativeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.textPrimary }}>
      <Stack.Screen name="CooperativeTabs" component={CooperativeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ManageLines" component={ManageLines} options={{ title: 'Gestionar Líneas' }} />
      <Stack.Screen name="ManageStops" component={ManageStops} options={{ title: 'Gestionar Paradas' }} />
      <Stack.Screen name="ManagePois" component={ManagePois} options={{ title: 'Gestionar POIs' }} />
      <Stack.Screen name="Alerts" component={Alerts} options={{ title: 'Alertas' }} />
      <Stack.Screen name="Maintenance" component={Maintenance} options={{ title: 'Mantenimiento' }} />
      <Stack.Screen name="CoopStatistics" component={CoopStatistics} options={{ title: 'Estadísticas' }} />
      <Stack.Screen name="Emergencies" component={Emergencies} options={{ title: 'Emergencias' }} />
      <Stack.Screen name="FuelHistory" component={FuelHistory} options={{ title: 'Combustible' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
    </Stack.Navigator>
  );
}
