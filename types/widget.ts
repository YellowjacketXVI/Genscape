export type WidgetSize = {
  width: 1 | 2 | 3; // Column spans (1/3, 2/3, or full width)
  height: 3; // Fixed height for uniform blocks
};

export type BaseWidget = {
  id: string;
  type: string;
  size: WidgetSize;
  position: number; // Vertical position in layout
  title?: string;
  mediaIds?: string[]; // IDs of media items assigned to this widget
  channel?: 'red' | 'green' | 'blue' | 'neutral'; // Channel for widget interactions
  isFeatured?: boolean; // Whether this widget is featured in the feed
  featuredCaption?: string; // Caption for featured widgets (max 300 chars)
};

export type MediaWidget = BaseWidget & {
  type: 'media';
  mediaType: 'image' | 'video';
  caption?: string;
  altText?: string;
};

export type GalleryWidget = BaseWidget & {
  type: 'gallery';
  layout: 'horizontal' | 'grid';
  items: Array<{
    id: string;
    mediaId: string;
    caption?: string;
    url?: string;
  }>;
};

export type ShopWidget = BaseWidget & {
  type: 'shop';
  layout: 'horizontal' | 'grid';
  products: Array<{
    id: string;
    mediaId: string;
    name: string;
    price: number;
    description?: string;
    available: boolean;
    imageUrl?: string;
  }>;
};

export type AudioWidget = BaseWidget & {
  type: 'audio';
  playerType: 'standard' | 'playlist';
  tracks: Array<{
    id: string;
    mediaId: string;
    title: string;
    artist: string;
    duration: number;
    audioUrl?: string;
  }>;
  currentTrack?: string;
};

export type AudioCaptionWidget = BaseWidget & {
  type: 'audio-caption';
  audioId: string;
  showTags: boolean;
};

export type CommsWidget = BaseWidget & {
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
};

export type ButtonWidget = BaseWidget & {
  type: 'button';
  targetChannel: 'red' | 'green' | 'blue';
  label: string;
  style: 'primary' | 'secondary' | 'accent';
};

export type TextWidget = BaseWidget & {
  type: 'text' | 'header';
  content: {
    header?: string;
    title?: string;
    body: string;
    tags?: string[];
  };
  style: 'normal' | 'highlight' | 'card';
  linkedMediaId?: string; // For header widgets that display media filename
};

export type LLMWidget = BaseWidget & {
  type: 'llm';
  prompt: string;
  model: string;
  systemMessage?: string;
};

export type Widget =
  | MediaWidget
  | GalleryWidget
  | ShopWidget
  | AudioWidget
  | AudioCaptionWidget
  | CommsWidget
  | ButtonWidget
  | TextWidget
  | LLMWidget;

export type WidgetLayout = {
  widgets: Widget[];
};