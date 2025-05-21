import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  useWindowDimensions,
  Platform
} from 'react-native';
import { ArrowLeft, Check, Star, Plus, Heart, MessageCircle, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Scape } from '@/types/scape';
import { Widget } from '@/types/widget';
import StyledWidgetContainer from '@/components/widgets/StyledWidgetContainer';
import LiveWidget from '@/components/widgets/LiveWidget';
import ImageWidget from '@/components/scape/widgets/ImageWidget';
import GalleryWidget from '@/components/scape/widgets/GalleryWidget';
import AudioWidget from '@/components/scape/widgets/AudioWidget';
import ShopWidget from '@/components/scape/widgets/ShopWidget';
import TextWidget from '@/components/scape/widgets/TextWidget';

interface ScapeViewProps {
  scape: Scape;
  isEditing?: boolean;
  onAddWidget?: () => void;
  onWidgetPress?: (widget: Widget) => void;
  onEditToggle?: () => void;
}

export default function ScapeView({
  scape,
  isEditing = false,
  onAddWidget,
  onWidgetPress,
  onEditToggle
}: ScapeViewProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Get channel color for a widget
  const getChannelColor = (channel?: string) => {
    switch (channel) {
      case 'red': return '#FF5252';
      case 'green': return '#4CAF50';
      case 'blue': return '#2196F3';
      default: return 'transparent';
    }
  };

  // Calculate widget dimensions based on size and device
  const getWidgetDimensions = (widget: Widget) => {
    const containerWidth = isMobile ? width - 32 : Math.min(1116, width - 64);
    const widgetWidth = containerWidth;

    // Calculate height based on widget size
    // For mobile: small (1x3) = 120.33px, medium (2x3) = 240.66px, large (3x3) = 361px
    // For desktop: maintain the same aspect ratio but scale up
    let widgetHeight = 0;

    if (isMobile) {
      // Mobile sizes
      if (widget.size.width === 1) { // Small
        widgetHeight = 120.33;
      } else if (widget.size.width === 2) { // Medium
        widgetHeight = 240.66;
      } else { // Large
        widgetHeight = 361;
      }
    } else {
      // Desktop sizes - scale up from mobile
      if (widget.size.width === 1) { // Small
        widgetHeight = 372; // 1x3 ratio
      } else if (widget.size.width === 2) { // Medium
        widgetHeight = 372 * 2; // 2x3 ratio
      } else { // Large
        widgetHeight = 372 * 3; // 3x3 ratio
      }
    }

    return { width: widgetWidth, height: widgetHeight };
  };

  // Render a widget based on its type and size
  const renderWidget = (widget: Widget) => {
    const channelColor = getChannelColor(widget.channel);
    const size = widget.size.width === 1 ? 'sm' : widget.size.width === 2 ? 'md' : 'lg';

    const content = (() => {
      switch (widget.type) {
        case 'media':
          return <ImageWidget widget={widget} isEditing={false} />;
        case 'gallery':
          return <GalleryWidget widget={widget} isEditing={false} />;
        case 'audio':
          return <AudioWidget widget={widget} isEditing={false} />;
        case 'shop':
          return <ShopWidget widget={widget} isEditing={false} onMediaSelect={() => {}} />;
        case 'text':
        case 'header':
          return <TextWidget widget={widget} isEditing={false} />;
        case 'live':
          return <LiveWidget size={size as 'sm' | 'md' | 'lg'} isLive duration="00:00" comments={[]} />;
        default:
          return (
            <StyledWidgetContainer
              widget={widget}
              onPress={() => onWidgetPress && onWidgetPress(widget)}
            />
          );
      }
    })();

    return (
      <View
        key={widget.id}
        style={[
          styles.widgetContainer,
          {
            borderColor: channelColor,
            borderWidth: channelColor !== 'transparent' ? 2 : 0,
          },
        ]}
      >
        {content}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.scapeTitle}>@{scape.name}</Text>

        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={onEditToggle}>
            <Check size={24} color="#4CAF50" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scape Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {/* Banner Image - Static */}
        <View style={styles.bannerContainer}>
          {scape.bannerImage ? (
            <Image
              source={{ uri: scape.bannerImage }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderBanner}>
              <Image size={40} color="#666666" />
            </View>
          )}
        </View>

        {/* Scape Info Section */}
        <View style={styles.scapeInfoContainer}>
          <Text style={styles.scapeName}>{scape.name}</Text>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Heart size={16} color={Colors.text.secondary} />
              <Text style={styles.statText}>{scape.stats?.likes || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={16} color={Colors.text.secondary} />
              <Text style={styles.statText}>{scape.stats?.comments || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={16} color={Colors.text.secondary} />
              <Text style={styles.statText}>{scape.stats?.views || 0}</Text>
            </View>
          </View>
        </View>

        {/* Widgets */}
        <View style={styles.widgetsContainer}>
          {scape.widgets.map(renderWidget)}
        </View>

        {/* Add Widget Button (only in editing mode) */}
        {isEditing && (
          <TouchableOpacity
            style={styles.addWidgetButton}
            onPress={onAddWidget}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addWidgetText}>Add Widget</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
    paddingVertical: Platform.OS === 'web' ? 12 : 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.medium,
  },
  backButton: {
    padding: 8,
  },
  scapeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  saveButton: {
    padding: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.background.medium,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scapeInfoContainer: {
    marginBottom: 16,
  },
  scapeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  placeholderMedia: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderGalleryItem: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetsContainer: {
    marginBottom: 16,
  },
  widgetContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  widget: {
    backgroundColor: '#2A2A2A',
    width: '100%',
  },
  mediaWidget: {
    flex: 1,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  captionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  galleryWidget: {
    flex: 1,
    padding: 0,
  },
  galleryGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryItem: {
    width: '33.33%',
    height: '50%',
    padding: 1,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  textWidget: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  textTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  featuredIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWidgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E57C45',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  addWidgetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
