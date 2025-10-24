/**
 * MindWeave Splash Screen
 * Features physics-based logo assembly animation
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {colors} from '../theme/colors';
import {TIMING} from '../constants';

const {width, height} = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const textOpacity = useSharedValue(0);
  const textRotateY = useSharedValue(720);
  const particleOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    // Phase 1: Logo Assembly (0-1.5s) - Simplified version
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });

    // Phase 2: Text Formation (1.5-2.5s)
    textOpacity.value = withDelay(
      1500,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );

    textRotateY.value = withDelay(
      1500,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
      }),
    );

    // Phase 3: Particle Burst (2.5-3.2s) - Simplified
    particleOpacity.value = withDelay(
      2500,
      withSequence(
        withTiming(1, {duration: 300}),
        withTiming(0, {duration: 400}),
      ),
    );

    // Phase 4: Transition (3.2-3.8s)
    backgroundOpacity.value = withDelay(
      3200,
      withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }, () => {
        runOnJS(onFinish)();
      }),
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{scale: logoScale.value}],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        {perspective: 1000},
        {rotateY: `${textRotateY.value}deg`},
      ],
    };
  });

  const particleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: particleOpacity.value,
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  const handleSkip = () => {
    onFinish();
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Logo - Simplified as circles representing nodes */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <View style={[styles.node, styles.centerNode]} />
          <View style={[styles.node, styles.node1]} />
          <View style={[styles.node, styles.node2]} />
          <View style={[styles.node, styles.node3]} />
          <View style={[styles.node, styles.node4]} />
          {/* Connection lines */}
          <View style={styles.connection1} />
          <View style={styles.connection2} />
          <View style={styles.connection3} />
          <View style={styles.connection4} />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.appName}>MindWeave</Text>
        <Text style={styles.tagline}>Weave Your Thoughts Into Clarity</Text>
      </Animated.View>

      {/* Particle effect - Simplified */}
      <Animated.View style={[styles.particleContainer, particleAnimatedStyle]}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: width / 2 + Math.cos((i * 360) / 20) * 100,
                top: height / 2 + Math.sin((i * 360) / 20) * 100,
              },
            ]}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.purple600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 12,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerNode: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.blue500,
  },
  node1: {
    top: 20,
    left: 85,
  },
  node2: {
    right: 20,
    top: 85,
  },
  node3: {
    bottom: 20,
    left: 85,
  },
  node4: {
    left: 20,
    top: 85,
  },
  connection1: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    top: 45,
    left: 99,
    transform: [{rotate: '-45deg'}],
  },
  connection2: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    top: 75,
    right: 75,
    transform: [{rotate: '45deg'}],
  },
  connection3: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    bottom: 45,
    left: 99,
    transform: [{rotate: '45deg'}],
  },
  connection4: {
    position: 'absolute',
    width: 2,
    height: 50,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    top: 75,
    left: 75,
    transform: [{rotate: '-45deg'}],
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});

export default SplashScreen;
