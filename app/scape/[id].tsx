import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Star, Plus, Heart, MessageCircle, Eye } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ScapeView from '@/components/scape/ScapeView';
import { Widget } from '@/types/widget';

// Mock data for demonstration
const MOCK_SCAPE = {
  id: '1',
  name: 'Digital Dreams',
  description: 'A collection of AI-generated landscapes',
  bannerImage: null,
  widgets: [
    {
      id: '1',
      type: 'media',
      title: 'Featured Image',
      size: { width: 3, height: 3 },
      position: 1,
      channel: 'green',
      isFeatured: true,
      featuredCaption: 'This is the caption for the scape. It shows a preview of a description that I created when managing the scape...',
      mediaIds: []
    },
    {
      id: '2',
      type: 'gallery',
      title: 'Image Gallery',
      size: { width: 3, height: 3 },
      position: 2,
      channel: 'blue',
      isFeatured: false,
      mediaIds: []
    },
    {
      id: '3',
      type: 'text',
      title: 'Description',
      size: { width: 2, height: 3 },
      position: 3,
      channel: 'neutral',
      content: {
        title: 'About This Collection',
        body: 'A showcase of AI-generated landscapes that explore the boundaries between reality and imagination.'
      }
    },
    {
      id: '4',
      type: 'media',
      title: 'Secondary Image',
      size: { width: 1, height: 3 },
      position: 4,
      channel: 'red',
      mediaIds: []
    }
  ],
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: {
    id: 'user-1',
    username: 'creative_minds',
    avatar: null
  },
  stats: {
    likes: 128,
    comments: 32,
    views: 1024
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
    visibility: 'public',
    approvalType: 'auto',
    pricingModel: 'free',
  }
};

export default function ScapeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [scape, setScape] = useState(MOCK_SCAPE);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);

  // Handle edit button click
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes and exit edit mode
      setIsEditing(false);
    } else {
      // Navigate to the unified scape editor
      router.push(`/scape-edit/${id}`);
    }
  };

  // Handle widget press
  const handleWidgetPress = (widget: Widget) => {
    if (isEditing) {
      // Open widget editor
      console.log('Edit widget:', widget.id);
    } else {
      // Interact with widget
      console.log('Interact with widget:', widget.id);
    }
  };

  // Add a new widget
  const handleAddWidget = () => {
    setShowAddWidgetModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Use the ScapeView component for consistent layout */}
      <ScapeView
        scape={scape}
        isEditing={isEditing}
        onAddWidget={handleAddWidget}
        onWidgetPress={handleWidgetPress}
        onEditToggle={handleEditToggle}
      />

      {/* Add Widget Modal */}
      <Modal
        visible={showAddWidgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddWidgetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Widget</Text>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddWidgetModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalCloseButton: {
    alignSelf: 'center',
    marginTop: 24,
    padding: 12,
  },
  modalCloseText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#4CAF50',
  },
});
