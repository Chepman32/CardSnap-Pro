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

const App = (): React.JSX.Element => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen will control its own duration
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3800); // 3.8 seconds as per design spec

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
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
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
