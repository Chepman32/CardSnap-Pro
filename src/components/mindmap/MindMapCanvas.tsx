/**
 * Mind Map Canvas Component
 * Interactive canvas with pan, zoom, and node rendering
 */

import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {MindMap} from '../../models/MindMap';
import {GESTURES} from '../../constants';
import NodeComponent from './NodeComponent';

interface MindMapCanvasProps {
  mindMap: MindMap;
}

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const MindMapCanvas: React.FC<MindMapCanvasProps> = ({mindMap}) => {
  const translateX = useSharedValue(SCREEN_WIDTH / 2);
  const translateY = useSharedValue(SCREEN_HEIGHT / 2);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(SCREEN_WIDTH / 2);
  const savedTranslateY = useSharedValue(SCREEN_HEIGHT / 2);
  const savedScale = useSharedValue(1);

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.min(
        Math.max(newScale, GESTURES.ZOOM_MIN),
        GESTURES.ZOOM_MAX,
      );
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  return (
    <View style={[styles.container, {backgroundColor: mindMap.settings.background.color || '#F8FAFC'}]}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.canvas, animatedStyle]}>
          {mindMap.nodes.map(node => (
            <NodeComponent key={node.id} node={node} />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MindMapCanvas;
