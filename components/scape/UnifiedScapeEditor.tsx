import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Modal
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
  Eye
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/types/widget';
import WidgetContainer from '@/components/widgets/WidgetContainer';
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
  const [widgets, setWidgets] = useState<any[]>(initialScape?.widgets || []);
  const [editMode, setEditMode] = useState(true);
  const [showContentBrowser, setShowContentBrowser] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [currentEditingWidget, setCurrentEditingWidget] = useState<any>(null);

  // Update widgets when initialScape changes
  useEffect(() => {
    if (initialScape) {
      setScape(initialScape);
      setWidgets(initialScape.widgets || []);
    }
  }, [initialScape]);

  const handleAddWidget = () => {
    // Navigate to widget selector
    if (isNewScape) {
      router.push('/scape-wizard/widget-selector');
    } else {
      // Use the scape-edit path for consistency
      router.push('/scape-edit/widget-selector');
    }
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
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          size: {
            ...widget.size,
            width: newWidth
          }
        };
      }
      return widget;
    }));
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
      setWidgets(widgets.map(w =>
        w.id === widgetId
          ? { ...w, isFeatured: false, featuredCaption: '' }
          : w
      ));
    }
  };

  const saveFeaturedCaption = (caption: string) => {
    if (!currentEditingWidget) return;

    setWidgets(widgets.map(w =>
      w.id === currentEditingWidget.id
        ? { ...w, isFeatured: true, featuredCaption: caption.slice(0, 300) }
        : w
    ));

    setCurrentEditingWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
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
          onPress: () => {
            setWidgets(widgets.filter(widget => widget.id !== widgetId));
          },
          style: 'destructive',
        },
      ]
    );
  };

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
    <View style={styles.container}>
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
          widgets.map((widget, index) => (
            <View key={widget.id} style={styles.widgetWrapper}>
              {editMode && (
                <View style={styles.widgetControls}>
                  <TouchableOpacity
                    style={[styles.controlButton, index === 0 && styles.disabledButton]}
                    onPress={() => moveWidgetUp(index)}
                    disabled={index === 0}
                  >
                    <Move size={20} color={index === 0 ? Colors.text.muted : Colors.text.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, index === widgets.length - 1 && styles.disabledButton]}
                    onPress={() => moveWidgetDown(index)}
                    disabled={index === widgets.length - 1}
                  >
                    <Move size={20} color={index === widgets.length - 1 ? Colors.text.muted : Colors.text.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, { borderColor: getChannelColor(widget.channel) }]}
                    onPress={() => {
                      setCurrentEditingWidget(widget);
                      setShowChannelSelector(true);
                    }}
                  >
                    <View style={[styles.channelIndicator, { backgroundColor: getChannelColor(widget.channel) }]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => toggleFeaturedWidget(widget.id)}
                  >
                    {widget.isFeatured ? (
                      <Star size={20} color={Colors.primary} fill={Colors.primary} />
                    ) : (
                      <StarOff size={20} color={Colors.text.primary} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => handleDeleteWidget(widget.id)}
                  >
                    <Trash2 size={20} color={Colors.text.primary} />
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={[
                  styles.widgetContainer,
                  editMode && { borderLeftWidth: 4, borderLeftColor: getChannelColor(widget.channel) }
                ]}
              >
                <WidgetContainer
                  widget={widget}
                  onMediaSelect={() => handleWidgetPress(widget)}
                  isEditing={editMode}
                  onSizeChange={(newWidth) => handleWidgetSizeChange(widget.id, newWidth)}
                />
              </View>
            </View>
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
            setWidgets(widgets.map(w =>
              w.id === currentEditingWidget.id
                ? { ...w, channel: channelId }
                : w
            ));
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
            setWidgets(widgets.map(w =>
              w.id === selectedWidget.id
                ? {
                    ...w,
                    mediaIds: w.mediaIds ? [...w.mediaIds, mediaId] : [mediaId]
                  }
                : w
            ));
            setSelectedWidget(null);
            setShowContentBrowser(false);
          }
        }}
        widgetType={selectedWidget?.type || 'media'}
      />
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
