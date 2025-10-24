/**
 * MindWeave Typography System
 */

import {TextStyle} from 'react-native';

export const typography = {
  // Font Families (iOS Native)
  fontFamily: {
    primary: 'SF Pro Display',
    text: 'SF Pro Text',
    mono: 'SF Mono',
  },

  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Text Styles
  styles: {
    h1: {
      fontSize: 34,
      fontWeight: '700' as TextStyle['fontWeight'],
      letterSpacing: -0.5,
      lineHeight: 41,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
      letterSpacing: -0.3,
      lineHeight: 34,
    },
    h3: {
      fontSize: 22,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 25,
    },
    bodyLarge: {
      fontSize: 17,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 22,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 18,
    },
    caption: {
      fontSize: 11,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 13,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 18,
    },
  },
};

export type TypographyStyle = keyof typeof typography.styles;
