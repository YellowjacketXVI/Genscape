import { supabase } from '@/lib/supabase';
import { MediaItem, MediaUploadData, MediaType } from '@/types/media';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

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

      // Convert file to base64 for upload
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

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
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  static async pickMedia(allowsMultipleSelection = false): Promise<ImagePicker.ImagePickerAsset[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Media library permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection,
      quality: 0.8,
      videoQuality: ImagePicker.VideoQuality.High,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets;
  }
}
