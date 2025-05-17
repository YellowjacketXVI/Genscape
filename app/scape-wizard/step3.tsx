import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import UnifiedScapeEditor from '@/components/scape/UnifiedScapeEditor';

export default function ConfigureWidgetsStep() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get scape data from previous steps
  const scapeName = params.name as string || 'New Scape';
  const scapeDescription = params.description as string || '';

  // Create initial scape object
  const initialScape = {
    id: `new-${Date.now()}`,
    name: scapeName,
    description: scapeDescription,
    widgets: [],
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      id: 'user-1',
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

  const handleSaveScape = (updatedScape: any) => {
    // Store the updated scape data to use in the next step
    console.log('Saving scape from wizard:', updatedScape);
    // Navigate to the next step
    router.push('/scape-wizard/step4');
  };

  return (
    <View style={styles.container}>
      <View style={styles.editorContainer}>
        <UnifiedScapeEditor
          isNewScape={true}
          initialScape={initialScape}
          onSave={handleSaveScape}
          onCancel={() => router.back()}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/scape-wizard/step4')}>
          <Text style={styles.nextButtonText}>Next: Publish Options</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
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
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});