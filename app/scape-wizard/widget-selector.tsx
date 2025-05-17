import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import SharedWidgetSelector from '@/components/scape/SharedWidgetSelector';

export default function WidgetSelector() {
  return (
    <AppContainer>
      <SharedWidgetSelector isNewScape={true} />
    </AppContainer>
  );
}
