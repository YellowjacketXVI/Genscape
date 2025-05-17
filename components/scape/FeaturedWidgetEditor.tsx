import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Dimensions, useWindowDimensions } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import { X, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type FeaturedWidgetEditorProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (caption: string) => void;
  initialCaption: string;
  widgetTitle: string;
};

export default function FeaturedWidgetEditor({
  visible,
  onClose,
  onSave,
  initialCaption,
  widgetTitle
}: FeaturedWidgetEditorProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [charCount, setCharCount] = useState(initialCaption.length);
  const MAX_CHARS = 300;

  useEffect(() => {
    if (visible) {
      setCaption(initialCaption);
      setCharCount(initialCaption.length);
    }
  }, [visible, initialCaption]);

  const handleTextChange = (text: string) => {
    if (text.length <= MAX_CHARS) {
      setCaption(text);
      setCharCount(text.length);
    }
  };

  const handleSave = () => {
    onSave(caption);
    onClose();
  };

  // Detect if we're on desktop or mobile
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <AppContainer>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: isDesktop ? 500 : '100%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Featured Widget</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.featuredBadge}>
            <Star size={16} color="#FFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>

          <Text style={styles.widgetTitle}>{widgetTitle}</Text>

          <Text style={styles.description}>
            Add a caption for this featured widget. This caption will be displayed in the feed preview.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="Enter a caption for this widget..."
              placeholderTextColor={Colors.text.muted}
              value={caption}
              onChangeText={handleTextChange}
              multiline
              maxLength={MAX_CHARS}
            />
            <Text style={styles.charCount}>{charCount}/{MAX_CHARS}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </AppContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.background.dark,
    borderRadius: 12,
    width: '100%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
    marginLeft: 4,
  },
  widgetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  captionInput: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'right',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});
