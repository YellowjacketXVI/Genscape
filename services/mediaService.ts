import { supabase } from '@/lib/supabase';
import { MediaItem, MediaUploadData, MediaType } from '@/types/media';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
// import { decode } from 'base64-arraybuffer';

export class MediaService {
  static async uploadMedia(
    file: ImagePicker.ImagePickerAsset,
    uploadData: MediaUploadData,
    userId: string
  ): Promise<{ data: MediaItem | null; error: any }> {
    try {
      // Determine media type from mime type
      const mediaType = this.getMediaTypeFromMimeType(file.mimeType || '');
      
      // Generate unique file path
      const fileExt = file.uri.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Convert file to arrayBuffer for upload
      let arrayBuffer: ArrayBuffer;

      if (Platform.OS === 'web' && file.uri.startsWith('blob:')) {
        // On web, fetch the blob URL to get the file data
        const response = await fetch(file.uri);
        const blob = await response.blob();
        arrayBuffer = await blob.arrayBuffer();
      } else {
        // On native platforms, fetch the file URI
        const response = await fetch(file.uri);
        const blob = await response.blob();
        arrayBuffer = await blob.arrayBuffer();
      }

      // Upload file to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, arrayBuffer, {
          contentType: file.mimeType || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) {
        return { data: null, error: uploadError };
      }

      // Create media item record in database
      const mediaItemData = {
        user_id: userId,
        name: uploadData.name,
        description: uploadData.description || null,
        file_path: filePath,
        file_size: file.fileSize || null,
        mime_type: file.mimeType || 'application/octet-stream',
        media_type: mediaType,
        width: file.width || null,
        height: file.height || null,
        duration: file.duration || null,
        tags: uploadData.tags || null,
        is_public: uploadData.is_public || false,
      };

      const { data: mediaItem, error: dbError } = await supabase
        .from('media_items')
        .insert(mediaItemData)
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('media').remove([filePath]);
        return { data: null, error: dbError };
      }

      return { data: mediaItem, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getMediaItems(userId: string, includePublic = false): Promise<{ data: MediaItem[] | null; error: any }> {
    try {
      let query = supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (includePublic) {
        query = query.or(`user_id.eq.${userId},is_public.eq.true`);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      // Add URLs to media items
      const mediaItemsWithUrls = await Promise.all(
        data.map(async (item) => {
          const url = await this.getMediaUrl(item.file_path);
          const thumbnail_url = item.thumbnail_path 
            ? await this.getMediaUrl(item.thumbnail_path)
            : null;
          
          return {
            ...item,
            url,
            thumbnail_url,
          };
        })
      );

      return { data: mediaItemsWithUrls, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getMediaUrl(filePath: string): Promise<string> {
    // Since the bucket is private, we need to use signed URLs
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      // Fallback to public URL (might not work for private buckets)
      const { data: publicData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      return publicData.publicUrl;
    }

    return data.signedUrl;
  }

  static async refreshMediaUrls(mediaItems: MediaItem[]): Promise<MediaItem[]> {
    // Refresh signed URLs for media items (useful when URLs expire)
    return Promise.all(
      mediaItems.map(async (item) => {
        const url = await this.getMediaUrl(item.file_path);
        const thumbnail_url = item.thumbnail_path
          ? await this.getMediaUrl(item.thumbnail_path)
          : null;

        return {
          ...item,
          url,
          thumbnail_url,
        };
      })
    );
  }

  static async deleteMedia(mediaId: string, userId: string): Promise<{ error: any }> {
    try {
      // First get the media item to get the file path
      const { data: mediaItem, error: fetchError } = await supabase
        .from('media_items')
        .select('file_path, thumbnail_path')
        .eq('id', mediaId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        return { error: fetchError };
      }

      // Delete from storage
      const filesToDelete = [mediaItem.file_path];
      if (mediaItem.thumbnail_path) {
        filesToDelete.push(mediaItem.thumbnail_path);
      }

      const { error: storageError } = await supabase.storage
        .from('media')
        .remove(filesToDelete);

      if (storageError) {
        console.warn('Error deleting files from storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_items')
        .delete()
        .eq('id', mediaId)
        .eq('user_id', userId);

      return { error: dbError };
    } catch (error) {
      return { error };
    }
  }

  static async updateMedia(
    mediaId: string, 
    updates: Partial<MediaItem>, 
    userId: string
  ): Promise<{ data: MediaItem | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mediaId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // Add URL to the updated item
      const url = await this.getMediaUrl(data.file_path);
      const thumbnail_url = data.thumbnail_path 
        ? await this.getMediaUrl(data.thumbnail_path)
        : null;

      return { 
        data: { ...data, url, thumbnail_url }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  static getMediaTypeFromMimeType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'image'; // default fallback
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // On web, no explicit permission is needed for file picker
        return true;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request media permissions:', error);
      return false;
    }
  }

  static async pickMedia(allowsMultipleSelection = false): Promise<ImagePicker.ImagePickerAsset[]> {
    try {
      if (Platform.OS === 'web') {
        return await this.pickMediaWeb(allowsMultipleSelection);
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission is required to upload files. Please enable it in your device settings.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection,
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled) {
        return [];
      }

      if (!result.assets || result.assets.length === 0) {
        return [];
      }

      return result.assets;
    } catch (error) {
      console.error('Failed to pick media:', error);
      throw error;
    }
  }

  static async pickMediaWeb(allowsMultipleSelection = false): Promise<ImagePicker.ImagePickerAsset[]> {
    return new Promise((resolve, reject) => {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*,audio/*';
        input.multiple = allowsMultipleSelection;

        input.onchange = async (event) => {
          try {
            const files = (event.target as HTMLInputElement).files;
            if (!files || files.length === 0) {
              resolve([]);
              return;
            }

            const assets: ImagePicker.ImagePickerAsset[] = [];

            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const uri = URL.createObjectURL(file);

              // Create asset object compatible with ImagePicker.ImagePickerAsset
              const asset: ImagePicker.ImagePickerAsset = {
                uri,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                type: file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('video/') ? 'video' : 'unknown',
                width: undefined,
                height: undefined,
                duration: undefined,
                assetId: undefined,
              };

              // For images, try to get dimensions
              if (file.type.startsWith('image/')) {
                try {
                  const dimensions = await this.getImageDimensions(uri);
                  asset.width = dimensions.width;
                  asset.height = dimensions.height;
                } catch (error) {
                  console.warn('Could not get image dimensions:', error);
                }
              }

              assets.push(asset);
            }

            resolve(assets);
          } catch (error) {
            reject(error);
          }
        };

        input.oncancel = () => {
          resolve([]);
        };

        input.click();
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = src;
    });
  }
}
