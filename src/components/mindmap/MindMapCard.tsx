/**
 * Mind Map Card Component
 * Displays a preview of a mind map in the gallery
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {MindMap} from '../../models/MindMap';
import {useTheme} from '../../theme';

interface MindMapCardProps {
  mindMap: MindMap;
  onPress: () => void;
}

const MindMapCard: React.FC<MindMapCardProps> = ({mindMap, onPress}) => {
  const {currentColors, shadows} = useTheme();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {backgroundColor: currentColors.surface, borderColor: currentColors.border},
        shadows.md,
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Preview - Simplified visualization */}
      <View style={[styles.preview, {backgroundColor: mindMap.settings.background.color || '#F8FAFC'}]}>
        {mindMap.nodes.slice(0, 5).map((node, index) => (
          <View
            key={node.id}
            style={[
              styles.nodePreview,
              {
                backgroundColor: node.style.backgroundColor,
                top: 20 + index * 15,
                left: 20 + (index % 2) * 40,
              },
            ]}
          />
        ))}
      </View>

      {/* Info Overlay */}
      <View style={styles.infoOverlay}>
        <Text
          style={[styles.title, {color: currentColors.text}]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {mindMap.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, {color: currentColors.textSecondary}]}>
            {mindMap.metadata.nodeCount} nodes
          </Text>
          <Text style={[styles.meta, {color: currentColors.textSecondary}]}>
            {formatDate(mindMap.modifiedAt)}
          </Text>
        </View>
        {mindMap.metadata.isFavorite && (
          <View style={styles.favoriteIndicator}>
            <Text>⭐</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  preview: {
    height: 140,
    position: 'relative',
  },
  nodePreview: {
    position: 'absolute',
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  infoOverlay: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default MindMapCard;
