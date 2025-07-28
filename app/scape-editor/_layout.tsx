import { Stack } from 'expo-router';

export default function ScapeEditorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Scape Editor',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
