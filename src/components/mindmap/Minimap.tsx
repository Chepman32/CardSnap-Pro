/**
 * Minimap Component
 * Shows overview of entire mind map with viewport indicator
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import {MindMap} from '../../models/MindMap';
import {useTheme} from '../../theme';

interface MinimapProps {
  mindMap: MindMap;
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  scale: number;
  onNavigate: (x: number, y: number) => void;
  onClose: () => void;
}

const MINIMAP_WIDTH = 160;
const MINIMAP_HEIGHT = 120;

const Minimap: React.FC<MinimapProps> = ({
  mindMap,
  viewportX,
  viewportY,
  viewportWidth,
  viewportHeight,
  scale,
  onNavigate,
  onClose,
}) => {
  const {currentColors, shadows} = useTheme();

  // Calculate bounding box of all nodes
  const getBoundingBox = () => {
    if (mindMap.nodes.length === 0) {
      return {minX: 0, minY: 0, maxX: 100, maxY: 100};
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    mindMap.nodes.forEach(node => {
      minX = Math.min(minX, node.position.x - 50);
      minY = Math.min(minY, node.position.y - 50);
      maxX = Math.max(maxX, node.position.x + 50);
      maxY = Math.max(maxY, node.position.y + 50);
    });

    return {minX, minY, maxX, maxY};
  };

  const {minX, minY, maxX, maxY} = getBoundingBox();
  const canvasWidth = maxX - minX;
  const canvasHeight = maxY - minY;

  // Calculate scale for minimap
  const minimapScale = Math.min(
    MINIMAP_WIDTH / canvasWidth,
    MINIMAP_HEIGHT / canvasHeight,
  );

  // Transform node position to minimap coordinates
  const toMinimapCoords = (x: number, y: number) => {
    return {
      x: (x - minX) * minimapScale,
      y: (y - minY) * minimapScale,
    };
  };

  // Calculate viewport indicator position and size
  const viewportIndicator = {
    x: (viewportX - minX) * minimapScale,
    y: (viewportY - minY) * minimapScale,
    width: (viewportWidth / scale) * minimapScale,
    height: (viewportHeight / scale) * minimapScale,
  };

  const handleMinimapPress = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    const canvasX = locationX / minimapScale + minX;
    const canvasY = locationY / minimapScale + minY;
    onNavigate(canvasX, canvasY);
  };

  return (
    <View style={[styles.container, shadows.lg]}>
      <View
        style={[
          styles.minimap,
          {
            backgroundColor: currentColors.surface,
            borderColor: currentColors.border,
          },
        ]}>
        <TouchableOpacity
          style={styles.canvas}
          onPress={handleMinimapPress}
          activeOpacity={0.8}>
          {/* Render nodes */}
          {mindMap.nodes.map(node => {
            const pos = toMinimapCoords(node.position.x, node.position.y);
            return (
              <View
                key={node.id}
                style={[
                  styles.node,
                  {
                    backgroundColor: node.style.backgroundColor,
                    left: pos.x - 2,
                    top: pos.y - 2,
                  },
                ]}
              />
            );
          })}

          {/* Viewport indicator */}
          <View
            style={[
              styles.viewport,
              {
                left: viewportIndicator.x,
                top: viewportIndicator.y,
                width: viewportIndicator.width,
                height: viewportIndicator.height,
                borderColor: '#3B82F6',
              },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 100,
  },
  minimap: {
    width: MINIMAP_WIDTH,
    height: MINIMAP_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  canvas: {
    width: MINIMAP_WIDTH,
    height: MINIMAP_HEIGHT,
    position: 'relative',
  },
  node: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  viewport: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 12,
    height: 2,
    backgroundColor: '#FFF',
  },
});

export default Minimap;
