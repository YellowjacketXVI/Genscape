export type MediaType = 'image' | 'video' | 'audio';

export interface MediaItem {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_size: number | null;
  mime_type: string;
  media_type: MediaType;
  thumbnail_path: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  tags: string[] | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Computed fields
  url?: string;
  thumbnail_url?: string;
}

export interface MediaUploadData {
  name: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface MediaUploadResult {
  media_item: MediaItem;
  url: string;
}

export interface MediaFilter {
  media_type?: MediaType;
  is_public?: boolean;
  tags?: string[];
  search?: string;
  user_id?: string;
}

export interface MediaSort {
  field: 'created_at' | 'updated_at' | 'name' | 'file_size';
  direction: 'asc' | 'desc';
}

export interface MediaGridProps {
  items: MediaItem[];
  onItemSelect?: (item: MediaItem) => void;
  onItemDelete?: (item: MediaItem) => void;
  selectable?: boolean;
  selectedItems?: string[];
  loading?: boolean;
}

export interface MediaUploadProps {
  onUploadComplete?: (item: MediaItem) => void;
  onUploadError?: (error: string) => void;
  allowedTypes?: MediaType[];
  maxFileSize?: number;
}

export interface MediaPreviewProps {
  item: MediaItem;
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: (updates: Partial<MediaItem>) => void;
}
