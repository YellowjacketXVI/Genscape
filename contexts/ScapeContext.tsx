import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Scape, ScapePreview } from '../models/Scape';
import { Widget, BaseWidget } from '../models/Widget';
import { ScapeService } from '../services/ScapeService';

interface ScapeContextType {
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
  addWidget: (scapeId: string, widget: Partial<BaseWidget>) => Promise<Widget | null>;
  updateWidget: (scapeId: string, widgetId: string, widgetData: Partial<BaseWidget>) => Promise<Widget | null>;
  removeWidget: (scapeId: string, widgetId: string) => Promise<boolean>;
  reorderWidgets: (scapeId: string, widgetIds: string[]) => Promise<boolean>;
  setFeaturedWidget: (scapeId: string, widgetId: string, caption: string) => Promise<boolean>;
}

const ScapeContext = createContext<ScapeContextType | undefined>(undefined);

export function ScapeProvider({ children }: { children: ReactNode }) {
  const scapeService = new ScapeService();

  // State for current scape being edited
  const [currentScape, setCurrentScape] = useState<Scape | null>(null);

  // State for feed scapes
  const [feedScapes, setFeedScapes] = useState<ScapePreview[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedTab, setFeedTab] = useState<'explore' | 'followed' | 'shop'>('explore');

  // State for user scapes
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

  // Fetch feed scapes
  const refreshFeed = async () => {
    setFeedLoading(true);
    try {
      const scapes = await scapeService.getScapesForFeed({ tab: feedTab });
      setFeedScapes(scapes);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setFeedLoading(false);
    }
  };

  // Fetch user scapes
  const refreshUserScapes = async () => {
    setUserScapesLoading(true);
    try {
      const scapes = await scapeService.getUserScapes({
        isPublished: userScapesTab === 'published'
      });
      setUserScapes(scapes);
    } catch (error) {
      console.error('Error loading user scapes:', error);
    } finally {
      setUserScapesLoading(false);
    }
  };

  // Scape operations
  const createScape = async (scapeData: Partial<Scape>) => {
    const scape = await scapeService.createScape(scapeData);
    await refreshUserScapes();
    return scape;
  };

  const updateScape = async (id: string, scapeData: Partial<Scape>) => {
    const scape = await scapeService.updateScape(id, scapeData);
    if (scape && currentScape?.id === id) {
      setCurrentScape(scape);
    }
    await refreshUserScapes();
    return scape;
  };

  const deleteScape = async (id: string) => {
    const success = await scapeService.deleteScape(id);
    if (success && currentScape?.id === id) {
      setCurrentScape(null);
    }
    await refreshUserScapes();
    return success;
  };

  const publishScape = async (id: string) => {
    const success = await scapeService.publishScape(id);
    if (success && currentScape?.id === id) {
      setCurrentScape({
        ...currentScape,
        isPublished: true
      });
    }
    await refreshUserScapes();
    return success;
  };

  const unpublishScape = async (id: string) => {
    const success = await scapeService.unpublishScape(id);
    if (success && currentScape?.id === id) {
      setCurrentScape({
        ...currentScape,
        isPublished: false
      });
    }
    await refreshUserScapes();
    return success;
  };

  // Widget operations
  const addWidget = async (scapeId: string, widget: Partial<BaseWidget>) => {
    const newWidget = await scapeService.addWidget(scapeId, widget);
    if (newWidget && currentScape?.id === scapeId) {
      setCurrentScape({
        ...currentScape,
        widgets: [...currentScape.widgets, newWidget],
      });
    }
    return newWidget;
  };

  const updateWidget = async (scapeId: string, widgetId: string, widgetData: Partial<BaseWidget>) => {
    const updatedWidget = await scapeService.updateWidget(scapeId, widgetId, widgetData);
    if (updatedWidget && currentScape?.id === scapeId) {
      setCurrentScape({
        ...currentScape,
        widgets: currentScape.widgets.map(w =>
          w.id === widgetId ? updatedWidget : w
        ),
      });
    }
    return updatedWidget;
  };

  const removeWidget = async (scapeId: string, widgetId: string) => {
    const success = await scapeService.removeWidget(scapeId, widgetId);
    if (success && currentScape?.id === scapeId) {
      setCurrentScape({
        ...currentScape,
        widgets: currentScape.widgets.filter(w => w.id !== widgetId),
      });
    }
    return success;
  };

  const reorderWidgets = async (scapeId: string, widgetIds: string[]) => {
    const success = await scapeService.reorderWidgets(scapeId, widgetIds);
    if (success && currentScape?.id === scapeId) {
      // Create a map for quick lookup of position by widget ID
      const positionMap = new Map(
        widgetIds.map((id, index) => [id, index + 1])
      );

      // Update the positions of widgets in the current scape
      setCurrentScape({
        ...currentScape,
        widgets: currentScape.widgets.map(w => ({
          ...w,
          position: positionMap.get(w.id) || w.position,
        })).sort((a, b) => a.position - b.position),
      });
    }
    return success;
  };

  const setFeaturedWidget = async (scapeId: string, widgetId: string, caption: string) => {
    const success = await scapeService.setFeaturedWidget(scapeId, widgetId, caption);
    if (success && currentScape?.id === scapeId) {
      setCurrentScape({
        ...currentScape,
        widgets: currentScape.widgets.map(w => ({
          ...w,
          isFeatured: w.id === widgetId,
          featuredCaption: w.id === widgetId ? caption : w.featuredCaption,
        })),
      });
    }
    return success;
  };

  const value = {
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
  };

  return (
    <ScapeContext.Provider value={value}>
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
