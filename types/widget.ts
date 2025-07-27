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
};

export type HeroWidget = BaseWidget & {
  type: 'hero';
  headline: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
};

export type CarouselWidget = BaseWidget & {
  type: 'carousel';
  items: Array<{
    id: string;
    title: string;
    link?: string;
  }>;
};

export type ShopWidget = BaseWidget & {
  type: 'shop';
  products: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    available: boolean;
  }>;
};

export type AudioWidget = BaseWidget & {
  type: 'audio';
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    duration: number;
    url: string;
  }>;
  currentTrack?: string;
};

export type GalleryWidget = BaseWidget & {
  type: 'gallery';
  layout: 'grid' | 'masonry';
};

export type LiveWidget = BaseWidget & {
  type: 'live';
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  startTime?: string;
  endTime?: string;
  chat?: {
    enabled: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
  };
};

export type ButtonWidget = BaseWidget & {
  type: 'button';
  buttons: Array<{
    id: string;
    label: string;
    link: string;
    style: 'primary' | 'secondary' | 'accent';
  }>;
};

export type TextWidget = BaseWidget & {
  type: 'text';
  content: {
    header?: string;
    title?: string;
    body: string;
    tags?: string[];
  };
  style: 'normal' | 'highlight' | 'card';
};

export type Widget = 
  | HeroWidget 
  | CarouselWidget 
  | ShopWidget 
  | AudioWidget 
  | GalleryWidget 
  | LiveWidget 
  | ButtonWidget 
  | TextWidget;

export type WidgetLayout = {
  widgets: Widget[];
};