import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Images,
  ShoppingBag,
  Music,
  Text as TextIcon,
  MessageSquare,
  ToggleLeft,
  Bot
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ThemedScrollView from '@/components/layout/ThemedScrollView';

type WidgetCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  widgets: WidgetType[];
  expanded: boolean;
};

type WidgetType = {
  id: string;
  title: string;
  description: string;
  type: string;
};

interface SharedWidgetSelectorProps {
  isNewScape?: boolean;
  scapeId?: string;
  onClose?: () => void;
}

export default function SharedWidgetSelector({
  isNewScape = false,
  scapeId,
  onClose
}: SharedWidgetSelectorProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<WidgetCategory[]>([
    {
      id: 'media',
      title: 'Media Display Widgets',
      icon: <ImageIcon size={24} color={Colors.text.primary} />,
      expanded: true,
      widgets: [
        {
          id: 'media-image',
          title: 'Image Display',
          description: 'Display images in various formats (JPEG, PNG, WebP)',
          type: 'media',
        },
        {
          id: 'media-video',
          title: 'Video Display',
          description: 'Display videos (MP4, WAV)',
          type: 'video',
        },
      ],
    },
    {
      id: 'gallery',
      title: 'Gallery Widgets',
      icon: <Images size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'gallery-horizontal',
          title: 'Horizontal Gallery',
          description: 'Scrollable horizontal gallery of images',
          type: 'gallery',
        },
      ],
    },
    {
      id: 'shop',
      title: 'Shop Widgets',
      icon: <ShoppingBag size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'shop-products',
          title: 'Product Grid',
          description: 'Display products in a grid layout',
          type: 'shop',
        },
      ],
    },
    {
      id: 'audio',
      title: 'Audio Widgets',
      icon: <Music size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'audio-player',
          title: 'Audio Player',
          description: 'Play audio files with controls',
          type: 'audio',
        },
        {
          id: 'audio-caption',
          title: 'Audio with Caption',
          description: 'Audio player with detailed caption',
          type: 'audio-caption',
        },
      ],
    },
    {
      id: 'text',
      title: 'Text Widgets',
      icon: <TextIcon size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'text-block',
          title: 'Text Block',
          description: 'Rich text with formatting options',
          type: 'text',
        },
        {
          id: 'text-header',
          title: 'Header',
          description: 'Large text header with optional subtitle',
          type: 'header',
        },
      ],
    },
    {
      id: 'comms',
      title: 'Communication Widgets',
      icon: <MessageSquare size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'comms-chat',
          title: 'Chat',
          description: 'Live chat module for user interaction',
          type: 'chat',
        },
        {
          id: 'comms-comments',
          title: 'Comments',
          description: 'Comment section for discussions',
          type: 'comments',
        },
      ],
    },
    {
      id: 'button',
      title: 'Button Widgets',
      icon: <ToggleLeft size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'button-action',
          title: 'Action Button',
          description: 'Trigger actions or navigate to other content',
          type: 'button',
        },
      ],
    },
    {
      id: 'llm',
      title: 'LLM Widgets',
      icon: <Bot size={24} color={Colors.text.primary} />,
      expanded: false,
      widgets: [
        {
          id: 'llm-chat',
          title: 'LLM Chat',
          description: 'Pre-prompted chat module for LLM communication',
          type: 'llm',
        },
      ],
    },
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId
        ? { ...category, expanded: !category.expanded }
        : category
    ));
  };

  const selectWidget = (widget: WidgetType) => {
    // Navigate to widget size selector with the selected widget type
    const path = '/scape-edit/widget-size-selector';
    const params: any = { type: widget.type, title: widget.title };

    // Add scapeId if available (for editing existing scapes)
    if (scapeId) {
      params.scapeId = scapeId;
    }

    router.push({
      pathname: path,
      params
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose || (() => router.back())}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Widget</Text>
        <View style={{ width: 40 }} />
      </View>

      <ThemedScrollView style={styles.content}>
        <Text style={styles.description}>
          Select a widget type to add to your scape. Each widget can be configured with different content and settings.
        </Text>

        {categories.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryTitleContainer}>
                <View style={styles.categoryIcon}>{category.icon}</View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              {category.expanded ? (
                <ChevronDown size={24} color={Colors.text.primary} />
              ) : (
                <ChevronRight size={24} color={Colors.text.primary} />
              )}
            </TouchableOpacity>

            {category.expanded && (
              <View style={styles.widgetsContainer}>
                {category.widgets.map(widget => (
                  <TouchableOpacity
                    key={widget.id}
                    style={styles.widgetItem}
                    onPress={() => selectWidget(widget)}
                  >
                    <View>
                      <Text style={styles.widgetTitle}>{widget.title}</Text>
                      <Text style={styles.widgetDescription}>{widget.description}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.text.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ThemedScrollView>
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
    backgroundColor: Colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.medium,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  widgetsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
  },
  widgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.light,
  },
  widgetTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  widgetDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    maxWidth: '90%',
  },
});
