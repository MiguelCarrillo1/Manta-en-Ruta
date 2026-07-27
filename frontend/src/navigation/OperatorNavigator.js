import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useAuthStore } from '../store';
import MonitorScreen from '../screens/operator/MonitorScreen';
import AssignDriverScreen from '../screens/operator/AssignDriverScreen';
import BottomTab from '../components/ui/BottomTab';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function OperatorTabs() {
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
      <Tab.Screen name="Monitor" component={MonitorScreen} options={{ title: 'Monitoreo' }} />
      <Tab.Screen name="Assign" component={AssignDriverScreen} options={{ title: 'Asignar' }} />
    </Tab.Navigator>
  );
}

export default function OperatorNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OperatorTabs" component={OperatorTabs} />
    </Stack.Navigator>
  );
}
