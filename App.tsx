/**
 * MindWeave Mobile Application
 * Main App Component
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/store';
import {ThemeProvider} from './src/theme/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import ToastContainer from './src/components/common/ToastContainer';
import {iapService} from './src/services/iapService';
import {mindMapsStorage, userPreferencesStorage} from './src/services/storageService';
import {loadMindMaps} from './src/store/slices/mindMapsSlice';
import {setPremiumStatus, completeOnboarding} from './src/store/slices/userSlice';

const App = (): React.JSX.Element => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize app services
    const initializeApp = async () => {
      try {
        // Initialize IAP
        await iapService.initialize();

        // Load persisted data
        const mindMaps = await mindMapsStorage.getAllMindMaps();
        store.dispatch(loadMindMaps(mindMaps));

        // Load user preferences
        const premiumStatus = userPreferencesStorage.getPremiumStatus();
        store.dispatch(setPremiumStatus(premiumStatus));

        const onboardingCompleted = userPreferencesStorage.getOnboardingCompleted();
        if (onboardingCompleted) {
          store.dispatch(completeOnboarding());
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeApp();

    // Splash screen timer
    const timer = setTimeout(() => {
      if (isInitialized) {
        setShowSplash(false);
      }
    }, 3800);

    return () => {
      clearTimeout(timer);
      iapService.cleanup();
    };
  }, [isInitialized]);

  if (showSplash || !isInitialized) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <ThemeProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
            <RootNavigator />
            <ToastContainer />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
