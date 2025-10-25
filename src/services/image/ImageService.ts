/**
 * Image Service
 * Image processing, storage, and management
 */

import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {v4 as uuidv4} from 'react-native-uuid';

export class ImageService {
  private basePath = `${RNFS.DocumentDirectoryPath}/CardSnapPro`;
  private cardsPath = `${this.basePath}/cards/original`;
  private thumbnailsPath = `${this.basePath}/cards/thumbnails`;
  private avatarsPath = `${this.basePath}/avatars`;

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure all required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await RNFS.mkdir(this.cardsPath);
      await RNFS.mkdir(this.thumbnailsPath);
      await RNFS.mkdir(this.avatarsPath);
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  }

  /**
   * Process and save card image
   */
  async saveCardImage(sourceUri: string): Promise<{
    imagePath: string;
    thumbnailPath: string;
  }> {
    const imageId = uuidv4() as string;
    const imagePath = `${this.cardsPath}/${imageId}.jpg`;
    const thumbnailPath = `${this.thumbnailsPath}/${imageId}_thumb.jpg`;

    try {
      // Resize main image (max 2000px)
      const resized = await ImageResizer.createResizedImage(
        sourceUri,
        2000,
        2000,
        'JPEG',
        90,
        0,
        undefined,
        false,
        {mode: 'contain'},
      );

      // Save main image
      await RNFS.moveFile(resized.uri, imagePath);

      // Create thumbnail (400px)
      const thumbnail = await ImageResizer.createResizedImage(
        imagePath,
        400,
        400,
        'JPEG',
        80,
        0,
        undefined,
        false,
        {mode: 'contain'},
      );

      // Save thumbnail
      await RNFS.moveFile(thumbnail.uri, thumbnailPath);

      return {imagePath, thumbnailPath};
    } catch (error) {
      console.error('Failed to save card image:', error);
      throw error;
    }
  }

  /**
   * Delete card image and thumbnail
   */
  async deleteCardImage(imagePath: string, thumbnailPath: string): Promise<void> {
    try {
      await Promise.all([
        RNFS.unlink(imagePath).catch(() => {}),
        RNFS.unlink(thumbnailPath).catch(() => {}),
      ]);
    } catch (error) {
      console.error('Failed to delete card image:', error);
    }
  }

  /**
   * Save avatar image
   */
  async saveAvatar(sourceUri: string): Promise<string> {
    const avatarId = uuidv4() as string;
    const avatarPath = `${this.avatarsPath}/${avatarId}.jpg`;

    try {
      // Resize to 256x256 square
      const resized = await ImageResizer.createResizedImage(
        sourceUri,
        256,
        256,
        'JPEG',
        85,
        0,
        undefined,
        false,
        {mode: 'cover'},
      );

      await RNFS.moveFile(resized.uri, avatarPath);
      return avatarPath;
    } catch (error) {
      console.error('Failed to save avatar:', error);
      throw error;
    }
  }

  /**
   * Delete avatar image
   */
  async deleteAvatar(avatarPath: string): Promise<void> {
    try {
      await RNFS.unlink(avatarPath);
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    }
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(uri: string): Promise<{width: number; height: number}> {
    const Image = require('react-native').Image;

    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width: number, height: number) => resolve({width, height}),
        reject,
      );
    });
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalSize: number;
    cardsSize: number;
    thumbnailsSize: number;
    avatarsSize: number;
  }> {
    try {
      const [cards, thumbnails, avatars] = await Promise.all([
        this.getDirectorySize(this.cardsPath),
        this.getDirectorySize(this.thumbnailsPath),
        this.getDirectorySize(this.avatarsPath),
      ]);

      return {
        totalSize: cards + thumbnails + avatars,
        cardsSize: cards,
        thumbnailsSize: thumbnails,
        avatarsSize: avatars,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalSize: 0,
        cardsSize: 0,
        thumbnailsSize: 0,
        avatarsSize: 0,
      };
    }
  }

  /**
   * Get directory size in bytes
   */
  private async getDirectorySize(path: string): Promise<number> {
    try {
      const files = await RNFS.readDir(path);
      return files.reduce((total, file) => total + (file.size || 0), 0);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    // Currently no separate cache directory
    // Could implement LRU cache cleanup here
  }

  /**
   * Clean up orphaned files
   */
  async cleanupOrphanedFiles(activeImagePaths: string[]): Promise<void> {
    try {
      const [cardFiles, thumbnailFiles, avatarFiles] = await Promise.all([
        RNFS.readDir(this.cardsPath),
        RNFS.readDir(this.thumbnailsPath),
        RNFS.readDir(this.avatarsPath),
      ]);

      const activePaths = new Set(activeImagePaths);

      // Delete orphaned files
      const deletePromises = [];

      for (const file of cardFiles) {
        if (!activePaths.has(file.path)) {
          deletePromises.push(RNFS.unlink(file.path));
        }
      }

      for (const file of thumbnailFiles) {
        if (!activePaths.has(file.path)) {
          deletePromises.push(RNFS.unlink(file.path));
        }
      }

      for (const file of avatarFiles) {
        if (!activePaths.has(file.path)) {
          deletePromises.push(RNFS.unlink(file.path));
        }
      }

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to cleanup orphaned files:', error);
    }
  }
}

export default new ImageService();
