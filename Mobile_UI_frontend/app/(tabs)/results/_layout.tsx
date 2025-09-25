import { Stack } from 'expo-router';
import React from 'react';

export default function ResultsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Assessment History' }} />
    </Stack>
  );
}
