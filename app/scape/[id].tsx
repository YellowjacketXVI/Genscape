import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Edit3, Trash2, MoreVertical, Heart, Share2, Bookmark } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getScapeById, getUserInteractions, DetailedScape } from '@/services/scapeService';
import { toggleLike, toggleSave, toggleFollow, incrementViewCount } from '@/services/feedService';

interface ScapeInteractions {
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
}

interface Scape {
  id: string;
  title: string;
  description: string;
  banner: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    followerCount: number;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
    saves: number;
  };
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  isPublished: boolean;
  createdAt: string;
  widgets: Widget[];
}

interface Widget {
  id: string;
  type: 'text' | 'image' | 'audio' | 'shop' | 'live';
  content?: string;
  images?: string[];
  audioUrl?: string;
  title?: string;
  description?: string;
}

export default function ScapeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const [scape, setScape] = useState<DetailedScape | null>(null);
  const [interactions, setInteractions] = useState<ScapeInteractions>({
    isLiked: false,
    isSaved: false,
    isFollowing: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScape = async () => {
      if (!id) return;

      try {
        const scapeData = await getScapeById(id, user?.id);
        if (scapeData) {
          setScape(scapeData);

          // Increment view count
          incrementViewCount(id);

          // Get user interactions if logged in
          if (user) {
            const userInteractions = await getUserInteractions(id, user.id);
            setInteractions(userInteractions);
          }
        } else {
          Alert.alert('Error', 'Scape not found');
          router.back();
        }
      } catch (error) {
        console.error('Error loading scape:', error);
        Alert.alert('Error', 'Failed to load scape');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchScape();
  }, [id]);

  const handleLike = async () => {
    if (!scape || !user) return;

    try {
      const newLikedState = await toggleLike(scape.id, user.id);
      setInteractions(prev => ({ ...prev, isLiked: newLikedState }));
      setScape(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          likes: prev.stats.likes + (newLikedState ? 1 : -1),
        },
      } : null);
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to like scape');
    }
  };

  const handleSave = async () => {
    if (!scape || !user) return;

    try {
      const newSavedState = await toggleSave(scape.id, user.id);
      setInteractions(prev => ({ ...prev, isSaved: newSavedState }));
      setScape(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          saves: prev.stats.saves + (newSavedState ? 1 : -1),
        },
      } : null);
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to save scape');
    }
  };

  const handleFollow = async () => {
    if (!scape || !user) return;

    try {
      const newFollowingState = await toggleFollow(scape.creator.id, user.id);
      setInteractions(prev => ({ ...prev, isFollowing: newFollowingState }));
    } catch (error) {
      console.error('Error toggling follow:', error);
      Alert.alert('Error', 'Failed to follow user');
    }
  };

  const handleEdit = () => {
    router.push(`/scape-editor/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Scape',
      'Are you sure you want to delete this scape? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete API call
            router.back();
          },
        },
      ]
    );
  };

  const isOwner = user?.id === scape?.creator.id;

  if (loading) {
    return <LoadingScreen message="Loading scape..." />;
  }

  if (!scape) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
          Scape not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          {isOwner && (
            <View style={styles.ownerActions}>
              <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                <Edit3 size={20} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                <Trash2 size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Banner Image */}
        {scape.banner_image_id && (
          <Image
            source={{
              uri: `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${scape.banner_image_id}`
            }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Creator Info */}
          <View style={styles.creatorSection}>
            <View style={styles.creatorInfo}>
              <Avatar
                source={{
                  uri: scape.creator.avatar_url ?
                    `https://msinxqvqjzlappkumynm.supabase.co/storage/v1/object/public/media/${scape.creator.avatar_url}` :
                    undefined
                }}
                size="md"
                fallbackText={scape.creator.username || 'U'}
              />
              <View style={styles.creatorDetails}>
                <Text style={[styles.creatorName, { color: theme.colors.textPrimary }]}>
                  @{scape.creator.username}
                </Text>
                <Text style={[styles.followerCount, { color: theme.colors.textSecondary }]}>
                  {scape.creator.full_name || 'Creator'}
                </Text>
              </View>
            </View>
            {!isOwner && (
              <Button
                title={interactions.isFollowing ? 'Following' : 'Follow'}
                onPress={handleFollow}
                variant={interactions.isFollowing ? 'secondary' : 'primary'}
                size="sm"
              />
            )}
          </View>

          {/* Title and Description */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{scape.title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {scape.description}
          </Text>

          {/* Stats and Actions */}
          <View style={styles.statsSection}>
            <View style={styles.stats}>
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {scape.stats.views.toLocaleString()} views
              </Text>
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {scape.stats.likes.toLocaleString()} likes
              </Text>
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {scape.stats.comments.toLocaleString()} comments
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                <Heart
                  size={24}
                  fill={interactions.isLiked ? theme.colors.primary : 'none'}
                  color={interactions.isLiked ? theme.colors.primary : theme.colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <Bookmark
                  size={24}
                  fill={interactions.isSaved ? theme.colors.primary : 'none'}
                  color={interactions.isSaved ? theme.colors.primary : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Widgets */}
          <View style={styles.widgetsSection}>
            {scape.widgets.map(widget => (
              <WidgetRenderer key={widget.id} widget={widget} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WidgetRenderer({ widget }: { widget: Widget }) {
  const theme = useTheme();

  switch (widget.type) {
    case 'text':
      return (
        <View style={[styles.widget, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.widgetText, { color: theme.colors.textPrimary }]}>
            {widget.content}
          </Text>
        </View>
      );

    case 'image':
      return (
        <View style={[styles.widget, { backgroundColor: theme.colors.surface }]}>
          {widget.images?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.widgetImage}
              resizeMode="cover"
            />
          ))}
        </View>
      );

    case 'audio':
      return (
        <View style={[styles.widget, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.widgetTitle, { color: theme.colors.textPrimary }]}>
            {widget.title}
          </Text>
          {widget.description && (
            <Text style={[styles.widgetDescription, { color: theme.colors.textSecondary }]}>
              {widget.description}
            </Text>
          )}
          {/* TODO: Add audio player component */}
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Audio Player (Coming Soon)
          </Text>
        </View>
      );

    default:
      return (
        <View style={[styles.widget, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
            Widget type "{widget.type}" not implemented
          </Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  creatorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creatorDetails: {
    marginLeft: 12,
  },
  creatorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  followerCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  widgetsSection: {
    gap: 16,
  },
  widget: {
    borderRadius: 12,
    padding: 16,
  },
  widgetText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  widgetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  widgetDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  widgetImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
