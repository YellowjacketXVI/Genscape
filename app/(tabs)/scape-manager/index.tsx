import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Dimensions, Platform, useWindowDimensions } from 'react-native';
import ThemedScrollView from '@/components/layout/ThemedScrollView';
import { useRouter } from 'expo-router';
import { Plus, CirclePlus as PlusCircle, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Mock data for demonstration
const SCAPES_DATA = [
  {
    id: '1',
    title: 'Digital Dreams',
    description: 'A collection of AI-generated landscapes',
    coverImage: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
    widgetCount: 5,
    viewCount: 128,
    isPublished: true,
    isFollowing: true,
  },
  {
    id: '2',
    title: 'Neon City',
    description: 'Futuristic cityscapes with a cyberpunk aesthetic',
    coverImage: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
    widgetCount: 3,
    viewCount: 256,
    isPublished: true,
    isFollowing: false,
  },
  {
    id: '3',
    title: 'Ambient Soundscapes',
    description: 'AI-generated ambient music for relaxation',
    coverImage: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg',
    widgetCount: 6,
    viewCount: 89,
    isPublished: false,
    isFollowing: false,
  },
];

export default function ScapeManagerScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const [scapes, setScapes] = useState(SCAPES_DATA);
  const [filter, setFilter] = useState('published'); // 'published', 'drafts'

  const filteredScapes = scapes.filter((scape) => {
    if (filter === 'all') return true;
    if (filter === 'published') return scape.isPublished;
    if (filter === 'drafts') return !scape.isPublished;
    return true;
  });

  const createNewScape = () => {
    // Create a new scape and navigate to the edit page
    const newScapeId = `new-${Date.now()}`;
    router.push(`/scape-edit/${newScapeId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Scapes</Text>
        <TouchableOpacity style={styles.createButton} onPress={createNewScape}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {/* Removed 'All' filter to focus on published/drafts tabs */}
        <TouchableOpacity
          style={[styles.filterButton, filter === 'published' && styles.filterActive]}
          onPress={() => setFilter('published')}
        >
          <Text style={[styles.filterText, filter === 'published' && styles.filterTextActive]}>Published</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'drafts' && styles.filterActive]}
          onPress={() => setFilter('drafts')}
        >
          <Text style={[styles.filterText, filter === 'drafts' && styles.filterTextActive]}>Drafts</Text>
        </TouchableOpacity>
      </View>

      {filteredScapes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Scapes Found</Text>
          <Text style={styles.emptyDescription}>Create your first Scape to get started</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={createNewScape}>
            <PlusCircle size={20} color={Colors.primary} />
            <Text style={styles.emptyButtonText}>Create New Scape</Text>
          </TouchableOpacity>
        </View>
      ) : (
        Platform.OS === 'web' && isDesktop ? (
          <ThemedScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.scapesGrid}>
              {filteredScapes.map(item => (
                <View key={item.id} style={styles.gridItem}>
                  <ScapeItem
                    item={item}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isDesktop={isDesktop}
                  />
                </View>
              ))}
            </View>
          </ThemedScrollView>
        ) : (
          <FlatList
            data={filteredScapes}
            keyExtractor={(item) => item.id}
            numColumns={isDesktop ? 2 : 1} // Two columns on desktop, one on mobile
            key={isDesktop ? 'desktop' : 'mobile'} // Force re-render when layout changes
            columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined} // Only apply on desktop
            renderItem={({ item }) => (
              <ScapeItem
                item={item}
                onEdit={() => {}}
                onDelete={() => {}}
                isDesktop={isDesktop}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )
      )}
    </View>
  );
}

function ScapeItem({ item, onEdit, onDelete, isDesktop = false }: { item: any, onEdit: () => void, onDelete: () => void, isDesktop?: boolean }) {
  const router = useRouter();
  return (
    <View style={[styles.scapeItem, isDesktop && styles.desktopScapeItem]}>
      <Image
        source={{ uri: item.coverImage }}
        style={[styles.scapeImage, isDesktop && styles.desktopScapeImage]}
        resizeMode="cover"
      />

      <View style={styles.scapeContent}>
        <View style={styles.scapeHeader}>
          <Text style={styles.scapeTitle}>{item.title}</Text>
          {item.isPublished ? (
            <View style={styles.publishedBadge}>
              <Text style={styles.publishedText}>Published</Text>
            </View>
          ) : (
            <View style={styles.draftBadge}>
              <Text style={styles.draftText}>Draft</Text>
            </View>
          )}
        </View>

        <Text style={styles.scapeDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.scapeStats}>
          <Text style={styles.statText}>{item.widgetCount} widgets</Text>
          <Text style={styles.statText}>{item.viewCount} views</Text>
        </View>

        <View style={styles.scapeActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/scape-edit/${item.id}`)}
          >
            <Edit2 size={18} color={Colors.text.primary} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={18} color={Colors.text.primary} />
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Create styles with responsive values
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
    paddingTop: Platform.OS === 'web' ? 24 : 60, // Lower padding on web
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: Colors.background.medium,
  },
  filterActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  scrollViewContent: {
    paddingBottom: 80, // Account for tab bar
    width: '100%',
  },
  scapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
    gap: 24, // Use gap for consistent spacing between items - vertical spacing
    columnGap: 24, // Horizontal spacing between posts set to 24px
    width: '100%',
  },
  gridItem: {
    width: '48%', // Use percentage-based width for better scaling (slightly less than 50% to account for gap)
    marginBottom: 0, // Gap property handles the spacing
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    width: '100%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  scapeItem: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    // For mobile (single column), take full width minus margins
    width: '100%',
  },
  desktopScapeItem: {
    // For desktop (two columns), use percentage-based width for better scaling
    width: '100%', // Full width within its container (gridItem handles the width)
    marginBottom: 24,
  },
  scapeImage: {
    width: '100%',
    height: 120,
  },
  desktopScapeImage: {
    height: 160, // Taller image on desktop
  },
  scapeContent: {
    padding: 16,
  },
  scapeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scapeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    flex: 1,
  },
  publishedBadge: {
    backgroundColor: '#2D8E46',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  publishedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
  },
  draftBadge: {
    backgroundColor: '#888',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  draftText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
  },
  scapeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  scapeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
    marginRight: 16,
  },
  scapeActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 4,
  },
});