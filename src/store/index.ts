/**
 * Redux Store Configuration
 */

import {configureStore} from '@reduxjs/toolkit';
import mindMapsReducer from './slices/mindMapsSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    mindMaps: mindMapsReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['mindMaps/addMindMap', 'mindMaps/updateMindMap'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
