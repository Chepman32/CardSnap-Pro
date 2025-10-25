/**
 * Export Service
 * Handles exporting mind maps to various formats
 */

import {MindMap} from '../models/MindMap';
import {Node} from '../models/Node';

/**
 * Export to JSON
 */
export const exportToJSON = (mindMap: MindMap): string => {
  return JSON.stringify(mindMap, null, 2);
};

/**
 * Export to Markdown
 */
export const exportToMarkdown = (mindMap: MindMap): string => {
  const lines: string[] = [];

  lines.push(`# ${mindMap.title}\n`);
  lines.push(`*Created: ${new Date(mindMap.createdAt).toLocaleDateString()}*`);
  lines.push(`*Modified: ${new Date(mindMap.modifiedAt).toLocaleDateString()}*\n`);

  const rootNode = mindMap.nodes.find(n => n.parentId === null);
  if (!rootNode) {
    return lines.join('\n');
  }

  const renderNode = (node: Node, depth: number = 0): void => {
    const indent = '  '.repeat(depth);
    const bullet = depth === 0 ? '##' : '-';
    const content =
      typeof node.content === 'string' ? node.content : JSON.stringify(node.content);

    lines.push(`${indent}${bullet} ${content}`);

    const children = mindMap.nodes.filter(n => n.parentId === node.id);
    children.forEach(child => renderNode(child, depth + 1));
  };

  renderNode(rootNode);

  return lines.join('\n');
};

/**
 * Export to SVG
 */
export const exportToSVG = (mindMap: MindMap): string => {
  const minX = Math.min(...mindMap.nodes.map(n => n.position.x)) - 100;
  const minY = Math.min(...mindMap.nodes.map(n => n.position.y)) - 100;
  const maxX = Math.max(...mindMap.nodes.map(n => n.position.x)) + 100;
  const maxY = Math.max(...mindMap.nodes.map(n => n.position.y)) + 100;

  const width = maxX - minX;
  const height = maxY - minY;

  const svgParts: string[] = [];

  svgParts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">`,
  );

  // Render connections
  mindMap.connections.forEach(conn => {
    const startNode = mindMap.nodes.find(n => n.id === conn.startNodeId);
    const endNode = mindMap.nodes.find(n => n.id === conn.endNodeId);

    if (startNode && endNode) {
      const dx = endNode.position.x - startNode.position.x;
      const dy = endNode.position.y - startNode.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const offset = distance * 0.4;

      const cp1x = startNode.position.x + offset;
      const cp1y = startNode.position.y;
      const cp2x = endNode.position.x - offset;
      const cp2y = endNode.position.y;

      svgParts.push(
        `<path d="M ${startNode.position.x} ${startNode.position.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endNode.position.x} ${endNode.position.y}" `,
        `stroke="${conn.style.color}" stroke-width="${conn.style.lineWidth}" fill="none"/>`,
      );
    }
  });

  // Render nodes
  mindMap.nodes.forEach(node => {
    const content =
      typeof node.content === 'string' ? node.content : JSON.stringify(node.content);

    svgParts.push(
      `<rect x="${node.position.x - 50}" y="${node.position.y - 20}" width="100" height="40" `,
      `rx="${node.style.borderRadius}" fill="${node.style.backgroundColor}" `,
      `stroke="${node.style.borderColor}" stroke-width="${node.style.borderWidth}"/>`,
    );

    svgParts.push(
      `<text x="${node.position.x}" y="${node.position.y}" text-anchor="middle" `,
      `dominant-baseline="middle" fill="${node.style.textColor}" `,
      `font-size="${node.style.fontSize}">${content}</text>`,
    );
  });

  svgParts.push('</svg>');

  return svgParts.join('\n');
};

/**
 * Export to Plain Text (indented outline)
 */
export const exportToPlainText = (mindMap: MindMap): string => {
  const lines: string[] = [];

  lines.push(mindMap.title);
  lines.push('='.repeat(mindMap.title.length));
  lines.push('');

  const rootNode = mindMap.nodes.find(n => n.parentId === null);
  if (!rootNode) {
    return lines.join('\n');
  }

  const renderNode = (node: Node, depth: number = 0): void => {
    const indent = '  '.repeat(depth);
    const content =
      typeof node.content === 'string' ? node.content : JSON.stringify(node.content);

    lines.push(`${indent}${content}`);

    const children = mindMap.nodes.filter(n => n.parentId === node.id);
    children.forEach(child => renderNode(child, depth + 1));
  };

  renderNode(rootNode);

  return lines.join('\n');
};

/**
 * Export to OPML (Outline Processor Markup Language)
 */
export const exportToOPML = (mindMap: MindMap): string => {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<opml version="2.0">');
  lines.push('  <head>');
  lines.push(`    <title>${mindMap.title}</title>`);
  lines.push(
    `    <dateCreated>${new Date(mindMap.createdAt).toISOString()}</dateCreated>`,
  );
  lines.push(
    `    <dateModified>${new Date(mindMap.modifiedAt).toISOString()}</dateModified>`,
  );
  lines.push('  </head>');
  lines.push('  <body>');

  const rootNode = mindMap.nodes.find(n => n.parentId === null);
  if (rootNode) {
    const renderNode = (node: Node, depth: number = 2): void => {
      const indent = '  '.repeat(depth);
      const content =
        typeof node.content === 'string'
          ? node.content
          : JSON.stringify(node.content);

      const children = mindMap.nodes.filter(n => n.parentId === node.id);

      if (children.length > 0) {
        lines.push(`${indent}<outline text="${content}">`);
        children.forEach(child => renderNode(child, depth + 1));
        lines.push(`${indent}</outline>`);
      } else {
        lines.push(`${indent}<outline text="${content}"/>`);
      }
    };

    renderNode(rootNode);
  }

  lines.push('  </body>');
  lines.push('</opml>');

  return lines.join('\n');
};

/**
 * Get file extension for export format
 */
export const getFileExtension = (
  format: 'json' | 'markdown' | 'svg' | 'text' | 'opml',
): string => {
  const extensions = {
    json: '.json',
    markdown: '.md',
    svg: '.svg',
    text: '.txt',
    opml: '.opml',
  };
  return extensions[format];
};

/**
 * Get MIME type for export format
 */
export const getMimeType = (
  format: 'json' | 'markdown' | 'svg' | 'text' | 'opml',
): string => {
  const mimeTypes = {
    json: 'application/json',
    markdown: 'text/markdown',
    svg: 'image/svg+xml',
    text: 'text/plain',
    opml: 'text/x-opml',
  };
  return mimeTypes[format];
};
