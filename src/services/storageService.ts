/**
 * Storage Service
 * Handles data persistence using MMKV and AsyncStorage
 */

import {MMKV} from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MindMap} from '../models/MindMap';
import {STORAGE_KEYS} from '../constants';

// Initialize MMKV instance
const storage = new MMKV();

/**
 * MMKV Storage (High-performance key-value storage)
 */
export const mmkvStorage = {
  set: (key: string, value: any): void => {
    storage.set(key, JSON.stringify(value));
  },

  get: (key: string): any | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },

  delete: (key: string): void => {
    storage.delete(key);
  },

  clear: (): void => {
    storage.clearAll();
  },

  contains: (key: string): boolean => {
    return storage.contains(key);
  },
};

/**
 * Mind Maps Storage
 */
export const mindMapsStorage = {
  saveMindMap: async (mindMap: MindMap): Promise<void> => {
    const allMaps = await mindMapsStorage.getAllMindMaps();
    allMaps[mindMap.id] = mindMap;
    await AsyncStorage.setItem(STORAGE_KEYS.MIND_MAPS, JSON.stringify(allMaps));
  },

  getMindMap: async (id: string): Promise<MindMap | null> => {
    const allMaps = await mindMapsStorage.getAllMindMaps();
    return allMaps[id] || null;
  },

  getAllMindMaps: async (): Promise<Record<string, MindMap>> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MIND_MAPS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading mind maps:', error);
      return {};
    }
  },

  deleteMindMap: async (id: string): Promise<void> => {
    const allMaps = await mindMapsStorage.getAllMindMaps();
    delete allMaps[id];
    await AsyncStorage.setItem(STORAGE_KEYS.MIND_MAPS, JSON.stringify(allMaps));
  },

  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.MIND_MAPS);
  },
};

/**
 * User Preferences Storage
 */
export const userPreferencesStorage = {
  saveThemeMode: (mode: 'light' | 'dark' | 'auto'): void => {
    mmkvStorage.set(STORAGE_KEYS.THEME_MODE, mode);
  },

  getThemeMode: (): 'light' | 'dark' | 'auto' => {
    return mmkvStorage.get(STORAGE_KEYS.THEME_MODE) || 'auto';
  },

  saveOnboardingCompleted: (completed: boolean): void => {
    mmkvStorage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  },

  getOnboardingCompleted: (): boolean => {
    return mmkvStorage.get(STORAGE_KEYS.ONBOARDING_COMPLETED) || false;
  },

  savePreferences: (preferences: any): void => {
    mmkvStorage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  getPreferences: (): any => {
    return mmkvStorage.get(STORAGE_KEYS.USER_PREFERENCES) || {};
  },

  savePremiumStatus: (status: any): void => {
    mmkvStorage.set(STORAGE_KEYS.PREMIUM_STATUS, status);
  },

  getPremiumStatus: (): any => {
    return mmkvStorage.get(STORAGE_KEYS.PREMIUM_STATUS) || {isPremium: false};
  },

  saveLastOpenedMap: (mapId: string): void => {
    mmkvStorage.set(STORAGE_KEYS.LAST_OPENED_MAP, mapId);
  },

  getLastOpenedMap: (): string | null => {
    return mmkvStorage.get(STORAGE_KEYS.LAST_OPENED_MAP);
  },

  saveAnalyticsConsent: (consent: boolean): void => {
    mmkvStorage.set(STORAGE_KEYS.ANALYTICS_CONSENT, consent);
  },

  getAnalyticsConsent: (): boolean => {
    return mmkvStorage.get(STORAGE_KEYS.ANALYTICS_CONSENT) || false;
  },
};

/**
 * Calculate storage usage
 */
export const getStorageUsage = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return 0;
  }
};

/**
 * Export all data
 */
export const exportAllData = async (): Promise<string> => {
  const allMaps = await mindMapsStorage.getAllMindMaps();
  const preferences = userPreferencesStorage.getPreferences();
  const premiumStatus = userPreferencesStorage.getPremiumStatus();

  const exportData = {
    mindMaps: allMaps,
    preferences,
    premiumStatus,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import data
 */
export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data = JSON.parse(jsonData);

    if (data.mindMaps) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.MIND_MAPS,
        JSON.stringify(data.mindMaps),
      );
    }

    if (data.preferences) {
      userPreferencesStorage.savePreferences(data.preferences);
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
