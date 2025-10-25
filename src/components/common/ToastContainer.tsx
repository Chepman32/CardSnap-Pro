/**
 * Toast Container Component
 * Displays toast notifications
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import {RootState} from '../../store';
import {removeToast} from '../../store/slices/uiSlice';
import {useTheme} from '../../theme';
import {TIMING} from '../../constants';

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.ui.toasts);
  const {currentColors} = useTheme();

  useEffect(() => {
    toasts.forEach(toast => {
      const duration = toast.duration || TIMING.TOAST_DURATION;
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  const getToastColor = (type: 'success' | 'error' | 'info' | 'warning') => {
    const colors = {
      success: '#10B981',
      error: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
    };
    return colors[type];
  };

  const getToastIcon = (type: 'success' | 'error' | 'info' | 'warning') => {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ⓘ',
      warning: '⚠',
    };
    return icons[type];
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <Animated.View
          key={toast.id}
          entering={FadeInDown.springify()}
          exiting={FadeOutUp}
          layout={Layout.springify()}
          style={[
            styles.toast,
            {
              backgroundColor: currentColors.surface,
              borderLeftColor: getToastColor(toast.type),
            },
          ]}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getToastColor(toast.type)},
            ]}>
            <Text style={styles.icon}>{getToastIcon(toast.type)}</Text>
          </View>
          <Text style={[styles.message, {color: currentColors.text}]}>
            {toast.message}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ToastContainer;
