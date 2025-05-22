import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  Star,
  StarOff,
  Move,
  Trash2,
  Save,
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Edit,
  Check
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/types/widget';
import WidgetContainer from '@/components/widgets/WidgetContainer';
import FeaturedWidgetEditor from '@/components/scape/FeaturedWidgetEditor';
import ContentBrowser from '@/components/scape/ContentBrowser';
import ThemedScrollView from '@/components/layout/ThemedScrollView';

// We'll use an inline ChannelSelector component
// Debug Colors object
console.log('Colors object:', Colors);

// Ensure Colors.channel exists
if (!Colors.channel) {
  Colors.channel = {
    red: '#FF5252',
    green: '#4CAF50',
    blue: '#2196F3',
    neutral: 'transparent'
  };
}

// Default empty scape template
const DEFAULT_SCAPE = {
  id: `draft_${Date.now()}`,
  name: 'Untitled Scape',
  description: '',
  bannerImage: null,
  layout: 'vertical',
  widgets: [],
  isPublished: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: {
    id: 'current-user',
    username: 'current_user',
  },
  stats: {
    likes: 0,
    comments: 0,
    views: 0,
  },
  permissions: {
    genGuard: false,
    datasetReuse: false,
    contentWarnings: {
      suggestive: false,
      political: false,
      violent: false,
      nudity: false,
    },
    visibility: 'private',
    approvalType: 'auto',
    pricingModel: 'free',
  }
};

type UnifiedScapeDocumentProps = {
  initialScape?: any;
  onSave?: (scape: any) => void;
  onCancel?: () => void;
  isNewScape?: boolean;
};

export default function UnifiedScapeDocument({
  initialScape,
  onSave,
  onCancel,
  isNewScape = false
}: UnifiedScapeDocumentProps) {
  const router = useRouter();

  // Initialize state with provided scape or default
  const [scape, setScape] = useState(initialScape || DEFAULT_SCAPE);
  const [widgets, setWidgets] = useState<Widget[]>(initialScape?.widgets || []);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [editingName, setEditingName] = useState(isNewScape);
  const [showContentBrowser, setShowContentBrowser] = useState(false);
  const [contentBrowserMode, setContentBrowserMode] = useState<'banner' | 'widget'>('widget');
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);

  // Update widgets when initialScape changes
  useEffect(() => {
    if (initialScape?.widgets) {
      setWidgets(initialScape.widgets);
    }
  }, [initialScape]);

  // Handle banner image selection
  const handleBannerPress = () => {
    setContentBrowserMode('banner');
    setShowContentBrowser(true);
  };

  // Handle widget press
  const handleWidgetPress = (widget: Widget) => {
    setSelectedWidget(widget);
    setContentBrowserMode('widget');
    setShowContentBrowser(true);
  };

  // Handle adding a new widget
  const handleAddWidget = () => {
    const params: any = {};

    if (scape?.id) {
      params.scapeId = scape.id;
    }

    router.push({
      pathname: '/scape-edit/widget-selector',
      params
    });
  };

  // Handle removing a widget
  const handleRemoveWidget = (widgetId: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to remove this widget?')) {
        const updatedWidgets = widgets.filter(w => w.id !== widgetId);
        // Update positions
        updatedWidgets.forEach((widget, idx) => {
          widget.position = idx + 1;
        });
        setWidgets(updatedWidgets);
      }
      return;
    }

    Alert.alert(
      'Remove Widget',
      'Are you sure you want to remove this widget?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedWidgets = widgets.filter(w => w.id !== widgetId);
            // Update positions
            updatedWidgets.forEach((widget, idx) => {
              widget.position = idx + 1;
            });
            setWidgets(updatedWidgets);
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Handle widget size change
  const handleWidgetSizeChange = (widgetId: string, newWidth: 1 | 2 | 3) => {
    setWidgets(widgets.map(w =>
      w.id === widgetId
        ? { ...w, size: { ...w.size, width: newWidth } }
        : w
    ));
  };

  // Handle widget channel change
  const handleWidgetChannelChange = (widgetId: string, channel: 'red' | 'green' | 'blue' | 'neutral') => {
    setWidgets(widgets.map(w =>
      w.id === widgetId
        ? { ...w, channel }
        : w
    ));
  };

  // Handle setting a widget as featured
  const handleSetFeatured = (widgetId: string) => {
    setWidgets(widgets.map(w => ({
      ...w,
      isFeatured: w.id === widgetId
    })));

    // Find the widget and open the featured caption editor
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setSelectedWidget(widget);
      setShowFeaturedEditor(true);
    }
  };

  // Handle featured caption update
  const handleFeaturedCaptionUpdate = (caption: string) => {
    if (!selectedWidget) return;

    setWidgets(widgets.map(w =>
      w.id === selectedWidget.id
        ? { ...w, featuredCaption: caption }
        : w
    ));

    setShowFeaturedEditor(false);
  };

  // Handle moving widgets up/down
  const moveWidgetUp = (index: number) => {
    if (index === 0) return;
    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
    // Update positions
    newWidgets.forEach((widget, idx) => {
      widget.position = idx + 1;
    });
    setWidgets(newWidgets);
  };

  const moveWidgetDown = (index: number) => {
    if (index === widgets.length - 1) return;
    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
    // Update positions
    newWidgets.forEach((widget, idx) => {
      widget.position = idx + 1;
    });
    setWidgets(newWidgets);
  };

  // Save the scape
  const saveScape = () => {
    // Prepare the scape data with updated widgets
    const updatedScape = {
      ...scape,
      widgets: widgets,
      updatedAt: new Date()
    };

    // Call the onSave callback if provided
    if (onSave) {
      onSave(updatedScape);
    } else {
      // Default save behavior
      console.log('Saving scape:', updatedScape);
      Alert.alert('Success', 'Scape saved successfully!');
    }
  };

  // Get channel color with fallback values
  const getChannelColor = (channel?: string) => {
    // Use hardcoded fallback values in case Colors.channel is undefined
    const channelColors = {
      red: Colors.channel?.red || '#FF5252',
      green: Colors.channel?.green || '#4CAF50',
      blue: Colors.channel?.blue || '#2196F3',
      neutral: 'transparent'
    };

    return channelColors[channel as keyof typeof channelColors] || 'transparent';
  };

  return (
    <View style={styles.container}>
      {/* Header with name editing */}
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.usernamePrefix}>@{scape.createdBy.username}</Text>
          <Text style={styles.nameSeparator}>/</Text>

          {editingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={styles.nameInput}
                value={scape.name}
                onChangeText={(text) => setScape({...scape, name: text})}
                autoFocus
                selectTextOnFocus
              />
              <TouchableOpacity
                style={styles.nameEditButton}
                onPress={() => setEditingName(false)}
              >
                <Check size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameDisplayContainer}>
              <Text style={styles.nameText}>{scape.name}</Text>
              <TouchableOpacity
                style={styles.nameEditButton}
                onPress={() => setEditingName(true)}
              >
                <Edit size={18} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveScape}
          >
            <Save size={20} color={Colors.text.primary} />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner Image */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={handleBannerPress}
      >
        {scape.bannerImage ? (
          <Image
            source={{ uri: scape.bannerImage }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder}>
            <ImageIcon size={32} color={Colors.text.secondary} />
            <Text style={styles.bannerPlaceholderText}>Tap to add banner image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Widgets */}
      <ThemedScrollView style={styles.widgetsContainer}>
        {widgets.length > 0 ? (
          widgets
            .sort((a, b) => a.position - b.position)
            .map((widget, index) => (
              <View key={widget.id} style={styles.widgetWrapper}>
                {/* Widget Controls */}
                <View style={styles.widgetControls}>
                  <TouchableOpacity
                    style={styles.widgetControlButton}
                    onPress={() => moveWidgetUp(index)}
                    disabled={index === 0}
                  >
                    <Move size={20} color={index === 0 ? Colors.text.disabled : Colors.text.secondary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.widgetControlButton}
                    onPress={() => moveWidgetDown(index)}
                    disabled={index === widgets.length - 1}
                  >
                    <Move size={20} color={index === widgets.length - 1 ? Colors.text.disabled : Colors.text.secondary} style={{ transform: [{ rotate: '180deg' }] }} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.widgetControlButton}
                    onPress={() => handleSetFeatured(widget.id)}
                  >
                    {widget.isFeatured ? (
                      <Star size={20} color={Colors.primary} fill={Colors.primary} />
                    ) : (
                      <StarOff size={20} color={Colors.text.secondary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.widgetControlButton}
                    onPress={() => handleRemoveWidget(widget.id)}
                  >
                    <Trash2 size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {/* Widget Container */}
                <View
                  style={[
                    styles.widgetContainer,
                    { borderLeftWidth: 4, borderLeftColor: getChannelColor(widget.channel) }
                  ]}
                >
                  <WidgetContainer
                    widget={widget}
                    onMediaSelect={
                      widget.type === 'text' || widget.type === 'header'
                        ? undefined
                        : () => handleWidgetPress(widget)
                    }
                    isEditing={true}
                    onSizeChange={(newWidth) => handleWidgetSizeChange(widget.id, newWidth)}
                  />
                </View>

                {/* Channel Selector */}
                <View style={styles.channelSelector}>
                  <TouchableOpacity
                    style={[styles.channelOption, widget.channel === 'red' && styles.channelOptionSelected]}
                    onPress={() => handleWidgetChannelChange(widget.id, 'red')}
                  >
                    <View style={[styles.channelDot, { backgroundColor: Colors.channel?.red || '#FF5252' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.channelOption, widget.channel === 'green' && styles.channelOptionSelected]}
                    onPress={() => handleWidgetChannelChange(widget.id, 'green')}
                  >
                    <View style={[styles.channelDot, { backgroundColor: Colors.channel?.green || '#4CAF50' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.channelOption, widget.channel === 'blue' && styles.channelOptionSelected]}
                    onPress={() => handleWidgetChannelChange(widget.id, 'blue')}
                  >
                    <View style={[styles.channelDot, { backgroundColor: Colors.channel?.blue || '#2196F3' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.channelOption, (widget.channel === 'neutral' || !widget.channel) && styles.channelOptionSelected]}
                    onPress={() => handleWidgetChannelChange(widget.id, 'neutral')}
                  >
                    <View style={[styles.channelDot, { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.text.secondary }]} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No widgets added yet</Text>
            <Text style={styles.emptyStateSubtext}>Add widgets to create your scape layout</Text>
          </View>
        )}

        {/* Add Widget Button */}
        <TouchableOpacity style={styles.addWidgetButton} onPress={handleAddWidget}>
          <Plus size={24} color={Colors.primary} />
          <Text style={styles.addWidgetText}>Add Widget</Text>
        </TouchableOpacity>
      </ThemedScrollView>

      {/* Content Browser Modal */}
      <ContentBrowser
        visible={showContentBrowser}
        onClose={() => setShowContentBrowser(false)}
        onSelect={(mediaId) => {
          if (contentBrowserMode === 'banner') {
            // Update banner image
            // In a real app, you would fetch the media URL based on the ID
            setScape({
              ...scape,
              bannerImage: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg' // Mock URL
            });
          } else if (selectedWidget) {
            // Update the widget with the selected media
            setWidgets(
              widgets.map((w) => {
                if (w.id !== selectedWidget.id) return w;

                switch (selectedWidget.type) {
                  case 'media':
                    return {
                      ...w,
                      mediaIds: w.mediaIds ? [...w.mediaIds, mediaId] : [mediaId],
                    };
                  case 'gallery':
                    return {
                      ...w,
                      items: (w as any).items
                        ? [...(w as any).items, { id: `item-${Date.now()}`, mediaId }]
                        : [{ id: `item-${Date.now()}`, mediaId }],
                    } as any;
                  case 'shop':
                    return {
                      ...w,
                      products: (w as any).products
                        ? [
                            ...(w as any).products,
                            {
                              id: `product-${Date.now()}`,
                              mediaId,
                              name: '',
                              price: 0,
                              available: true,
                            },
                          ]
                        : [
                            {
                              id: `product-${Date.now()}`,
                              mediaId,
                              name: '',
                              price: 0,
                              available: true,
                            },
                          ],
                    } as any;
                  case 'audio':
                    return {
                      ...w,
                      tracks: (w as any).tracks
                        ? [
                            ...(w as any).tracks,
                            {
                              id: `track-${Date.now()}`,
                              mediaId,
                              title: '',
                              artist: '',
                              duration: 0,
                            },
                          ]
                        : [
                            {
                              id: `track-${Date.now()}`,
                              mediaId,
                              title: '',
                              artist: '',
                              duration: 0,
                            },
                          ],
                    } as any;
                  default:
                    return w;
                }
              })
            );
          }
          setSelectedWidget(null);
          setShowContentBrowser(false);
        }}
        widgetType={contentBrowserMode === 'banner' ? 'media' : (selectedWidget?.type || 'media')}
      />

      {/* Featured Widget Caption Editor */}
      <Modal
        visible={showFeaturedEditor}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFeaturedEditor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Featured Caption</Text>

            <FeaturedWidgetEditor
              visible={showFeaturedEditor}
              onClose={() => setShowFeaturedEditor(false)}
              onSave={handleFeaturedCaptionUpdate}
              initialCaption={selectedWidget?.featuredCaption || ''}
              widgetTitle={selectedWidget?.title || 'Widget'}
            />
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernamePrefix: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  nameSeparator: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginHorizontal: 4,
  },
  nameDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    marginRight: 8,
  },
  nameInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
    flex: 1,
  },
  nameEditButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background.light,
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerPlaceholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  widgetsContainer: {
    flex: 1,
    padding: 16,
  },
  widgetWrapper: {
    marginBottom: 24,
  },
  widgetControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  widgetControlButton: {
    padding: 8,
    marginLeft: 8,
  },
  widgetContainer: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.background.light,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  addWidgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  addWidgetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  channelSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  channelOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: Colors.background.light,
  },
  channelOptionSelected: {
    borderWidth: 2,
    borderColor: Colors.text.primary,
  },
  channelDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
});
