/**
 * Media Types
 */

import { ContentWarnings } from './Permissions';

// Media permissions
export interface MediaPermissions {
  genGuard: boolean;
  datasetReuse: boolean;
  contentWarnings: ContentWarnings;
}

// Media item
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  size: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  permissions: MediaPermissions;
}

// Media folder
export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  itemCount: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Media usage
export interface MediaUsage {
  id: string;
  mediaId: string;
  usageType: 'scape' | 'generation' | 'training';
  entityId: string; // ID of the scape, generation, or training
  entityName: string;
  timestamp: string;
}

// Media upload response
export interface MediaUploadResponse {
  success: boolean;
  media?: MediaItem;
  error?: string;
}
