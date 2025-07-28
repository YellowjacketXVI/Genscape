import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = 'https://msinxqvqjzlappkumynm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaW54cXZxanpsYXBwa3VteW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzczOTcsImV4cCI6MjA2OTIxMzM5N30.KkQ140QXg9VxvwQMChBWlJVqRl03CEX_MexEnpNgH0s';

// Custom storage implementation that works across platforms
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    // Web fallback using localStorage
    return {
      getItem: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('localStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('localStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('localStorage removeItem error:', error);
        }
      },
    };
  }

  // Native platforms using SecureStore
  return {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.warn('SecureStore getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.warn('SecureStore setItem error:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.warn('SecureStore removeItem error:', error);
      }
    },
  };
};

const ExpoSecureStoreAdapter = createStorageAdapter();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          file_path: string;
          file_size: number | null;
          mime_type: string;
          media_type: 'image' | 'video' | 'audio';
          thumbnail_path: string | null;
          width: number | null;
          height: number | null;
          duration: number | null;
          tags: string[] | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          file_path: string;
          file_size?: number | null;
          mime_type: string;
          media_type: 'image' | 'video' | 'audio';
          thumbnail_path?: string | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          tags?: string[] | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          file_path?: string;
          file_size?: number | null;
          mime_type?: string;
          media_type?: 'image' | 'video' | 'audio';
          thumbnail_path?: string | null;
          width?: number | null;
          height?: number | null;
          duration?: number | null;
          tags?: string[] | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      scapes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          tagline: string | null;
          banner_image_id: string | null;
          banner_static: boolean;
          feature_widget_id: string | null;
          layout: string;
          tags: string[] | null;
          is_published: boolean;
          visibility: string;
          permissions: any;
          view_count: number;
          like_count: number;
          save_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          tagline?: string | null;
          banner_image_id?: string | null;
          banner_static?: boolean;
          feature_widget_id?: string | null;
          layout?: string;
          tags?: string[] | null;
          is_published?: boolean;
          visibility?: string;
          permissions?: any;
          view_count?: number;
          like_count?: number;
          save_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          tagline?: string | null;
          banner_image_id?: string | null;
          banner_static?: boolean;
          feature_widget_id?: string | null;
          layout?: string;
          tags?: string[] | null;
          is_published?: boolean;
          visibility?: string;
          permissions?: any;
          view_count?: number;
          like_count?: number;
          save_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      widgets: {
        Row: {
          id: string;
          scape_id: string;
          type: string;
          variant: string | null;
          channel: string | null;
          title: string | null;
          position: number;
          size_width: number;
          size_height: number;
          content: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scape_id: string;
          type: string;
          variant?: string | null;
          channel?: string | null;
          title?: string | null;
          position: number;
          size_width?: number;
          size_height?: number;
          content?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scape_id?: string;
          type?: string;
          variant?: string | null;
          channel?: string | null;
          title?: string | null;
          position?: number;
          size_width?: number;
          size_height?: number;
          content?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      widget_media: {
        Row: {
          id: string;
          widget_id: string;
          media_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          widget_id: string;
          media_id: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          widget_id?: string;
          media_id?: string;
          position?: number;
          created_at?: string;
        };
      };
    };
  };
}
