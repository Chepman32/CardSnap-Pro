/**
 * CardSnap Pro
 * Main Application Component
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import {DatabaseProvider} from './services/database/DatabaseProvider';
import {SubscriptionProvider} from './services/subscription/SubscriptionProvider';
import {ThemeProvider} from './services/theme/ThemeProvider';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

const App = (): React.JSX.Element => {
  useEffect(() => {
    // Initialize app services on mount
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Initialize database
    // Initialize analytics
    // Check subscription status
    // Load user preferences
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider>
          <DatabaseProvider>
            <SubscriptionProvider>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
              />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SubscriptionProvider>
          </DatabaseProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
