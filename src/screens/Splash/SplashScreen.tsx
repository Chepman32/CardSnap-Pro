/**
 * Animated Splash Screen
 * Features physics-based particle system with logo explosion and reassembly
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import {Canvas, Group, Rect, LinearGradient, vec} from '@shopify/react-native-skia';
import {Colors} from '@constants/theme';

const {width, height} = Dimensions.get('window');
const PARTICLE_COUNT = 200;

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  finalX: number;
  finalY: number;
}

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(1);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Initial logo display
    setTimeout(() => {
      // Particle explosion phase
      logoScale.value = withSequence(
        withTiming(1.2, {duration: 500}),
        withTiming(0, {duration: 200}),
      );

      // After explosion, reassemble
      setTimeout(() => {
        logoScale.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        });
        logoOpacity.value = withTiming(1, {duration: 500});

        // Show title
        titleOpacity.value = withDelay(300, withTiming(1, {duration: 500}));
        titleTranslateY.value = withDelay(
          300,
          withSpring(0, {damping: 20, stiffness: 100}),
        );

        // Navigate after animation completes
        setTimeout(() => {
          runOnJS(navigateToMain)();
        }, 2800);
      }, 1200);
    }, 500);
  };

  const navigateToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main' as never}],
    });
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleTranslateY.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Background Gradient using Skia */}
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Group>
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={[Colors.brandDark, Colors.brandLight]}
            />
          </Rect>
        </Group>
      </Canvas>

      {/* Logo Container */}
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <View style={styles.cardIcon} />
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          CardSnap Pro
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, titleAnimatedStyle]}>
          Professional Contact Management
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 30,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.8,
    marginTop: 8,
  },
});

export default SplashScreen;
