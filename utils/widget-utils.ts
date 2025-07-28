import {
  ScapeEditorWidget,
  WidgetType,
  ChannelColor,
  ScapeValidationResult,
  WIDGET_HIERARCHY
} from '@/types/scape-editor';

export function generateWidgetId(): string {
  return `widget_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createWidget(
  type: WidgetType,
  variant: string,
  defaultData: Record<string, any> = {}
): ScapeEditorWidget {
  return {
    id: generateWidgetId(),
    type,
    variant,
    channel: null,
    data: { ...defaultData },
    position: Date.now(), // Use timestamp for initial ordering
  };
}

export function getChannelColor(channel: ChannelColor): string {
  switch (channel) {
    case 'red':
      return '#EF4444';
    case 'green':
      return '#22C55E';
    case 'blue':
      return '#3B82F6';
    case 'neutral':
      return '#6B7280';
    default:
      return '#6B7280';
  }
}

export function getChannelName(channel: ChannelColor): string {
  switch (channel) {
    case 'red':
      return 'Red Channel';
    case 'green':
      return 'Green Channel';
    case 'blue':
      return 'Blue Channel';
    case 'neutral':
      return 'No Channel';
    default:
      return 'Unknown';
  }
}

export function sortWidgetsByHierarchy(widgets: ScapeEditorWidget[]): ScapeEditorWidget[] {
  return [...widgets].sort((a, b) => {
    // First sort by hierarchy (lower number = higher priority)
    const hierarchyDiff = WIDGET_HIERARCHY[a.type] - WIDGET_HIERARCHY[b.type];
    if (hierarchyDiff !== 0) {
      return hierarchyDiff;
    }
    
    // Then sort by position (creation order)
    return a.position - b.position;
  });
}

export function getWidgetsByChannel(
  widgets: ScapeEditorWidget[], 
  channel: ChannelColor
): ScapeEditorWidget[] {
  return widgets.filter(widget => widget.channel === channel);
}

export function getDrivingWidget(
  widgets: ScapeEditorWidget[], 
  channel: ChannelColor
): ScapeEditorWidget | null {
  const channelWidgets = getWidgetsByChannel(widgets, channel);
  const sortedWidgets = sortWidgetsByHierarchy(channelWidgets);
  return sortedWidgets[0] || null;
}

export function validateScapeName(name: string): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Scape name is required' };
  }
  
  if (name.length < 3) {
    return { isValid: false, error: 'Scape name must be at least 3 characters' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Scape name must be less than 50 characters' };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: 'Scape name contains invalid characters' };
  }
  
  return { isValid: true };
}

export function validateTagline(tagline: string): { isValid: boolean; error?: string } {
  if (tagline.length > 75) {
    return { isValid: false, error: 'Tagline must be 75 characters or less' };
  }
  
  return { isValid: true };
}

export function validateScape(
  title: string,
  widgets: ScapeEditorWidget[],
  featureWidgetId: string | null,
  tagline: string
): ScapeValidationResult {
  const errors: string[] = [];
  
  // Validate title
  const titleValidation = validateScapeName(title);
  if (!titleValidation.isValid) {
    errors.push(titleValidation.error!);
  }
  
  // Validate widgets
  if (widgets.length === 0) {
    errors.push('At least one widget is required');
  }
  
  // Validate feature widget and tagline for publishing
  let canPublish = true;
  if (!featureWidgetId) {
    errors.push('Feature widget must be selected to publish');
    canPublish = false;
  }
  
  if (!tagline.trim()) {
    errors.push('Tagline is required to publish');
    canPublish = false;
  } else {
    const taglineValidation = validateTagline(tagline);
    if (!taglineValidation.isValid) {
      errors.push(taglineValidation.error!);
      canPublish = false;
    }
  }
  
  const canSaveDraft = titleValidation.isValid;
  const isValid = errors.length === 0;
  
  return {
    isValid,
    errors,
    canSaveDraft,
    canPublish: canPublish && canSaveDraft,
  };
}

export function reorderWidgets(
  widgets: ScapeEditorWidget[],
  fromIndex: number,
  toIndex: number
): ScapeEditorWidget[] {
  const result = [...widgets];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update positions to maintain order
  return result.map((widget, index) => ({
    ...widget,
    position: index,
  }));
}
