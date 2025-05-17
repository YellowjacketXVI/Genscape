import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/models/Widget';

interface StyledWidgetContainerProps {
  widget: Widget;
  onPress?: () => void;
}

export default function StyledWidgetContainer({ widget, onPress }: StyledWidgetContainerProps) {
  // Get channel color for the widget border
  const getChannelColor = (channel?: string) => {
    switch (channel) {
      case 'red': return '#FF5252';
      case 'green': return '#4CAF50';
      case 'blue': return '#2196F3';
      default: return 'transparent';
    }
  };

  // Calculate dimensions based on screen size and widget size
  const calculateDimensions = () => {
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 32; // Total horizontal padding
    const availableWidth = screenWidth - containerPadding;

    // Calculate width based on widget size
    let width = availableWidth;

    // Calculate height based on widget type and size
    let height;
    if (widget.type === 'gallery') {
      height = width; // Square for gallery
    } else if (widget.size.width === 3) {
      height = width / 2; // Half width for large widgets
    } else if (widget.size.width === 2) {
      height = width / 3; // Third width for medium widgets
    } else {
      height = width / 4; // Quarter width for small widgets
    }

    return { width, height };
  };

  const dimensions = calculateDimensions();
  const channelColor = getChannelColor(widget.channel);

  // Render content based on widget type
  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'media':
        return (
          <View style={styles.mediaContent}>
            <View style={styles.placeholderMedia}>
              <Image size={40} color="#666666" />
            </View>
            {widget.featuredCaption && (
              <View style={styles.captionContainer}>
                <Text style={styles.captionText}>{widget.featuredCaption}</Text>
              </View>
            )}
          </View>
        );

      case 'gallery':
        return (
          <View style={styles.galleryContent}>
            <View style={styles.galleryGrid}>
              {Array(6).fill(0).map((_, index) => (
                <View key={index} style={styles.galleryItem}>
                  <View style={styles.placeholderGalleryItem}>
                    <Image size={20} color="#666666" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case 'text':
        return (
          <View style={styles.textContent}>
            {widget.content?.title && (
              <Text style={styles.textTitle}>{widget.content.title}</Text>
            )}
            {widget.content?.body && (
              <Text style={styles.textBody}>{widget.content.body}</Text>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>{widget.title || widget.type}</Text>
          </View>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: channelColor,
          borderWidth: channelColor !== 'transparent' ? 2 : 0,
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.widgetContent,
          { height: dimensions.height }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {renderWidgetContent()}

        {/* Featured indicator */}
        {widget.isFeatured && (
          <View style={styles.featuredIndicator}>
            <Star size={16} color="#FFFFFF" fill={channelColor !== 'transparent' ? channelColor : '#4CAF50'} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  widgetContent: {
    backgroundColor: '#2A2A2A',
    width: '100%',
  },
  mediaContent: {
    flex: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  captionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  galleryContent: {
    flex: 1,
  },
  galleryGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryItem: {
    width: '33.33%',
    height: '50%',
    padding: 1,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  placeholderMedia: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderGalleryItem: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    padding: 16,
  },
  textTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featuredIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
