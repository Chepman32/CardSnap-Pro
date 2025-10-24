/**
 * Node Data Model
 */

export type NodeType =
  | 'text'
  | 'checklist'
  | 'image'
  | 'link'
  | 'drawing'
  | 'voice'
  | 'file';

export type NodeShape =
  | 'rectangle'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'cloud';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ImageContent {
  uri: string;
  width: number;
  height: number;
  caption?: string;
}

export interface LinkContent {
  url: string;
  title?: string;
  favicon?: string;
}

export interface DrawingContent {
  paths: any[]; // Skia paths data
  thumbnail?: string;
}

export interface VoiceContent {
  uri: string;
  duration: number;
  waveform?: number[];
  transcription?: string;
}

export interface FileContent {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export type NodeContent =
  | string
  | ChecklistItem[]
  | ImageContent
  | LinkContent
  | DrawingContent
  | VoiceContent
  | FileContent;

export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shape: NodeShape;
  textColor: string;
  fontSize: number;
  fontWeight?: '400' | '500' | '600' | '700';
  textAlign?: 'left' | 'center' | 'right';
  icon?: string | null;
  shadowEnabled?: boolean;
  glowEnabled?: boolean;
  glowColor?: string;
}

export interface NodeMetadata {
  createdAt: number;
  modifiedAt: number;
  collapsed: boolean;
  level?: number;
  locked?: boolean;
  noteText?: string;
}

export interface Node {
  id: string;
  parentId: string | null;
  type: NodeType;
  content: NodeContent;
  position: {x: number; y: number};
  size?: {width: number; height: number};
  style: NodeStyle;
  metadata: NodeMetadata;
}

export const createDefaultNode = (
  parentId: string | null = null,
  position: {x: number; y: number} = {x: 0, y: 0},
  level: number = 1,
): Node => {
  const now = Date.now();
  return {
    id: `node_${now}_${Math.random().toString(36).substr(2, 9)}`,
    parentId,
    type: 'text',
    content: '',
    position,
    style: {
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1,
      borderRadius: 8,
      shape: 'rounded',
      textColor: '#FFFFFF',
      fontSize: 14,
      fontWeight: '400',
      icon: null,
    },
    metadata: {
      createdAt: now,
      modifiedAt: now,
      collapsed: false,
      level,
    },
  };
};
