/**
 * Widget Registry - Handles dynamic import of widget components
 */

import dynamic from 'next/dynamic';

// Define widget types
export const WIDGET_TYPES = {
  TEXT: 'text',
  HEADER: 'header',
  MEDIA: 'media',
  GALLERY: 'gallery',
  SHOP: 'shop',
  AUDIO: 'audio',
  AUDIO_CAPTION: 'audio-caption',
  CHAT: 'chat',
  COMMENTS: 'comments',
  LIVE: 'live',
  BUTTON: 'button',
  LLM: 'llm',
};

// Define widget sizes
export const WIDGET_SIZES = {
  SMALL: { width: 1, height: 3 },
  MEDIUM: { width: 2, height: 3 },
  LARGE: { width: 3, height: 3 },
};

// Define widget channels
export const WIDGET_CHANNELS = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  NEUTRAL: 'neutral',
};

// Dynamic imports for widget components
const TextWidget = dynamic(() => import('@/components/scape/widgets/TextWidget'));
const ImageWidget = dynamic(() => import('@/components/scape/widgets/ImageWidget'));
const GalleryWidget = dynamic(() => import('@/components/scape/widgets/GalleryWidget'));
const ShopWidget = dynamic(() => import('@/components/scape/widgets/ShopWidget'));
const AudioWidget = dynamic(() => import('@/components/scape/widgets/AudioWidget'));
const CommsWidget = dynamic(() => import('@/components/scape/widgets/CommsWidget'));
const ButtonWidget = dynamic(() => import('@/components/scape/widgets/ButtonWidget'));
const LLMWidget = dynamic(() => import('@/components/scape/widgets/LLMWidget'));

// Widget registry mapping
const widgetRegistry = {
  [WIDGET_TYPES.TEXT]: TextWidget,
  [WIDGET_TYPES.HEADER]: TextWidget, // Header uses the same component as Text
  [WIDGET_TYPES.MEDIA]: ImageWidget,
  [WIDGET_TYPES.GALLERY]: GalleryWidget,
  [WIDGET_TYPES.SHOP]: ShopWidget,
  [WIDGET_TYPES.AUDIO]: AudioWidget,
  [WIDGET_TYPES.AUDIO_CAPTION]: AudioWidget, // Audio caption uses the same component
  [WIDGET_TYPES.CHAT]: CommsWidget,
  [WIDGET_TYPES.COMMENTS]: CommsWidget, // Comments uses the same component
  [WIDGET_TYPES.LIVE]: CommsWidget, // Live uses the same component
  [WIDGET_TYPES.BUTTON]: ButtonWidget,
  [WIDGET_TYPES.LLM]: LLMWidget,
};

/**
 * Get widget component by type
 */
export const getWidgetComponent = (type: string) => {
  return widgetRegistry[type] || null;
};

/**
 * Get all available widget types with metadata
 */
export const getAvailableWidgetTypes = () => {
  return [
    {
      type: WIDGET_TYPES.MEDIA,
      title: 'Media Display',
      description: 'Display an image or video',
      icon: 'image',
    },
    {
      type: WIDGET_TYPES.GALLERY,
      title: 'Gallery',
      description: 'Display multiple images in a gallery',
      icon: 'images',
    },
    {
      type: WIDGET_TYPES.TEXT,
      title: 'Text',
      description: 'Add formatted text content',
      icon: 'type',
    },
    {
      type: WIDGET_TYPES.HEADER,
      title: 'Header',
      description: 'Add a section header with title',
      icon: 'heading',
    },
    {
      type: WIDGET_TYPES.SHOP,
      title: 'Shop',
      description: 'Display products for sale',
      icon: 'shopping-bag',
    },
    {
      type: WIDGET_TYPES.AUDIO,
      title: 'Audio',
      description: 'Play audio files',
      icon: 'music',
    },
    {
      type: WIDGET_TYPES.AUDIO_CAPTION,
      title: 'Audio Caption',
      description: 'Display audio with caption',
      icon: 'file-audio',
    },
    {
      type: WIDGET_TYPES.CHAT,
      title: 'Chat',
      description: 'Add a chat interface',
      icon: 'message-square',
    },
    {
      type: WIDGET_TYPES.COMMENTS,
      title: 'Comments',
      description: 'Display and collect comments',
      icon: 'message-circle',
    },
    {
      type: WIDGET_TYPES.LIVE,
      title: 'Live Stream',
      description: 'Embed a live stream',
      icon: 'video',
    },
    {
      type: WIDGET_TYPES.BUTTON,
      title: 'Button',
      description: 'Add an interactive button',
      icon: 'mouse-pointer',
    },
    {
      type: WIDGET_TYPES.LLM,
      title: 'AI Chat',
      description: 'Add an AI chat interface',
      icon: 'cpu',
    },
  ];
};

/**
 * Get widget size name
 */
export const getWidgetSizeName = (size: { width: number; height: number }) => {
  if (size.width === 1) return 'Small';
  if (size.width === 2) return 'Medium';
  return 'Large';
};

/**
 * Get next widget size (cycles through Small -> Medium -> Large -> Small)
 */
export const getNextWidgetSize = (currentSize: { width: number; height: number }) => {
  // Cycle through sizes: Small (1) -> Medium (2) -> Large (3) -> Small (1)
  const newWidth = currentSize.width === 3 ? 1 : currentSize.width + 1;
  return { width: newWidth, height: 3 };
};

/**
 * Get channel color
 */
export const getChannelColor = (channel: string) => {
  switch (channel) {
    case WIDGET_CHANNELS.RED:
      return '#FF5252';
    case WIDGET_CHANNELS.GREEN:
      return '#4CAF50';
    case WIDGET_CHANNELS.BLUE:
      return '#2196F3';
    case WIDGET_CHANNELS.NEUTRAL:
    default:
      return 'transparent';
  }
};
