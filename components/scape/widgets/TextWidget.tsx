import { useState } from 'react';

type TextWidgetProps = {
  widget: {
    id: string;
    type: 'text' | 'header';
    title: string;
    content?: {
      body: string;
    };
    fontSize?: 12 | 24 | 32;
    bold?: boolean;
  };
  isEditing: boolean;
  onUpdate?: (updatedWidget: any) => void;
};

export default function TextWidget({ widget, isEditing, onUpdate }: TextWidgetProps) {
  const [text, setText] = useState(widget.content?.body || '');
  const [fontSize, setFontSize] = useState<12 | 24 | 32>(widget.fontSize || 24);
  const [bold, setBold] = useState(widget.bold || false);

  const updateWidget = (updates: Partial<TextWidgetProps['widget']>) => {
    if (onUpdate) {
      onUpdate({
        ...widget,
        ...updates,
        content: { body: updates.content?.body ?? text },
      });
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    updateWidget({ content: { body: value } });
  };

  const handleFontSizeChange = (value: 12 | 24 | 32) => {
    setFontSize(value);
    updateWidget({ fontSize: value });
  };

  const handleBoldChange = (value: boolean) => {
    setBold(value);
    updateWidget({ bold: value });
  };

  if (isEditing) {
    return (
      <div className="text-widget editing" style={{ backgroundColor: '#f0f0f0', padding: 8 }}>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          style={{
            width: '100%',
            minHeight: 80,
            fontSize,
            fontWeight: bold ? 'bold' as const : 'normal' as const,
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: 4,
          }}
        />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <select value={fontSize} onChange={(e) => handleFontSizeChange(Number(e.target.value) as 12 | 24 | 32)}>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={32}>32</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={bold}
              onChange={(e) => handleBoldChange(e.target.checked)}
            />
            Bold
          </label>
        </div>
      </div>
    );
  }

  return (
    <p
      style={{
        fontSize,
        fontWeight: bold ? 'bold' : 'normal',
        color: '#FFFFFF',
      }}
    >
      {text || ' '}
    </p>
  );
}
