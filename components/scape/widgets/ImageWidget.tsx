import { useState, useEffect } from 'react';
import { getMediaById } from '@/data/localMedia';

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
  const [editCaption, setEditCaption] = useState(widget.caption || '');
  const [editAltText, setEditAltText] = useState(widget.altText || '');

  // Fetch media data when mediaIds change
  useEffect(() => {
    const fetchMedia = () => {
      if (!widget.mediaIds || widget.mediaIds.length === 0) {
        setMedia(null);
        return;
      }

      const data = getMediaById(widget.mediaIds[0]);
      if (data) {
        setMedia(data);
        setHasError(false);
      } else {
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

  const handleCaptionChange = (value: string) => {
    setEditCaption(value);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        caption: value,
      });
    }
  };

  const handleAltTextChange = (value: string) => {
    setEditAltText(value);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        altText: value,
      });
    }
  };

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
                alt={editAltText || 'Preview'} 
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
          
          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <input 
              type="text" 
              id="caption" 
              value={editCaption} 
              onChange={(e) => handleCaptionChange(e.target.value)} 
              placeholder="Add a caption" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="altText">Alt Text (for accessibility)</label>
            <input 
              type="text" 
              id="altText" 
              value={editAltText} 
              onChange={(e) => handleAltTextChange(e.target.value)} 
              placeholder="Describe the image for screen readers" 
            />
          </div>
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
          <img 
            src={media.url} 
            alt={widget.altText || widget.caption || 'Image'} 
            className={`widget-image ${isLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {widget.caption && (
            <div className="widget-caption">
              <p>{widget.caption}</p>
            </div>
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
