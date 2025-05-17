import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Widget = {
  id: string;
  type: string;
  title: string;
  size: {
    width: 1 | 2 | 3;
    height: 3;
  };
  position: number;
  channel?: 'red' | 'green' | 'blue' | 'neutral';
  isFeatured?: boolean;
  featuredCaption?: string;
  mediaIds?: string[];
  content?: any;
};

type ContentWarnings = {
  suggestive: boolean;
  political: boolean;
  violent: boolean;
  nudity: boolean;
};

type ScapePermissions = {
  genGuard: boolean;
  datasetReuse: boolean;
  contentWarnings: ContentWarnings;
  visibility: 'public' | 'private' | 'unlisted';
  approvalType: 'auto' | 'manual';
  pricingModel: 'free' | 'paid10' | 'paid20' | 'paid30';
};

type Scape = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  bannerImage?: string;
  layout: string;
  widgets: Widget[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
    shares?: number;
  };
  permissions: ScapePermissions;
};

type ScapePreview = {
  id: string;
  name: string;
  description?: string;
  createdBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  featuredWidget?: {
    id: string;
    type: string;
    caption: string;
    mediaUrl: string;
    aspectRatio?: number;
  };
  isShoppable: boolean;
  isFollowing: boolean;
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  tags?: string[];
};

type ScapeContextType = {
  // Current scape being edited
  currentScape: Scape | null;
  setCurrentScape: (scape: Scape | null) => void;
  
  // Feed scapes
  feedScapes: ScapePreview[];
  feedLoading: boolean;
  feedTab: 'explore' | 'followed' | 'shop';
  setFeedTab: (tab: 'explore' | 'followed' | 'shop') => void;
  refreshFeed: () => Promise<void>;
  
  // User scapes
  userScapes: Scape[];
  userScapesLoading: boolean;
  userScapesTab: 'published' | 'drafts';
  setUserScapesTab: (tab: 'published' | 'drafts') => void;
  refreshUserScapes: () => Promise<void>;
  
  // Scape operations
  createScape: (scapeData: Partial<Scape>) => Promise<Scape>;
  updateScape: (id: string, scapeData: Partial<Scape>) => Promise<Scape | null>;
  deleteScape: (id: string) => Promise<boolean>;
  publishScape: (id: string) => Promise<boolean>;
  unpublishScape: (id: string) => Promise<boolean>;
  
  // Widget operations
  addWidget: (scapeId: string, widget: Partial<Widget>) => Promise<Widget | null>;
  updateWidget: (scapeId: string, widgetId: string, widgetData: Partial<Widget>) => Promise<Widget | null>;
  removeWidget: (scapeId: string, widgetId: string) => Promise<boolean>;
  reorderWidgets: (scapeId: string, widgetIds: string[]) => Promise<boolean>;
  setFeaturedWidget: (scapeId: string, widgetId: string, caption: string) => Promise<boolean>;
};

const ScapeContext = createContext<ScapeContextType | undefined>(undefined);

export function ScapeProvider({ children }: { children: ReactNode }) {
  const [currentScape, setCurrentScape] = useState<Scape | null>(null);
  
  // Feed state
  const [feedScapes, setFeedScapes] = useState<ScapePreview[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedTab, setFeedTab] = useState<'explore' | 'followed' | 'shop'>('explore');
  
  // User scapes state
  const [userScapes, setUserScapes] = useState<Scape[]>([]);
  const [userScapesLoading, setUserScapesLoading] = useState<boolean>(false);
  const [userScapesTab, setUserScapesTab] = useState<'published' | 'drafts'>('published');
  
  // Load feed scapes when tab changes
  useEffect(() => {
    refreshFeed();
  }, [feedTab]);
  
  // Load user scapes when tab changes
  useEffect(() => {
    refreshUserScapes();
  }, [userScapesTab]);
  
  const refreshFeed = async () => {
    setFeedLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/feed?tab=${feedTab}`);
      const data = await response.json();
      setFeedScapes(data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setFeedLoading(false);
    }
  };
  
  const refreshUserScapes = async () => {
    setUserScapesLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/me?status=${userScapesTab}`);
      const data = await response.json();
      setUserScapes(data);
    } catch (error) {
      console.error('Error loading user scapes:', error);
    } finally {
      setUserScapesLoading(false);
    }
  };
  
  // Scape operations
  const createScape = async (scapeData: Partial<Scape>) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/scapes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scapeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create scape');
      }
      
      const scape = await response.json();
      
      // Refresh user scapes
      refreshUserScapes();
      
      return scape;
    } catch (error) {
      console.error('Error creating scape:', error);
      throw error;
    }
  };
  
  const updateScape = async (id: string, scapeData: Partial<Scape>) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scapeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update scape');
      }
      
      const scape = await response.json();
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === id) {
        setCurrentScape(scape);
      }
      
      // Refresh user scapes
      refreshUserScapes();
      
      return scape;
    } catch (error) {
      console.error('Error updating scape:', error);
      throw error;
    }
  };
  
  const deleteScape = async (id: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete scape');
      }
      
      // Clear current scape if it's the one being deleted
      if (currentScape?.id === id) {
        setCurrentScape(null);
      }
      
      // Refresh user scapes
      refreshUserScapes();
      
      return true;
    } catch (error) {
      console.error('Error deleting scape:', error);
      return false;
    }
  };
  
  const publishScape = async (id: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${id}/publish`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish scape');
      }
      
      // Update current scape if it's the one being published
      if (currentScape?.id === id) {
        setCurrentScape({
          ...currentScape,
          isPublished: true,
        });
      }
      
      // Refresh user scapes
      refreshUserScapes();
      
      return true;
    } catch (error) {
      console.error('Error publishing scape:', error);
      return false;
    }
  };
  
  const unpublishScape = async (id: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${id}/unpublish`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to unpublish scape');
      }
      
      // Update current scape if it's the one being unpublished
      if (currentScape?.id === id) {
        setCurrentScape({
          ...currentScape,
          isPublished: false,
        });
      }
      
      // Refresh user scapes
      refreshUserScapes();
      
      return true;
    } catch (error) {
      console.error('Error unpublishing scape:', error);
      return false;
    }
  };
  
  // Widget operations
  const addWidget = async (scapeId: string, widget: Partial<Widget>) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${scapeId}/widgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widget),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add widget');
      }
      
      const newWidget = await response.json();
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === scapeId) {
        setCurrentScape({
          ...currentScape,
          widgets: [...currentScape.widgets, newWidget],
        });
      }
      
      return newWidget;
    } catch (error) {
      console.error('Error adding widget:', error);
      return null;
    }
  };
  
  const updateWidget = async (scapeId: string, widgetId: string, widgetData: Partial<Widget>) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${scapeId}/widgets/${widgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(widgetData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update widget');
      }
      
      const updatedWidget = await response.json();
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === scapeId) {
        setCurrentScape({
          ...currentScape,
          widgets: currentScape.widgets.map(w => 
            w.id === widgetId ? updatedWidget : w
          ),
        });
      }
      
      return updatedWidget;
    } catch (error) {
      console.error('Error updating widget:', error);
      return null;
    }
  };
  
  const removeWidget = async (scapeId: string, widgetId: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${scapeId}/widgets/${widgetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove widget');
      }
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === scapeId) {
        setCurrentScape({
          ...currentScape,
          widgets: currentScape.widgets.filter(w => w.id !== widgetId),
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error removing widget:', error);
      return false;
    }
  };
  
  const reorderWidgets = async (scapeId: string, widgetIds: string[]) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${scapeId}/widgets/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ widgetIds }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder widgets');
      }
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === scapeId) {
        // Create a map of position by widget ID
        const positionMap = widgetIds.reduce((map, id, index) => {
          map[id] = index + 1; // Position is 1-based
          return map;
        }, {});
        
        // Update widget positions
        setCurrentScape({
          ...currentScape,
          widgets: currentScape.widgets.map(w => ({
            ...w,
            position: positionMap[w.id] || w.position,
          })),
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering widgets:', error);
      return false;
    }
  };
  
  const setFeaturedWidget = async (scapeId: string, widgetId: string, caption: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/scapes/${scapeId}/featured-widget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ widgetId, caption }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set featured widget');
      }
      
      // Update current scape if it's the one being edited
      if (currentScape?.id === scapeId) {
        setCurrentScape({
          ...currentScape,
          widgets: currentScape.widgets.map(w => ({
            ...w,
            isFeatured: w.id === widgetId,
            featuredCaption: w.id === widgetId ? caption : w.featuredCaption,
          })),
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error setting featured widget:', error);
      return false;
    }
  };
  
  return (
    <ScapeContext.Provider
      value={{
        currentScape,
        setCurrentScape,
        feedScapes,
        feedLoading,
        feedTab,
        setFeedTab,
        refreshFeed,
        userScapes,
        userScapesLoading,
        userScapesTab,
        setUserScapesTab,
        refreshUserScapes,
        createScape,
        updateScape,
        deleteScape,
        publishScape,
        unpublishScape,
        addWidget,
        updateWidget,
        removeWidget,
        reorderWidgets,
        setFeaturedWidget,
      }}
    >
      {children}
    </ScapeContext.Provider>
  );
}

export function useScape() {
  const context = useContext(ScapeContext);
  if (context === undefined) {
    throw new Error('useScape must be used within a ScapeProvider');
  }
  return context;
}
