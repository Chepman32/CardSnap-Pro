/**
 * Connection Data Model
 */

import {ConnectionStyle, ArrowType} from '../constants';

export interface ConnectionStyle {
  lineStyle: ConnectionStyle;
  lineWidth: number;
  color: string;
  pattern?: 'solid' | 'dashed' | 'dotted';
  arrowType: ArrowType;
  animated?: boolean;
  animationType?: 'flow' | 'pulse' | 'dash';
}

export interface Connection {
  id: string;
  startNodeId: string;
  endNodeId: string;
  style: ConnectionStyle;
  label?: string;
  metadata?: {
    createdAt: number;
    type: 'primary' | 'secondary' | 'cross-reference';
  };
}

export const createDefaultConnection = (
  startNodeId: string,
  endNodeId: string,
): Connection => {
  const now = Date.now();
  return {
    id: `connection_${now}_${Math.random().toString(36).substr(2, 9)}`,
    startNodeId,
    endNodeId,
    style: {
      lineStyle: 'curved',
      lineWidth: 2,
      color: '#6B7280',
      pattern: 'solid',
      arrowType: 'end',
      animated: false,
    },
    metadata: {
      createdAt: now,
      type: 'primary',
    },
  };
};
