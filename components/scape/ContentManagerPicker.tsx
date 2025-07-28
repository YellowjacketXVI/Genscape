import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { X, Check, Image as ImageIcon, Music, Video } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMedia } from '@/hooks/useMedia';
import { MediaItem } from '@/types/media';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface ContentManagerPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (mediaIds: string[]) => void;
  allowMultiple?: boolean;
  mediaType?: 'image' | 'video' | 'audio' | 'all';
  selectedIds?: string[];
}

export default function ContentManagerPicker({
  isVisible,
  onClose,
  onSelect,
  allowMultiple = true,
  mediaType = 'all',
  selectedIds = [],
}: ContentManagerPickerProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);
  
  const {
    mediaItems,
    loading,
    error,
    updateFilter,
    fetchMedia
  } = useMedia();

  useEffect(() => {
    if (isVisible && user) {
      // Apply media type filter
      updateFilter({ 
        media_type: mediaType === 'all' ? undefined : mediaType 
      });
    }
  }, [isVisible, mediaType, user]);

  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  const handleToggleSelection = (mediaId: string) => {
    if (allowMultiple) {
      setLocalSelectedIds(prev => 
        prev.includes(mediaId)
          ? prev.filter(id => id !== mediaId)
          : [...prev, mediaId]
      );
    } else {
      setLocalSelectedIds([mediaId]);
    }
  };

  const handleConfirm = () => {
    onSelect(localSelectedIds);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedIds);
    onClose();
  };

  const getMediaIcon = (item: MediaItem) => {
    switch (item.media_type) {
      case 'image':
        return <ImageIcon size={16} color={theme.colors.textSecondary} />;
      case 'video':
        return <Video size={16} color={theme.colors.textSecondary} />;
      case 'audio':
        return <Music size={16} color={theme.colors.textSecondary} />;
      default:
        return <ImageIcon size={16} color={theme.colors.textSecondary} />;
    }
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    const isSelected = localSelectedIds.includes(item.id);
    const canShowThumbnail = item.media_type === 'image' || item.media_type === 'video';
    
    return (
      <TouchableOpacity
        style={[
          styles.mediaItem,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          }
        ]}
        onPress={() => handleToggleSelection(item.id)}
      >
        <View style={styles.mediaPreview}>
          {canShowThumbnail && item.thumbnail_path ? (
            <Image
              source={{ 
                uri: `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${item.thumbnail_path}` 
              }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.background }]}>
              {getMediaIcon(item)}
            </View>
          )}
          
          {isSelected && (
            <View style={[styles.selectedOverlay, { backgroundColor: theme.colors.primary }]}>
              <Check size={20} color={theme.colors.textPrimary} />
            </View>
          )}
        </View>
        
        <View style={styles.mediaInfo}>
          <Text 
            style={[styles.mediaName, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text style={[styles.mediaType, { color: theme.colors.textSecondary }]}>
            {item.media_type.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <LoadingScreen />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Select {mediaType === 'all' ? 'Media' : mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
          </Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <X size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              Failed to load media items
            </Text>
          </View>
        )}

        <View style={styles.content}>
          {mediaItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No {mediaType === 'all' ? 'media' : mediaType} items found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textMuted }]}>
                Upload some files in the Content Manager first
              </Text>
            </View>
          ) : (
            <FlatList
              data={mediaItems}
              renderItem={renderMediaItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.selectionCount, { color: theme.colors.textSecondary }]}>
            {localSelectedIds.length} selected
          </Text>
          <View style={styles.footerButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              style={styles.footerButton}
            />
            <Button
              title="Confirm"
              onPress={handleConfirm}
              variant="primary"
              style={styles.footerButton}
              disabled={localSelectedIds.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  closeButton: {
    padding: 4,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  mediaItem: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  mediaPreview: {
    position: 'relative',
    aspectRatio: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    padding: 12,
  },
  mediaName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  mediaType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  selectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    minWidth: 80,
  },
});
