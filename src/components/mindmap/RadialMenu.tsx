/**
 * Radial Context Menu Component
 * Circular menu triggered by long-press on canvas
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import {useTheme} from '../../theme';

interface MenuOption {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface RadialMenuProps {
  x: number;
  y: number;
  options: MenuOption[];
  onClose: () => void;
}

const MENU_RADIUS = 120;
const ITEM_SIZE = 56;

const RadialMenu: React.FC<RadialMenuProps> = ({x, y, options, onClose}) => {
  const {currentColors, shadows} = useTheme();
  const scale = useSharedValue(0);
  const itemsScale = options.map(() => useSharedValue(0));

  React.useEffect(() => {
    // Animate center button
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });

    // Animate menu items with stagger
    itemsScale.forEach((itemScale, index) => {
      itemScale.value = withDelay(
        index * 40,
        withSpring(1, {
          damping: 15,
          stiffness: 200,
        }),
      );
    });
  }, []);

  const centerStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const getItemPosition = (index: number) => {
    const angle = (index / options.length) * 2 * Math.PI;
    return {
      x: Math.cos(angle) * MENU_RADIUS,
      y: Math.sin(angle) * MENU_RADIUS,
    };
  };

  return (
    <View style={[styles.container, {left: x, top: y}]}>
      {/* Backdrop */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Center Button */}
      <Animated.View
        style={[
          styles.centerButton,
          {backgroundColor: currentColors.surface},
          shadows.lg,
          centerStyle,
        ]}>
        <Text style={{fontSize: 24}}>×</Text>
      </Animated.View>

      {/* Menu Items */}
      {options.map((option, index) => {
        const position = getItemPosition(index);
        const itemStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {translateX: position.x},
              {translateY: position.y},
              {scale: itemsScale[index].value},
            ],
          };
        });

        return (
          <Animated.View
            key={option.id}
            style={[
              styles.menuItem,
              {backgroundColor: currentColors.surface},
              shadows.md,
              itemStyle,
            ]}>
            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => {
                option.onPress();
                onClose();
              }}>
              <Text style={styles.menuItemIcon}>{option.icon}</Text>
              <Text
                style={[styles.menuItemLabel, {color: currentColors.text}]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 400,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  centerButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  menuItemLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
});

export default RadialMenu;
