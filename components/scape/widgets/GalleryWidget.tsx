import { useState, useEffect } from 'react';

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
    const fetchMediaItems = async () => {
      if (!widget.items || widget.items.length === 0) {
        return;
      }
      
      setLoading(true);
      
      try {
        // Create a copy of items to update with URLs
        const updatedItems = [...widget.items];
        
        // Fetch each media item
        for (let i = 0; i < updatedItems.length; i++) {
          const item = updatedItems[i];
          
          // Skip if no mediaId
          if (!item.mediaId) continue;
          
          // Replace with actual API call
          const response = await fetch(`/api/media/${item.mediaId}`);
          const data = await response.json();
          
          // Update item with URL
          updatedItems[i] = {
            ...item,
            url: data.url,
          };
        }
        
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
      <div className="gallery-widget editing">
        <div className="widget-edit-header">
          <h4>Edit Gallery Widget</h4>
          
          <div className="layout-selector">
            <button 
              className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('grid')}
            >
              Grid
            </button>
            <button 
              className={`layout-button ${layout === 'horizontal' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('horizontal')}
            >
              Horizontal
            </button>
          </div>
        </div>
        
        <div className="widget-edit-content">
          <div className="gallery-items">
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
              <div className="empty-gallery">
                <p>No items in gallery</p>
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
    <div className="gallery-widget">
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
  );
}
