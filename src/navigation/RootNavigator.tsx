/**
 * Root Navigator
 * Manages app navigation structure
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MindMapEditorScreen from '../screens/MindMapEditorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PremiumScreen from '../screens/PremiumScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import SearchScreen from '../screens/SearchScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export type RootStackParamList = {
  Home: undefined;
  MindMapEditor: {mapId: string; isNew?: boolean};
  Settings: undefined;
  Premium: undefined;
  Templates: undefined;
  Search: undefined;
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const onboardingCompleted = useSelector(
    (state: RootState) => state.user.onboardingCompleted,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}>
        {!onboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MindMapEditor" component={MindMapEditorScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Premium" component={PremiumScreen} />
            <Stack.Screen name="Templates" component={TemplatesScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
