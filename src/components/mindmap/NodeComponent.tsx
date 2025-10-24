/**
 * Node Component
 * Renders individual nodes with styling and interactions
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Node} from '../../models/Node';
import {NODE_CONFIG} from '../../constants';

interface NodeComponentProps {
  node: Node;
  onPress?: () => void;
  onLongPress?: () => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({node, onPress, onLongPress}) => {
  const getNodeContent = () => {
    if (node.type === 'text') {
      return node.content as string;
    }
    // Handle other node types
    return '';
  };

  return (
    <TouchableOpacity
      style={[
        styles.node,
        {
          backgroundColor: node.style.backgroundColor,
          borderColor: node.style.borderColor,
          borderWidth: node.style.borderWidth,
          borderRadius: node.style.borderRadius,
          left: node.position.x,
          top: node.position.y,
          minWidth: node.size?.width || NODE_CONFIG.MIN_WIDTH,
          minHeight: node.size?.height || NODE_CONFIG.MIN_HEIGHT,
        },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}>
      <Text
        style={[
          styles.text,
          {
            color: node.style.textColor,
            fontSize: node.style.fontSize,
            fontWeight: node.style.fontWeight || '400',
            textAlign: node.style.textAlign || 'center',
          },
        ]}>
        {getNodeContent()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    paddingVertical: NODE_CONFIG.PADDING_VERTICAL,
    paddingHorizontal: NODE_CONFIG.PADDING_HORIZONTAL,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default NodeComponent;
