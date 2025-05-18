import React from 'react';

export type ShopItem = {
  id: string;
  name: string;
  price: number | string;
  thumbnailUrl: string;
  altText?: string;
  available?: boolean;
};

export type ShopWidgetProps = {
  items: ShopItem[];
  onBuy?: (item: ShopItem) => void;
};

const ShopWidget: React.FC<ShopWidgetProps> = ({ items, onBuy }) => {
  const handleBuy = (item: ShopItem) => {
    if (onBuy) {
      onBuy(item);
    }
  };

  return (
    <div className="shop-widget-container">
      <div className="shop-widget-scroll">
        {items.map((item) => (
          <div key={item.id} className="shop-widget-item">
            <img
              src={item.thumbnailUrl}
              alt={item.altText || item.name}
              className="shop-widget-thumbnail"
            />
            <div className="shop-widget-details">
              <span className="shop-widget-name">{item.name}</span>
              <span className="shop-widget-price">
                {typeof item.price === 'number'
                  ? `$${item.price.toFixed(2)}`
                  : item.price}
              </span>
              <button
                className="shop-widget-buy"
                onClick={() => handleBuy(item)}
                disabled={item.available === false}
              >
                {item.available === false ? 'Sold Out' : 'Buy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopWidget;
