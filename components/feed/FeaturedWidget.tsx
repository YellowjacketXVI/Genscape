import { useState } from 'react';

type FeaturedWidgetProps = {
  widget: {
    id: string;
    type: string;
    caption: string;
    mediaUrl: string;
    aspectRatio?: number;
  };
  isDesktop: boolean;
};

export default function FeaturedWidget({ widget, isDesktop }: FeaturedWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  // Determine aspect ratio for the widget
  const aspectRatio = widget.aspectRatio || 1; // Default to 1:1 if not specified

  // Render different widget types
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'media':
      case 'gallery':
        return (
          <>
            {!isLoaded && !hasError && (
              <div className="widget-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
            
            {hasError ? (
              <div className="widget-error">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Failed to load image</span>
              </div>
            ) : (
              <img
                src={widget.mediaUrl}
                alt={widget.caption}
                className={`widget-image ${isLoaded ? 'loaded' : ''}`}
                style={{ aspectRatio }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </>
        );
        
      case 'shop':
        return (
          <div className="shop-widget">
            <img
              src={widget.mediaUrl}
              alt={widget.caption}
              className={`widget-image ${isLoaded ? 'loaded' : ''}`}
              style={{ aspectRatio }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="shop-overlay">
              <svg className="shop-icon" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span>Shop Now</span>
            </div>
          </div>
        );
        
      case 'audio':
        return (
          <div className="audio-widget">
            <div className="audio-background" style={{ backgroundImage: `url(${widget.mediaUrl})` }}></div>
            <div className="audio-overlay">
              <svg className="audio-icon" viewBox="0 0 24 24">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              <span>Listen</span>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="default-widget">
            <span>{widget.type}</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={`featured-widget ${isDesktop ? 'desktop' : 'mobile'}`}
      style={{ aspectRatio }}
    >
      {renderWidgetContent()}
      
      {widget.caption && (
        <div className="widget-caption">
          <p>{widget.caption}</p>
        </div>
      )}
    </div>
  );
}
