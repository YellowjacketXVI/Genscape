import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Music, Video, Image as ImageIcon, Check, Trash2, Edit3, Globe, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MediaGridProps, MediaItem } from '@/types/media';

interface MediaGridItemProps {
  item: MediaItem;
  onSelect?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  selectable?: boolean;
  isSelected?: boolean;
}

function MediaGridItem({ 
  item, 
  onSelect, 
  onDelete, 
  selectable = false, 
  isSelected = false 
}: MediaGridItemProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = () => {
    switch (item.media_type) {
      case 'audio':
        return <Music size={18} color="#FFF" />;
      case 'video':
        return <Video size={18} color="#FFF" />;
      default:
        return <ImageIcon size={18} color="#FFF" />;
    }
  };

  const handlePress = () => {
    if (selectable) {
      onSelect?.(item);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Media',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(item)
        },
      ]
    );
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity 
      style={[styles.gridItem, isSelected && styles.selectedItem]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.preview}>
        {item.media_type === 'image' && item.url ? (
          <>
            <Image 
              source={{ uri: item.thumbnail_url || item.url }} 
              style={styles.previewImage}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
            {imageError && (
              <View style={styles.errorOverlay}>
                <ImageIcon size={24} color={Colors.text.muted} />
                <Text style={styles.errorText}>Failed to load</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderPreview}>
            {getTypeIcon()}
            <Text style={styles.placeholderText}>{item.media_type.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.typeIcon}>
          {getTypeIcon()}
        </View>

        <View style={styles.visibilityIcon}>
          {item.is_public ? (
            <Globe size={14} color="#FFF" />
          ) : (
            <Lock size={14} color="#FFF" />
          )}
        </View>

        {selectable && isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkIcon}>
              <Check size={18} color="#FFF" />
            </View>
          </View>
        )}

        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={14} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.itemMeta}>
          {item.file_size && (
            <Text style={styles.metaText}>{formatFileSize(item.file_size)}</Text>
          )}
          {item.duration && (
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          )}
          {item.width && item.height && item.media_type === 'image' && (
            <Text style={styles.metaText}>{item.width}×{item.height}</Text>
          )}
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MediaGrid({ 
  items, 
  onItemSelect, 
  onItemDelete, 
  selectable = false, 
  selectedItems = [],
  loading = false 
}: MediaGridProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading media...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ImageIcon size={48} color={Colors.text.muted} />
        <Text style={styles.emptyTitle}>No media found</Text>
        <Text style={styles.emptySubtitle}>Upload some media to get started</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MediaGridItem
          item={item}
          onSelect={onItemSelect}
          onDelete={onItemDelete}
          selectable={selectable}
          isSelected={selectedItems.includes(item.id)}
        />
      )}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  preview: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.text.muted,
    marginTop: 4,
  },
  typeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(241, 90, 41, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.text.muted,
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginTop: 2,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFF',
  },
  moreTagsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.text.muted,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
