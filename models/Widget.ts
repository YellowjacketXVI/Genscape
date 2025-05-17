export type WidgetSize = {
  width: 1 | 2 | 3; // Column spans (1=small, 2=medium, 3=large)
  height: 3; // Fixed height for uniform blocks
};

export type WidgetChannel = 'red' | 'green' | 'blue' | 'neutral';

export interface BaseWidget {
  id: string;
  type: string;
  title: string;
  size: WidgetSize;
  position: number; // Vertical position in layout
  channel?: WidgetChannel; // Channel for widget interactions
  isFeatured?: boolean; // Whether this widget is featured in the feed
  featuredCaption?: string; // Caption for featured widgets (max 300 chars)
  mediaIds?: string[]; // IDs of media items assigned to this widget
}

export interface MediaWidget extends BaseWidget {
  type: 'media';
  mediaType: 'image' | 'video';
  caption?: string;
  altText?: string;
}

export interface GalleryWidget extends BaseWidget {
  type: 'gallery';
  layout: 'horizontal' | 'grid';
  items: Array<{
    id: string;
    mediaId: string;
    caption?: string;
  }>;
}

export interface ShopWidget extends BaseWidget {
  type: 'shop';
  layout: 'horizontal' | 'grid';
  products: Array<{
    id: string;
    mediaId: string;
    name: string;
    price: number;
    description?: string;
    available: boolean;
  }>;
}

export interface AudioWidget extends BaseWidget {
  type: 'audio';
  playerType: 'standard' | 'playlist';
  tracks: Array<{
    id: string;
    mediaId: string;
    title: string;
    artist: string;
    duration: number;
  }>;
  currentTrack?: string;
}

export interface TextWidget extends BaseWidget {
  type: 'text' | 'header';
  content: {
    header?: string;
    title?: string;
    body: string;
    tags?: string[];
  };
  style: 'normal' | 'highlight' | 'card';
  linkedMediaId?: string; // For header widgets that display media filename
}

export interface ButtonWidget extends BaseWidget {
  type: 'button';
  targetChannel: WidgetChannel;
  label: string;
  style: 'primary' | 'secondary' | 'accent';
}

export interface CommsWidget extends BaseWidget {
  type: 'chat' | 'comments' | 'live';
  streamUrl?: string;
  isLive?: boolean;
  viewerCount?: number;
  startTime?: string;
  endTime?: string;
  settings: {
    enabled: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
  };
}

export interface LLMWidget extends BaseWidget {
  type: 'llm';
  prompt: string;
  model: string;
  systemMessage?: string;
}

export type Widget =
  | MediaWidget
  | GalleryWidget
  | ShopWidget
  | AudioWidget
  | TextWidget
  | ButtonWidget
  | CommsWidget
  | LLMWidget;

// Helper functions for widgets
export const getWidgetSizeName = (size: WidgetSize): string => {
  if (size.width === 1) return 'Small';
  if (size.width === 2) return 'Medium';
  return 'Large';
};

export const getNextWidgetSize = (currentSize: WidgetSize): WidgetSize => {
  // Cycle through sizes: Small (1) -> Medium (2) -> Large (3) -> Small (1)
  const newWidth = currentSize.width === 3 ? 1 : currentSize.width + 1;
  return { width: newWidth as 1 | 2 | 3, height: 3 };
};
