import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type ContentWarnings = {
  suggestive: boolean;
  political: boolean;
  violent: boolean;
  nudity: boolean;
};

type MediaPermissions = {
  genGuard: boolean;
  datasetReuse: boolean;
  contentWarnings: ContentWarnings;
};

type MediaItem = {
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
};

type ContentContextType = {
  mediaItems: MediaItem[];
  folders: any[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  selectedItem: MediaItem | null;
  setSelectedItem: (item: MediaItem | null) => void;
  fetchMedia: () => Promise<void>;
  uploadMedia: (file: File, metadata: Partial<MediaItem>) => Promise<MediaItem>;
  updateMedia: (id: string, data: Partial<MediaItem>) => Promise<MediaItem>;
  deleteMedia: (id: string) => Promise<void>;
  createFolder: (name: string) => Promise<any>;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [zoomLevel, setZoomLevel] = useState(75); // 25-100%
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Fetch media on mount
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API calls
      const mediaResponse = await fetch('/api/media');
      const mediaData = await mediaResponse.json();
      setMediaItems(mediaData);
      
      const foldersResponse = await fetch('/api/folders');
      const foldersData = await foldersResponse.json();
      setFolders(foldersData);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMedia = async (file: File, metadata: Partial<MediaItem>) => {
    setIsLoading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
      
      // Replace with actual API call
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const newMedia = await response.json();
      
      // Update local state
      setMediaItems([newMedia, ...mediaItems]);
      
      return newMedia;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedia = async (id: string, data: Partial<MediaItem>) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Update failed');
      }
      
      const updatedMedia = await response.json();
      
      // Update local state
      setMediaItems(mediaItems.map(item => 
        item.id === id ? updatedMedia : item
      ));
      
      // Update selected item if it's the one being updated
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(updatedMedia);
      }
      
      return updatedMedia;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      // Update local state
      setMediaItems(mediaItems.filter(item => item.id !== id));
      
      // Clear selected item if it's the one being deleted
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (name: string) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Folder creation failed');
      }
      
      const newFolder = await response.json();
      
      // Update local state
      setFolders([...folders, newFolder]);
      
      return newFolder;
    } catch (error) {
      console.error('Folder creation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        mediaItems,
        folders,
        isLoading,
        viewMode,
        setViewMode,
        zoomLevel,
        setZoomLevel,
        selectedItem,
        setSelectedItem,
        fetchMedia,
        uploadMedia,
        updateMedia,
        deleteMedia,
        createFolder,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
