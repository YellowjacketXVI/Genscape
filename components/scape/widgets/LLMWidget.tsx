import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

type LLMWidgetProps = {
  widget: {
    id: string;
    type: 'llm';
    title: string;
    prompt: string;
    model: string;
    systemMessage?: string;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function LLMWidget({ 
  widget, 
  isEditing, 
  onUpdate 
}: LLMWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(widget.prompt || '');
  const [model, setModel] = useState(widget.model || 'gpt-3.5-turbo');
  const [systemMessage, setSystemMessage] = useState(widget.systemMessage || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with system message if provided
  useEffect(() => {
    if (widget.systemMessage && messages.length === 0) {
      setMessages([
        {
          id: 'system-1',
          role: 'system',
          content: widget.systemMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [widget.systemMessage]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        prompt: newPrompt,
      });
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        model: newModel,
      });
    }
  };

  const handleSystemMessageChange = (newSystemMessage: string) => {
    setSystemMessage(newSystemMessage);
    
    if (onUpdate) {
      onUpdate({
        ...widget,
        systemMessage: newSystemMessage,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to an LLM service
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simple response based on the input
      let responseText = '';
      
      if (inputMessage.toLowerCase().includes('hello') || inputMessage.toLowerCase().includes('hi')) {
        responseText = 'Hello! How can I help you today?';
      } else if (inputMessage.toLowerCase().includes('help')) {
        responseText = 'I\'m here to help! What do you need assistance with?';
      } else if (inputMessage.toLowerCase().includes('thank')) {
        responseText = 'You\'re welcome! Is there anything else you\'d like to know?';
      } else if (inputMessage.toLowerCase().includes('?')) {
        responseText = 'That\'s an interesting question. In a real implementation, I would provide a thoughtful answer based on the AI model specified in the widget settings.';
      } else {
        responseText = 'I understand. In a fully implemented version, I would respond to your message using the ' + model + ' model with the context from our conversation.';
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating a response. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isEditing) {
    return (
      <div className="llm-widget editing">
        <div className="widget-edit-header"></div>
        
        <div className="widget-edit-content">
          <div className="form-group">
            <label htmlFor="model-select">AI Model</label>
            <select 
              id="model-select" 
              value={model} 
              onChange={(e) => handleModelChange(e.target.value)}
              className="model-select"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-2">Claude 2</option>
              <option value="llama-2">Llama 2</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="initial-prompt">Initial Prompt (Optional)</label>
            <textarea 
              id="initial-prompt" 
              value={prompt} 
              onChange={(e) => handlePromptChange(e.target.value)} 
              placeholder="Enter an initial prompt to start the conversation..." 
              rows={3}
              className="prompt-input"
            />
            <p className="input-help">This prompt will be sent automatically when a user first interacts with the widget.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="system-message">System Message (Optional)</label>
            <textarea 
              id="system-message" 
              value={systemMessage} 
              onChange={(e) => handleSystemMessageChange(e.target.value)} 
              placeholder="Enter instructions for the AI..." 
              rows={3}
              className="system-message-input"
            />
            <p className="input-help">System messages provide instructions to the AI about how it should behave.</p>
          </div>
          
          <div className="preview-section">
            <h5>Preview</h5>
            <div className="chat-preview">
              <div className="chat-message system">
                <div className="message-content">
                  <div className="message-text">
                    {systemMessage || 'No system message set. The AI will use default behavior.'}
                  </div>
                </div>
              </div>
              
              <div className="chat-message user">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">User</span>
                    <span className="message-time">{formatTime(new Date())}</span>
                  </div>
                  <div className="message-text">
                    {prompt || 'Hello, can you help me with something?'}
                  </div>
                </div>
              </div>
              
              <div className="chat-message assistant">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">AI</span>
                    <span className="message-time">{formatTime(new Date())}</span>
                  </div>
                  <div className="message-text">
                    Hello! I'm here to help. What would you like to know?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="llm-widget">
      <div className="chat-header">
        <h3 className="chat-title">AI Chat</h3>
        <div className="model-badge">{model}</div>
      </div>
      
      <div className="chat-messages">
        {messages.length > 0 ? (
          <div className="messages-container">
            {messages.map((msg) => (
              msg.role !== 'system' && (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-role">{msg.role === 'user' ? 'You' : 'AI'}</span>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-text">{msg.content}</div>
                  </div>
                </div>
              )
            ))}
            {isLoading && (
              <div className="chat-message assistant loading">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">AI</span>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="empty-chat">
            <div className="ai-icon">🤖</div>
            <p className="empty-chat-message">
              {prompt || "Hello! I'm an AI assistant. How can I help you today?"}
            </p>
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <textarea 
          className="chat-input" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Type your message..." 
          rows={2}
          disabled={isLoading}
        />
        <button 
          className="send-button" 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
