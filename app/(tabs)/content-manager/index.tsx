import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Grid2x2 as GridIcon, Database, Wand as Wand2, Search, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useMedia } from '@/hooks/useMedia';
import { useAuth } from '@/contexts/AuthContext';
import MediaUpload from '@/components/media/MediaUpload';
import MediaGrid from '@/components/media/MediaGrid';
import { MediaType } from '@/types/media';

export default function ContentManagerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedType, setSelectedType] = useState<'all' | MediaType>('all');

  const {
    mediaItems,
    loading,
    error,
    deleteMedia,
    updateFilter,
    fetchMedia
  } = useMedia({
    media_type: selectedType === 'all' ? undefined : selectedType
  });

  const handleFilterChange = (type: 'all' | MediaType) => {
    setSelectedType(type);
    updateFilter({ media_type: type === 'all' ? undefined : type });
  };

  const handleUploadComplete = () => {
    fetchMedia();
  };

  const handleDeleteMedia = async (item: any) => {
    try {
      await deleteMedia(item.id);
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Content</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <GridIcon size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <MediaUpload onUploadComplete={handleUploadComplete} />
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
    backgroundColor: Colors.background.dark,
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
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: 8,
    marginRight: 12,
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