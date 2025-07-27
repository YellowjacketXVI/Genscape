import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { UploadCloud, FolderPlus, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import MediaItem from '@/components/media/MediaItem';

// Mock data for demonstration
const mockMediaItems = [
  { id: '1', type: 'image', name: 'Beach Sunset', preview: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg' },
  { id: '2', type: 'image', name: 'Mountain View', preview: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg' },
  { id: '3', type: 'video', name: 'City Timelapse', preview: 'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg' },
  { id: '4', type: 'audio', name: 'Ambient Music', preview: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg' },
  { id: '5', type: 'image', name: 'Forest Path', preview: 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg' },
];

export default function AddMediaStep() {
  const router = useRouter();

  const goToNextStep = () => {
    router.push('/scape-wizard/step3');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <UploadCloud size={24} color="#FFF" />
            <Text style={styles.actionButtonText}>Upload Media</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FolderPlus size={24} color="#FFF" />
            <Text style={styles.actionButtonText}>Create Folder</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recently Uploaded</Text>
        
        <FlatList
          data={mockMediaItems}
          renderItem={({ item }) => <MediaItem item={item} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaList}
          contentContainerStyle={styles.mediaListContent}
        />

        <Text style={styles.sectionTitle}>Your Folders</Text>
        
        <View style={styles.folderGrid}>
          <FolderItem name="Portraits" count={12} />
          <FolderItem name="Landscapes" count={8} />
          <FolderItem name="Audio Tracks" count={5} />
          <FolderItem name="Product Photos" count={20} />
        </View>

        <Text style={styles.sectionTitle}>Selected Media (0)</Text>
        <View style={styles.emptySelection}>
          <Text style={styles.emptyText}>No media selected yet.</Text>
          <Text style={styles.emptySubtext}>Tap on media items above to select them.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
          <Text style={styles.nextButtonText}>Next: Configure Widgets</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FolderItem({ name, count }: { name: string, count: number }) {
  return (
    <TouchableOpacity style={styles.folderItem}>
      <View style={styles.folderIcon}>
        <Text style={styles.folderCount}>{count}</Text>
      </View>
      <Text style={styles.folderName}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.background.medium,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  mediaList: {
    marginBottom: 24,
  },
  mediaListContent: {
    paddingRight: 16,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  folderItem: {
    width: '50%',
    padding: 8,
  },
  folderIcon: {
    backgroundColor: Colors.background.medium,
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  folderCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  folderName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptySelection: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
  },
  footer: {
    backgroundColor: Colors.background.dark,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});