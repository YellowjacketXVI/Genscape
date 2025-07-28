import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMedia } from '@/hooks/useMedia';
import { MediaItem } from '@/types/media';

interface BannerSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string) => void;
}

export default function BannerSelector({
  isVisible,
  onClose,
  onSelect,
}: BannerSelectorProps) {
  const theme = useTheme();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const {
    mediaItems,
    loading,
    error,
    fetchMedia
  } = useMedia({
    media_type: 'image'
  });

  useEffect(() => {
    if (isVisible) {
      fetchMedia();
    }
  }, [isVisible]);

  const handleMediaSelect = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const handleConfirmSelection = () => {
    if (selectedMedia?.url) {
      onSelect(selectedMedia.url);
    }
  };

  const renderMediaItem = (item: MediaItem) => {
    const isSelected = selectedMedia?.id === item.id;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.mediaItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          }
        ]}
        onPress={() => handleMediaSelect(item)}
      >
        {item.url ? (
          <Image
            source={{ uri: item.thumbnail_url || item.url }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mediaPlaceholder, { backgroundColor: theme.colors.background }]}>
            <ImageIcon size={24} color={theme.colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.mediaInfo}>
          <Text 
            style={[styles.mediaName, { color: theme.colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.mediaSize, { color: theme.colors.textSecondary }]}>
            {item.width && item.height ? `${item.width}×${item.height}` : 'Unknown size'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Select Banner Image
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                  Loading images...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  Failed to load images
                </Text>
              </View>
            ) : mediaItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <ImageIcon size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No images found
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
                  Upload some images to use as banners
                </Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.mediaList}
                showsVerticalScrollIndicator={false}
              >
                {mediaItems.map(renderMediaItem)}
              </ScrollView>
            )}
          </View>

          {/* Footer */}
          {selectedMedia && (
            <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmSelection}
              >
                <Text style={styles.selectButtonText}>
                  Use as Banner
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    height: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  mediaList: {
    flex: 1,
    padding: 20,
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  mediaImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mediaPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mediaName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  mediaSize: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  selectButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
