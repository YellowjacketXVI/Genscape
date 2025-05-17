import { useState, useCallback } from 'react';
import { Widget } from '@/types/widget';

type WidgetManagerHook = {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  moveWidgetUp: (index: number) => void;
  moveWidgetDown: (index: number) => void;
  reorderWidgets: (widgetIds: string[]) => void;
  setFeaturedWidget: (widgetId: string, caption?: string) => void;
  setWidgetChannel: (widgetId: string, channel: 'red' | 'green' | 'blue' | 'neutral') => void;
  getWidgetById: (widgetId: string) => Widget | undefined;
};

/**
 * Hook for managing widgets within a scape
 * 
 * Provides functions to add, remove, update, and reorder widgets
 */
export default function useWidgetManager(initialWidgets: Widget[] = []): WidgetManagerHook {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);

  /**
   * Add a new widget to the collection
   */
  const addWidget = useCallback((widget: Widget) => {
    setWidgets(currentWidgets => {
      // Ensure the widget has a position
      const newWidget = {
        ...widget,
        position: widget.position || currentWidgets.length + 1
      };
      return [...currentWidgets, newWidget];
    });
  }, []);

  /**
   * Remove a widget by ID
   */
  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(currentWidgets => {
      const filteredWidgets = currentWidgets.filter(w => w.id !== widgetId);
      
      // Update positions to ensure they remain sequential
      return filteredWidgets.map((widget, index) => ({
        ...widget,
        position: index + 1
      }));
    });
  }, []);

  /**
   * Update a widget with new properties
   */
  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>) => {
    setWidgets(currentWidgets => 
      currentWidgets.map(widget => 
        widget.id === widgetId 
          ? { ...widget, ...updates } 
          : widget
      )
    );
  }, []);

  /**
   * Move a widget up in the order (decrease position)
   */
  const moveWidgetUp = useCallback((index: number) => {
    if (index <= 0 || index >= widgets.length) return;
    
    setWidgets(currentWidgets => {
      const newWidgets = [...currentWidgets];
      // Swap the widget with the one above it
      [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
      
      // Update positions to reflect the new order
      return newWidgets.map((widget, idx) => ({
        ...widget,
        position: idx + 1
      }));
    });
  }, [widgets]);

  /**
   * Move a widget down in the order (increase position)
   */
  const moveWidgetDown = useCallback((index: number) => {
    if (index < 0 || index >= widgets.length - 1) return;
    
    setWidgets(currentWidgets => {
      const newWidgets = [...currentWidgets];
      // Swap the widget with the one below it
      [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
      
      // Update positions to reflect the new order
      return newWidgets.map((widget, idx) => ({
        ...widget,
        position: idx + 1
      }));
    });
  }, [widgets]);

  /**
   * Reorder widgets based on an array of widget IDs
   */
  const reorderWidgets = useCallback((widgetIds: string[]) => {
    setWidgets(currentWidgets => {
      // Create a map of widgets by ID for quick lookup
      const widgetMap = new Map(currentWidgets.map(widget => [widget.id, widget]));
      
      // Create a new array of widgets in the specified order
      const reorderedWidgets = widgetIds
        .map(id => widgetMap.get(id))
        .filter(widget => widget !== undefined) as Widget[];
      
      // Update positions to reflect the new order
      return reorderedWidgets.map((widget, idx) => ({
        ...widget,
        position: idx + 1
      }));
    });
  }, []);

  /**
   * Set a widget as featured (and unset any previously featured widget)
   */
  const setFeaturedWidget = useCallback((widgetId: string, caption?: string) => {
    setWidgets(currentWidgets => 
      currentWidgets.map(widget => ({
        ...widget,
        isFeatured: widget.id === widgetId,
        // Only update the caption if this is the widget being featured and a caption was provided
        featuredCaption: widget.id === widgetId 
          ? (caption !== undefined ? caption : widget.featuredCaption) 
          : widget.featuredCaption
      }))
    );
  }, []);

  /**
   * Set a widget's channel
   */
  const setWidgetChannel = useCallback((widgetId: string, channel: 'red' | 'green' | 'blue' | 'neutral') => {
    setWidgets(currentWidgets => 
      currentWidgets.map(widget => 
        widget.id === widgetId 
          ? { ...widget, channel } 
          : widget
      )
    );
  }, []);

  /**
   * Get a widget by ID
   */
  const getWidgetById = useCallback((widgetId: string) => {
    return widgets.find(widget => widget.id === widgetId);
  }, [widgets]);

  return {
    widgets,
    addWidget,
    removeWidget,
    updateWidget,
    moveWidgetUp,
    moveWidgetDown,
    reorderWidgets,
    setFeaturedWidget,
    setWidgetChannel,
    getWidgetById
  };
}
