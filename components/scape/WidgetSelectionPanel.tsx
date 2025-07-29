import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import {
  Image as ImageIcon,
  Music2,
  ShoppingBag,
  Type as TextIcon,
  Grid3x3,
  Radio,
  MousePointer,
  Bot,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { WidgetType, WidgetCategory, WidgetVariant } from '@/types/scape-editor';

interface WidgetSelectionPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectWidget: (type: string, variant: string, defaultData: any) => void;
}

// Widget categories and variants configuration
const WIDGET_CATEGORIES: WidgetCategory[] = [
  {
    id: 'text',
    name: 'Text',
    icon: TextIcon,
    variants: [
      {
        id: 'text-small',
        size: 'small',
        name: 'Small Text',
        description: 'Brief text snippet',
        previewComponent: () => null,
        defaultData: { content: '' },
      },
      {
        id: 'text-medium',
        size: 'medium',
        name: 'Medium Text',
        description: 'Paragraph text',
        previewComponent: () => null,
        defaultData: { content: '' },
      },
      {
        id: 'text-large',
        size: 'large',
        name: 'Large Text',
        description: 'Article or long-form text',
        previewComponent: () => null,
        defaultData: { content: '' },
      },
    ],
  },
  {
    id: 'image',
    name: 'Image/Media',
    icon: ImageIcon,
    variants: [
      {
        id: 'image-small',
        size: 'small',
        name: 'Small Image',
        description: 'Thumbnail size',
        previewComponent: () => null,
        defaultData: { mediaIds: [] },
      },
      {
        id: 'image-medium',
        size: 'medium',
        name: 'Medium Image',
        description: 'Standard size',
        previewComponent: () => null,
        defaultData: { mediaIds: [] },
      },
      {
        id: 'image-large',
        size: 'large',
        name: 'Large Image',
        description: 'Hero size',
        previewComponent: () => null,
        defaultData: { mediaIds: [] },
      },
    ],
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Music2,
    variants: [
      {
        id: 'audio-player',
        size: 'medium',
        name: 'Audio Player',
        description: 'Music or podcast player',
        previewComponent: () => null,
        defaultData: { tracks: [] },
      },
    ],
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: Grid3x3,
    variants: [
      {
        id: 'gallery-grid',
        size: 'large',
        name: 'Grid Gallery',
        description: 'Grid layout gallery',
        previewComponent: () => null,
        defaultData: { mediaIds: [], layout: 'grid' },
      },
      {
        id: 'gallery-carousel',
        size: 'medium',
        name: 'Carousel Gallery',
        description: 'Horizontal scrolling',
        previewComponent: () => null,
        defaultData: { mediaIds: [], layout: 'carousel' },
      },
    ],
  },
  {
    id: 'live',
    name: 'Live',
    icon: Radio,
    variants: [
      {
        id: 'live-stream',
        size: 'large',
        name: 'Live Stream',
        description: 'Live video/audio stream',
        previewComponent: () => null,
        defaultData: { streamUrl: '', isLive: false },
      },
    ],
  },
  {
    id: 'shop',
    name: 'Shop',
    icon: ShoppingBag,
    variants: [
      {
        id: 'shop-grid',
        size: 'large',
        name: 'Product Grid',
        description: 'Multiple products',
        previewComponent: () => null,
        defaultData: { products: [] },
      },
      {
        id: 'shop-single',
        size: 'medium',
        name: 'Single Product',
        description: 'Featured product',
        previewComponent: () => null,
        defaultData: { products: [] },
      },
    ],
  },
  {
    id: 'llm',
    name: 'LLM',
    icon: Bot,
    variants: [
      {
        id: 'llm-chat',
        size: 'large',
        name: 'AI Chat',
        description: 'Interactive AI conversation',
        previewComponent: () => null,
        defaultData: { prompt: '', messages: [] },
      },
    ],
  },
  {
    id: 'button',
    name: 'Button',
    icon: MousePointer,
    variants: [
      {
        id: 'button-two',
        size: 'small',
        name: 'Two Button',
        description: 'Two channel buttons',
        previewComponent: () => null,
        defaultData: { buttons: [{ label: 'Button 1' }, { label: 'Button 2' }] },
      },
      {
        id: 'button-three',
        size: 'medium',
        name: 'Three Button',
        description: 'Three channel buttons',
        previewComponent: () => null,
        defaultData: { buttons: [{ label: 'Red' }, { label: 'Green' }, { label: 'Blue' }] },
      },
    ],
  },
];

export default function WidgetSelectionPanel({
  isVisible,
  onClose,
  onSelectWidget,
}: WidgetSelectionPanelProps) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // Set to false for web compatibility
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // Set to false for web compatibility
      }).start();
      setSelectedCategory(null);
    }
  }, [isVisible]);

  const handleCategorySelect = (category: WidgetCategory) => {
    setSelectedCategory(category);
  };

  const handleVariantSelect = (variant: WidgetVariant) => {
    if (selectedCategory) {
      onSelectWidget(selectedCategory.id, variant.id, variant.defaultData);
    }
  };

  const renderCategoryList = () => (
    <View style={styles.categoryList}>
      <Text style={[styles.panelTitle, { color: theme.colors.textPrimary }]}>
        Choose Widget Type
      </Text>
      {WIDGET_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => handleCategorySelect(category)}
        >
          <View style={styles.categoryContent}>
            <category.icon size={24} color={theme.colors.textPrimary} />
            <Text style={[styles.categoryName, { color: theme.colors.textPrimary }]}>
              {category.name}
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderVariantList = () => {
    if (!selectedCategory) return null;

    const groupedVariants = selectedCategory.variants.reduce((acc, variant) => {
      if (!acc[variant.size]) {
        acc[variant.size] = [];
      }
      acc[variant.size].push(variant);
      return acc;
    }, {} as Record<string, WidgetVariant[]>);

    return (
      <View style={styles.variantList}>
        <View style={styles.variantHeader}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: theme.colors.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.panelTitle, { color: theme.colors.textPrimary }]}>
            {selectedCategory.name} Widgets
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(groupedVariants).map(([size, variants]) => (
            <View key={size} style={styles.sizeGroup}>
              <Text style={[styles.sizeTitle, { color: theme.colors.accent }]}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Text>
              <View style={styles.variantGrid}>
                {variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[styles.variantCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => handleVariantSelect(variant)}
                  >
                    <View style={[styles.variantPreview, { backgroundColor: theme.colors.background }]}>
                      {/* Placeholder for widget preview */}
                      <selectedCategory.icon size={32} color={theme.colors.textSecondary} />
                    </View>
                    <Text style={[styles.variantName, { color: theme.colors.textPrimary }]}>
                      {variant.name}
                    </Text>
                    <Text style={[styles.variantDescription, { color: theme.colors.textSecondary }]}>
                      {variant.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              if (selectedCategory?.variants[0]) {
                handleVariantSelect(selectedCategory.variants[0]);
              }
            }}
          >
            <Text style={styles.addButtonText}>Add To Scape</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
              Add Widget
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {selectedCategory ? renderVariantList() : renderCategoryList()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    flex: 1,
    padding: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  variantList: {
    flex: 1,
  },
  variantHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  sizeGroup: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sizeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  variantCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  variantPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  variantName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  variantDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  addButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
