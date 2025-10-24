/**
 * Image Helper Utilities
 * Functions for image processing and manipulation
 */

import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

export const resizeImage = async (
  uri: string,
  maxWidth: number,
  maxHeight: number,
  quality = 90,
): Promise<string> => {
  try {
    const result = await ImageResizer.createResizedImage(
      uri,
      maxWidth,
      maxHeight,
      'JPEG',
      quality,
    );
    return result.uri;
  } catch (error) {
    console.error('Failed to resize image:', error);
    throw error;
  }
};

export const createThumbnail = async (uri: string): Promise<string> => {
  return resizeImage(uri, 400, 400, 80);
};

export const getImageDimensions = async (
  uri: string,
): Promise<{width: number; height: number}> => {
  try {
    // Use Image.getSize for React Native
    return new Promise((resolve, reject) => {
      const Image = require('react-native').Image;
      Image.getSize(
        uri,
        (width: number, height: number) => resolve({width, height}),
        reject,
      );
    });
  } catch (error) {
    console.error('Failed to get image dimensions:', error);
    throw error;
  }
};

export const saveImageToLocal = async (
  uri: string,
  filename: string,
): Promise<string> => {
  try {
    const destPath = `${RNFS.DocumentDirectoryPath}/CardSnapPro/cards/${filename}`;
    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/CardSnapPro/cards`);
    await RNFS.copyFile(uri, destPath);
    return destPath;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
};

export const deleteImage = async (uri: string): Promise<void> => {
  try {
    await RNFS.unlink(uri);
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
};
