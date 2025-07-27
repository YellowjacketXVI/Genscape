import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageSquare, Share2, Bookmark, Search, Bell, LogOut, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import FeedLayout, { FeedCard } from '@/components/scape/FeedLayout';

// Mock data for demonstration
const FEED_DATA = [
  {
    id: '1',
    username: 'creative_minds',
    title: 'Digital Dreams',
    description: 'A collection of AI-generated landscapes',
    coverImage: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
    likes: 128,
    comments: 32,
    saved: false,
  },
  {
    id: '2',
    username: 'future_visions',
    title: 'Neon City',
    description: 'Futuristic cityscapes with a cyberpunk aesthetic',
    coverImage: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
    likes: 256,
    comments: 48,
    saved: true,
  },
  {
    id: '3',
    username: 'audio_creator',
    title: 'Ambient Soundscapes',
    description: 'AI-generated ambient music for relaxation',
    coverImage: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg',
    likes: 89,
    comments: 15,
    saved: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [feedData, setFeedData] = useState(FEED_DATA);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleSave = (id: string) => {
    setFeedData(feedData.map(item =>
      item.id === id ? { ...item, saved: !item.saved } : item
    ));
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        },
      ]
    );
  };

  return (
    <FeedLayout>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Genscape</Text>
          {profile && (
            <Text style={styles.welcomeText}>
              Welcome, {profile.full_name || profile.username || 'User'}!
            </Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedCard>
            <ScapeCard
              item={item}
              onSave={() => toggleSave(item.id)}
            />
          </FeedCard>
        )}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </FeedLayout>
  );
}

function ScapeCard({ item, onSave }: { item: any, onSave: () => void }) {
  return (
    <View style={styles.scapeCard}>
      <Image
        source={{ uri: item.coverImage }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.username}>@{item.username}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.statItem}>
            <Heart size={20} color={Colors.text.muted} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageSquare size={20} color={Colors.text.muted} />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
          <TouchableOpacity style={styles.statItem}>
            <Share2 size={20} color={Colors.text.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={onSave}>
            <Bookmark
              size={20}
              fill={item.saved ? Colors.primary : 'none'}
              color={item.saved ? Colors.primary : Colors.text.muted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background.dark,
    width: 593, // Match card width
    maxWidth: '100%',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  feedContent: {
    paddingBottom: 80, // Account for tab bar
  },
  scapeCard: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 300, // Increased height for the larger card
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  followButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  followButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    marginLeft: 4,
  },
});