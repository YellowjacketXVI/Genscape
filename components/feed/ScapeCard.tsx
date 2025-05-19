import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Bookmark, ShoppingBag, Image as ImageIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ScapePreview } from '@/types/scape';

interface ScapeCardProps {
  scape: ScapePreview;
  onSave: () => void;
  onLike: () => void;
  isDesktop?: boolean;
}

export default function ScapeCard({ scape, onSave, onLike, isDesktop = false }: ScapeCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isShoppable = scape.isShoppable;

  // Determine if we should use desktop layout based on screen width
  const useDesktopLayout = isDesktop || width > 768;

  // Navigate to the scape detail page
  const navigateToScape = () => {
    router.push(`/scape/${scape.id}`);
  };

  // Navigate to the user profile
  const navigateToProfile = () => {
    router.push(`/profile/${scape.createdBy.id}`);
  };

  // Toggle following status
  const toggleFollow = () => {
    // Implementation would go here
  };

  return (
    <View style={[styles.card, useDesktopLayout && styles.desktopCard]}>
      {/* Featured Widget Preview */}
      <TouchableOpacity onPress={navigateToScape} activeOpacity={0.9}>
        {scape.featuredWidget ? (
          <Image
            source={{ uri: scape.featuredWidget.mediaUrl }}
            style={[
              styles.coverImage,
              useDesktopLayout && styles.desktopCoverImage,
              scape.featuredWidget.aspectRatio && { aspectRatio: scape.featuredWidget.aspectRatio }
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderCover, useDesktopLayout && styles.desktopPlaceholderCover]}>
            <ImageIcon size={useDesktopLayout ? 48 : 32} color={Colors.text.muted} />
            <Text style={styles.placeholderText}>{scape.name}</Text>
          </View>
        )}

        {/* Featured Caption Overlay */}
        {scape.featuredWidget?.caption && (
          <View style={styles.captionOverlay}>
            <Text
              style={styles.captionText}
              numberOfLines={3}
            >
              {scape.featuredWidget.caption}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={navigateToProfile}>
            <Text style={styles.username}>@{scape.createdBy.username}</Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            {isShoppable && (
              <View style={styles.shoppableBadge}>
                <ShoppingBag size={12} color="#FFF" />
                <Text style={styles.shoppableBadgeText}>Shop</Text>
              </View>
            )}

            <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
              <Text style={styles.followButtonText}>
                {scape.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.cardTitle}>{scape.name}</Text>
        {scape.description && (
          <Text style={styles.cardDescription}>{scape.description}</Text>
        )}

        <View style={styles.interactionBar}>
          <View style={styles.interactionGroup}>
            <TouchableOpacity style={styles.interactionButton} onPress={onLike}>
              <Heart
                size={20}
                color={Colors.text.primary}
                fill="transparent"
              />
              <Text style={styles.interactionText}>{scape.stats.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interactionButton} onPress={navigateToScape}>
              <MessageCircle size={20} color={Colors.text.primary} />
              <Text style={styles.interactionText}>{scape.stats.comments}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Bookmark
              size={20}
              color={Colors.text.primary}
              fill="transparent"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  desktopCard: {
    width: '100%',
    // Ensure proper spacing between cards in desktop view
    marginHorizontal: 0,
  },
  coverImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Square aspect ratio for mobile
  },
  desktopCoverImage: {
    aspectRatio: 4/3, // Different aspect ratio for desktop
  },
  placeholderCover: {
    width: '100%',
    aspectRatio: 1, // Square for mobile
    backgroundColor: Colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  desktopPlaceholderCover: {
    aspectRatio: 4/3, // Different aspect ratio for desktop
  },
  placeholderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  captionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    maxWidth: '100%',
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
    fontSize: 14,
    color: Colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shoppableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  shoppableBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.primary,
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
    lineHeight: 20,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interactionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 6,
  },
  saveButton: {
    padding: 4,
  },
});
