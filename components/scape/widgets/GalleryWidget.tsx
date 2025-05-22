import { useState, useEffect } from 'react';
import { getTestUserMediaById } from '@/utils/mediaAssets';

type GalleryItem = {
  id: string;
  mediaId: string;
  caption?: string;
  url?: string; // Added for convenience after fetching
};

type GalleryWidgetProps = {
  widget: {
    id: string;
    type: 'gallery';
    title: string;
    layout: 'horizontal' | 'grid';
    items: GalleryItem[];
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
  onMediaSelect?: () => void;
};

export default function GalleryWidget({ 
  widget, 
  isEditing, 
  onUpdate, 
  onMediaSelect 
}: GalleryWidgetProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(widget.items || []);
  const [layout, setLayout] = useState<'horizontal' | 'grid'>(widget.layout || 'grid');
  const [loading, setLoading] = useState(false);

  // Fetch media data for all items
  useEffect(() => {
    const fetchMediaItems = () => {
      if (!widget.items || widget.items.length === 0) {
        return;
      }

      setLoading(true);

      try {
        const updatedItems = widget.items.map((item) => {
          if (!item.mediaId) return item;
          const media = getTestUserMediaById(item.mediaId);
          return {
            ...item,
            url: media ? media.url : undefined,
          };
        });

        setGalleryItems(updatedItems);
      } catch (error) {
        console.error('Error fetching gallery media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, [widget.items]);

  const handleLayoutChange = (newLayout: 'horizontal' | 'grid') => {
    setLayout(newLayout);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        layout: newLayout,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = galleryItems.filter(item => item.id !== itemId);
    setGalleryItems(updatedItems);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        items: updatedItems,
      });
    }
  };

  const handleCaptionChange = (itemId: string, caption: string) => {
    const updatedItems = galleryItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          caption,
        };
      }
      return item;
    });
    
    setGalleryItems(updatedItems);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        items: updatedItems,
      });
    }
  };

  if (isEditing) {
    return (
      <div className={`gallery-widget editing ${widget.size.width === 2 ? 'medium' : widget.size.width === 3 ? 'large' : 'small'}`}>
        <div className="widget-edit-header">

          <div className="layout-selector">
            <button
              className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('grid')}
              aria-label="Grid Layout"
            />
            <button
              className={`layout-button ${layout === 'horizontal' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('horizontal')}
              aria-label="Horizontal Layout"
            />
          </div>
        </div>
        
        <div className="widget-edit-content">
          <div className="gallery-scroll">
            {galleryItems.length > 0 ? (
              <div className={`gallery-edit-${layout}`}>
                {galleryItems.map((item) => (
                  <div key={item.id} className="gallery-item-edit">
                    <div className="item-preview">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.caption || 'Gallery item'}
                          className="item-image"
                        />
                      ) : (
                        <div className="item-placeholder">
                          <span>Loading...</span>
                        </div>
                      )}

                      <button
                        className="remove-item-button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        &times;
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.caption || ''}
                      onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                      placeholder="Caption"
                      className="item-caption-input"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`gallery-edit-${layout}`}>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="gallery-item-edit placeholder">
                    <div className="item-preview">
                      <div className="item-placeholder" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="add-media-button" 
            onClick={onMediaSelect}
          >
            Add Media
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="gallery-widget loading">
        <div className="loading-spinner"></div>
        <span>Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className={`gallery-widget ${widget.size.width === 2 ? 'medium' : widget.size.width === 3 ? 'large' : 'small'}`}>
      <div className="gallery-scroll">
        {galleryItems.length > 0 ? (
          <div className={`gallery-${layout}`}>
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.caption || 'Gallery item'}
                    className="item-image"
                  />
                ) : (
                  <div className="item-placeholder">
                    <span>Image not available</span>
                  </div>
                )}

                {item.caption && (
                  <div className="item-caption">
                    <p>{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-gallery">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>No images in gallery</span>
          </div>
        )}
      </div>
    </div>
  );
}
