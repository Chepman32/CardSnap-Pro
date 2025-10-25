/**
 * Loading Overlay Component
 * Full-screen loading indicator
 */

import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import {Colors, Spacing} from '../../constants/theme';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.brandPrimary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    minWidth: 200,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
