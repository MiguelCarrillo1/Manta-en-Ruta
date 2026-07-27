import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHome from '../screens/user/UserHome';
import LiveLocationMap from '../screens/user/LiveLocationMap';
import Lines from '../screens/user/Lines';
import LineDetail from '../screens/user/LineDetail';
import Stops from '../screens/user/Stops';
import Search from '../screens/user/Search';
import BusDetail from '../screens/user/BusDetail';
import StopDetail from '../screens/user/StopDetail';
import MapScreen from '../screens/MapScreen';
import Profile from '../screens/Profile';
import BottomTab from '../components/ui/BottomTab';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function UserTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTab {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="LiveLocationMap" component={LiveLocationMap} />
      <Tab.Screen name="UserHome" component={UserHome} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Lines" component={Lines} />
      <Tab.Screen name="Stops" component={Stops} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen name="LineDetail" component={LineDetail} />
      <Stack.Screen name="BusDetail" component={BusDetail} />
      <Stack.Screen name="StopDetail" component={StopDetail} />
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}
