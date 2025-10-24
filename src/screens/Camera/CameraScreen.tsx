/**
 * Camera/Scanner Screen
 * Business card scanning with auto-capture and edge detection
 */

import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {Colors, Spacing} from '@constants/theme';

const {width, height} = Dimensions.get('window');
const GUIDE_WIDTH = width - 64;
const GUIDE_HEIGHT = GUIDE_WIDTH / 1.75; // Business card aspect ratio

const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();

  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const shutterScale = useSharedValue(1);
  const guideOpacity = useSharedValue(1);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleFlashToggle = () => {
    const modes: Array<'off' | 'on' | 'auto'> = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flash);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlash(modes[nextIndex]);
    ReactNativeHapticFeedback.trigger('impactLight');
  };

  const handleCapture = useCallback(async () => {
    if (!camera.current || isCapturing) return;

    setIsCapturing(true);
    ReactNativeHapticFeedback.trigger('impactMedium');

    // Animate shutter button
    shutterScale.value = withSequence(
      withTiming(0.9, {duration: 100}),
      withSpring(1, {damping: 15, stiffness: 200}),
    );

    try {
      const photo = await camera.current.takePhoto({
        flash: flash,
        qualityPrioritization: 'quality',
      });

      // Navigate to processing screen
      navigation.navigate('Processing' as never, {
        imagePath: photo.path,
      } as never);
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [flash, isCapturing, navigation, shutterScale]);

  const shutterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: shutterScale.value}],
  }));

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-off" size={80} color={Colors.gray400} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          CardSnap Pro needs camera access to scan business cards
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={handleClose}>
          <Icon name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Position Card in Frame</Text>
        <TouchableOpacity style={styles.topButton} onPress={handleFlashToggle}>
          <Icon
            name={
              flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-auto' : 'flash-off'
            }
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Scanning Guide */}
      <View style={styles.guideContainer}>
        <View style={styles.guide}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
        <Text style={styles.guideText}>Align card within frame</Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        <View style={styles.shutterContainer}>
          <Animated.View style={shutterAnimatedStyle}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={handleCapture}
              disabled={isCapturing}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  permissionButton: {
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  permissionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: Spacing.md,
  },
  closeButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xl + 20,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  topButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  guideContainer: {
    position: 'absolute',
    top: height / 2 - GUIDE_HEIGHT / 2,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  guide: {
    width: GUIDE_WIDTH,
    height: GUIDE_HEIGHT,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.brandPrimary,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  guideText: {
    color: Colors.white,
    fontSize: 14,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing.xl + 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  shutterContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 6,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
  },
});

export default CameraScreen;
