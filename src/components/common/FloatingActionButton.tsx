/**
 * Floating Action Button Component
 * Main action button with gradient and animations
 */

import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../theme/colors';

interface FABProps {
  onPress: () => void;
}

const FloatingActionButton: React.FC<FABProps> = ({onPress}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  React.useEffect(() => {
    // Pulsing glow animation every 3 seconds
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, {duration: 800}),
        withTiming(0, {duration: 800}),
      ),
      -1,
      false,
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}>
        <Animated.Text style={styles.icon}>+</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 64,
    height: 64,
  },
  glow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.purple600,
    shadowColor: colors.primary.purple600,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.purple600,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default FloatingActionButton;
