/**
 * User Redux Slice
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserPreferences {
  defaultLayout: string;
  autoSaveInterval: number;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  gestureSensitivity: 'low' | 'medium' | 'high';
  reduceAnimations: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

interface UserState {
  isPremium: boolean;
  premiumExpiryDate: number | null;
  subscriptionType: 'monthly' | 'annual' | 'lifetime' | null;
  preferences: UserPreferences;
  storageUsed: number;
  storageLimit: number;
  onboardingCompleted: boolean;
}

const initialState: UserState = {
  isPremium: false,
  premiumExpiryDate: null,
  subscriptionType: null,
  preferences: {
    defaultLayout: 'mindmap',
    autoSaveInterval: 3000,
    gridEnabled: false,
    gridSize: 20,
    snapToGrid: false,
    gestureSensitivity: 'medium',
    reduceAnimations: false,
    fontSize: 'medium',
  },
  storageUsed: 0,
  storageLimit: 100 * 1024 * 1024, // 100MB for free users
  onboardingCompleted: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPremiumStatus: (
      state,
      action: PayloadAction<{
        isPremium: boolean;
        subscriptionType: 'monthly' | 'annual' | 'lifetime' | null;
        expiryDate?: number | null;
      }>,
    ) => {
      state.isPremium = action.payload.isPremium;
      state.subscriptionType = action.payload.subscriptionType;
      state.premiumExpiryDate = action.payload.expiryDate || null;
      // Premium users get more storage
      if (action.payload.isPremium) {
        state.storageLimit = 5 * 1024 * 1024 * 1024; // 5GB
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = {...state.preferences, ...action.payload};
    },
    updateStorageUsed: (state, action: PayloadAction<number>) => {
      state.storageUsed = action.payload;
    },
    completeOnboarding: state => {
      state.onboardingCompleted = true;
    },
  },
});

export const {setPremiumStatus, updatePreferences, updateStorageUsed, completeOnboarding} =
  userSlice.actions;

export default userSlice.reducer;
