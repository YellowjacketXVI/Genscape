import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Upload } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MediaUploadProps } from '@/types/media';
import { useMedia } from '@/hooks/useMedia';
import { MediaService } from '@/services/mediaService';

export default function SimpleMediaUpload({ 
  onUploadComplete, 
  onUploadError,
}: MediaUploadProps) {
  const { uploadMedia, uploading } = useMedia();

  const handleQuickUpload = async () => {
    try {
      // Pick files directly
      const assets = await MediaService.pickMedia(true);
      
      if (assets.length === 0) {
        return; // User cancelled
      }

      // Use default upload data
      const uploadData = {
        name: assets[0].fileName || `Media_${Date.now()}`,
        description: '',
        tags: [],
        is_public: false,
      };

      const uploadedItems = await uploadMedia(assets, uploadData);
      
      if (uploadedItems.length > 0) {
        onUploadComplete?.(uploadedItems[0]);
        Alert.alert('Success', `Uploaded ${uploadedItems.length} file(s) successfully!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      Alert.alert('Upload Failed', errorMessage);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.uploadButton, uploading && styles.disabledButton]} 
      onPress={handleQuickUpload}
      disabled={uploading}
    >
      <Upload size={20} color="#FFF" />
      <Text style={styles.uploadButtonText}>
        {uploading ? 'Uploading...' : 'Quick Upload'}
      </Text>
    </TouchableOpacity>
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
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
