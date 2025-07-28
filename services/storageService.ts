import { MediaItem } from '@/types/media';

export interface StorageData {
  used: number; // GB
  total: number; // GB
  breakdown: {
    images: number;
    videos: number;
    audio: number;
  };
}

export class StorageService {
  static calculateStorageFromMediaItems(mediaItems: MediaItem[]): StorageData {
    const breakdown = {
      images: 0,
      videos: 0,
      audio: 0,
    };

    let totalBytes = 0;

    mediaItems.forEach(item => {
      const sizeInBytes = item.file_size || 0;
      totalBytes += sizeInBytes;

      const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);

      switch (item.media_type) {
        case 'image':
          breakdown.images += sizeInGB;
          break;
        case 'video':
          breakdown.videos += sizeInGB;
          break;
        case 'audio':
          breakdown.audio += sizeInGB;
          break;
      }
    });

    const totalUsedGB = totalBytes / (1024 * 1024 * 1024);

    return {
      used: Math.round(totalUsedGB * 100) / 100, // Round to 2 decimal places
      total: 50, // TODO: Get from user plan/subscription
      breakdown: {
        images: Math.round(breakdown.images * 100) / 100,
        videos: Math.round(breakdown.videos * 100) / 100,
        audio: Math.round(breakdown.audio * 100) / 100,
      },
    };
  }

  static formatFileSize(bytes: number | null): string {
    if (!bytes) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    if (i === 0) return `${bytes} ${sizes[i]}`;
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  static getStoragePercentage(used: number, total: number): number {
    return Math.min((used / total) * 100, 100);
  }

  static getStorageColor(percentage: number): string {
    if (percentage < 50) return '#22C55E'; // Green
    if (percentage < 80) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  }
}
