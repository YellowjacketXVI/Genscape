import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Grid2x2 as GridIcon, List, Database, Wand as Wand2, Search, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMedia } from '@/hooks/useMedia';
import { useAuth } from '@/contexts/AuthContext';
import MediaUpload from '@/components/media/MediaUpload';
import SimpleMediaUpload from '@/components/media/SimpleMediaUpload';
import MediaGrid from '@/components/media/MediaGrid';
import { MediaType } from '@/types/media';
import Button from '@/components/ui/Button';
import { StorageService, StorageData } from '@/services/storageService';

export default function ContentManagerScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedType, setSelectedType] = useState<'all' | MediaType>('all');
  const [storageData, setStorageData] = useState<StorageData>({
    used: 0,
    total: 50,
    breakdown: { images: 0, videos: 0, audio: 0 }
  });

  const {
    mediaItems,
    loading,
    error,
    deleteMedia,
    updateFilter,
    fetchMedia
  } = useMedia(); // Start with no initial filter

  const handleFilterChange = (type: 'all' | MediaType) => {
    setSelectedType(type);
    updateFilter({ media_type: type === 'all' ? undefined : type });
  };

  const handleUploadComplete = () => {
    // Media list will be automatically refreshed by the uploadMedia function
    // No need to manually call fetchMedia here
  };

  // Calculate storage data when media items change
  useEffect(() => {
    const newStorageData = StorageService.calculateStorageFromMediaItems(mediaItems);
    setStorageData(newStorageData);
  }, [mediaItems]);

  const handleDeleteMedia = async (item: any) => {
    try {
      await deleteMedia(item.id);
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const getStoragePercentage = () => {
    return StorageService.getStoragePercentage(storageData.used, storageData.total);
  };

  const getStorageColor = () => {
    const percentage = getStoragePercentage();
    return StorageService.getStorageColor(percentage);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Your Content</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewModeButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List size={20} color={theme.colors.textPrimary} />
            ) : (
              <GridIcon size={20} color={theme.colors.textPrimary} />
            )}
          </TouchableOpacity>
          <SimpleMediaUpload onUploadComplete={handleUploadComplete} />
          <MediaUpload onUploadComplete={handleUploadComplete} />
        </View>
      </View>

      {/* Storage Indicator */}
      <View style={[styles.storageSection, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.storageHeader}>
          <Text style={[styles.storageTitle, { color: theme.colors.textPrimary }]}>Storage</Text>
          <Text style={[styles.storageText, { color: theme.colors.textSecondary }]}>
            {storageData.used} GB of {storageData.total} GB used
          </Text>
        </View>
        <View style={[styles.storageBar, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.storageProgress,
              {
                width: `${getStoragePercentage()}%`,
                backgroundColor: getStorageColor(),
              }
            ]}
          />
        </View>
        <View style={styles.storageBreakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.breakdownText, { color: theme.colors.textSecondary }]}>
              Images: {storageData.breakdown.images} GB
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: theme.colors.accent }]} />
            <Text style={[styles.breakdownText, { color: theme.colors.textSecondary }]}>
              Videos: {storageData.breakdown.videos} GB
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.breakdownDot, { backgroundColor: theme.colors.secondary }]} />
            <Text style={[styles.breakdownText, { color: theme.colors.textSecondary }]}>
              Audio: {storageData.breakdown.audio} GB
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/generate')}
        >
          <Wand2 size={24} color={Colors.text.primary} />
          <Text style={styles.actionButtonText}>Generate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/lora-studio')}
        >
          <Database size={24} color={Colors.text.primary} />
          <Text style={styles.actionButtonText}>LoRA Studio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterChips}
        contentContainerStyle={styles.filterChipsContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'all' && styles.activeFilterChip]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={selectedType === 'all' ? styles.activeFilterText : styles.filterText}>
            All Files
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'image' && styles.activeFilterChip]}
          onPress={() => handleFilterChange('image')}
        >
          <Text style={selectedType === 'image' ? styles.activeFilterText : styles.filterText}>
            Images
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'audio' && styles.activeFilterChip]}
          onPress={() => handleFilterChange('audio')}
        >
          <Text style={selectedType === 'audio' ? styles.activeFilterText : styles.filterText}>
            Audio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'video' && styles.activeFilterChip]}
          onPress={() => handleFilterChange('video')}
        >
          <Text style={selectedType === 'video' ? styles.activeFilterText : styles.filterText}>
            Video
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <MediaGrid
        items={mediaItems}
        onItemDelete={handleDeleteMedia}
        loading={loading}
      />
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  storageSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  storageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  storageProgress: {
    height: '100%',
    borderRadius: 4,
  },
  storageBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  breakdownText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  filterChips: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: 50,
  },
  filterChipsContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background.medium,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activeFilterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
  },

});