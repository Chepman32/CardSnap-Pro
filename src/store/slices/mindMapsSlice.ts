/**
 * Mind Maps Redux Slice
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MindMap, createDefaultMindMap} from '../../models/MindMap';
import {Node, createDefaultNode} from '../../models/Node';
import {Connection, createDefaultConnection} from '../../models/Connection';

interface MindMapsState {
  maps: Record<string, MindMap>;
  currentMapId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MindMapsState = {
  maps: {},
  currentMapId: null,
  isLoading: false,
  error: null,
};

const mindMapsSlice = createSlice({
  name: 'mindMaps',
  initialState,
  reducers: {
    addMindMap: (state, action: PayloadAction<MindMap>) => {
      state.maps[action.payload.id] = action.payload;
    },
    updateMindMap: (state, action: PayloadAction<{id: string; updates: Partial<MindMap>}>) => {
      const {id, updates} = action.payload;
      if (state.maps[id]) {
        state.maps[id] = {
          ...state.maps[id],
          ...updates,
          modifiedAt: Date.now(),
        };
      }
    },
    deleteMindMap: (state, action: PayloadAction<string>) => {
      delete state.maps[action.payload];
      if (state.currentMapId === action.payload) {
        state.currentMapId = null;
      }
    },
    setCurrentMap: (state, action: PayloadAction<string | null>) => {
      state.currentMapId = action.payload;
    },
    addNode: (
      state,
      action: PayloadAction<{mapId: string; node: Node; parentId?: string | null}>,
    ) => {
      const {mapId, node} = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].nodes.push(node);
        state.maps[mapId].metadata.nodeCount += 1;
        state.maps[mapId].modifiedAt = Date.now();
      }
    },
    updateNode: (state, action: PayloadAction<{mapId: string; nodeId: string; updates: Partial<Node>}>) => {
      const {mapId, nodeId, updates} = action.payload;
      if (state.maps[mapId]) {
        const nodeIndex = state.maps[mapId].nodes.findIndex(n => n.id === nodeId);
        if (nodeIndex !== -1) {
          state.maps[mapId].nodes[nodeIndex] = {
            ...state.maps[mapId].nodes[nodeIndex],
            ...updates,
            metadata: {
              ...state.maps[mapId].nodes[nodeIndex].metadata,
              modifiedAt: Date.now(),
            },
          };
          state.maps[mapId].modifiedAt = Date.now();
        }
      }
    },
    deleteNode: (state, action: PayloadAction<{mapId: string; nodeId: string}>) => {
      const {mapId, nodeId} = action.payload;
      if (state.maps[mapId]) {
        // Delete node and its connections
        state.maps[mapId].nodes = state.maps[mapId].nodes.filter(n => n.id !== nodeId);
        state.maps[mapId].connections = state.maps[mapId].connections.filter(
          c => c.startNodeId !== nodeId && c.endNodeId !== nodeId,
        );
        state.maps[mapId].metadata.nodeCount -= 1;
        state.maps[mapId].modifiedAt = Date.now();
      }
    },
    addConnection: (state, action: PayloadAction<{mapId: string; connection: Connection}>) => {
      const {mapId, connection} = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].connections.push(connection);
        state.maps[mapId].modifiedAt = Date.now();
      }
    },
    deleteConnection: (state, action: PayloadAction<{mapId: string; connectionId: string}>) => {
      const {mapId, connectionId} = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].connections = state.maps[mapId].connections.filter(
          c => c.id !== connectionId,
        );
        state.maps[mapId].modifiedAt = Date.now();
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.maps[action.payload]) {
        state.maps[action.payload].metadata.isFavorite =
          !state.maps[action.payload].metadata.isFavorite;
      }
    },
    loadMindMaps: (state, action: PayloadAction<Record<string, MindMap>>) => {
      state.maps = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  addMindMap,
  updateMindMap,
  deleteMindMap,
  setCurrentMap,
  addNode,
  updateNode,
  deleteNode,
  addConnection,
  deleteConnection,
  toggleFavorite,
  loadMindMaps,
} = mindMapsSlice.actions;

export default mindMapsSlice.reducer;
