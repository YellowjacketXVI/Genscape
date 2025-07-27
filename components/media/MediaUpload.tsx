import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Upload, X, Tag, Globe, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MediaUploadProps, MediaUploadData } from '@/types/media';
import { useMedia } from '@/hooks/useMedia';

export default function MediaUpload({ 
  onUploadComplete, 
  onUploadError,
  allowedTypes = ['image', 'video', 'audio'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
}: MediaUploadProps) {
  const { pickAndUploadMedia, uploading } = useMedia();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadData, setUploadData] = useState<MediaUploadData>({
    name: '',
    description: '',
    tags: [],
    is_public: false,
  });
  const [tagInput, setTagInput] = useState('');

  const handleUpload = async () => {
    if (!uploadData.name.trim()) {
      Alert.alert('Error', 'Please enter a name for your media');
      return;
    }

    try {
      const uploadedItems = await pickAndUploadMedia(uploadData, true);
      
      if (uploadedItems.length > 0) {
        setModalVisible(false);
        resetForm();
        onUploadComplete?.(uploadedItems[0]);
        Alert.alert('Success', `Uploaded ${uploadedItems.length} file(s) successfully!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      Alert.alert('Upload Failed', errorMessage);
    }
  };

  const resetForm = () => {
    setUploadData({
      name: '',
      description: '',
      tags: [],
      is_public: false,
    });
    setTagInput('');
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !uploadData.tags?.includes(tag)) {
      setUploadData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const openUploadModal = () => {
    setModalVisible(true);
  };

  const closeUploadModal = () => {
    setModalVisible(false);
    resetForm();
  };

  return (
    <>
      <TouchableOpacity style={styles.uploadButton} onPress={openUploadModal}>
        <Upload size={20} color="#FFF" />
        <Text style={styles.uploadButtonText}>Upload Media</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeUploadModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Media</Text>
            <TouchableOpacity onPress={closeUploadModal}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={uploadData.name}
                onChangeText={(text) => setUploadData(prev => ({ ...prev, name: text }))}
                placeholder="Enter media name"
                placeholderTextColor={Colors.text.muted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={uploadData.description}
                onChangeText={(text) => setUploadData(prev => ({ ...prev, description: text }))}
                placeholder="Enter description (optional)"
                placeholderTextColor={Colors.text.muted}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add tags"
                  placeholderTextColor={Colors.text.muted}
                  onSubmitEditing={addTag}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                  <Tag size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              
              {uploadData.tags && uploadData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {uploadData.tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tag}
                      onPress={() => removeTag(tag)}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                      <X size={12} color={Colors.text.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Visibility</Text>
              <View style={styles.visibilityContainer}>
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    !uploadData.is_public && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setUploadData(prev => ({ ...prev, is_public: false }))}
                >
                  <Lock size={16} color={!uploadData.is_public ? '#FFF' : Colors.text.secondary} />
                  <Text style={[
                    styles.visibilityText,
                    !uploadData.is_public && styles.visibilityTextActive,
                  ]}>
                    Private
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    uploadData.is_public && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setUploadData(prev => ({ ...prev, is_public: true }))}
                >
                  <Globe size={16} color={uploadData.is_public ? '#FFF' : Colors.text.secondary} />
                  <Text style={[
                    styles.visibilityText,
                    uploadData.is_public && styles.visibilityTextActive,
                  ]}>
                    Public
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeUploadModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadModalButton, uploading && styles.disabledButton]}
              onPress={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Upload size={16} color="#FFF" />
                  <Text style={styles.uploadModalButtonText}>Upload</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.light,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.background.light,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.background.light,
    marginRight: 8,
  },
  addTagButton: {
    padding: 12,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFF',
    marginRight: 4,
  },
  visibilityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.background.light,
  },
  visibilityOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  visibilityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  visibilityTextActive: {
    color: '#FFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  uploadModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadModalButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
    marginLeft: 4,
  },
});
