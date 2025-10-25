/**
 * Undo/Redo Service
 * Implements history stack for mind map operations
 */

import {MindMap} from '../models/MindMap';
import {LIMITS} from '../constants';

export interface HistoryAction {
  type: string;
  timestamp: number;
  before: any;
  after: any;
}

export class UndoRedoManager {
  private undoStack: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];
  private currentState: MindMap | null = null;

  constructor(initialState?: MindMap) {
    this.currentState = initialState || null;
  }

  /**
   * Push a new action to the undo stack
   */
  pushAction(action: HistoryAction): void => {
    this.undoStack.push(action);

    // Limit history size
    if (this.undoStack.length > LIMITS.UNDO_HISTORY_LIMIT) {
      this.undoStack.shift();
    }

    // Clear redo stack when new action is performed
    this.redoStack = [];
  }

  /**
   * Undo the last action
   */
  undo(): HistoryAction | null => {
    if (this.undoStack.length === 0) {
      return null;
    }

    const action = this.undoStack.pop()!;
    this.redoStack.push(action);

    return action;
  }

  /**
   * Redo the last undone action
   */
  redo(): HistoryAction | null => {
    if (this.redoStack.length === 0) {
      return null;
    }

    const action = this.redoStack.pop()!;
    this.undoStack.push(action);

    return action;
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean => {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean => {
    return this.redoStack.length > 0;
  }

  /**
   * Get undo stack size
   */
  getUndoStackSize(): number => {
    return this.undoStack.length;
  }

  /**
   * Get redo stack size
   */
  getRedoStackSize(): number => {
    return this.redoStack.length;
  }

  /**
   * Clear all history
   */
  clearHistory(): void => {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Get history preview (for UI display)
   */
  getHistoryPreview(count: number = 10): HistoryAction[] => {
    return this.undoStack.slice(-count).reverse();
  }

  /**
   * Create action for node addition
   */
  static createNodeAddAction(before: MindMap, after: MindMap): HistoryAction {
    return {
      type: 'NODE_ADD',
      timestamp: Date.now(),
      before: {nodes: before.nodes},
      after: {nodes: after.nodes},
    };
  }

  /**
   * Create action for node deletion
   */
  static createNodeDeleteAction(
    before: MindMap,
    after: MindMap,
  ): HistoryAction {
    return {
      type: 'NODE_DELETE',
      timestamp: Date.now(),
      before: {nodes: before.nodes, connections: before.connections},
      after: {nodes: after.nodes, connections: after.connections},
    };
  }

  /**
   * Create action for node edit
   */
  static createNodeEditAction(before: MindMap, after: MindMap): HistoryAction {
    return {
      type: 'NODE_EDIT',
      timestamp: Date.now(),
      before: {nodes: before.nodes},
      after: {nodes: after.nodes},
    };
  }

  /**
   * Create action for node move
   */
  static createNodeMoveAction(before: MindMap, after: MindMap): HistoryAction {
    return {
      type: 'NODE_MOVE',
      timestamp: Date.now(),
      before: {nodes: before.nodes},
      after: {nodes: after.nodes},
    };
  }

  /**
   * Create action for connection add
   */
  static createConnectionAddAction(
    before: MindMap,
    after: MindMap,
  ): HistoryAction {
    return {
      type: 'CONNECTION_ADD',
      timestamp: Date.now(),
      before: {connections: before.connections},
      after: {connections: after.connections},
    };
  }

  /**
   * Create action for connection delete
   */
  static createConnectionDeleteAction(
    before: MindMap,
    after: MindMap,
  ): HistoryAction {
    return {
      type: 'CONNECTION_DELETE',
      timestamp: Date.now(),
      before: {connections: before.connections},
      after: {connections: after.connections},
    };
  }

  /**
   * Create action for style change
   */
  static createStyleChangeAction(
    before: MindMap,
    after: MindMap,
  ): HistoryAction {
    return {
      type: 'STYLE_CHANGE',
      timestamp: Date.now(),
      before: {nodes: before.nodes},
      after: {nodes: after.nodes},
    };
  }

  /**
   * Create action for layout change
   */
  static createLayoutChangeAction(
    before: MindMap,
    after: MindMap,
  ): HistoryAction {
    return {
      type: 'LAYOUT_CHANGE',
      timestamp: Date.now(),
      before: {nodes: before.nodes, settings: before.settings},
      after: {nodes: after.nodes, settings: after.settings},
    };
  }
}
