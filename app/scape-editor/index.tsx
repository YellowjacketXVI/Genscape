import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
  ]
};

export default function ScapeEditor() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scapeId = params.id as string;
  const [scape, setScape] = useState(MOCK_SCAPE);

  // In a real app, you would fetch the scape data based on the ID
  useEffect(() => {
    // Fetch scape data
    console.log('Fetching scape with ID:', scapeId);
    // For now, we're using mock data
  }, [scapeId]);

  const handleSaveScape = (updatedScape: any) => {
    // In a real app, you would save the scape data to your backend
    console.log('Saving scape:', updatedScape);
    // Navigate back after saving
    router.back();
  };

  return (
    <AppContainer>
      <View style={styles.container}>
        <UnifiedScapeEditor
          initialScape={scape}
          onSave={handleSaveScape}
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
});
