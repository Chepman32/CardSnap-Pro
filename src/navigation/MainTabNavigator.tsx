/**
 * Main Tab Navigator
 * Bottom tab navigation for main app screens
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainTabParamList} from '@types/index';
import {Colors} from '@constants/theme';

// Screens
import HomeScreen from '@screens/Home/HomeScreen';
import SearchScreen from '@screens/Search/SearchScreen';
import OrganizationScreen from '@screens/Organization/OrganizationScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandPrimary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Cards',
          tabBarIcon: ({color, size}) => (
            <Icon name="card-account-details" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <Icon name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Organization"
        component={OrganizationScreen}
        options={{
          tabBarLabel: 'Organize',
          tabBarIcon: ({color, size}) => (
            <Icon name="folder-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
