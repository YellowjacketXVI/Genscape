import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image as ImageIcon, Music2, ShoppingBag, MessageSquare, Text as TextIcon, ImagePlus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/types/scape';

type WidgetPreviewProps = {
  widget: Widget;
};

export default function WidgetPreview({ widget }: WidgetPreviewProps) {
  const getWidgetIcon = () => {
    switch (widget.type) {
      case 'media':
        return <ImageIcon size={24} color={Colors.text.primary} />;
      case 'audio':
        return <Music2 size={24} color={Colors.text.primary} />;
      case 'shop':
        return <ShoppingBag size={24} color={Colors.text.primary} />;
      case 'text':
        return <TextIcon size={24} color={Colors.text.primary} />;
      case 'gallery':
        return <ImagePlus size={24} color={Colors.text.primary} />;
      case 'chat':
        return <MessageSquare size={24} color={Colors.text.primary} />;
      default:
        return <ImageIcon size={24} color={Colors.text.primary} />;
    }
  };

  const getWidgetHeight = () => {
    // Check if widget.size is an object with width property (new format)
    if (typeof widget.size === 'object' && widget.size.width) {
      // For media and gallery types, use taller heights
      if (widget.type === 'media' || widget.type === 'gallery') {
        return widget.size.width === 1 ? 150 : // Small
               widget.size.width === 2 ? 250 : // Medium
               350; // Large
      }

      // For other widget types
      return widget.size.width === 1 ? 120 : // Small
             widget.size.width === 2 ? 180 : // Medium
             240; // Large
    }

    // Fallback for string-based size (old format)
    switch (widget.size) {
      case 'small':
        return 120;
      case 'medium':
        return 180;
      case 'large':
        return 240;
      default:
        return 180;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { height: getWidgetHeight() }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>{getWidgetIcon()}</View>
          <Text style={styles.title}>{widget.title}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.sizeText}>
            {typeof widget.size === 'object'
              ? widget.size.width === 1 ? 'Small' : widget.size.width === 2 ? 'Medium' : 'Large'
              : widget.size}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        {(widget.type === 'media' || widget.type === 'gallery') ? (
          <View style={styles.mediaPreview}>
            <ImageIcon size={40} color={Colors.text.muted} />
            <Text style={[styles.contentText, { marginTop: 8 }]}>
              {widget.type === 'media' ? 'Media Display' : 'Gallery'}
            </Text>
          </View>
        ) : (
          <Text style={styles.contentText}>Tap to configure content</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  headerRight: {
    backgroundColor: Colors.background.medium,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  sizeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mediaPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 24,
    width: '100%',
    height: '100%',
  },
  contentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});