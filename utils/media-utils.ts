import { supabase } from '@/lib/supabase';

// Cache for signed URLs to avoid repeated requests
const urlCache = new Map<string, { url: string; expires: number }>();

/**
 * Get a signed URL for a media file stored in Supabase storage
 * @param filePath - The file path in storage
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - The signed URL or null if failed
 */
export async function getSignedMediaUrl(
  filePath: string, 
  expiresIn: number = 3600
): Promise<string | null> {
  if (!filePath) return null;

  // If it's already a full URL, return as-is
  if (filePath.startsWith('http')) {
    return filePath;
  }

  // Check cache first
  const cacheKey = `${filePath}_${expiresIn}`;
  const cached = urlCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      // Fallback to public URL
      return getPublicMediaUrl(filePath);
    }

    if (data?.signedUrl) {
      // Cache the URL
      urlCache.set(cacheKey, {
        url: data.signedUrl,
        expires: Date.now() + (expiresIn * 1000) - 60000, // Expire 1 minute early
      });
      return data.signedUrl;
    }

    return null;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    // Fallback to public URL
    return getPublicMediaUrl(filePath);
  }
}

/**
 * Get a public URL for a media file (for public files only)
 * @param filePath - The file path in storage
 * @returns string - The public URL
 */
export function getPublicMediaUrl(filePath: string): string {
  if (!filePath) return '';
  
  // If it's already a full URL, return as-is
  if (filePath.startsWith('http')) {
    return filePath;
  }

  return `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${filePath}`;
}

/**
 * Get multiple signed URLs efficiently
 * @param filePaths - Array of file paths
 * @param expiresIn - Expiration time in seconds
 * @returns Promise<Record<string, string | null>> - Map of filePath to signed URL
 */
export async function getMultipleSignedUrls(
  filePaths: string[],
  expiresIn: number = 3600
): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};
  
  // Process in batches to avoid overwhelming the API
  const batchSize = 10;
  for (let i = 0; i < filePaths.length; i += batchSize) {
    const batch = filePaths.slice(i, i + batchSize);
    const batchPromises = batch.map(async (filePath) => {
      const url = await getSignedMediaUrl(filePath, expiresIn);
      return { filePath, url };
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(({ filePath, url }) => {
      results[filePath] = url;
    });
  }
  
  return results;
}

/**
 * Clear expired URLs from cache
 */
export function clearExpiredUrls(): void {
  const now = Date.now();
  for (const [key, value] of urlCache.entries()) {
    if (value.expires <= now) {
      urlCache.delete(key);
    }
  }
}

/**
 * Clear all cached URLs
 */
export function clearUrlCache(): void {
  urlCache.clear();
}

/**
 * Get thumbnail URL for a media item
 * @param filePath - Original file path
 * @param size - Thumbnail size ('sm', 'md', 'lg')
 * @returns Promise<string | null> - Thumbnail URL or fallback to original
 */
export async function getThumbnailUrl(
  filePath: string,
  size: 'sm' | 'md' | 'lg' = 'md'
): Promise<string | null> {
  if (!filePath) return null;

  // Generate thumbnail path
  const pathParts = filePath.split('.');
  const extension = pathParts.pop();
  const basePath = pathParts.join('.');
  const thumbnailPath = `${basePath}_thumb_${size}.${extension}`;

  // Try to get thumbnail first
  const thumbnailUrl = await getSignedMediaUrl(thumbnailPath);
  if (thumbnailUrl) {
    return thumbnailUrl;
  }

  // Fallback to original image
  return getSignedMediaUrl(filePath);
}

/**
 * Upload a file to Supabase storage
 * @param file - File to upload
 * @param path - Storage path
 * @returns Promise<string | null> - File path or null if failed
 */
export async function uploadMediaFile(
  file: File | Blob,
  path: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

/**
 * Delete a file from Supabase storage
 * @param path - File path to delete
 * @returns Promise<boolean> - Success status
 */
export async function deleteMediaFile(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    // Remove from cache
    for (const key of urlCache.keys()) {
      if (key.startsWith(path)) {
        urlCache.delete(key);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Auto-cleanup expired URLs every 5 minutes
setInterval(clearExpiredUrls, 5 * 60 * 1000);
