/**
 * MindMap Data Model
 */

import {Node} from './Node';
import {Connection} from './Connection';
import {ColorTheme} from '../theme/colors';
import {LayoutType} from '../constants';

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'grid' | 'texture';
  color?: string;
  gradientColors?: string[];
  gradientAngle?: number;
  gridPattern?: 'dots' | 'lines';
  gridSize?: number;
  gridColor?: string;
  gridOpacity?: number;
  textureUrl?: string;
}

export interface MindMapSettings {
  theme: ColorTheme;
  layout: LayoutType;
  background: BackgroundConfig;
  zoom: number;
  viewportOffset: {x: number; y: number};
  gridEnabled: boolean;
  snapToGrid: boolean;
}

export interface MindMapMetadata {
  nodeCount: number;
  depth: number;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isPinned: boolean;
  isEncrypted?: boolean;
}

export interface MindMap {
  id: string;
  title: string;
  createdAt: number;
  modifiedAt: number;
  nodes: Node[];
  connections: Connection[];
  settings: MindMapSettings;
  metadata: MindMapMetadata;
}

export const createDefaultMindMap = (title: string = 'Untitled Mind Map'): MindMap => {
  const now = Date.now();
  const rootNodeId = `node_${now}_root`;

  return {
    id: `mindmap_${now}`,
    title,
    createdAt: now,
    modifiedAt: now,
    nodes: [
      {
        id: rootNodeId,
        parentId: null,
        type: 'text',
        content: 'Central Idea',
        position: {x: 0, y: 0},
        style: {
          backgroundColor: '#6B46C1',
          borderColor: '#5B21B6',
          borderWidth: 2,
          borderRadius: 12,
          shape: 'rounded',
          textColor: '#FFFFFF',
          fontSize: 18,
          fontWeight: '600',
          icon: null,
        },
        metadata: {
          createdAt: now,
          modifiedAt: now,
          collapsed: false,
          level: 0,
        },
      },
    ],
    connections: [],
    settings: {
      theme: 'default',
      layout: 'mindmap',
      background: {
        type: 'solid',
        color: '#F8FAFC',
      },
      zoom: 1.0,
      viewportOffset: {x: 0, y: 0},
      gridEnabled: false,
      snapToGrid: false,
    },
    metadata: {
      nodeCount: 1,
      depth: 0,
      tags: [],
      isFavorite: false,
      isArchived: false,
      isPinned: false,
    },
  };
};
