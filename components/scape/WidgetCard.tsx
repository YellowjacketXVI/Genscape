import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Star,
  Edit3,
  Trash2,
  MoreVertical,
  Image as ImageIcon,
  Music2,
  ShoppingBag,
  Type as TextIcon,
  Grid3x3,
  Radio,
  MousePointer,
  Bot,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ScapeEditorWidget, ChannelColor } from '@/types/scape-editor';
import { getChannelColor } from '@/utils/widget-utils';
import ChannelSelector from './ChannelSelector';
import WidgetEditor from './WidgetEditor';

interface WidgetCardProps {
  widget: ScapeEditorWidget;
  isFeature: boolean;
  onUpdate: (widget: ScapeEditorWidget) => void;
  onDelete: () => void;
  onSetFeature: () => void;
}

const WIDGET_ICONS = {
  text: TextIcon,
  image: ImageIcon,
  audio: Music2,
  gallery: Grid3x3,
  live: Radio,
  shop: ShoppingBag,
  llm: Bot,
  button: MousePointer,
};

export default function WidgetCard({
  widget,
  isFeature,
  onUpdate,
  onDelete,
  onSetFeature,
}: WidgetCardProps) {
  const theme = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const IconComponent = WIDGET_ICONS[widget.type] || ImageIcon;

  const handleChannelChange = (channel: ChannelColor) => {
    onUpdate({
      ...widget,
      channel,
    });
  };

  const handleEdit = () => {
    setShowEditor(true);
  };

  const handleSaveWidget = (updatedWidget: ScapeEditorWidget) => {
    onUpdate(updatedWidget);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const getWidgetTitle = () => {
    switch (widget.type) {
      case 'text':
        return 'Text Widget';
      case 'image':
        return 'Image Widget';
      case 'audio':
        return 'Audio Widget';
      case 'gallery':
        return 'Gallery Widget';
      case 'live':
        return 'Live Widget';
      case 'shop':
        return 'Shop Widget';
      case 'llm':
        return 'AI Chat Widget';
      case 'button':
        return 'Button Widget';
      default:
        return 'Widget';
    }
  };

  const getWidgetDescription = () => {
    // TODO: Generate description based on widget data
    switch (widget.type) {
      case 'text':
        return widget.data.content ? 'Has content' : 'Tap to add content';
      case 'image':
        return widget.data.mediaIds?.length > 0 
          ? `${widget.data.mediaIds.length} image(s)` 
          : 'Tap to add images';
      case 'audio':
        return widget.data.tracks?.length > 0 
          ? `${widget.data.tracks.length} track(s)` 
          : 'Tap to add audio';
      case 'gallery':
        return widget.data.mediaIds?.length > 0 
          ? `${widget.data.mediaIds.length} item(s)` 
          : 'Tap to add media';
      case 'live':
        return widget.data.streamUrl ? 'Stream configured' : 'Tap to configure';
      case 'shop':
        return widget.data.products?.length > 0 
          ? `${widget.data.products.length} product(s)` 
          : 'Tap to add products';
      case 'llm':
        return widget.data.prompt ? 'AI configured' : 'Tap to configure';
      case 'button':
        return widget.data.buttons?.length > 0 
          ? `${widget.data.buttons.length} button(s)` 
          : 'Tap to configure';
      default:
        return 'Tap to configure';
    }
  };

  const borderColor = widget.channel && widget.channel !== 'neutral' 
    ? getChannelColor(widget.channel) 
    : theme.colors.border;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface,
        borderColor,
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
            <IconComponent size={20} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {getWidgetTitle()}
            </Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {getWidgetDescription()}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={onSetFeature}
            style={[
              styles.featureButton,
              isFeature && { backgroundColor: theme.colors.primary }
            ]}
          >
            <Star 
              size={16} 
              color={isFeature ? '#FFFFFF' : theme.colors.textSecondary}
              fill={isFeature ? '#FFFFFF' : 'none'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowActions(!showActions)}
            style={styles.moreButton}
          >
            <MoreVertical size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Preview */}
      <TouchableOpacity 
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        onPress={handleEdit}
      >
        <View style={styles.contentPreview}>
          <IconComponent size={32} color={theme.colors.textSecondary} />
          <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>
            Tap to edit content
          </Text>
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <ChannelSelector
          selectedChannel={widget.channel}
          onChannelChange={handleChannelChange}
        />

        <Text style={[styles.variantText, { color: theme.colors.textMuted }]}>
          {widget.variant}
        </Text>
      </View>

      {/* Actions Menu */}
      {showActions && (
        <View style={[styles.actionsMenu, { backgroundColor: theme.colors.cardBackground }]}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActions(false);
              handleEdit();
            }}
          >
            <Edit3 size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActions(false);
              handleDelete();
            }}
          >
            <Trash2 size={16} color={theme.colors.error} />
            <Text style={[styles.actionText, { color: theme.colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <WidgetEditor
        widget={widget}
        isVisible={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSaveWidget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    height: 120,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentPreview: {
    alignItems: 'center',
    gap: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  variantText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  actionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
