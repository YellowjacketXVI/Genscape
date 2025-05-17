import { useEffect } from 'react';

type SlidePanelProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  size?: 'small' | 'medium' | 'large';
};

export default function SlidePanel({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  position = 'right',
  size = 'medium'
}: SlidePanelProps) {
  // Prevent body scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine panel size class
  const sizeClass = `panel-${size}`;
  
  // Determine panel position class
  const positionClass = `panel-${position}`;

  return (
    <div className="slide-panel-overlay" onClick={onClose}>
      <div 
        className={`slide-panel ${positionClass} ${sizeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h2 className="panel-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="panel-content">
          {children}
        </div>
      </div>
    </div>
  );
}
