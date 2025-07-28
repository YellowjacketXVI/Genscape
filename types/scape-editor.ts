export type ChannelColor = 'red' | 'green' | 'blue' | 'neutral';

export interface ChannelState {
  red: { 
    drivingWidgetId: string | null; 
    drivingMediaId: string | null; 
  };
  green: { 
    drivingWidgetId: string | null; 
    drivingMediaId: string | null; 
  };
  blue: { 
    drivingWidgetId: string | null; 
    drivingMediaId: string | null; 
  };
}

export interface ScapeEditorWidget {
  id: string;
  type: WidgetType;
  variant: string;
  channel: ChannelColor | null;
  data: Record<string, any>;
  position: number;
}

export interface ScapeEditorState {
  id: string;
  title: string;
  description?: string;
  banner: string | null;
  bannerStatic: boolean;
  widgets: ScapeEditorWidget[];
  featureWidgetId: string | null;
  tagline: string;
  isDraft: boolean;
  visibility: 'public' | 'private';
}

export type WidgetType = 
  | 'text' 
  | 'image' 
  | 'audio' 
  | 'gallery' 
  | 'live' 
  | 'shop' 
  | 'llm' 
  | 'button';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetVariant {
  id: string;
  size: WidgetSize;
  name: string;
  description: string;
  previewComponent: React.ComponentType<{ variant: WidgetVariant }>;
  defaultData: Record<string, any>;
}

export interface WidgetCategory {
  id: WidgetType;
  name: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  variants: WidgetVariant[];
}

export interface ChannelContextType {
  state: ChannelState;
  setDrivingMedia: (
    channel: ChannelColor, 
    widgetId: string, 
    mediaId: string
  ) => void;
  clearChannel: (channel: ChannelColor) => void;
  getActiveChannel: () => ChannelColor | null;
}

export interface ContentManagerPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (mediaIds: string[]) => void;
  allowMultiple?: boolean;
  mediaType?: 'image' | 'video' | 'audio' | 'all';
}

export interface ScapeValidationResult {
  isValid: boolean;
  errors: string[];
  canSaveDraft: boolean;
  canPublish: boolean;
}

// Widget hierarchy for channel priority
export const WIDGET_HIERARCHY: Record<WidgetType, number> = {
  button: 1,
  live: 1,
  gallery: 2,
  image: 3,
  audio: 3,
  text: 4,
  shop: 5,
  llm: 6,
};

export interface WidgetEditorProps {
  widget: ScapeEditorWidget;
  onUpdate: (widget: ScapeEditorWidget) => void;
  onClose: () => void;
  isVisible: boolean;
}
