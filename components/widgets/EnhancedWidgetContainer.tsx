import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { 
  Image, 
  ShoppingBag, 
  Music, 
  Text as TextIcon, 
  MessageSquare, 
  Bot,
  Star,
  Move,
  Trash2
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget, getWidgetSizeName } from '@/types/widget';
import { getWidgetComponent } from '@/utils/widgetRegistry';

interface WidgetContainerProps {
  widget: Widget;
  isEditing?: boolean;
  onMediaSelect?: () => void;
  onSizeChange?: (newWidth: 1 | 2 | 3) => void;
  onFeatureToggle?: () => void;
  onRemove?: () => void;
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
}

export default function EnhancedWidgetContainer({
  widget,
  isEditing = false,
  onMediaSelect,
  onSizeChange,
  onFeatureToggle,
  onRemove,
  onMoveStart,
  onMoveEnd
}: WidgetContainerProps) {
  // Get the appropriate icon for the widget type
  const getWidgetIcon = () => {
    switch (widget.type) {
      case 'media':
        return <Image size={32} color={Colors.text.primary} />;
      case 'gallery':
        return <Image size={32} color={Colors.text.primary} />;
      case 'shop':
        return <ShoppingBag size={32} color={Colors.text.primary} />;
      case 'audio':
      case 'audio-caption':
        return <Music size={32} color={Colors.text.primary} />;
      case 'text':
      case 'header':
        return <TextIcon size={32} color={Colors.text.primary} />;
      case 'chat':
      case 'comments':
      case 'live':
        return <MessageSquare size={32} color={Colors.text.primary} />;
      case 'llm':
        return <Bot size={32} color={Colors.text.primary} />;
      default:
        return <TextIcon size={32} color={Colors.text.primary} />;
    }
  };

  // Calculate dimensions based on widget size
  const calculateDimensions = () => {
    // Get screen dimensions
    const screenWidth = Dimensions.get('window').width;
    const isDesktop = screenWidth > 768;
    
    // Base width calculation
    const containerPadding = 32; // Total horizontal padding of the container
    const gutterWidth = 16; // Space between widgets
    
    let baseWidth;
    if (isDesktop) {
      // Desktop: Use a fixed width container
      const containerWidth = Math.min(1200, screenWidth - 48); // Max width or screen width minus margins
      baseWidth = (containerWidth - containerPadding - gutterWidth * 2) / 3; // 3-column layout
    } else {
      // Mobile: Use full screen width
      baseWidth = (screenWidth - containerPadding) / 3; // 3-column layout
    }
    
    // Calculate width based on widget size
    const width = baseWidth * widget.size.width + (widget.size.width - 1) * gutterWidth;
    
    // Calculate height (fixed aspect ratio based on width)
    let height: number | undefined = widget.size.height * (baseWidth / 3);
    if (widget.type === 'text' || widget.type === 'header') {
      // Allow text widgets to size based on content
      height = undefined;
    }
    
    return { width, height };
  };
  
  const dimensions = calculateDimensions();

  // Resolve the actual widget component for rendering
  const WidgetComponent = getWidgetComponent(widget.type);
  
  return (
    <View style={[
      styles.container,
      {
        width: dimensions.width,
      },
      widget.channel && styles[`${widget.channel}Channel` as keyof typeof styles],
      isEditing && styles.editingContainer
    ]}>
      {/* Widget Header - only shown in editing mode */}
      {isEditing && (
        <View style={styles.widgetHeader}>
          <TouchableOpacity
            style={styles.moveHandle}
            onPressIn={onMoveStart}
            onPressOut={onMoveEnd}
          >
            <Move size={20} color={Colors.text.muted} />
          </TouchableOpacity>
          
          <View style={styles.widgetTitleContainer}>
            <Text style={styles.widgetTitle}>{widget.title || widget.type}</Text>
          </View>
          
          <View style={styles.widgetActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onFeatureToggle}
            >
              <Star
                size={20}
                color={widget.isFeatured ? Colors.primary : Colors.text.muted}
                fill={widget.isFeatured ? Colors.primary : 'transparent'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onRemove}
            >
              <Trash2 size={20} color={Colors.text.muted} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Size Tag - only shown in editing mode */}
      {isEditing && (
        <TouchableOpacity
          style={styles.sizeTag}
          onPress={() => onSizeChange && onSizeChange(
            widget.size.width === 3 ? 1 : (widget.size.width + 1) as 1 | 2 | 3
          )}
        >
          <Text style={styles.sizeTagText}>{getWidgetSizeName(widget.size)}</Text>
        </TouchableOpacity>
      )}
      
      {/* Featured Badge - only shown if widget is featured */}
      {widget.isFeatured && (
        <View style={styles.featuredBadge}>
          <Star size={12} color="#FFF" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      {/* Widget Content */}
      {onMediaSelect ? (
        <TouchableOpacity
          style={[
            styles.widgetContent,
            {
              height: dimensions.height
            }
          ]}
          onPress={onMediaSelect}
          activeOpacity={isEditing ? 0.7 : 1}
          disabled={!isEditing || !onMediaSelect}
        >
          {WidgetComponent ? (
            <WidgetComponent
              widget={widget as any}
              isEditing={isEditing}
              onMediaSelect={onMediaSelect}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.iconContainer}>{getWidgetIcon()}</View>
              <Text style={styles.placeholderTitle}>{widget.title || widget.type}</Text>
              <Text style={styles.placeholderDescription}>
                {isEditing ? 'Tap to add content' : 'Widget preview'}
              </Text>
            </View>
          )}

          {/* Add content overlay - only shown in editing mode */}
          {isEditing && (
            <View style={styles.addContentOverlay}>
              <View style={styles.addContentButton}>
                <Text style={styles.addContentText}>Add Content</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.widgetContent,
            {
              height: dimensions.height
            }
          ]}
        >
          {WidgetComponent ? (
            <WidgetComponent
              widget={widget as any}
              isEditing={isEditing}
              onMediaSelect={onMediaSelect}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.iconContainer}>{getWidgetIcon()}</View>
              <Text style={styles.placeholderTitle}>{widget.title || widget.type}</Text>
              <Text style={styles.placeholderDescription}>
                {isEditing ? 'Tap to add content' : 'Widget preview'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  editingContainer: {
    borderWidth: 1,
    borderColor: Colors.background.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  redChannel: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  greenChannel: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  blueChannel: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  neutralChannel: {
    // No special styling for neutral channel
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.background.medium,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.light,
  },
  moveHandle: {
    padding: 4,
  },
  widgetTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  widgetTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  widgetActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  sizeTag: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: Colors.background.medium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    zIndex: 10,
  },
  sizeTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  featuredText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  widgetContent: {
    backgroundColor: Colors.background.medium,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    marginBottom: 12,
  },
  placeholderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  placeholderDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  addContentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContentButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addContentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
