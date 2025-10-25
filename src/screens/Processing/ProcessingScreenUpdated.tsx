/**
 * Processing Screen (Updated with Real OCR)
 * OCR processing with animated feedback
 */

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing} from '@constants/theme';
import OCRService from '@services/ocr/OCRService';
import ImageService from '@services/image/ImageService';

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
    scanLinePosition.value = withRepeat(withTiming(1, {duration: 2000}), -1, false);

    try {
      // Stage 1: Save image
      setStatus('Saving image...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const {imagePath: savedImagePath, thumbnailPath} = await ImageService.saveCardImage(
        imagePath,
      );

      // Stage 2: OCR Processing
      setStatus('Detecting text...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const extractedData = await OCRService.processCard(savedImagePath);

      // Stage 3: Extracting contact info
      setStatus('Extracting contact info...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Stage 4: Finalizing
      setStatus('Finalizing...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to edit screen with extracted data
      navigation.replace('EditContact' as never, {
        contactData: extractedData,
        imagePath: savedImagePath,
        thumbnailPath: thumbnailPath,
      } as never);
    } catch (error) {
      console.error('OCR processing failed:', error);

      Alert.alert(
        'Processing Failed',
        'Unable to extract text from the image. Would you like to enter the details manually?',
        [
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Manual Entry',
            onPress: () => {
              navigation.replace('EditContact' as never, {
                contactData: {
                  phones: [],
                  emails: [],
                  urls: [],
                },
                imagePath: imagePath,
              } as never);
            },
          },
        ],
      );
    }
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

        {/* Status Text */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{status}</Text>
          <View style={styles.dotsContainer}>
            <Animated.Text style={styles.dots}>...</Animated.Text>
          </View>
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
    shadowColor: Colors.brandPrimary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  dotsContainer: {
    marginTop: Spacing.sm,
  },
  dots: {
    fontSize: 20,
    color: Colors.white,
  },
});

export default ProcessingScreen;
