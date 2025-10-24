/**
 * Theme Provider
 * Manages app theme and styling
 */

import React, {createContext, useContext, useState} from 'react';
import {Theme} from '@types/index';
import {Colors, Spacing, BorderRadius, Typography} from '@constants/theme';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const defaultTheme: Theme = {
  colors: {
    primary: Colors.brandPrimary,
    secondary: Colors.brandSecondary,
    background: Colors.background,
    surface: Colors.white,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    border: Colors.gray300,
    error: Colors.error,
    success: Colors.success,
    warning: Colors.warning,
  },
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: defaultTheme,
        isDarkMode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
