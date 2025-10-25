/**
 * Auto-Save Hook
 * Automatically saves mind map changes with debouncing
 */

import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {mindMapsStorage} from '../services/storageService';
import {TIMING} from '../constants';

export const useAutoSave = (mapId: string | null) => {
  const dispatch = useDispatch();
  const mindMap = useSelector((state: RootState) =>
    mapId ? state.mindMaps.maps[mapId] : null,
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<number>(0);

  useEffect(() => {
    if (!mindMap) return;

    // Don't save if map hasn't changed
    if (mindMap.modifiedAt <= lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        await mindMapsStorage.saveMindMap(mindMap);
        lastSavedRef.current = mindMap.modifiedAt;
        console.log(`Auto-saved mind map: ${mindMap.title}`);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, TIMING.AUTO_SAVE_DEBOUNCE);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mindMap]);

  const forceSave = async () => {
    if (!mindMap) return;

    try {
      await mindMapsStorage.saveMindMap(mindMap);
      lastSavedRef.current = mindMap.modifiedAt;
      console.log(`Force saved mind map: ${mindMap.title}`);
    } catch (error) {
      console.error('Force save failed:', error);
    }
  };

  return {forceSave};
};
