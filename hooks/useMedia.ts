import { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem, MediaFilter, MediaSort, MediaUploadData } from '@/types/media';
import { MediaService } from '@/services/mediaService';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export function useMedia(initialFilter?: MediaFilter) {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MediaFilter>(initialFilter || {});
  const [sort, setSort] = useState<MediaSort>({ field: 'created_at', direction: 'desc' });
  const fetchingRef = useRef(false);

  const fetchMedia = useCallback(async () => {
    if (!user || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await MediaService.getMediaItems(
        user.id,
        false // Only fetch user's own media by default
      );

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      let filteredItems = data || [];

      // Apply filters
      if (filter.media_type) {
        filteredItems = filteredItems.filter(item => item.media_type === filter.media_type);
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }

      if (filter.tags && filter.tags.length > 0) {
        filteredItems = filteredItems.filter(item =>
          item.tags && filter.tags!.some(tag => item.tags!.includes(tag))
        );
      }

      if (filter.user_id) {
        filteredItems = filteredItems.filter(item => item.user_id === filter.user_id);
      }

      // Apply sorting
      filteredItems.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sort.direction === 'asc' ? comparison : -comparison;
      });

      setMediaItems(filteredItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [user, filter, sort]);

  const uploadMedia = async (
    files: ImagePicker.ImagePickerAsset[],
    uploadData: MediaUploadData
  ): Promise<MediaItem[]> => {
    if (!user) throw new Error('User not authenticated');

    setUploading(true);
    const uploadedItems: MediaItem[] = [];

    try {
      for (const file of files) {
        const { data, error } = await MediaService.uploadMedia(file, uploadData, user.id);
        
        if (error) {
          throw new Error(`Failed to upload ${file.uri}: ${error.message}`);
        }

        if (data) {
          uploadedItems.push(data);
        }
      }

      // Refresh media list
      await fetchMedia();
      
      return uploadedItems;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (mediaId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await MediaService.deleteMedia(mediaId, user.id);
      
      if (error) {
        throw new Error(error.message);
      }

      // Remove from local state
      setMediaItems(prev => prev.filter(item => item.id !== mediaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  };

  const updateMedia = async (
    mediaId: string, 
    updates: Partial<MediaItem>
  ): Promise<MediaItem> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await MediaService.updateMedia(mediaId, updates, user.id);
      
      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      // Update local state
      setMediaItems(prev => 
        prev.map(item => item.id === mediaId ? data : item)
      );

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  };

  const pickAndUploadMedia = async (
    uploadData: MediaUploadData,
    allowMultiple = false
  ): Promise<MediaItem[]> => {
    try {
      const assets = await MediaService.pickMedia(allowMultiple);
      
      if (assets.length === 0) {
        return [];
      }

      return await uploadMedia(assets, uploadData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pick media');
      throw err;
    }
  };

  const updateFilter = (newFilter: Partial<MediaFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const updateSort = (newSort: Partial<MediaSort>) => {
    setSort(prev => ({ ...prev, ...newSort }));
  };

  const clearError = () => setError(null);

  // Fetch media when dependencies change
  useEffect(() => {
    fetchMedia();
  }, [user?.id, filter, sort]); // Use specific dependencies instead of fetchMedia

  return {
    mediaItems,
    loading,
    uploading,
    error,
    filter,
    sort,
    fetchMedia,
    uploadMedia,
    deleteMedia,
    updateMedia,
    pickAndUploadMedia,
    updateFilter,
    updateSort,
    clearError,
  };
}
