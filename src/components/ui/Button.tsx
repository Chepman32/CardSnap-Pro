/**
 * Button Component
 * Reusable button with variants and animations
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, BorderRadius, Typography, Shadow} from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {damping: 15, stiffness: 200});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {damping: 15, stiffness: 200});
  };

  const buttonStyle: ViewStyle = [
    styles.base,
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle: TextStyle = [styles.text, styles[`${size}Text`]];

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, styles.shadow]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}>
        <LinearGradient
          colors={[Colors.brandPrimary, Colors.brandSecondary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={buttonStyle}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              {icon}
              <Text style={[textStyle, {color: Colors.white}]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  const variantStyles = {
    secondary: {backgroundColor: Colors.backgroundSecondary},
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: Colors.brandPrimary,
    },
    ghost: {backgroundColor: 'transparent'},
  };

  const variantTextColors = {
    secondary: Colors.textPrimary,
    outline: Colors.brandPrimary,
    ghost: Colors.brandPrimary,
  };

  return (
    <AnimatedTouchable
      style={[animatedStyle, buttonStyle, variantStyles[variant]]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variantTextColors[variant]} />
      ) : (
        <>
          {icon}
          <Text style={[textStyle, {color: variantTextColors[variant]}]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  smallSize: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 36,
  },
  mediumSize: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
  },
  largeSize: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    height: 56,
  },
  text: {
    ...Typography.button,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  shadow: {
    ...Shadow.medium,
  },
});
