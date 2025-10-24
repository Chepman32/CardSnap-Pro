/**
 * Processing Screen
 * OCR processing with animated feedback
 */

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing} from '@constants/theme';
import {ExtractedContactData} from '@types/index';

const ProcessingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {imagePath} = route.params as {imagePath: string};

  const [status, setStatus] = useState('Analyzing image...');
  const scanLinePosition = useSharedValue(0);

  useEffect(() => {
    startProcessing();
  }, []);

  const startProcessing = async () => {
    // Animate scan line
    scanLinePosition.value = withRepeat(
      withTiming(1, {duration: 2000}),
      -1,
      false,
    );

    // Simulate OCR processing stages
    setTimeout(() => setStatus('Detecting text...'), 1000);
    setTimeout(() => setStatus('Extracting contact info...'), 2500);
    setTimeout(() => setStatus('Finalizing...'), 4000);

    // Navigate to edit screen after processing
    setTimeout(() => {
      const mockExtractedData: ExtractedContactData = {
        name: {value: 'John Doe', confidence: 0.95},
        company: {value: 'Acme Corporation', confidence: 0.90},
        title: {value: 'Marketing Director', confidence: 0.88},
        phones: [{value: '+1 (555) 123-4567', confidence: 0.92}],
        emails: [{value: 'john.doe@acme.com', confidence: 0.96}],
        urls: [{value: 'www.acme.com', confidence: 0.85}],
      };

      navigation.replace('EditContact' as never, {
        contactData: mockExtractedData,
        imagePath: imagePath,
      } as never);
    }, 5000);
  };

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{translateY: scanLinePosition.value * 300}],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.brandDark, Colors.brandLight]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Card Image Preview */}
        <View style={styles.imageContainer}>
          <Image
            source={{uri: `file://${imagePath}`}}
            style={styles.image}
            resizeMode="contain"
          />
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color={Colors.brandPrimary} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
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
    padding: Spacing.xl,
  },
  imageContainer: {
    width: '80%',
    aspectRatio: 1.75,
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.brandPrimary,
    opacity: 0.8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: Colors.white,
    marginTop: Spacing.md,
  },
});

export default ProcessingScreen;
