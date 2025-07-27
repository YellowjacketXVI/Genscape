import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
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
  const [scapes, setScapes] = useState(SCAPES_DATA);
  const [filter, setFilter] = useState('all'); // 'all', 'following', 'published', 'drafts'
  
  const filteredScapes = scapes.filter((scape) => {
    if (filter === 'all') return true;
    if (filter === 'following') return scape.isFollowing;
    if (filter === 'published') return scape.isPublished;
    if (filter === 'drafts') return !scape.isPublished;
    return true;
  });

  const createNewScape = () => {
    router.push('/scape-wizard');
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
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'following' && styles.filterActive]}
          onPress={() => setFilter('following')}
        >
          <Text style={[styles.filterText, filter === 'following' && styles.filterTextActive]}>Following</Text>
        </TouchableOpacity>
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
        <FlatList
          data={filteredScapes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScapeItem 
              item={item}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

function ScapeItem({ item, onEdit, onDelete }: { item: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <View style={styles.scapeItem}>
      <Image 
        source={{ uri: item.coverImage }} 
        style={styles.scapeImage}
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
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
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
  },
  scapeImage: {
    width: '100%',
    height: 120,
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