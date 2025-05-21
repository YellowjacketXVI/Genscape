import { useState } from 'react';

type TextWidgetProps = {
  widget: {
    id: string;
    type: 'text' | 'header';
    title: string;
    content?: {
      body: string;
    };
    fontSize?: 'header' | 'subheader' | 'body';
    bold?: boolean;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function TextWidget({ widget, onUpdate }: TextWidgetProps) {
  const [text, setText] = useState(widget.content?.body || 'Double click to edit this text');
  const [editing, setEditing] = useState(false);

  const handleDoubleClick = () => setEditing(true);

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

  const fontClass = widget.fontSize || 'body';

  return (
    <div
      className={`text-widget ${fontClass}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      {text}
    </div>
  );
}
