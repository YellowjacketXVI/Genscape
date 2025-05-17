export type Widget = {
  id: string;
  type: string; // 'media' | 'audio' | 'shop' | 'text' | 'gallery' | 'chat' | 'button' | 'llm' | etc.
  title: string;
  size: {
    width: number; // 1, 2, or 3 (small, medium, large)
    height: number; // Usually 3
  };
  position: number; // Vertical position in the layout
  content?: any; // This would contain the widget's specific content
  channel?: 'red' | 'green' | 'blue' | 'neutral'; // For linking widgets together
  isFeatured?: boolean; // Whether this widget is featured in the feed
  featuredCaption?: string; // Caption for featured widgets (max 300 chars)
  mediaIds?: string[]; // IDs of media items assigned to this widget
};

export type Scape = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  bannerImage?: string;
  layout: string;
  widgets: Widget[];
  isPublished: boolean;
  permissions: {
    genGuard: boolean;
    datasetReuse: boolean;
    contentWarnings: {
      suggestive: boolean;
      political: boolean;
      violent: boolean;
      nudity: boolean;
    };
    visibility: string; // 'public' | 'private'
    approvalType: string; // 'auto' | 'manual'
    pricingModel: string; // 'free' | 'paid10' | 'paid20' | 'paid30'
  }
};