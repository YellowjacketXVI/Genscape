import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { Widget } from '@/types/widget';
import Colors from '@/constants/Colors';
import { Image, Music, ShoppingBag, MessageSquare, Text as TextIcon, Bot } from 'lucide-react-native';

type Props = {
  widget: Widget;
  onMediaSelect: () => void;
  isEditing?: boolean;
  onSizeChange?: (newSize: number) => void;
};

export default function WidgetContainer({ widget, onMediaSelect, isEditing = false, onSizeChange }: Props) {
  // Get the size label based on widget dimensions
  const getSizeLabel = () => {
    if (widget.size.width === 1) return 'Small';
    if (widget.size.width === 2) return 'Medium';
    return 'Large';
  };

  // Handle size tag click to cycle through sizes
  const handleSizeTagClick = () => {
    if (!onSizeChange) return;

    // Cycle through sizes: Small (1) -> Medium (2) -> Large (3) -> Small (1)
    const newWidth = widget.size.width === 3 ? 1 : widget.size.width + 1;
    onSizeChange(newWidth);
  };

  // Temporary placeholder component until we implement the actual widget components
  const getWidgetComponent = () => {
    const getIcon = () => {
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

    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text style={styles.widgetTitle}>{widget.title || widget.type}</Text>
        <Text style={styles.widgetDescription}>
          {isEditing ? 'Tap to add content' : 'Widget preview'}
        </Text>
      </View>
    );
  };

  const getWidgetWidth = () => {
    const baseWidth = 100 / 3; // For 3-column layout
    return {
      width: `${baseWidth * widget.size.width}%`,
    };
  };

  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isDesktop = screenWidth > 768;

  // Calculate widget dimensions based on screen size
  const getWidgetDimensions = () => {
    // For mobile format (393x852 pixels)
    // Small (1x3) = 361x120.33px
    // Medium (2x3) = 361x240.66px
    // Large (3x3) = 361x361px

    // For desktop, maintain the same aspect ratios but scale up
    // Small (1x3) = 1116.03x372px

    // Calculate container width (accounting for padding)
    const containerWidth = isDesktop ?
      Math.min(1116, screenWidth - 24) : // Desktop: max 1116px or screen width minus padding
      screenWidth - 12; // Mobile: screen width minus padding

    // Calculate widget width based on container width
    const widgetWidth = containerWidth;

    // Calculate heights based on the specified aspect ratios
    let widgetHeight = 0;

    if (isDesktop) {
      // Desktop sizes
      if (widget.size.width === 1) { // Small (1x3)
        widgetHeight = 372; // Base height for small widget
      } else if (widget.size.width === 2) { // Medium (2x3)
        widgetHeight = 372 * 2; // Double height for medium widget
      } else { // Large (3x3)
        widgetHeight = 372 * 3; // Triple height for large widget
      }
    } else {
      // Mobile sizes
      if (widget.size.width === 1) { // Small (1x3)
        widgetHeight = 120.33; // Small height
      } else if (widget.size.width === 2) { // Medium (2x3)
        widgetHeight = 240.66; // Medium height
      } else { // Large (3x3)
        widgetHeight = 361; // Large height (square)
      }
    }

    return {
      width: widgetWidth,
      height: widgetHeight
    };
  };

  // Get the dimensions for this widget
  const dimensions = getWidgetDimensions();

  return (
    <View style={styles.container}>
      {/* Size tag - only shown in editing mode */}
      {isEditing && (
        <TouchableOpacity
          style={styles.sizeTag}
          onPress={handleSizeTagClick}
          activeOpacity={0.7}
        >
          <Text style={styles.sizeTagText}>{getSizeLabel()}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.touchableArea}
        onPress={onMediaSelect}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.widgetContent,
            {
              width: dimensions.width,
              height: dimensions.height
            },
            isEditing && styles.editingWidget
          ]}
        >
          {getWidgetComponent()}

          {/* Add content overlay - only shown in editing mode */}
          {isEditing && (
            <View style={styles.addContentOverlay}>
              <View style={styles.addContentButton}>
                <Text style={styles.addContentText}>Tap to add content</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
    position: 'relative', // For absolute positioning of size tag
  },
  touchableArea: {
    width: '100%',
  },
  widgetContent: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    overflow: 'hidden',
    // Shadow for better visual separation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative', // For overlay positioning
  },
  editingWidget: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  sizeTag: {
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
    // Add shadow for better visual feedback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  sizeTagText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  addContentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Hidden by default, visible on hover/focus
  },
  addContentButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addContentText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  iconContainer: {
    marginBottom: 12,
  },
  widgetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: Dimensions.get('window').width > 768 ? 16 : 14, // Smaller on mobile
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  widgetDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: Dimensions.get('window').width > 768 ? 14 : 12, // Smaller on mobile
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});