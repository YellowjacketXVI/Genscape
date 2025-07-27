export type Widget = {
  id: string;
  type: string; // 'media' | 'audio' | 'shop' | 'text' | 'gallery' | 'chat'
  title: string;
  size: string; // 'small' | 'medium' | 'large'
  content?: any; // This would contain the widget's specific content
  channel?: string; // For linking widgets together
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