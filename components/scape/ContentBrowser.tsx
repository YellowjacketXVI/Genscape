import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, useWindowDimensions } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import { X } from 'lucide-react-native';
import MediaItem from '@/components/media/MediaItem';
import Colors from '@/constants/Colors';
import { getTestUserMedia } from '@/utils/mediaAssets';

type ContentBrowserProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mediaId: string) => void;
  widgetType: string;
};

// Load media from local assets
const MOCK_MEDIA = getTestUserMedia();

export default function ContentBrowser({ visible, onClose, onSelect, widgetType }: ContentBrowserProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      filteredMedia.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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

    const handlePress = () => {
      setSelectedId(item.id);
    };

    return (
      <TouchableOpacity style={styles.mediaItem} onPress={handlePress}>
        <MediaItem item={mappedItem} selected={item.id === selectedId} onPress={handlePress} />
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

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmButton, !selectedId && styles.confirmButtonDisabled]}
            disabled={!selectedId}
            onPress={() => {
              if (selectedId) {
                onSelect(selectedId);
                setSelectedId(null);
              }
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.medium,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});
