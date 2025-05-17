import { useState } from 'react';

type TextWidgetProps = {
  widget: {
    id: string;
    type: 'text' | 'header';
    title: string;
    content?: {
      header?: string;
      title?: string;
      body: string;
      tags?: string[];
    };
    style?: 'normal' | 'highlight' | 'card';
    linkedMediaId?: string;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function TextWidget({ widget, isEditing, onUpdate }: TextWidgetProps) {
  const [editContent, setEditContent] = useState(widget.content || {
    header: '',
    title: '',
    body: '',
    tags: [],
  });

  const handleContentChange = (field: string, value: string) => {
    const updatedContent = {
      ...editContent,
      [field]: value,
    };
    
    setEditContent(updatedContent);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        content: updatedContent,
      });
    }
  };

  const handleStyleChange = (style: 'normal' | 'highlight' | 'card') => {
    if (onUpdate) {
      onUpdate({
        ...widget,
        style,
      });
    }
  };

  // Determine widget style class
  const styleClass = widget.style || 'normal';

  if (isEditing) {
    return (
      <div className={`text-widget editing ${styleClass}`}>
        <div className="widget-edit-header">
          <h4>Edit Text Widget</h4>
          
          <div className="style-selector">
            <button 
              className={`style-button ${styleClass === 'normal' ? 'active' : ''}`}
              onClick={() => handleStyleChange('normal')}
            >
              Normal
            </button>
            <button 
              className={`style-button ${styleClass === 'highlight' ? 'active' : ''}`}
              onClick={() => handleStyleChange('highlight')}
            >
              Highlight
            </button>
            <button 
              className={`style-button ${styleClass === 'card' ? 'active' : ''}`}
              onClick={() => handleStyleChange('card')}
            >
              Card
            </button>
          </div>
        </div>
        
        <div className="widget-edit-content">
          {widget.type === 'header' && (
            <div className="form-group">
              <label htmlFor="header">Header</label>
              <input 
                type="text" 
                id="header" 
                value={editContent.header || ''} 
                onChange={(e) => handleContentChange('header', e.target.value)} 
                placeholder="Header text" 
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              value={editContent.title || ''} 
              onChange={(e) => handleContentChange('title', e.target.value)} 
              placeholder="Title" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Content</label>
            <textarea 
              id="body" 
              value={editContent.body || ''} 
              onChange={(e) => handleContentChange('body', e.target.value)} 
              placeholder="Enter your text here..." 
              rows={5}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-widget ${styleClass}`}>
      {editContent.header && (
        <div className="widget-header">{editContent.header}</div>
      )}
      
      {editContent.title && (
        <h3 className="widget-title">{editContent.title}</h3>
      )}
      
      <div className="widget-body">
        {editContent.body ? (
          <p>{editContent.body}</p>
        ) : (
          <p className="empty-content">No content</p>
        )}
      </div>
      
      {editContent.tags && editContent.tags.length > 0 && (
        <div className="widget-tags">
          {editContent.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
