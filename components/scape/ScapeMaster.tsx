import { useState, useEffect } from 'react';
import ScapeView from './ScapeView';
import UnifiedScapeEditor from './UnifiedScapeEditor';

type Widget = {
  id: string;
  type: string;
  title: string;
  size: {
    width: 1 | 2 | 3;
    height: 3;
  };
  position: number;
  channel?: 'red' | 'green' | 'blue' | 'neutral';
  isFeatured?: boolean;
  featuredCaption?: string;
  mediaIds?: string[];
  content?: any;
};

type Scape = {
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
};

type ScapeMasterProps = {
  scape: Scape;
  isEditing?: boolean;
  onSave?: (updatedScape: Scape) => void;
  onCancel?: () => void;
};

export default function ScapeMaster({
  scape,
  isEditing = false,
  onSave,
  onCancel
}: ScapeMasterProps) {
  const [editMode, setEditMode] = useState(isEditing);
  const [currentScape, setCurrentScape] = useState<Scape>(scape);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop or mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update current scape when prop changes
  useEffect(() => {
    setCurrentScape(scape);
  }, [scape]);

  // Update edit mode when prop changes
  useEffect(() => {
    setEditMode(isEditing);
  }, [isEditing]);

  const handleSave = (updatedScape: Scape) => {
    if (onSave) {
      onSave(updatedScape);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset to original scape
    setCurrentScape(scape);

    if (onCancel) {
      onCancel();
    }
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className={`scape-master ${isDesktop ? 'desktop' : 'mobile'}`}>
      {editMode ? (
        <UnifiedScapeEditor
          scape={currentScape}
          onSave={handleSave}
          onCancel={handleCancel}
          isDesktop={isDesktop}
        />
      ) : (
        <ScapeView
          scape={currentScape}
          onEdit={toggleEditMode}
          isDesktop={isDesktop}
        />
      )}
    </div>
  );
}
