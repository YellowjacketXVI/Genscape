import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageSquare, Share2, Bookmark, Search, Bell, LogOut, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import FeedLayout, { FeedCard } from '@/components/scape/FeedLayout';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { fetchFeed, FeedScape } from '@/services/scapeService';
import { toggleLike, toggleSave, toggleFollow, getUserInteractions } from '@/services/feedService';
import Colors from '@/constants/Colors';

type FeedSegment = 'explore' | 'followed' | 'shop' | 'genId';

interface FeedItem extends FeedScape {
  // Add interaction states
  liked: boolean;
  saved: boolean;
  following: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [segment, setSegment] = useState<FeedSegment>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Load feed data
  const loadFeed = async () => {
    if (!user) return;

    try {
      setRefreshing(true);
      const data = await fetchFeed(segment, searchQuery.trim(), user.id);

      // Get user interactions for each scape
      const feedWithInteractions = await Promise.all(
        data.map(async (scape) => {
          const interactions = await getUserInteractions(scape.id, user.id);
          return {
            ...scape,
            liked: interactions.isLiked,
            saved: interactions.isSaved,
            following: interactions.isFollowing,
          };
        })
      );

      setFeedData(feedWithInteractions);
    } catch (error) {
      console.error('Error loading feed:', error);
      Alert.alert('Error', 'Failed to load feed');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [segment, user]);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (user) loadFeed();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleRefresh = () => {
    loadFeed();
  };

  const handleSave = async (scapeId: string) => {
    if (!user) return;

    try {
      const newSavedState = await toggleSave(scapeId, user.id);
      setFeedData(prev => prev.map(item =>
        item.id === scapeId ? { ...item, saved: newSavedState } : item
      ));
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to save scape');
    }
  };

  const handleLike = async (scapeId: string) => {
    if (!user) return;

    try {
      const newLikedState = await toggleLike(scapeId, user.id);
      setFeedData(prev => prev.map(item =>
        item.id === scapeId
          ? {
              ...item,
              liked: newLikedState,
              like_count: item.like_count + (newLikedState ? 1 : -1)
            }
          : item
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to like scape');
    }
  };

  const handleFollow = async (creatorId: string) => {
    if (!user) return;

    try {
      const newFollowingState = await toggleFollow(creatorId, user.id);
      setFeedData(prev => prev.map(item =>
        item.creator_id === creatorId
          ? { ...item, following: newFollowingState }
          : item
      ));
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to follow user');
    }
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

  const handleOpenScape = (scapeId: string) => {
    router.push(`/scape/${scapeId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

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

      <FeedLayout>
        <FlatList
          data={feedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedCard>
              <ScapeCard
                item={item}
                onSave={() => handleSave(item.id)}
                onLike={() => handleLike(item.id)}
                onFollow={() => handleFollow(item.creator_id)}
                onOpenScape={() => handleOpenScape(item.id)}
              />
            </FeedCard>
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
      </FeedLayout>
    </View>
  );
}

interface ScapeCardProps {
  item: FeedItem;
  onSave: () => void;
  onLike: () => void;
  onFollow: () => void;
  onOpenScape: () => void;
}

function ScapeCard({ item, onSave, onLike, onFollow, onOpenScape }: ScapeCardProps) {
  const theme = useTheme();

  // Get cover image URL - handle both file path and direct URL
  const getCoverImageUrl = () => {
    if (!item.cover_image_path) return null;

    // If it's already a full URL, use it directly
    if (item.cover_image_path.startsWith('http')) {
      return item.cover_image_path;
    }

    // Otherwise, construct Supabase storage URL
    return `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${item.cover_image_path}`;
  };

  const getAvatarUrl = () => {
    if (!item.creator_avatar) return null;

    if (item.creator_avatar.startsWith('http')) {
      return item.creator_avatar;
    }

    return `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${item.creator_avatar}`;
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onOpenScape} activeOpacity={0.9}>
        <Image
          source={{ uri: getCoverImageUrl() || 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg' }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Avatar
              source={{ uri: getAvatarUrl() }}
              size="sm"
              fallbackText={item.creator_username || 'U'}
            />
            <Text style={[styles.username, { color: theme.colors.textPrimary }]}>
              @{item.creator_username}
            </Text>
          </View>
          <Button
            title={item.following ? 'Following' : 'Follow'}
            onPress={onFollow}
            variant={item.following ? 'secondary' : 'primary'}
            size="sm"
          />
        </View>

        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.cardDescription, { color: theme.colors.textSecondary }]}>
          {item.description || ''}
        </Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.statItem} onPress={onLike}>
            <Heart
              size={20}
              fill={item.liked ? theme.colors.primary : 'none'}
              color={item.liked ? theme.colors.primary : theme.colors.textSecondary}
            />
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {item.like_count}
            </Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <MessageSquare size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {item.comment_count}
            </Text>
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
  cardContainer: {
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '60%', // Use percentage for responsive height
    minHeight: 200,
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