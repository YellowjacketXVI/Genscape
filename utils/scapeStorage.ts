import { Scape, Widget } from '@/types/Scape';
import {
  saveScapeToFile,
  loadScapeFromFile,
  listUserScapes,
  initUserStorage,
} from './fileStorage';

/**
 * Utility functions for saving and loading scape data
 */

/**
 * Save a scape to local storage (for offline/draft mode)
 */
export const saveScapeToLocalStorage = (scape: Scape): void => {
  try {
    const key = `scape_${scape.id}`;
    localStorage.setItem(key, JSON.stringify(scape));
  } catch (error) {
    console.error('Error saving scape to local storage:', error);
  }
};

/**
 * Load a scape from local storage
 */
export const loadScapeFromLocalStorage = (scapeId: string): Scape | null => {
  try {
    const key = `scape_${scapeId}`;
    const scapeData = localStorage.getItem(key);
    
    if (!scapeData) return null;
    
    return JSON.parse(scapeData);
  } catch (error) {
    console.error('Error loading scape from local storage:', error);
    return null;
  }
};

/**
 * Delete a scape from local storage
 */
export const deleteScapeFromLocalStorage = (scapeId: string): void => {
  try {
    const key = `scape_${scapeId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting scape from local storage:', error);
  }
};

/**
 * Get all draft scapes from local storage
 */
export const getAllDraftScapesFromLocalStorage = (): Scape[] => {
  try {
    const scapes: Scape[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('scape_')) {
        const scapeData = localStorage.getItem(key);
        
        if (scapeData) {
          const scape = JSON.parse(scapeData);
          
          if (!scape.isPublished) {
            scapes.push(scape);
          }
        }
      }
    }
    
    return scapes;
  } catch (error) {
    console.error('Error getting all draft scapes from local storage:', error);
    return [];
  }
};

/**
 * Initialize storage directories for a user
 */
export const setupStorageForUser = async (userId: string) => {
  await initUserStorage(userId);
};

/**
 * Save a scape to the user's storage folder and localStorage
 */
export const saveScape = async (userId: string, scape: Scape): Promise<void> => {
  await saveScapeToFile(userId, scape);
  saveScapeToLocalStorage(scape);
};

/**
 * Load a scape from the user's storage folder, falling back to localStorage
 */
export const loadScape = async (
  userId: string,
  scapeId: string
): Promise<Scape | null> => {
  const fileScape = await loadScapeFromFile(userId, scapeId);
  return fileScape || loadScapeFromLocalStorage(scapeId);
};

/**
 * List all scapes for a user from the storage folder
 */
export const listScapesForUser = async (userId: string): Promise<Scape[]> => {
  const scapes = await listUserScapes(userId);
  return scapes.length ? scapes : getAllDraftScapesFromLocalStorage();
};

/**
 * Create a new empty scape with default values
 */
export const createEmptyScape = (userId: string, username: string): Scape => {
  const now = new Date();
  const scapeId = `draft_${now.getTime()}`;
  
  return {
    id: scapeId,
    name: 'Untitled Scape',
    description: '',
    tags: [],
    bannerImage: '',
    layout: 'vertical',
    widgets: [],
    isPublished: false,
    createdAt: now,
    updatedAt: now,
    createdBy: {
      id: userId,
      username,
    },
    stats: {
      likes: 0,
      comments: 0,
      views: 0,
    },
    permissions: {
      genGuard: false,
      datasetReuse: false,
      contentWarnings: {
        suggestive: false,
        political: false,
        violent: false,
        nudity: false,
      },
      visibility: 'private',
      approvalType: 'auto',
      pricingModel: 'free',
    },
  };
};

/**
 * Create a new widget with default values
 */
export const createEmptyWidget = (
  type: string,
  size: { width: 1 | 2 | 3, height: 3 },
  position: number
): Widget => {
  return {
    id: `widget_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type,
    title: getDefaultWidgetTitle(type),
    size,
    position,
    channel: 'neutral',
    isFeatured: false,
    mediaIds: [],
  };
};

/**
 * Get a default title for a widget based on its type
 */
const getDefaultWidgetTitle = (type: string): string => {
  switch (type) {
    case 'media':
      return 'Media Display';
    case 'gallery':
      return 'Gallery';
    case 'shop':
      return 'Shop';
    case 'audio':
      return 'Audio Player';
    case 'text':
      return 'Text Block';
    case 'header':
      return 'Header';
    case 'chat':
      return 'Chat';
    case 'comments':
      return 'Comments';
    case 'live':
      return 'Live Stream';
    case 'button':
      return 'Button';
    case 'llm':
      return 'AI Chat';
    default:
      return 'Widget';
  }
};

/**
 * Export a scape to JSON file
 */
export const exportScapeToJson = (scape: Scape): void => {
  try {
    const scapeJson = JSON.stringify(scape, null, 2);
    const blob = new Blob([scapeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scape.name.replace(/\s+/g, '_')}_${scape.id}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting scape to JSON:', error);
  }
};

/**
 * Import a scape from JSON file
 */
export const importScapeFromJson = (file: File): Promise<Scape> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const scapeData = JSON.parse(event.target.result as string);
        resolve(scapeData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};
