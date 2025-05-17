import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AppContainer from '@/components/layout/AppContainer';
import UnifiedScapeEditor from '@/components/scape/UnifiedScapeEditor';

// Mock data for demonstration
const MOCK_SCAPE = {
  id: '1',
  name: 'Digital Dreams',
  description: 'A collection of AI-generated landscapes',
  widgets: [
    {
      id: '1',
      type: 'media',
      title: 'Featured Image',
      size: { width: 3, height: 3 }, // Large (3x3)
      position: 1,
      channel: 'neutral',
      isFeatured: true,
      featuredCaption: 'Explore the digital dreamscape of AI-generated art',
      mediaIds: ['media-1']
    },
    {
      id: '2',
      type: 'text',
      title: 'Description',
      size: { width: 2, height: 3 }, // Medium (2x3)
      position: 2,
      channel: 'neutral',
      content: {
        title: 'Digital Dreams',
        body: 'A collection of AI-generated landscapes that explore the boundaries between reality and imagination.',
      }
    },
    {
      id: '3',
      type: 'gallery',
      title: 'Image Gallery',
      size: { width: 3, height: 3 }, // Large (3x3)
      position: 3,
      channel: 'blue',
      mediaIds: ['media-1', 'media-2', 'media-3']
    },
    {
      id: '4',
      type: 'audio',
      title: 'Audio Track',
      size: { width: 1, height: 3 }, // Small (1x3)
      position: 4,
      channel: 'green',
      mediaIds: ['audio-1']
    },
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

export default function ScapeEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scapeId = params.id as string;
  const [scape, setScape] = useState(MOCK_SCAPE);

  // In a real app, you would fetch the scape data based on the ID
  useEffect(() => {
    // Fetch scape data
    console.log('Fetching scape with ID:', scapeId);
    // For now, we're using mock data
    // In a real app, you would fetch the scape data from your API
    // setScape(fetchedScape);
  }, [scapeId]);

  // Check if we're returning from widget selection with new widget data
  useEffect(() => {
    if (params.newWidget) {
      try {
        // Parse the widget data from the URL params
        const newWidgetData = JSON.parse(decodeURIComponent(params.newWidget as string));

        // Add the new widget to the scape
        setScape(prevScape => ({
          ...prevScape,
          widgets: [...prevScape.widgets, newWidgetData]
        }));

        // Clear the URL params to prevent duplicate additions
        router.setParams({});
      } catch (error) {
        console.error('Error parsing widget data:', error);
      }
    }
  }, [params.newWidget, router]);

  const handleSaveScape = (updatedScape: any) => {
    // In a real app, you would save the scape data to your backend
    console.log('Saving scape:', updatedScape);
    // Navigate back to the scape view
    router.push(`/scape/${scapeId}`);
  };

  return (
    <AppContainer>
      <View style={styles.container}>
        <View style={styles.editorContainer}>
          <UnifiedScapeEditor
            initialScape={scape}
            onSave={handleSaveScape}
            onCancel={() => router.back()}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
            <Check size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  editorContainer: {
    flex: 1,
  },
  footer: {
    backgroundColor: Colors.background.dark,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});
