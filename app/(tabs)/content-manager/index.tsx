import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Pressable, useWindowDimensions, Platform, ScrollView, Modal } from 'react-native';
import { Folder, Music, Video, Image as ImageIcon, Upload, Grid2x2 as GridIcon, Database, Wand as Wand2, Grid, Maximize, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

// Mock data for demonstration
const CONTENT_DATA = [
  {
    id: 'folder-1',
    type: 'folder',
    name: 'Landscapes',
    itemCount: 12,
    thumbnail: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
  },
  {
    id: 'folder-2',
    type: 'folder',
    name: 'Portraits',
    itemCount: 8,
    thumbnail: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
  },
  {
    id: 'image-1',
    type: 'image',
    name: 'Sunset Beach',
    date: '2023-06-15',
    thumbnail: 'https://images.pexels.com/photos/1714455/pexels-photo-1714455.jpeg',
  },
  {
    id: 'image-2',
    type: 'image',
    name: 'Mountain View',
    date: '2023-07-23',
    thumbnail: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg',
  },
  {
    id: 'video-1',
    type: 'video',
    name: 'Forest Walk',
    duration: '0:45',
    thumbnail: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg',
  },
  {
    id: 'audio-1',
    type: 'audio',
    name: 'Summer Breeze',
    duration: '3:28',
    thumbnail: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
  },
  {
    id: 'lora-1',
    type: 'lora',
    name: 'Character Style',
    status: 'Trained',
    thumbnail: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
  },
];

export default function ContentManagerScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [content, setContent] = useState(CONTENT_DATA);
  const [selectedType, setSelectedType] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom level (25-100)
  const [selectedItem, setSelectedItem] = useState<any>(null); // For detail overlay
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Calculate number of columns based on zoom level
  const getColumnsCount = () => {
    if (viewMode === 'list') return 1;

    // For grid view, calculate columns based on zoom level for smoother transitions
    // This creates a continuous scale from 6 columns at 25% to 2 columns at 100%
    if (zoomLevel <= 25) return 6; // 6 columns at 25% zoom (minimum)
    if (zoomLevel >= 100) return 2; // 2 columns at 100% zoom (maximum)

    // Linear interpolation between zoom levels
    // 25% -> 6 columns, 50% -> 4 columns, 75% -> 3 columns, 100% -> 2 columns
    const normalizedZoom = (zoomLevel - 25) / 75; // 0 at 25%, 1 at 100%
    const columnsFloat = 6 - (normalizedZoom * 4); // Scale from 6 down to 2
    return Math.round(columnsFloat);
  };

  // Handle zoom level change
  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(Math.max(25, Math.min(100, newZoomLevel)));
  };

  // Calculate the position of the thumb on the slider (scaled to fit the 25-100% range on the shorter track)
  const getThumbPosition = () => {
    // Convert the 25-100% range to 0-100% for the slider
    return ((zoomLevel - 25) / 75) * 100;
  };

  // Update the zoom track fill width when zoom level changes
  useEffect(() => {
    // This is needed for platforms where direct style updates don't work
    // Force re-render when zoom level changes
  }, [zoomLevel]);

  // Check if we're on desktop or mobile
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // Handle pinch gesture for mobile zoom
  const onPinchGestureEvent = (event: any) => {
    if (Platform.OS !== 'web') {
      // Scale zoom level based on pinch scale
      // Map the pinch scale (typically 0.5-2.0) to our zoom range (25-100)
      const newZoomLevel = Math.max(25, Math.min(100, zoomLevel * event.nativeEvent.scale));
      setZoomLevel(newZoomLevel);
    }
  };

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Update the base zoom level when the gesture ends
      const newZoomLevel = Math.max(25, Math.min(100, zoomLevel * event.nativeEvent.scale));
      setZoomLevel(newZoomLevel);
    }
  };

  const filteredContent = content.filter(item =>
    selectedType === 'all' || item.type === selectedType
  );

  const getIconForType = (type: string, size: number = 24) => {
    switch (type) {
      case 'folder':
        return <Folder size={size} color={Colors.text.primary} />;
      case 'music':
      case 'audio':
        return <Music size={size} color={Colors.text.primary} />;
      case 'video':
        return <Video size={size} color={Colors.text.primary} />;
      case 'image':
        return <ImageIcon size={size} color={Colors.text.primary} />;
      case 'lora':
        return <Database size={size} color={Colors.text.primary} />;
      default:
        return <Folder size={size} color={Colors.text.primary} />;
    }
  };

  // Show detail overlay for an item
  const showItemDetail = (item: any) => {
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  // Close detail overlay
  const closeItemDetail = () => {
    setDetailModalVisible(false);
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
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={20} color="#FFF" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'grid' && (
        <View style={styles.zoomContainer}>
          <TouchableOpacity onPress={() => handleZoomChange(25)}>
            <Grid size={16} color={zoomLevel <= 25 ? Colors.primary : Colors.text.secondary} />
          </TouchableOpacity>
          <View style={styles.zoomSlider}>
            <Pressable
              style={styles.zoomTrack}
              onPress={(event) => {
                const { locationX } = event.nativeEvent;
                // For web and native compatibility
                const trackWidth = Platform.OS === 'web'
                  ? (event.nativeEvent.target?.width || 100)
                  : 100; // Default width for native
                // Scale from 25% to 100% based on slider position
                const newZoomLevel = Math.round(25 + (locationX / trackWidth) * 75);
                handleZoomChange(newZoomLevel);
              }}
            >
              <View
                style={[styles.zoomTrackFill, { width: `${getThumbPosition()}%` }]}
              />
              <View
                style={[styles.zoomThumb, { left: `${getThumbPosition() - 5}%` }]}
              />
            </Pressable>
          </View>
          <TouchableOpacity onPress={() => handleZoomChange(100)}>
            <Maximize size={16} color={zoomLevel >= 100 ? Colors.primary : Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.zoomText}>{zoomLevel}%</Text>
        </View>
      )}

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

      <View style={styles.filterChips}>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'all' && styles.activeFilterChip]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={selectedType === 'all' ? styles.activeFilterText : styles.filterText}>
            All Files
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'image' && styles.activeFilterChip]}
          onPress={() => setSelectedType('image')}
        >
          <Text style={selectedType === 'image' ? styles.activeFilterText : styles.filterText}>
            Images
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'audio' && styles.activeFilterChip]}
          onPress={() => setSelectedType('audio')}
        >
          <Text style={selectedType === 'audio' ? styles.activeFilterText : styles.filterText}>
            Audio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'video' && styles.activeFilterChip]}
          onPress={() => setSelectedType('video')}
        >
          <Text style={selectedType === 'video' ? styles.activeFilterText : styles.filterText}>
            Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'lora' && styles.activeFilterChip]}
          onPress={() => setSelectedType('lora')}
        >
          <Text style={selectedType === 'lora' ? styles.activeFilterText : styles.filterText}>
            LoRA
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          // Calculate the size factor based on zoom level (25% to 100%)
          const normalizedZoom = (zoomLevel - 25) / 75; // 0 at 25%, 1 at 100%
          const sizeFactor = 0.25 + (normalizedZoom * 0.75); // Scale from 0.25 to 1.0

          // Use uniform height of 372px for grid items
          const gridItemHeight = 372; // Fixed uniform height

          if (viewMode === 'grid') {
            return (
              <TouchableOpacity
                style={[styles.gridItem, { height: gridItemHeight }]}
                onPress={() => showItemDetail(item)}
              >
                {item.type === 'folder' ? (
                  <View style={styles.folderContainer}>
                    {getIconForType(item.type, Math.max(24, 32 * sizeFactor))}
                    {zoomLevel > 30 && (
                      <Text style={[styles.folderCount, {fontSize: Math.max(12, 16 * sizeFactor)}]}>
                        {item.itemCount} items
                      </Text>
                    )}
                  </View>
                ) : (
                  <>
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={styles.gridThumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.gridItemTypeIcon}>
                      {getIconForType(item.type, 16)}
                    </View>
                    <View style={styles.gridItemGradient}>
                      <Text style={styles.gridItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.gridItemInfo}>
                        {item.duration ? item.duration : item.date}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            );
          } else {
            // List view
            return (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => showItemDetail(item)}
              >
                {item.type === 'folder' ? (
                  <View style={styles.listFolderIcon}>
                    {getIconForType(item.type, 24)}
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.listThumbnail}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemName}>
                    {item.name}
                  </Text>
                  <Text style={styles.listItemInfo}>
                    {item.type === 'folder'
                      ? `${item.itemCount} items`
                      : item.duration
                        ? item.duration
                        : item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
        numColumns={viewMode === 'grid' ? getColumnsCount() : 1}
        key={`${viewMode}-${zoomLevel}`} // Force re-render when zoom changes
        contentContainerStyle={styles.contentList}
      />

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeItemDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                {selectedItem && getIconForType(selectedItem.type, 20)}
                <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeItemDetail}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedItem && (
                <>
                  <Image
                    source={{ uri: selectedItem.thumbnail }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />

                  <View style={styles.modalInfo}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Type:</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                      </Text>
                    </View>

                    {selectedItem.duration && (
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalInfoLabel}>Duration:</Text>
                        <Text style={styles.modalInfoValue}>{selectedItem.duration}</Text>
                      </View>
                    )}

                    {selectedItem.date && (
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalInfoLabel}>Date:</Text>
                        <Text style={styles.modalInfoValue}>{selectedItem.date}</Text>
                      </View>
                    )}

                    {selectedItem.itemCount && (
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalInfoLabel}>Items:</Text>
                        <Text style={styles.modalInfoValue}>{selectedItem.itemCount}</Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
      </View>
  );
}

const styles = StyleSheet.create({

  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: -8,
    justifyContent: 'flex-end', // Align to the right side
  },

  // Content grid styles
  contentList: {
    padding: 3, // 3px spacing on all sides
    paddingBottom: 80,
  },

  gridItem: {
    flex: 1,
    margin: 3, // 3px spacing on all sides
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  gridThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  gridItemTypeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  gridItemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gridItemInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  folderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.text.primary,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    marginHorizontal: 3,
  },
  listFolderIcon: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: Colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  listItemInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
  },
  zoomSlider: {
    width: '25%', // Make the slider 1/4 of its original length
    marginHorizontal: 8,
    height: 24,
    justifyContent: 'center',
  },
  zoomTrack: {
    height: 4,
    backgroundColor: Colors.background.medium,
    borderRadius: 2,
    position: 'relative',
  },
  zoomTrackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  zoomThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    top: -6,
    marginLeft: -8,
  },
  zoomText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
    width: 40,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.background.dark,
    borderRadius: 12,
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.medium,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalInfo: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    width: 80,
  },
  modalInfoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background.medium,
    marginRight: 8,
    marginBottom: 8,
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
  contentList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  gridItem: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  folderThumbnail: {
    height: 150,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  folderCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.text.primary,
    marginTop: 8,
  },
  thumbnail: {
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  listThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  itemInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  listItemInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
  },
});