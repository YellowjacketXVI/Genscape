import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal, Dimensions, useWindowDimensions } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import { X } from 'lucide-react-native';
import MediaItem from '@/components/media/MediaItem';
import Colors from '@/constants/Colors';

type ContentBrowserProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mediaId: string) => void;
  widgetType: string;
};

// Mock media data
const MOCK_MEDIA = [
  {
    id: 'media-1',
    type: 'image',
    title: 'Landscape 1',
    thumbnail: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
    dateCreated: '2023-05-15',
  },
  {
    id: 'media-2',
    type: 'image',
    title: 'Cityscape',
    thumbnail: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
    dateCreated: '2023-06-22',
  },
  {
    id: 'media-3',
    type: 'image',
    title: 'Abstract Art',
    thumbnail: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg',
    dateCreated: '2023-07-10',
  },
  {
    id: 'audio-1',
    type: 'audio',
    title: 'Ambient Track',
    thumbnail: null,
    dateCreated: '2023-08-05',
  },
  {
    id: 'video-1',
    type: 'video',
    title: 'Motion Graphics',
    thumbnail: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg',
    dateCreated: '2023-09-18',
  },
];

export default function ContentBrowser({ visible, onClose, onSelect, widgetType }: ContentBrowserProps) {
  const [activeTab, setActiveTab] = useState('all');

  // Filter media based on widget type and active tab
  const getFilteredMedia = () => {
    let filteredMedia = [...MOCK_MEDIA];

    // Filter by media type based on widget type
    if (widgetType === 'media' || widgetType === 'gallery') {
      filteredMedia = filteredMedia.filter(media => media.type === 'image');
    } else if (widgetType === 'audio' || widgetType === 'audio-caption') {
      filteredMedia = filteredMedia.filter(media => media.type === 'audio');
    } else if (widgetType === 'video') {
      filteredMedia = filteredMedia.filter(media => media.type === 'video');
    }

    // Apply tab filters
    if (activeTab === 'recent') {
      // Sort by date, most recent first
      filteredMedia.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    } else if (activeTab !== 'all') {
      // Filter by media type
      filteredMedia = filteredMedia.filter(media => media.type === activeTab);
    }

    return filteredMedia;
  };

  const renderMediaItem = ({ item }: { item: any }) => {
    const mappedItem = {
      id: item.id,
      type: item.type,
      name: item.title,
      preview: item.thumbnail || '',
    };

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={() => onSelect(item.id)}>
        <MediaItem item={mappedItem} />
      </TouchableOpacity>
    );
  };

  // Detect if we're on desktop or mobile
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <AppContainer>
        <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Content</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'all' && styles.activeTabButton]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'recent' && styles.activeTabButton]}
            onPress={() => setActiveTab('recent')}
          >
            <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'image' && styles.activeTabButton]}
            onPress={() => setActiveTab('image')}
          >
            <Text style={[styles.tabText, activeTab === 'image' && styles.activeTabText]}>Images</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'audio' && styles.activeTabButton]}
            onPress={() => setActiveTab('audio')}
          >
            <Text style={[styles.tabText, activeTab === 'audio' && styles.activeTabText]}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'video' && styles.activeTabButton]}
            onPress={() => setActiveTab('video')}
          >
            <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>Video</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={getFilteredMedia()}
          renderItem={renderMediaItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.mediaList}
        />
      </View>
      </AppContainer>
    </Modal>
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
    backgroundColor: Colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.medium,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.medium,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: Colors.background.light,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: '#FFF',
  },
  mediaList: {
    padding: 16,
  },
  mediaItem: {
    width: '31%',
    marginHorizontal: '1%',
    marginBottom: 16,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaThumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.background.light,
  },
  mediaIconContainer: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    padding: 8,
  },
  mediaType: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
    paddingHorizontal: 8,
    paddingBottom: 8,
    textTransform: 'capitalize',
  },
});
