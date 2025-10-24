/**
 * Root Navigator
 * Main navigation structure for the app
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@types/index';

// Screens
import SplashScreen from '@screens/Splash/SplashScreen';
import MainTabNavigator from './MainTabNavigator';
import CameraScreen from '@screens/Camera/CameraScreen';
import ProcessingScreen from '@screens/Processing/ProcessingScreen';
import EditContactScreen from '@screens/EditContact/EditContactScreen';
import ContactDetailScreen from '@screens/ContactDetail/ContactDetailScreen';
import SearchScreen from '@screens/Search/SearchScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import OrganizationScreen from '@screens/Organization/OrganizationScreen';
import IAPScreen from '@screens/IAP/IAPScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="EditContact"
        component={EditContactScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="Organization"
        component={OrganizationScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="IAP"
        component={IAPScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
