import { useState, useEffect } from 'react';
import { getTestUserMediaById } from '@/utils/mediaAssets';

type ImageWidgetProps = {
  widget: {
    id: string;
    type: 'media';
    title: string;
    mediaType?: 'image' | 'video';
    mediaIds?: string[];
    caption?: string;
    altText?: string;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
  onMediaSelect?: () => void;
};

export default function ImageWidget({ 
  widget, 
  isEditing, 
  onUpdate, 
  onMediaSelect 
}: ImageWidgetProps) {
  const [media, setMedia] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // Media widgets are simplified: no caption or alt text display

  // Fetch media data when mediaIds change
  useEffect(() => {
    const fetchMedia = () => {
      if (!widget.mediaIds || widget.mediaIds.length === 0) {
        setMedia(null);
        return;
      }

      try {
        const data = getTestUserMediaById(widget.mediaIds[0]);
        setMedia(data);
        setHasError(!data);
      } catch (error) {
        console.error('Error fetching media:', error);
        setHasError(true);
      }
    };

    fetchMedia();
  }, [widget.mediaIds]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  // Caption and alt text editing have been removed

  if (isEditing) {
    return (
      <div className="image-widget editing">
        <div className="widget-edit-header">
          <h4>Edit Image Widget</h4>
        </div>
        
        <div className="widget-edit-content">
          <div className="media-preview" onClick={onMediaSelect}>
            {media ? (
              <img
                src={media.url}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <div className="empty-media">
                <svg className="media-icon" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Click to select an image</span>
              </div>
            )}
          </div>
          
          {/* Media widgets have no caption or alt text */}
        </div>
      </div>
    );
  }

  return (
    <div className="image-widget">
      {!isLoaded && !hasError && media && (
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="error-placeholder">
          <svg className="error-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Failed to load image</span>
        </div>
      ) : media ? (
        <>
          {media.type === 'video' ? (
            <video
              src={media.url}
              className="widget-video"
              controls
              onLoadedData={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <img
              src={media.url}
              alt="Media"
              className={`widget-image ${isLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </>
      ) : (
        <div className="empty-widget">
          <svg className="empty-icon" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>No image selected</span>
        </div>
      )}
    </div>
  );
}
