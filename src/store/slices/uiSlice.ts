/**
 * UI State Redux Slice
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  toasts: Toast[];
  selectedNodeIds: string[];
  isSelectionMode: boolean;
  showMinimap: boolean;
  searchQuery: string;
  activeModal: string | null;
  sideMenuOpen: boolean;
  quickActionsOpen: boolean;
}

const initialState: UIState = {
  isLoading: false,
  toasts: [],
  selectedNodeIds: [],
  isSelectionMode: false,
  showMinimap: false,
  searchQuery: '',
  activeModal: null,
  sideMenuOpen: false,
  quickActionsOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: `toast_${Date.now()}_${Math.random()}`,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    selectNode: (state, action: PayloadAction<string>) => {
      if (!state.selectedNodeIds.includes(action.payload)) {
        state.selectedNodeIds.push(action.payload);
      }
    },
    deselectNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== action.payload);
    },
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodeIds = action.payload;
    },
    clearSelection: state => {
      state.selectedNodeIds = [];
      state.isSelectionMode = false;
    },
    toggleSelectionMode: state => {
      state.isSelectionMode = !state.isSelectionMode;
      if (!state.isSelectionMode) {
        state.selectedNodeIds = [];
      }
    },
    toggleMinimap: state => {
      state.showMinimap = !state.showMinimap;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: state => {
      state.activeModal = null;
    },
    toggleSideMenu: state => {
      state.sideMenuOpen = !state.sideMenuOpen;
      if (state.sideMenuOpen) {
        state.quickActionsOpen = false;
      }
    },
    toggleQuickActions: state => {
      state.quickActionsOpen = !state.quickActionsOpen;
      if (state.quickActionsOpen) {
        state.sideMenuOpen = false;
      }
    },
  },
});

export const {
  setLoading,
  showToast,
  removeToast,
  selectNode,
  deselectNode,
  setSelectedNodes,
  clearSelection,
  toggleSelectionMode,
  toggleMinimap,
  setSearchQuery,
  openModal,
  closeModal,
  toggleSideMenu,
  toggleQuickActions,
} = uiSlice.actions;

export default uiSlice.reducer;
