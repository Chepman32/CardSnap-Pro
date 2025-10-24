/**
 * MindWeave Theme Context
 * Manages app theme (light/dark mode) and provides theme values
 */

import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {useColorScheme} from 'react-native';
import {colors} from './colors';
import {typography} from './typography';
import {spacing, borderRadius, shadows} from './spacing';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  currentColors: typeof colors.light | typeof colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('auto');

  const isDark =
    mode === 'auto' ? systemColorScheme === 'dark' : mode === 'dark';

  const currentColors = isDark ? colors.dark : colors.light;

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    // TODO: Persist theme preference to AsyncStorage
  };

  useEffect(() => {
    // TODO: Load theme preference from AsyncStorage
  }, []);

  const value: ThemeContextType = {
    mode,
    isDark,
    setThemeMode,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    currentColors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
