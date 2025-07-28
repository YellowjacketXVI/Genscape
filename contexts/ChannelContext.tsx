import React, { createContext, useContext, useState, useCallback } from 'react';
import { ChannelState, ChannelContextType, ChannelColor } from '@/types/scape-editor';

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ChannelState>({
    red: { drivingWidgetId: null, drivingMediaId: null },
    green: { drivingWidgetId: null, drivingMediaId: null },
    blue: { drivingWidgetId: null, drivingMediaId: null },
  });

  const setDrivingMedia = useCallback((
    channel: ChannelColor,
    widgetId: string,
    mediaId: string
  ) => {
    if (channel === 'neutral') return;
    
    setState(prev => ({
      ...prev,
      [channel]: {
        drivingWidgetId: widgetId,
        drivingMediaId: mediaId,
      },
    }));
  }, []);

  const clearChannel = useCallback((channel: ChannelColor) => {
    if (channel === 'neutral') return;
    
    setState(prev => ({
      ...prev,
      [channel]: {
        drivingWidgetId: null,
        drivingMediaId: null,
      },
    }));
  }, []);

  const getActiveChannel = useCallback((): ChannelColor | null => {
    // Return the first channel that has an active driving widget
    for (const channel of ['red', 'green', 'blue'] as const) {
      if (state[channel].drivingWidgetId) {
        return channel;
      }
    }
    return null;
  }, [state]);

  const value: ChannelContextType = {
    state,
    setDrivingMedia,
    clearChannel,
    getActiveChannel,
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel() {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
}

// Utility hook for widgets to subscribe to their channel
export function useWidgetChannel(widgetId: string, channel: ChannelColor | null) {
  const { state, setDrivingMedia } = useChannel();
  
  const channelState = channel && channel !== 'neutral' ? state[channel] : null;
  const isActive = channelState?.drivingWidgetId === widgetId;
  const activeDrivingMedia = channelState?.drivingMediaId || null;
  
  const setAsActive = useCallback((mediaId: string) => {
    if (channel && channel !== 'neutral') {
      setDrivingMedia(channel, widgetId, mediaId);
    }
  }, [channel, widgetId, setDrivingMedia]);
  
  return {
    isActive,
    activeDrivingMedia,
    setAsActive,
    channelState,
  };
}
