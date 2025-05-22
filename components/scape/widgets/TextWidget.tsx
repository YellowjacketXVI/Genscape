import { useState, useEffect, useRef } from 'react';

type TextWidgetProps = {
  widget: {
    id: string;
    type: 'text' | 'header';
    title: string;
    content?: {
      body: string;
    };
    /** Font size in pixels */
    fontSize?: 12 | 24 | 32;
    /** Whether the text should be bold */
    bold?: boolean;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function TextWidget({ widget, onUpdate }: TextWidgetProps) {
  const [text, setText] = useState(widget.content?.body || 'Click to edit this text');
  const [editing, setEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText;
    setEditing(false);
    setText(newText);
    if (onUpdate) {
      onUpdate({
        ...widget,
        content: { body: newText },
      });
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText;
    setText(newText);
  };

  useEffect(() => {
    if (editing) {
      divRef.current?.focus();
    }
  }, [editing]);

  const fontSize = widget.fontSize ?? 12;

  return (
    <div
      className="text-widget"
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        color: '#FFFFFF',
        fontWeight: widget.bold ? 'bold' : 'normal',
        fontSize,
        width: '100%',
      }}
      contentEditable={editing}
      suppressContentEditableWarning
      ref={divRef}
      onClick={handleClick}
      onInput={handleInput}
      onBlur={handleBlur}
    >
      {text}
    </div>
  );
}
