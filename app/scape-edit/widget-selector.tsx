import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppContainer from '@/components/layout/AppContainer';
import SharedWidgetSelector from '@/components/scape/SharedWidgetSelector';

export default function WidgetSelector() {
  const params = useLocalSearchParams();
  // Get the scapeId from the URL params
  const scapeId = params.id as string || params.scapeId as string;

  if (!scapeId) {
    console.error('No scapeId provided to widget selector');
  }

  return (
    <AppContainer>
      <SharedWidgetSelector
        isNewScape={false}
        scapeId={scapeId}
      />
    </AppContainer>
  );
}
