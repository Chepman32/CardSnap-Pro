/**
 * Mind Map Layout Algorithms
 * Implements various automatic layout algorithms for organizing nodes
 */

import {Node} from '../models/Node';
import {MindMap} from '../models/MindMap';

export interface LayoutResult {
  nodes: Node[];
}

/**
 * Tree Layout - Hierarchical top-down structure
 */
export const treeLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const rootNode = nodes.find(n => n.parentId === null);

  if (!rootNode) {
    return {nodes};
  }

  const levelWidth = 200;
  const levelHeight = 120;

  const positionNode = (
    node: Node,
    x: number,
    y: number,
    level: number,
  ): void => {
    node.position = {x, y};
    node.metadata.level = level;

    const children = nodes.filter(n => n.parentId === node.id);
    const childCount = children.length;

    if (childCount > 0) {
      const startX = x - ((childCount - 1) * levelWidth) / 2;

      children.forEach((child, index) => {
        const childX = startX + index * levelWidth;
        const childY = y + levelHeight;
        positionNode(child, childX, childY, level + 1);
      });
    }
  };

  positionNode(rootNode, 0, 0, 0);

  return {nodes};
};

/**
 * Mind Map Layout - Central node with radial branches
 */
export const mindMapLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const rootNode = nodes.find(n => n.parentId === null);

  if (!rootNode) {
    return {nodes};
  }

  rootNode.position = {x: 0, y: 0};
  rootNode.metadata.level = 0;

  const primaryChildren = nodes.filter(n => n.parentId === rootNode.id);
  const primaryRadius = 250;

  primaryChildren.forEach((child, index) => {
    const angle = (index / primaryChildren.length) * 2 * Math.PI;
    child.position = {
      x: Math.cos(angle) * primaryRadius,
      y: Math.sin(angle) * primaryRadius,
    };
    child.metadata.level = 1;

    // Position secondary children
    const secondaryChildren = nodes.filter(n => n.parentId === child.id);
    const secondaryRadius = 150;

    secondaryChildren.forEach((secChild, secIndex) => {
      const secAngle =
        angle + ((secIndex - secondaryChildren.length / 2) * Math.PI) / 6;
      secChild.position = {
        x: child.position.x + Math.cos(secAngle) * secondaryRadius,
        y: child.position.y + Math.sin(secAngle) * secondaryRadius,
      };
      secChild.metadata.level = 2;
    });
  });

  return {nodes};
};

/**
 * Radial Layout - Concentric circles
 */
export const radialLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const rootNode = nodes.find(n => n.parentId === null);

  if (!rootNode) {
    return {nodes};
  }

  rootNode.position = {x: 0, y: 0};
  rootNode.metadata.level = 0;

  const getLevelNodes = (level: number): Node[] => {
    return nodes.filter(n => {
      if (level === 0) {
        return n.parentId === null;
      }
      const parent = nodes.find(p => p.id === n.parentId);
      return parent?.metadata.level === level - 1;
    });
  };

  let maxLevel = 0;
  nodes.forEach(node => {
    let level = 0;
    let currentNode = node;
    while (currentNode.parentId) {
      level++;
      const parent = nodes.find(n => n.id === currentNode.parentId);
      if (!parent) break;
      currentNode = parent;
    }
    node.metadata.level = level;
    maxLevel = Math.max(maxLevel, level);
  });

  for (let level = 1; level <= maxLevel; level++) {
    const levelNodes = getLevelNodes(level);
    const radius = level * 200;

    levelNodes.forEach((node, index) => {
      const angle = (index / levelNodes.length) * 2 * Math.PI;
      node.position = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
  }

  return {nodes};
};

/**
 * Organizational Chart Layout - Hierarchical with even spacing
 */
export const orgChartLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const rootNode = nodes.find(n => n.parentId === null);

  if (!rootNode) {
    return {nodes};
  }

  const horizontalSpacing = 180;
  const verticalSpacing = 120;

  const calculateSubtreeWidth = (node: Node): number => {
    const children = nodes.filter(n => n.parentId === node.id);
    if (children.length === 0) {
      return 1;
    }
    return children.reduce(
      (sum, child) => sum + calculateSubtreeWidth(child),
      0,
    );
  };

  const positionNode = (
    node: Node,
    x: number,
    y: number,
    level: number,
  ): number => {
    node.position = {x, y};
    node.metadata.level = level;

    const children = nodes.filter(n => n.parentId === node.id);

    if (children.length === 0) {
      return x + horizontalSpacing;
    }

    let currentX = x;
    const childY = y + verticalSpacing;

    children.forEach(child => {
      const childWidth = calculateSubtreeWidth(child);
      const childX = currentX + (childWidth * horizontalSpacing) / 2;
      currentX = positionNode(child, childX, childY, level + 1);
    });

    // Center parent over children
    const firstChild = children[0];
    const lastChild = children[children.length - 1];
    node.position.x = (firstChild.position.x + lastChild.position.x) / 2;

    return currentX;
  };

  positionNode(rootNode, 0, 0, 0);

  return {nodes};
};

/**
 * Force-Directed Layout - Physics-based simulation
 */
export const forceDirectedLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const iterations = 50;
  const repulsionStrength = 5000;
  const attractionStrength = 0.01;
  const damping = 0.9;

  // Initialize velocities
  const velocities = new Map<string, {vx: number; vy: number}>();
  nodes.forEach(node => {
    velocities.set(node.id, {vx: 0, vy: 0});
  });

  for (let iter = 0; iter < iterations; iter++) {
    // Apply repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distanceSq = dx * dx + dy * dy + 1; // +1 to avoid division by zero
        const distance = Math.sqrt(distanceSq);

        const force = repulsionStrength / distanceSq;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        const velA = velocities.get(nodeA.id)!;
        const velB = velocities.get(nodeB.id)!;

        velA.vx -= fx;
        velA.vy -= fy;
        velB.vx += fx;
        velB.vy += fy;
      }
    }

    // Apply attraction between connected nodes
    mindMap.connections.forEach(conn => {
      const startNode = nodes.find(n => n.id === conn.startNodeId);
      const endNode = nodes.find(n => n.id === conn.endNodeId);

      if (startNode && endNode) {
        const dx = endNode.position.x - startNode.position.x;
        const dy = endNode.position.y - startNode.position.y;

        const fx = dx * attractionStrength;
        const fy = dy * attractionStrength;

        const velStart = velocities.get(startNode.id)!;
        const velEnd = velocities.get(endNode.id)!;

        velStart.vx += fx;
        velStart.vy += fy;
        velEnd.vx -= fx;
        velEnd.vy -= fy;
      }
    });

    // Update positions with damping
    nodes.forEach(node => {
      const vel = velocities.get(node.id)!;
      node.position.x += vel.vx;
      node.position.y += vel.vy;
      vel.vx *= damping;
      vel.vy *= damping;
    });
  }

  return {nodes};
};

/**
 * Compact Layout - Minimize canvas space usage
 */
export const compactLayout = (mindMap: MindMap): LayoutResult => {
  const nodes = [...mindMap.nodes];
  const rootNode = nodes.find(n => n.parentId === null);

  if (!rootNode) {
    return {nodes};
  }

  const horizontalSpacing = 120;
  const verticalSpacing = 80;

  const positionNode = (
    node: Node,
    x: number,
    y: number,
    level: number,
  ): void => {
    node.position = {x, y};
    node.metadata.level = level;

    const children = nodes.filter(n => n.parentId === node.id);

    children.forEach((child, index) => {
      const childX = x + (index - children.length / 2) * horizontalSpacing;
      const childY = y + verticalSpacing;
      positionNode(child, childX, childY, level + 1);
    });
  };

  positionNode(rootNode, 0, 0, 0);

  return {nodes};
};

/**
 * Apply layout algorithm to mind map
 */
export const applyLayout = (
  mindMap: MindMap,
  layoutType:
    | 'tree'
    | 'mindmap'
    | 'radial'
    | 'org_chart'
    | 'force_directed'
    | 'compact',
): MindMap => {
  let result: LayoutResult;

  switch (layoutType) {
    case 'tree':
      result = treeLayout(mindMap);
      break;
    case 'mindmap':
      result = mindMapLayout(mindMap);
      break;
    case 'radial':
      result = radialLayout(mindMap);
      break;
    case 'org_chart':
      result = orgChartLayout(mindMap);
      break;
    case 'force_directed':
      result = forceDirectedLayout(mindMap);
      break;
    case 'compact':
      result = compactLayout(mindMap);
      break;
    default:
      result = {nodes: mindMap.nodes};
  }

  return {
    ...mindMap,
    nodes: result.nodes,
    settings: {
      ...mindMap.settings,
      layout: layoutType,
    },
  };
};
