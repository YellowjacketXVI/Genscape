import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Plus,
  Star,
  StarOff,
  Move,
  Trash2,
  Save,
  ArrowLeft,
  Eye
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/types/widget';
import EnhancedWidgetContainer from '@/components/widgets/EnhancedWidgetContainer';
import useWidgetManager from '@/hooks/useWidgetManager';
import DraggableWidgetWrapper from '@/components/scape/DraggableWidgetWrapper';
import FeaturedWidgetEditor from '@/components/scape/FeaturedWidgetEditor';
import ChannelSelector from '@/components/scape/ChannelSelector';
import ContentBrowser from '@/components/scape/ContentBrowser';
import ThemedScrollView from '@/components/layout/ThemedScrollView';

interface UnifiedScapeEditorProps {
  isNewScape?: boolean;
  initialScape?: any;
  onSave?: (scapeData: any) => void;
  onCancel?: () => void;
}

export default function UnifiedScapeEditor({
  isNewScape = false,
  initialScape = null,
  onSave,
  onCancel
}: UnifiedScapeEditorProps) {
  const router = useRouter();

  // Default empty scape if none provided
  const defaultScape = {
    id: isNewScape ? `new-${Date.now()}` : 'temp-id',
    name: isNewScape ? 'New Scape' : 'Untitled Scape',
    description: '',
    widgets: []
  };

  const [scape, setScape] = useState(initialScape || defaultScape);
  const params = useLocalSearchParams();
  const {
    widgets,
    addWidget,
    removeWidget,
    updateWidget,
    moveWidgetUp,
    moveWidgetDown,
    reorderWidgets,
    setFeaturedWidget,
    setWidgetChannel,
  } = useWidgetManager(initialScape?.widgets || []);
  const [editMode, setEditMode] = useState(true);
  const [showContentBrowser, setShowContentBrowser] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [currentEditingWidget, setCurrentEditingWidget] = useState<any>(null);

  // Drag and drop state
  const [draggingWidgetId, setDraggingWidgetId] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number>(-1);
  const widgetPositions = useRef<{ [key: string]: { y: number, height: number } }>({});

  // Update widgets when initialScape changes
  useEffect(() => {
    if (initialScape) {
      setScape(initialScape);
    }
  }, [initialScape]);

  // If returning from the widget selector with a new widget, add it
  useEffect(() => {
    if (params.newWidget) {
      try {
        const newWidget = JSON.parse(decodeURIComponent(params.newWidget as string));
        addWidget(newWidget as Widget);
      } catch (err) {
        console.error('Error parsing new widget:', err);
      } finally {
        router.setParams({});
      }
    }
  }, [params.newWidget]);

  const handleAddWidget = () => {
    // Navigate to widget selector with current scape id so the selector
    // can return with the new widget data encoded in the URL params
    router.push({
      pathname: '/scape-edit/widget-selector',
      params: { scapeId: scape.id }
    });
  };

  const handleWidgetPress = (widget: any) => {
    if (editMode) {
      // In edit mode, open the content browser
      setSelectedWidget(widget);
      setShowContentBrowser(true);
    } else {
      // In view mode, show widget options
      Alert.alert(
        'Widget Options',
        'What would you like to do with this widget?',
        [
          {
            text: 'View Details',
            onPress: () => console.log('View widget details:', widget.id),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  // Handle widget size change
  const handleWidgetSizeChange = (widgetId: string, newWidth: number) => {
    updateWidget(widgetId, { size: { width: newWidth as 1 | 2 | 3, height: 3 } });
  };

  const handleWidgetLongPress = (widget: any) => {
    if (editMode) {
      // Show widget configuration options
      Alert.alert(
        'Widget Options',
        'What would you like to do with this widget?',
        [
          {
            text: 'Add Media',
            onPress: () => {
              setSelectedWidget(widget);
              setShowContentBrowser(true);
            },
          },
          {
            text: 'Edit Properties',
            onPress: () => console.log('Edit widget properties:', widget.id),
          },
          {
            text: 'Change Channel',
            onPress: () => {
              setCurrentEditingWidget(widget);
              setShowChannelSelector(true);
            },
          },
          {
            text: widget.isFeatured ? 'Remove Featured' : 'Set as Featured',
            onPress: () => toggleFeaturedWidget(widget.id),
          },
          {
            text: 'Delete',
            onPress: () => handleDeleteWidget(widget.id),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const toggleFeaturedWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    if (!widget.isFeatured) {
      // If setting as featured, show the featured editor
      setCurrentEditingWidget(widget);
      setShowFeaturedEditor(true);
    } else {
      // If removing featured status
      setFeaturedWidget(widgetId, '');
    }
  };

  const saveFeaturedCaption = (caption: string) => {
    if (!currentEditingWidget) return;

    setFeaturedWidget(currentEditingWidget.id, caption.slice(0, 300));

    setCurrentEditingWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this widget?')) {
        removeWidget(widgetId);
      }
      return;
    }

    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeWidget(widgetId),
          style: 'destructive',
        },
      ]
    );
  };

  const moveWidgetUpLocal = (index: number) => {
    moveWidgetUp(index);
  };

  const moveWidgetDownLocal = (index: number) => {
    moveWidgetDown(index);
  };

  const saveScape = () => {
    // Prepare the scape data with updated widgets
    const updatedScape = {
      ...scape,
      widgets: widgets
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

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Drag and drop handlers
  const handleDragStart = (widgetId: string, index: number) => {
    setDraggingWidgetId(widgetId);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingWidgetId(null);
    setDraggingIndex(-1);
  };

  // Register widget position
  const registerWidgetPosition = (id: string, y: number, height: number) => {
    widgetPositions.current[id] = { y, height };
  };

  // Find the closest widget index based on y position
  const findClosestWidgetIndex = (y: number): number => {
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;

    widgets.forEach((widget, index) => {
      const position = widgetPositions.current[widget.id];
      if (position) {
        // Calculate the top and bottom of the widget
        const widgetTop = position.y;
        const widgetBottom = position.y + position.height;

        // If the drag position is within the widget's bounds, use that index
        if (y >= widgetTop && y <= widgetBottom) {
          closestIndex = index;
          return; // Exit the forEach early
        }

        // Otherwise, find the closest widget by center point
        const widgetCenter = position.y + position.height / 2;
        const distance = Math.abs(y - widgetCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    return closestIndex;
  };

  // Handle widget reordering
  const handleReorderWidgets = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);

    // Update positions
    newWidgets.forEach((widget, idx) => {
      widget.position = idx + 1;
    });

    // Update the dragging index to match the new position
    setDraggingIndex(toIndex);
    reorderWidgets(newWidgets.map(w => w.id));
  };

  // Handle widget drag
  const handleWidgetDrag = (y: number) => {
    if (draggingIndex === -1) return;

    const newIndex = findClosestWidgetIndex(y);
    if (newIndex !== draggingIndex) {
      handleReorderWidgets(draggingIndex, newIndex);
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'red':
        return '#F15A29';
      case 'green':
        return '#2D8E46';
      case 'blue':
        return '#3498db';
      default:
        return 'transparent';
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel || (() => router.back())}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{scape.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleEditMode}>
            <Eye size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={saveScape}>
            <Save size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ThemedScrollView style={styles.content}>
        {widgets.length > 0 ? (
          widgets
            .sort((a, b) => a.position - b.position)
            .map((widget, index) => (
              <DraggableWidgetWrapper
                key={widget.id}
                widget={widget}
                index={index}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleWidgetDrag}
                onRemove={handleDeleteWidget}
                onMoveUp={moveWidgetUpLocal}
                onMoveDown={moveWidgetDownLocal}
                onSetFeatured={toggleFeaturedWidget}
                onSelectChannel={(widget) => {
                  setCurrentEditingWidget(widget);
                  setShowChannelSelector(true);
                }}
                getChannelColor={getChannelColor}
                registerPosition={registerWidgetPosition}
                isDragging={widget.id === draggingWidgetId}
                isFirst={index === 0}
                isLast={index === widgets.length - 1}
              >
                <View
                  style={[
                    styles.widgetContainer,
                    editMode && { borderLeftWidth: 4, borderLeftColor: getChannelColor(widget.channel) }
                  ]}
                >
                  <EnhancedWidgetContainer
                    widget={widget}
                    onMediaSelect={
                      widget.type === 'text' || widget.type === 'header'
                        ? undefined
                        : () => handleWidgetPress(widget)
                    }
                    isEditing={editMode}
                    onSizeChange={(newWidth) => handleWidgetSizeChange(widget.id, newWidth)}
                    onRemove={() => handleDeleteWidget(widget.id)}
                    onFeatureToggle={() => toggleFeaturedWidget(widget.id)}
                  />
                </View>
              </DraggableWidgetWrapper>
            ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No widgets added yet</Text>
            <Text style={styles.emptyStateSubtext}>Add widgets to create your scape layout</Text>
          </View>
        )}

        {editMode && (
          <TouchableOpacity style={styles.addWidgetButton} onPress={handleAddWidget}>
            <Plus size={24} color={Colors.primary} />
            <Text style={styles.addWidgetText}>Add Widget</Text>
          </TouchableOpacity>
        )}
      </ThemedScrollView>

      {/* Featured Widget Editor */}
      <FeaturedWidgetEditor
        visible={showFeaturedEditor}
        onClose={() => setShowFeaturedEditor(false)}
        onSave={saveFeaturedCaption}
        initialCaption={currentEditingWidget?.featuredCaption || ''}
        widgetTitle={currentEditingWidget?.title || ''}
      />

      {/* Channel Selector */}
      <ChannelSelector
        visible={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        onSelect={(channelId) => {
          if (currentEditingWidget) {
            setWidgetChannel(currentEditingWidget.id, channelId);
            setCurrentEditingWidget(null);
          }
        }}
        currentChannel={currentEditingWidget?.channel || 'neutral'}
      />

      {/* Content Browser */}
      <ContentBrowser
        visible={showContentBrowser}
        onClose={() => setShowContentBrowser(false)}
        onSelect={(mediaId) => {
          if (selectedWidget) {
            // Update the widget with the selected media
            const mediaIds = selectedWidget.mediaIds ? [...selectedWidget.mediaIds, mediaId] : [mediaId];
            updateWidget(selectedWidget.id, { mediaIds });
            setSelectedWidget(null);
            setShowContentBrowser(false);
          }
        }}
        widgetType={selectedWidget?.type || 'media'}
      />
    </GestureHandlerRootView>
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
    paddingTop: Platform.OS === 'web' ? 16 : 60,
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
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  widgetWrapper: {
    marginBottom: 16,
  },
  widgetControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  channelIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  widgetContainer: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addWidgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addWidgetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
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
});
