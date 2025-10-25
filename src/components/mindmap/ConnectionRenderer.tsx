/**
 * Connection Renderer Component
 * Renders connections between nodes using Skia for smooth Bezier curves
 */

import React from 'react';
import {Canvas, Path, Skia, vec} from '@shopify/react-native-skia';
import {Connection} from '../../models/Connection';
import {Node} from '../../models/Node';

interface ConnectionRendererProps {
  connections: Connection[];
  nodes: Node[];
  canvasWidth: number;
  canvasHeight: number;
}

const ConnectionRenderer: React.FC<ConnectionRendererProps> = ({
  connections,
  nodes,
  canvasWidth,
  canvasHeight,
}) => {
  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  const createBezierPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    style: 'straight' | 'curved' | 'stepped' | 'organic',
  ) => {
    const path = Skia.Path.Make();

    if (style === 'straight') {
      path.moveTo(startX, startY);
      path.lineTo(endX, endY);
    } else if (style === 'curved') {
      // Bezier curve with automatic control points
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const offset = distance * 0.4;

      const cp1x = startX + offset;
      const cp1y = startY;
      const cp2x = endX - offset;
      const cp2y = endY;

      path.moveTo(startX, startY);
      path.cubicTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    } else if (style === 'stepped') {
      // Orthogonal lines (right angles)
      const midX = (startX + endX) / 2;
      path.moveTo(startX, startY);
      path.lineTo(midX, startY);
      path.lineTo(midX, endY);
      path.lineTo(endX, endY);
    } else if (style === 'organic') {
      // Variable-width curves for hand-drawn effect
      const cp1x = startX + (endX - startX) * 0.3;
      const cp1y = startY + (endY - startY) * 0.1;
      const cp2x = startX + (endX - startX) * 0.7;
      const cp2y = startY + (endY - startY) * 0.9;

      path.moveTo(startX, startY);
      path.cubicTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    }

    return path;
  };

  const renderConnections = () => {
    return connections.map(connection => {
      const startNode = getNodeById(connection.startNodeId);
      const endNode = getNodeById(connection.endNodeId);

      if (!startNode || !endNode) {
        return null;
      }

      const startX = startNode.position.x;
      const startY = startNode.position.y;
      const endX = endNode.position.x;
      const endY = endNode.position.y;

      const path = createBezierPath(
        startX,
        startY,
        endX,
        endY,
        connection.style.lineStyle,
      );

      return (
        <Path
          key={connection.id}
          path={path}
          color={connection.style.color}
          style="stroke"
          strokeWidth={connection.style.lineWidth}
          strokeCap="round"
          strokeJoin="round"
        />
      );
    });
  };

  return (
    <Canvas style={{width: canvasWidth, height: canvasHeight, position: 'absolute'}}>
      {renderConnections()}
    </Canvas>
  );
};

export default ConnectionRenderer;
