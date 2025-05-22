import { useState, useEffect } from 'react';
import { getTestUserMediaById } from '@/utils/mediaAssets';

type Product = {
  id: string;
  mediaId: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
  imageUrl?: string; // Added for convenience after fetching
};

type ShopWidgetProps = {
  widget: {
    id: string;
    type: 'shop';
    title: string;
    layout: 'horizontal' | 'grid';
    products: Product[];
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
  onMediaSelect?: () => void;
};

export default function ShopWidget({ 
  widget, 
  isEditing, 
  onUpdate, 
  onMediaSelect 
}: ShopWidgetProps) {
  const [products, setProducts] = useState<Product[]>(widget.products || []);
  const [layout, setLayout] = useState<'horizontal' | 'grid'>(widget.layout || 'grid');
  const [loading, setLoading] = useState(false);

  // Fetch product data when products change
  useEffect(() => {
    const fetchProductData = async () => {
      if (!widget.products || widget.products.length === 0) {
        setProducts([]);
        return;
      }
      
      setLoading(true);
      
      try {
        const updatedProducts = widget.products.map((product) => {
          if (!product.mediaId) {
            return { ...product, imageUrl: undefined };
          }

          try {
            const media = getTestUserMediaById(product.mediaId);
            return {
              ...product,
              imageUrl: media ? media.url : undefined,
            };
          } catch (error) {
            console.error(`Error fetching media for product ${product.id}:`, error);
            return { ...product, imageUrl: undefined };
          }
        });
        
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [widget.products]);

  const handleLayoutChange = (newLayout: 'horizontal' | 'grid') => {
    setLayout(newLayout);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        layout: newLayout,
      });
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        products: updatedProducts,
      });
    }
  };

  const handleProductChange = (productId: string, field: string, value: any) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          [field]: value,
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        products: updatedProducts,
      });
    }
  };

  const handleAddProduct = () => {
    if (onMediaSelect) {
      onMediaSelect();
      // The actual product would be added after media selection
      // This would be handled by the parent component
    }
  };

  if (isEditing) {
    return (
      <div className={`shop-widget editing ${widget.size.width === 2 ? 'medium' : widget.size.width === 3 ? 'large' : 'small'}`}>
        <div className="widget-edit-header">
          <h4>Edit Shop Widget</h4>
          
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
          <div className="products-list">
            {products.length > 0 ? (
              <div className={`products-edit-${layout}`}>
                {products.map((product) => (
                  <div key={product.id} className="product-item-edit">
                    <div className="product-preview">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="product-image" 
                        />
                      ) : (
                        <div className="product-placeholder">
                          <span>No image</span>
                        </div>
                      )}
                      
                      <button 
                        className="remove-product-button" 
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        &times;
                      </button>
                    </div>
                    
                    <input 
                      type="text" 
                      value={product.name} 
                      onChange={(e) => handleProductChange(product.id, 'name', e.target.value)} 
                      placeholder="Product Name" 
                      className="product-name-input" 
                    />
                    
                    <div className="product-price-container">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        value={product.price} 
                        onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value))} 
                        placeholder="Price" 
                        className="product-price-input" 
                        min="0" 
                        step="0.01" 
                      />
                    </div>
                    
                    <textarea 
                      value={product.description || ''} 
                      onChange={(e) => handleProductChange(product.id, 'description', e.target.value)} 
                      placeholder="Description" 
                      className="product-description-input" 
                    />
                    
                    <label className="availability-label">
                      <input 
                        type="checkbox" 
                        checked={product.available} 
                        onChange={(e) => handleProductChange(product.id, 'available', e.target.checked)} 
                      />
                      Available
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <span>No products added yet</span>
              </div>
            )}
          </div>
          
          <button 
            className="add-product-button" 
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={`shop-widget ${widget.size.width === 2 ? 'medium' : widget.size.width === 3 ? 'large' : 'small'}`}>
      {products.length > 0 ? (
        <div className={`products-${layout}`}>
          {products.map((product) => (
            <div key={product.id} className={`product-item ${!product.available ? 'unavailable' : ''}`}>
              <div className="product-image-container">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-image" 
                  />
                ) : (
                  <div className="product-placeholder">
                    <span>Image not available</span>
                  </div>
                )}
                
                {!product.available && (
                  <div className="sold-out-badge">
                    <span>Sold Out</span>
                  </div>
                )}
              </div>
              
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                
                <button 
                  className="buy-button" 
                  disabled={!product.available}
                >
                  {product.available ? 'Add to Cart' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-shop">
          <svg className="empty-icon" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
          <span>No products available</span>
        </div>
      )}
    </div>
  );
}
