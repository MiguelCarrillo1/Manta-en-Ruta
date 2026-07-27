import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store';
import SuperadminDashboard from '../screens/superadmin/SuperadminDashboard';
import Cooperatives from '../screens/superadmin/Cooperatives';
import CooperativeDetail from '../screens/superadmin/CooperativeDetail';
import GlobalConfig from '../screens/superadmin/GlobalConfig';
import Catalogs from '../screens/superadmin/Catalogs';
import CatalogItems from '../screens/superadmin/CatalogItems';
import Users from '../screens/superadmin/Users';
import Roles from '../screens/superadmin/Roles';
import Logs from '../screens/superadmin/Logs';
import SuperadminStatistics from '../screens/superadmin/SuperadminStatistics';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS = [
  { name: 'Dashboard', label: 'Dashboard', icon: '⬡' },
  { name: 'Cooperatives', label: 'Cooperativas', icon: '◆' },
  { name: 'Catalogs', label: 'Catálogos', icon: '⊞' },
  { name: 'Roles', label: 'Roles', icon: '⚙' },
  { name: 'SuperadminStatistics', label: 'Estadísticas', icon: '≡' },
];

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <TouchableOpacity onPress={logout} style={{ marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5' }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#666' }}>Salir</Text>
    </TouchableOpacity>
  );
}

function TabIcon({ label, focused }) {
  const tab = TABS.find((t) => t.label === label);
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, color: focused ? '#000' : '#AAA' }}>{tab?.icon || '○'}</Text>
    </View>
  );
}

function SuperadminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFF' },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: '#FFF', borderTopColor: '#F0F0F0', borderTopWidth: 1, height: 60, paddingBottom: 6, paddingTop: 6 },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#AAA',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={
            tab.name === 'Dashboard' ? SuperadminDashboard :
            tab.name === 'Cooperatives' ? Cooperatives :
            tab.name === 'Catalogs' ? Catalogs :
            tab.name === 'Roles' ? Roles :
            SuperadminStatistics
          }
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => <TabIcon label={tab.label} focused={focused} />,
            headerRight: () => <LogoutButton />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function SuperadminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#FFF' }, headerTintColor: '#000', headerTitleStyle: { fontWeight: '700' }, headerShadowVisible: false }}>
      <Stack.Screen name="SuperadminTabs" component={SuperadminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CooperativeDetail" component={CooperativeDetail} options={{ title: 'Cooperativa' }} />
      <Stack.Screen name="GlobalConfig" component={GlobalConfig} options={{ title: 'Config. Global' }} />
      <Stack.Screen name="CatalogItems" component={CatalogItems} options={{ title: 'Items' }} />
      <Stack.Screen name="Users" component={Users} options={{ title: 'Usuarios' }} />
      <Stack.Screen name="Logs" component={Logs} options={{ title: 'Logs' }} />
    </Stack.Navigator>
  );
}
