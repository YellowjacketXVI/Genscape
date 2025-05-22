import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
};

type CommsWidgetProps = {
  widget: {
    id: string;
    type: 'chat' | 'comments' | 'live';
    title: string;
    streamUrl?: string;
    isLive?: boolean;
    viewerCount?: number;
    startTime?: string;
    endTime?: string;
    settings: {
      enabled: boolean;
      moderationLevel: 'low' | 'medium' | 'high';
    };
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function CommsWidget({ 
  widget, 
  isEditing, 
  onUpdate 
}: CommsWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLive, setIsLive] = useState(widget.isLive || false);
  const [viewerCount, setViewerCount] = useState(widget.viewerCount || 0);
  const [settings, setSettings] = useState(widget.settings || {
    enabled: true,
    moderationLevel: 'medium'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      // In a real app, this would fetch messages from an API
      // For now, we'll use mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'JaneDoe',
          avatar: 'https://placehold.co/100x100?text=JD',
          content: 'Hello everyone! Welcome to the chat.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
        },
        {
          id: '2',
          userId: 'user2',
          username: 'JohnSmith',
          avatar: 'https://placehold.co/100x100?text=JS',
          content: 'Hi Jane! Thanks for hosting this stream.',
          timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
        },
        {
          id: '3',
          userId: 'user3',
          username: 'AlexWong',
          avatar: 'https://placehold.co/100x100?text=AW',
          content: 'The content looks great today!',
          timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        }
      ];
      
      setMessages(mockMessages);
    };
    
    loadMessages();
    
    // Simulate live viewer count updates
    if (widget.type === 'live' || widget.type === 'chat') {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
          return Math.max(1, prev + change); // Ensure at least 1 viewer
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [widget.type]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add new message
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      userId: 'current-user',
      username: 'You',
      avatar: 'https://placehold.co/100x100?text=You',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    setSettings(updatedSettings);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        settings: updatedSettings
      });
    }
  };

  const handleLiveToggle = () => {
    const newLiveState = !isLive;
    setIsLive(newLiveState);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        isLive: newLiveState
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isEditing) {
    return (
      <div className="comms-widget editing">
        <div className="widget-edit-header"></div>
        
        <div className="widget-edit-content">
          {(widget.type === 'chat' || widget.type === 'live') && (
            <div className="live-settings">
              <label className="setting-label">
                <input 
                  type="checkbox" 
                  checked={isLive} 
                  onChange={handleLiveToggle} 
                />
                Live Mode
              </label>
              
              {widget.type === 'live' && (
                <div className="stream-url-container">
                  <label htmlFor="stream-url">Stream URL:</label>
                  <input 
                    type="text" 
                    id="stream-url" 
                    value={widget.streamUrl || ''} 
                    onChange={(e) => onUpdate && onUpdate({
                      ...widget,
                      streamUrl: e.target.value
                    })} 
                    placeholder="rtmp://example.com/stream" 
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="moderation-settings">
            <label className="setting-label">
              <input 
                type="checkbox" 
                checked={settings.enabled} 
                onChange={(e) => handleSettingChange('enabled', e.target.checked)} 
              />
              Enable {widget.type === 'chat' ? 'Chat' : widget.type === 'comments' ? 'Comments' : 'Chat'}
            </label>
            
            <div className="moderation-level">
              <span>Moderation Level:</span>
              <div className="moderation-options">
                <label>
                  <input 
                    type="radio" 
                    name="moderation" 
                    value="low" 
                    checked={settings.moderationLevel === 'low'} 
                    onChange={() => handleSettingChange('moderationLevel', 'low')} 
                  />
                  Low
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="moderation" 
                    value="medium" 
                    checked={settings.moderationLevel === 'medium'} 
                    onChange={() => handleSettingChange('moderationLevel', 'medium')} 
                  />
                  Medium
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="moderation" 
                    value="high" 
                    checked={settings.moderationLevel === 'high'} 
                    onChange={() => handleSettingChange('moderationLevel', 'high')} 
                  />
                  High
                </label>
              </div>
            </div>
          </div>
          
          <div className="preview-section">
            <h5>Preview</h5>
            <div className="messages-preview">
              {messages.slice(0, 2).map((msg) => (
                <div key={msg.id} className="message-preview">
                  <div className="message-avatar">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt={msg.username} />
                    ) : (
                      <div className="avatar-placeholder">{msg.username.charAt(0)}</div>
                    )}
                  </div>
                  <div className="message-content-preview">
                    <div className="message-header">
                      <span className="message-username">{msg.username}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text-preview">{msg.content}</div>
                  </div>
                </div>
              ))}
              <div className="preview-note">... and {messages.length - 2} more messages</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={`comms-widget ${widget.type}`}>
      <div className="comms-header">
        <h3 className="comms-title">
          {widget.type === 'chat' ? 'Chat' : widget.type === 'comments' ? 'Comments' : 'Live Stream'}
        </h3>
        
        {(widget.type === 'chat' || widget.type === 'live') && isLive && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
            <span className="viewer-count">{viewerCount} watching</span>
          </div>
        )}
      </div>
      
      {widget.type === 'live' && widget.streamUrl && (
        <div className="stream-container">
          <div className="video-placeholder">
            <span>Live stream would appear here</span>
            <span className="stream-url">{widget.streamUrl}</span>
          </div>
        </div>
      )}
      
      {settings.enabled ? (
        <>
          <div className="messages-container">
            {messages.length > 0 ? (
              <div className="messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.userId === 'current-user' ? 'own-message' : ''}`}>
                    <div className="message-avatar">
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.username} />
                      ) : (
                        <div className="avatar-placeholder">{msg.username.charAt(0)}</div>
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-text">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="empty-messages">
                <span>No messages yet. Be the first to comment!</span>
              </div>
            )}
          </div>
          
          <div className="message-input-container">
            <textarea 
              className="message-input" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder={`Type your ${widget.type === 'comments' ? 'comment' : 'message'}...`} 
              rows={2}
            />
            <button 
              className="send-button" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="comms-disabled">
          <span>{widget.type === 'chat' ? 'Chat' : widget.type === 'comments' ? 'Comments' : 'Chat'} is currently disabled</span>
        </div>
      )}
    </div>
  );
}
