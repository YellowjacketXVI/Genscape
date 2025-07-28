import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWidgetChannel } from '@/contexts/ChannelContext';
import { ScapeEditorWidget } from '@/types/scape-editor';
import { MediaItem } from '@/types/media';

interface ImageWidgetProps {
  widget: ScapeEditorWidget;
  mediaItems?: MediaItem[];
  onMediaPress?: (mediaId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function ImageWidget({ widget, mediaItems = [], onMediaPress }: ImageWidgetProps) {
  const theme = useTheme();
  const { isActive, activeDrivingMedia, setAsActive } = useWidgetChannel(widget.id, widget.channel);
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);

  // Get media IDs from widget data
  const widgetMediaIds = widget.data.mediaIds || [];
  const displayMediaItems = mediaItems.filter(item => widgetMediaIds.includes(item.id));

  // Determine which media to display
  useEffect(() => {
    if (widget.channel && widget.channel !== 'neutral' && activeDrivingMedia) {
      // If this widget is subscribed to a channel and there's driving media, use that
      setCurrentMediaId(activeDrivingMedia);
    } else if (displayMediaItems.length > 0) {
      // Otherwise, use the first media item
      setCurrentMediaId(displayMediaItems[0].id);
    } else {
      setCurrentMediaId(null);
    }
  }, [activeDrivingMedia, displayMediaItems, widget.channel]);

  const currentMedia = displayMediaItems.find(item => item.id === currentMediaId);

  const handleMediaPress = (mediaId: string) => {
    // Set this media as the driving media for the channel
    if (widget.channel && widget.channel !== 'neutral') {
      setAsActive(mediaId);
    }
    
    // Update local state
    setCurrentMediaId(mediaId);
    
    // Call external handler if provided
    onMediaPress?.(mediaId);
  };

  const getImageUrl = (media: MediaItem) => {
    if (media.file_path.startsWith('http')) {
      return media.file_path;
    }
    return `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${media.file_path}`;
  };

  if (displayMediaItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.placeholder, { borderColor: theme.colors.border }]}>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            No images selected
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Widget Title */}
      {widget.data.title && (
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {widget.data.title}
        </Text>
      )}

      {/* Main Image Display */}
      {currentMedia && (
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: getImageUrl(currentMedia) }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* Channel Indicator */}
          {widget.channel && widget.channel !== 'neutral' && (
            <View style={[
              styles.channelIndicator,
              { 
                backgroundColor: isActive ? theme.colors[widget.channel] : theme.colors.surface,
                borderColor: theme.colors[widget.channel],
              }
            ]}>
              <Text style={[
                styles.channelText,
                { color: isActive ? theme.colors.textPrimary : theme.colors[widget.channel] }
              ]}>
                {widget.channel.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Description */}
      {widget.data.description && (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {widget.data.description}
        </Text>
      )}

      {/* Thumbnail Gallery (if multiple images) */}
      {displayMediaItems.length > 1 && (
        <View style={styles.thumbnailContainer}>
          {displayMediaItems.map((media) => (
            <TouchableOpacity
              key={media.id}
              style={[
                styles.thumbnail,
                {
                  borderColor: currentMediaId === media.id ? theme.colors.primary : theme.colors.border,
                  borderWidth: currentMediaId === media.id ? 2 : 1,
                }
              ]}
              onPress={() => handleMediaPress(media.id)}
            >
              <Image
                source={{ uri: getImageUrl(media) }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  placeholder: {
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  mainImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  channelIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  channelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
