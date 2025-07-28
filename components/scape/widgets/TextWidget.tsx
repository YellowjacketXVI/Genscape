import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWidgetChannel } from '@/contexts/ChannelContext';
import { ScapeEditorWidget } from '@/types/scape-editor';
import { MediaItem } from '@/types/media';

interface TextWidgetProps {
  widget: ScapeEditorWidget;
  mediaItems?: MediaItem[];
}

export default function TextWidget({ widget, mediaItems = [] }: TextWidgetProps) {
  const theme = useTheme();
  const { isActive, activeDrivingMedia, channelState } = useWidgetChannel(widget.id, widget.channel);
  const [displayContent, setDisplayContent] = useState({
    header: widget.data.header || '',
    title: widget.data.title || '',
    body: widget.data.body || '',
  });

  // Update content based on driving media when channel is active
  useEffect(() => {
    if (widget.channel && widget.channel !== 'neutral' && activeDrivingMedia) {
      // Find the driving media item
      const drivingMedia = mediaItems.find(item => item.id === activeDrivingMedia);
      
      if (drivingMedia) {
        // Update content to reflect the driving media
        setDisplayContent({
          header: widget.data.header || '',
          title: drivingMedia.name || widget.data.title || '',
          body: drivingMedia.description || widget.data.body || '',
        });
      }
    } else {
      // Use original widget content
      setDisplayContent({
        header: widget.data.header || '',
        title: widget.data.title || '',
        body: widget.data.body || '',
      });
    }
  }, [activeDrivingMedia, mediaItems, widget.data, widget.channel]);

  const getChannelIndicatorStyle = () => {
    if (!widget.channel || widget.channel === 'neutral') return null;
    
    return {
      backgroundColor: isActive ? theme.colors[widget.channel] : 'transparent',
      borderColor: theme.colors[widget.channel],
      borderWidth: 1,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Channel Indicator */}
      {widget.channel && widget.channel !== 'neutral' && (
        <View style={[styles.channelIndicator, getChannelIndicatorStyle()]}>
          <Text style={[
            styles.channelText,
            { color: isActive ? theme.colors.textPrimary : theme.colors[widget.channel] }
          ]}>
            {widget.channel.toUpperCase()} {isActive ? '● ACTIVE' : '○'}
          </Text>
        </View>
      )}

      {/* Header */}
      {displayContent.header && (
        <Text style={[styles.header, { color: theme.colors.textSecondary }]}>
          {displayContent.header}
        </Text>
      )}

      {/* Title */}
      {displayContent.title && (
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {displayContent.title}
        </Text>
      )}

      {/* Body */}
      {displayContent.body && (
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {displayContent.body}
        </Text>
      )}

      {/* Tags */}
      {widget.data.tags && widget.data.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {widget.data.tags.map((tag: string, index: number) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Channel Status Indicator */}
      {widget.channel && widget.channel !== 'neutral' && channelState && (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: theme.colors.textMuted }]}>
            {isActive 
              ? `Driving ${widget.channel} channel` 
              : `Listening to ${widget.channel} channel`
            }
          </Text>
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
    position: 'relative',
  },
  channelIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  channelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  header: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    lineHeight: 28,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
});
