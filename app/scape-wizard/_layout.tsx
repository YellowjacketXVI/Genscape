import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function ScapeWizardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background.dark,
        },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
        },
        contentStyle: {
          backgroundColor: Colors.background.dark,
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Create New Scape',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="step1"
        options={{
          title: 'Step 1: Scape Details',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="step2"
        options={{
          title: 'Step 2: Add Media',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="step3"
        options={{
          title: 'Step 3: Configure Widgets',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="step4"
        options={{
          title: 'Step 4: Publish Options',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}