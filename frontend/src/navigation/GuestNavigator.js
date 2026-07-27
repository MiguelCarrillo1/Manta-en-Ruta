import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store';
import GuestMap from '../screens/guest/GuestMap';
import GuestLines from '../screens/guest/GuestLines';
import GuestStops from '../screens/guest/GuestStops';
import BottomTab from '../components/ui/BottomTab';
import { colors, typography, spacing } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function GuestTabs() {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Salir del modo invitado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Tab.Navigator tabBar={(props) => <BottomTab {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="GuestMap" component={GuestMap} />
      <Tab.Screen name="GuestLines" component={GuestLines} />
      <Tab.Screen name="GuestStops" component={GuestStops} />
    </Tab.Navigator>
  );
}

export default function GuestNavigator() {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Salir del modo invitado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GuestTabs"
        component={GuestTabs}
        options={{
          headerShown: true,
          headerTitle: 'MantaRuta',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: spacing.md }}>
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});

