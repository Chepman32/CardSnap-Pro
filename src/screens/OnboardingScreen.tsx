/**
 * Onboarding Screen
 * First-time user experience
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {completeOnboarding} from '../store/slices/userSlice';

const {width} = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to MindWeave',
    subtitle: 'Your ideas, beautifully organized',
    emoji: '🧠',
  },
  {
    title: 'Designed for Your Fingers',
    subtitle: 'Intuitive gestures make mind mapping effortless',
    emoji: '✋',
  },
  {
    title: 'Works Completely Offline',
    subtitle: 'Your data stays private and always accessible',
    emoji: '🔒',
  },
  {
    title: 'Ready to Start Mapping?',
    subtitle: 'Create your first mind map in seconds',
    emoji: '🚀',
  },
];

const OnboardingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(completeOnboarding());
    }
  };

  const handleSkip = () => {
    dispatch(completeOnboarding());
  };

  const slide = slides[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B46C1',
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B46C1',
  },
});

export default OnboardingScreen;
