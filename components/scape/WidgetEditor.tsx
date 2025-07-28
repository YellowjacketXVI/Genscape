import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ScapeEditorWidget } from '@/types/scape-editor';
import Button from '@/components/ui/Button';
import ContentManagerPicker from './ContentManagerPicker';

interface WidgetEditorProps {
  widget: ScapeEditorWidget;
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedWidget: ScapeEditorWidget) => void;
}

export default function WidgetEditor({ widget, isVisible, onClose, onSave }: WidgetEditorProps) {
  const theme = useTheme();
  const [editedWidget, setEditedWidget] = useState<ScapeEditorWidget>(widget);
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [contentPickerType, setContentPickerType] = useState<'image' | 'video' | 'audio' | 'all'>('all');

  const handleSave = () => {
    onSave(editedWidget);
    onClose();
  };

  const updateWidgetData = (key: string, value: any) => {
    setEditedWidget(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value,
      },
    }));
  };

  const handleMediaSelection = (mediaIds: string[]) => {
    updateWidgetData('mediaIds', mediaIds);
  };

  const openContentPicker = (type: 'image' | 'video' | 'audio' | 'all' = 'all') => {
    setContentPickerType(type);
    setShowContentPicker(true);
  };

  const renderTextEditor = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Text Content</Text>
      
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Header</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.header || ''}
        onChangeText={(text) => updateWidgetData('header', text)}
        placeholder="Enter header text"
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.title || ''}
        onChangeText={(text) => updateWidgetData('title', text)}
        placeholder="Enter title"
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Body Text</Text>
      <TextInput
        style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.body || ''}
        onChangeText={(text) => updateWidgetData('body', text)}
        placeholder="Enter body text"
        placeholderTextColor={theme.colors.textMuted}
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Tags (comma separated)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.tags?.join(', ') || ''}
        onChangeText={(text) => updateWidgetData('tags', text.split(',').map(tag => tag.trim()).filter(Boolean))}
        placeholder="tag1, tag2, tag3"
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );

  const renderImageEditor = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Image Widget</Text>
      
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.title || ''}
        onChangeText={(text) => updateWidgetData('title', text)}
        placeholder="Enter image title"
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Description</Text>
      <TextInput
        style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.description || ''}
        onChangeText={(text) => updateWidgetData('description', text)}
        placeholder="Enter image description"
        placeholderTextColor={theme.colors.textMuted}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        style={[styles.mediaButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => openContentPicker('image')}
      >
        <Text style={[styles.mediaButtonText, { color: theme.colors.textPrimary }]}>
          Select Images ({editedWidget.data.mediaIds?.length || 0} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAudioEditor = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Audio Widget</Text>
      
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.title || ''}
        onChangeText={(text) => updateWidgetData('title', text)}
        placeholder="Enter audio title"
        placeholderTextColor={theme.colors.textMuted}
      />

      <TouchableOpacity
        style={[styles.mediaButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => openContentPicker('audio')}
      >
        <Text style={[styles.mediaButtonText, { color: theme.colors.textPrimary }]}>
          Select Audio ({editedWidget.data.mediaIds?.length || 0} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGalleryEditor = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Gallery Widget</Text>
      
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Layout</Text>
      <View style={styles.layoutOptions}>
        <TouchableOpacity
          style={[
            styles.layoutOption,
            { backgroundColor: theme.colors.surface },
            editedWidget.data.layout === 'grid' && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          onPress={() => updateWidgetData('layout', 'grid')}
        >
          <Text style={[styles.layoutText, { color: theme.colors.textPrimary }]}>Grid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.layoutOption,
            { backgroundColor: theme.colors.surface },
            editedWidget.data.layout === 'masonry' && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          onPress={() => updateWidgetData('layout', 'masonry')}
        >
          <Text style={[styles.layoutText, { color: theme.colors.textPrimary }]}>Masonry</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.mediaButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => openContentPicker('all')}
      >
        <Text style={[styles.mediaButtonText, { color: theme.colors.textPrimary }]}>
          Select Media ({editedWidget.data.mediaIds?.length || 0} selected)
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDefaultEditor = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
      </Text>
      
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary }]}
        value={editedWidget.data.title || ''}
        onChangeText={(text) => updateWidgetData('title', text)}
        placeholder="Enter widget title"
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
        Advanced configuration for {widget.type} widgets coming soon.
      </Text>
    </View>
  );

  const renderEditor = () => {
    switch (widget.type) {
      case 'text':
        return renderTextEditor();
      case 'image':
        return renderImageEditor();
      case 'audio':
        return renderAudioEditor();
      case 'gallery':
        return renderGalleryEditor();
      default:
        return renderDefaultEditor();
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Edit {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Widget
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderEditor()}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            style={styles.footerButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
            style={styles.footerButton}
          />
        </View>

        <ContentManagerPicker
          isVisible={showContentPicker}
          onClose={() => setShowContentPicker(false)}
          onSelect={handleMediaSelection}
          allowMultiple={widget.type === 'gallery'}
          mediaType={contentPickerType}
          selectedIds={editedWidget.data.mediaIds || []}
        />
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  mediaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  layoutOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  layoutOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  layoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
