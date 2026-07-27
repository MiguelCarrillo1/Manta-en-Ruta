import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from './src/store';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import GuestNavigator from './src/navigation/GuestNavigator';
import DriverNavigator from './src/navigation/DriverNavigator';
import OperatorNavigator from './src/navigation/OperatorNavigator';
import UserNavigator from './src/navigation/UserNavigator';
import CooperativeNavigator from './src/navigation/CooperativeNavigator';
import SuperadminNavigator from './src/navigation/SuperadminNavigator';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const { user } = useAuthStore();
  switch (user?.role) {
    case 'superadmin': return <SuperadminNavigator />;
    case 'conductor': return <DriverNavigator />;
    case 'usuario': return <UserNavigator />;
    case 'operador': return <OperatorNavigator />;
    case 'admin':
    case 'gerente':
    case 'operador': return <CooperativeNavigator />;
    default: return <UserNavigator />;
  }
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  );
}

export default function App() {
  const { isLoading, isAuthenticated, isGuest, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : isGuest ? <GuestNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
