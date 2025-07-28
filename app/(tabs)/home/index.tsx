import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageSquare, Share2, Bookmark, Search, Bell, LogOut, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
// import FeedLayout, { FeedCard } from '@/components/scape/FeedLayout';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

// Mock data for demonstration
const FEED_DATA = [
  {
    id: '1',
    username: 'creative_minds',
    title: 'Digital Dreams',
    description: 'A collection of AI-generated landscapes',
    coverImage: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    likes: 128,
    comments: 32,
    saved: false,
    liked: false,
    following: false,
    hasShop: true,
    isGenId: false,
  },
  {
    id: '2',
    username: 'future_visions',
    title: 'Neon City',
    description: 'Futuristic cityscapes with a cyberpunk aesthetic',
    coverImage: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
    likes: 256,
    comments: 48,
    saved: true,
    liked: true,
    following: true,
    hasShop: false,
    isGenId: true,
  },
  {
    id: '3',
    username: 'audio_creator',
    title: 'Ambient Soundscapes',
    description: 'AI-generated ambient music for relaxation',
    coverImage: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    likes: 89,
    comments: 15,
    saved: false,
    liked: false,
    following: false,
    hasShop: true,
    isGenId: false,
  },
];

type FeedSegment = 'explore' | 'followed' | 'shop' | 'genId';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, profile, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [feedData, setFeedData] = useState(FEED_DATA);
  const [segment, setSegment] = useState<FeedSegment>('explore');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleLike = (scapeId: string) => {
    setFeedData(prev => prev.map(item =>
      item.id === scapeId
        ? { ...item, likes: item.likes + (item.liked ? -1 : 1), liked: !item.liked }
        : item
    ));
  };

  const handleFollow = (creatorId: string, isFollowing: boolean) => {
    setFeedData(prev => prev.map(item =>
      item.username === creatorId
        ? { ...item, following: !isFollowing }
        : item
    ));
  };

  const handleOpenScape = (scapeId: string) => {
    router.push(`/scape/${scapeId}`);
  };

  const getFilteredFeedData = () => {
    let filtered = feedData;

    // Filter by segment
    switch (segment) {
      case 'followed':
        filtered = filtered.filter(item => item.following);
        break;
      case 'shop':
        filtered = filtered.filter(item => item.hasShop);
        break;
      case 'genId':
        filtered = filtered.filter(item => item.isGenId);
        break;
      default: // explore
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Genscape</Text>
          {profile && (
            <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
              Welcome, {profile.full_name || profile.username || 'User'}!
            </Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search scapes, creators..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.segmentContainer}>
        <SegmentedControl
          segments={['explore', 'followed', 'shop', 'genId'] as const}
          selectedSegment={segment}
          onSegmentChange={setSegment}
          segmentLabels={{
            explore: 'Explore',
            followed: 'Following',
            shop: 'Shop',
            genId: 'GenID',
          }}
        />
      </View>

      <FlatList
        data={getFilteredFeedData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScapeCard
            item={item}
            onSave={() => toggleSave(item.id)}
            onLike={() => handleLike(item.id)}
            onFollow={() => handleFollow(item.username, item.following)}
            onOpenScape={() => handleOpenScape(item.id)}
          />
        )}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

interface ScapeCardProps {
  item: any;
  onSave: () => void;
  onLike: () => void;
  onFollow: () => void;
  onOpenScape: () => void;
}

function ScapeCard({ item, onSave, onLike, onFollow, onOpenScape }: ScapeCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.scapeCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
      <TouchableOpacity onPress={onOpenScape} activeOpacity={0.9}>
        <Image
          source={{ uri: item.coverImage }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Avatar
              source={{ uri: item.avatar }}
              size="sm"
              fallbackText={item.username}
            />
            <Text style={[styles.username, { color: theme.colors.textPrimary }]}>@{item.username}</Text>
          </View>
          <Button
            title={item.following ? 'Following' : 'Follow'}
            onPress={onFollow}
            variant={item.following ? 'secondary' : 'primary'}
            size="sm"
          />
        </View>

        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.statItem} onPress={onLike}>
            <Heart
              size={20}
              fill={item.liked ? theme.colors.primary : 'none'}
              color={item.liked ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.likes}</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <MessageSquare size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.comments}</Text>
          </View>
          <TouchableOpacity style={styles.statItem}>
            <Share2 size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={onSave}>
            <Bookmark
              size={20}
              fill={item.saved ? theme.colors.primary : 'none'}
              color={item.saved ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  username: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
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