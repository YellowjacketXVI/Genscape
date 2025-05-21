import React, { useState } from 'react';
import './TextWidget.css';

interface TextWidgetProps {
  widget: {
    id: string;
    type: 'text' | 'header';
    content?: { body?: string };
    fontSize?: 'header' | 'subheader' | 'body';
    bold?: boolean;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
}

const TextWidget: React.FC<TextWidgetProps> = ({ widget, isEditing, onUpdate }) => {
  const [text, setText] = useState(widget.content?.body || 'Double click to edit this text');
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = () => {
    if (isEditing) setEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setEditing(false);
    const newText = e.currentTarget.innerText;
    setText(newText);
    onUpdate?.({
      ...widget,
      content: { ...(widget.content || {}), body: newText },
    });
  };

  const fontSize = widget.fontSize || 'body';
  const bold = widget.bold || false;

  return (
    <div
      className={`text-widget ${fontSize}${bold ? ' bold' : ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      {text}
    </div>
  );
};

export default TextWidget;
