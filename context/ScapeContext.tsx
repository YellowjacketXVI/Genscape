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
  
  // Scape operations
  createScape: (scapeData: Partial<Scape>) => Promise<Scape>;
  updateScape: (id: string, scapeData: Partial<Scape>) => Promise<Scape | null>;
  deleteScape: (id: string) => Promise<boolean>;
  
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
  
  const [currentScape, setCurrentScape] = useState<Scape | null>(null);
  const [feedScapes, setFeedScapes] = useState<ScapePreview[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feedTab, setFeedTab] = useState<'explore' | 'followed' | 'shop'>('explore');
  
  // Load feed scapes when tab changes
  useEffect(() => {
    refreshFeed();
  }, [feedTab]);
  
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
  
  // Scape operations
  const createScape = async (scapeData: Partial<Scape>) => {
    const scape = await scapeService.createScape(scapeData);
    return scape;
  };
  
  const updateScape = async (id: string, scapeData: Partial<Scape>) => {
    const scape = await scapeService.updateScape(id, scapeData);
    if (scape && currentScape?.id === id) {
      setCurrentScape(scape);
    }
    return scape;
  };
  
  const deleteScape = async (id: string) => {
    const success = await scapeService.deleteScape(id);
    if (success && currentScape?.id === id) {
      setCurrentScape(null);
    }
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
      // Reorder widgets based on the new order
      const reorderedWidgets = [...currentScape.widgets];
      reorderedWidgets.sort((a, b) => {
        const aIndex = widgetIds.indexOf(a.id);
        const bIndex = widgetIds.indexOf(b.id);
        return aIndex - bIndex;
      });
      
      setCurrentScape({
        ...currentScape,
        widgets: reorderedWidgets,
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
    createScape,
    updateScape,
    deleteScape,
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
