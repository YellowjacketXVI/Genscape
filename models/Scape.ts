import { Widget } from './Widget';

export interface Scape {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  bannerImage?: string;
  layout: string;
  widgets: Widget[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
    shares?: number;
  };
  permissions: {
    genGuard: boolean;
    datasetReuse: boolean;
    contentWarnings: {
      suggestive: boolean;
      political: boolean;
      violent: boolean;
      nudity: boolean;
    };
    visibility: 'public' | 'private' | 'unlisted';
    approvalType: 'auto' | 'manual';
    pricingModel: 'free' | 'paid10' | 'paid20' | 'paid30';
  }
}

// For use in the feed
export interface ScapePreview {
  id: string;
  name: string;
  description?: string;
  createdBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  featuredWidget?: {
    id: string;
    type: string;
    caption: string;
    mediaUrl: string;
    aspectRatio?: number;
  };
  isShoppable: boolean;
  isFollowing: boolean;
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  tags?: string[];
}
