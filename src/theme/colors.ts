/**
 * MindWeave Color System
 * All color tokens for the application
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    purple600: '#6B46C1',
    purple700: '#5B21B6',
    blue500: '#3B82F6',
    blue600: '#2563EB',
  },

  // Secondary Colors
  secondary: {
    green500: '#10B981',
    green600: '#059669',
    yellow500: '#F59E0B',
    yellow600: '#D97706',
    red500: '#EF4444',
    red600: '#DC2626',
  },

  // Neutral Colors - Light Mode
  light: {
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },

  // Neutral Colors - Dark Mode
  dark: {
    gray50: '#0F172A',
    gray100: '#1E293B',
    gray200: '#334155',
    gray300: '#475569',
    gray400: '#64748B',
    gray500: '#94A3B8',
    gray600: '#CBD5E1',
    gray700: '#E2E8F0',
    gray800: '#F1F5F9',
    gray900: '#F8FAFC',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
  },

  // Mind Map Themes
  themes: {
    default: {
      root: '#6B46C1',
      level1: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      level2: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'],
    },
    ocean: {
      root: '#0A4D68',
      level1: ['#088395', '#05BFDB', '#00FFCA'],
      level2: ['#0FA3B1', '#00CED1', '#40E0D0'],
    },
    forest: {
      root: '#1B4D3E',
      level1: ['#2D6A4F', '#52B788', '#95D5B2'],
      level2: ['#40916C', '#74C69D', '#B7E4C7'],
    },
    sunset: {
      root: '#C1121F',
      level1: ['#FFA500', '#FF6B35', '#F7B32B'],
      level2: ['#FFB347', '#FF8C42', '#FDD835'],
    },
    monochrome: {
      root: '#000000',
      level1: ['#404040', '#707070', '#A0A0A0'],
      level2: ['#505050', '#808080', '#B0B0B0'],
    },
    pastel: {
      root: '#E0BBE4',
      level1: ['#FFDFD3', '#C3E0E5', '#B2DBBF'],
      level2: ['#FFE5E5', '#D4F1F4', '#C8E6C9'],
    },
    neon: {
      root: '#FF006E',
      level1: ['#FB5607', '#FFBE0B', '#8338EC'],
      level2: ['#FF7538', '#FFC857', '#A663CC'],
    },
    corporate: {
      root: '#003459',
      level1: ['#007EA7', '#00A8E8', '#6C757D'],
      level2: ['#0096C7', '#00B4D8', '#8D99AE'],
    },
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Special Colors
  premium: '#FFD700', // Gold for premium badge
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export type ColorTheme = keyof typeof colors.themes;
export type MindMapTheme = typeof colors.themes[ColorTheme];
