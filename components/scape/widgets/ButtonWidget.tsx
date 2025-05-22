import { useState } from 'react';

type ButtonWidgetProps = {
  widget: {
    id: string;
    type: 'button';
    title: string;
    targetChannel: 'red' | 'green' | 'blue' | 'neutral';
    label: string;
    style: 'primary' | 'secondary' | 'accent';
    action?: 'scroll' | 'link' | 'toggle' | 'custom';
    actionTarget?: string;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
  onButtonPress?: (widgetId: string, channel: string) => void;
};

export default function ButtonWidget({ 
  widget, 
  isEditing, 
  onUpdate,
  onButtonPress
}: ButtonWidgetProps) {
  const [label, setLabel] = useState(widget.label || 'Button');
  const [buttonStyle, setButtonStyle] = useState<'primary' | 'secondary' | 'accent'>(widget.style || 'primary');
  const [targetChannel, setTargetChannel] = useState<'red' | 'green' | 'blue' | 'neutral'>(widget.targetChannel || 'neutral');
  const [action, setAction] = useState<'scroll' | 'link' | 'toggle' | 'custom'>(widget.action || 'scroll');
  const [actionTarget, setActionTarget] = useState(widget.actionTarget || '');

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        label: newLabel,
      });
    }
  };

  const handleStyleChange = (newStyle: 'primary' | 'secondary' | 'accent') => {
    setButtonStyle(newStyle);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        style: newStyle,
      });
    }
  };

  const handleChannelChange = (newChannel: 'red' | 'green' | 'blue' | 'neutral') => {
    setTargetChannel(newChannel);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        targetChannel: newChannel,
      });
    }
  };

  const handleActionChange = (newAction: 'scroll' | 'link' | 'toggle' | 'custom') => {
    setAction(newAction);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        action: newAction,
      });
    }
  };

  const handleActionTargetChange = (newTarget: string) => {
    setActionTarget(newTarget);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        actionTarget: newTarget,
      });
    }
  };

  const handleButtonClick = () => {
    if (isEditing) return;
    
    if (onButtonPress) {
      onButtonPress(widget.id, targetChannel);
    } else {
      // Default behavior based on action type
      switch (action) {
        case 'link':
          if (actionTarget) {
            window.open(actionTarget, '_blank');
          }
          break;
        case 'scroll':
          // Scroll to element with ID matching actionTarget
          if (actionTarget) {
            const element = document.getElementById(actionTarget);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
          break;
        case 'toggle':
          // Toggle visibility of element with ID matching actionTarget
          if (actionTarget) {
            const element = document.getElementById(actionTarget);
            if (element) {
              element.style.display = element.style.display === 'none' ? 'block' : 'none';
            }
          }
          break;
        default:
          console.log(`Button pressed: ${widget.id}, channel: ${targetChannel}`);
      }
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'red': return '#FF5252';
      case 'green': return '#4CAF50';
      case 'blue': return '#2196F3';
      default: return '#757575';
    }
  };

  if (isEditing) {
    return (
      <div className="button-widget editing">
        <div className="widget-edit-header"></div>
        
        <div className="widget-edit-content">
          <div className="form-group">
            <label htmlFor="button-label">Button Label</label>
            <input 
              type="text" 
              id="button-label" 
              value={label} 
              onChange={(e) => handleLabelChange(e.target.value)} 
              placeholder="Button Text" 
              maxLength={30}
            />
          </div>
          
          <div className="form-group">
            <label>Button Style</label>
            <div className="button-style-options">
              <button 
                className={`style-option primary ${buttonStyle === 'primary' ? 'selected' : ''}`}
                onClick={() => handleStyleChange('primary')}
              >
                Primary
              </button>
              <button 
                className={`style-option secondary ${buttonStyle === 'secondary' ? 'selected' : ''}`}
                onClick={() => handleStyleChange('secondary')}
              >
                Secondary
              </button>
              <button 
                className={`style-option accent ${buttonStyle === 'accent' ? 'selected' : ''}`}
                onClick={() => handleStyleChange('accent')}
              >
                Accent
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Target Channel</label>
            <div className="channel-options">
              <button 
                className="channel-option"
                style={{ backgroundColor: getChannelColor('red'), opacity: targetChannel === 'red' ? 1 : 0.5 }}
                onClick={() => handleChannelChange('red')}
              >
                Red
              </button>
              <button 
                className="channel-option"
                style={{ backgroundColor: getChannelColor('green'), opacity: targetChannel === 'green' ? 1 : 0.5 }}
                onClick={() => handleChannelChange('green')}
              >
                Green
              </button>
              <button 
                className="channel-option"
                style={{ backgroundColor: getChannelColor('blue'), opacity: targetChannel === 'blue' ? 1 : 0.5 }}
                onClick={() => handleChannelChange('blue')}
              >
                Blue
              </button>
              <button 
                className="channel-option"
                style={{ backgroundColor: getChannelColor('neutral'), opacity: targetChannel === 'neutral' ? 1 : 0.5 }}
                onClick={() => handleChannelChange('neutral')}
              >
                Neutral
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Button Action</label>
            <select 
              value={action} 
              onChange={(e) => handleActionChange(e.target.value as any)} 
              className="action-select"
            >
              <option value="scroll">Scroll To Element</option>
              <option value="link">External Link</option>
              <option value="toggle">Toggle Element</option>
              <option value="custom">Custom (Channel)</option>
            </select>
          </div>
          
          {action !== 'custom' && (
            <div className="form-group">
              <label htmlFor="action-target">
                {action === 'scroll' ? 'Element ID' : 
                 action === 'link' ? 'URL' : 
                 'Element ID'}
              </label>
              <input 
                type="text" 
                id="action-target" 
                value={actionTarget} 
                onChange={(e) => handleActionTargetChange(e.target.value)} 
                placeholder={
                  action === 'scroll' ? 'section-id' : 
                  action === 'link' ? 'https://example.com' : 
                  'element-id'
                } 
              />
            </div>
          )}
          
          <div className="button-preview">
            <h5>Preview</h5>
            <button 
              className={`button-widget-button ${buttonStyle}`}
              style={{ borderColor: getChannelColor(targetChannel) }}
            >
              {label || 'Button'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="button-widget">
      <button 
        className={`button-widget-button ${buttonStyle}`}
        style={{ borderColor: getChannelColor(targetChannel) }}
        onClick={handleButtonClick}
      >
        {label}
      </button>
    </div>
  );
}
