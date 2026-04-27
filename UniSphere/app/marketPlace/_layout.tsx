import { Stack } from 'expo-router';
import React from 'react';

export default function MarketplaceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create"  />
      <Stack.Screen name="edit"  />
      <Stack.Screen name="[id]" /> 
    </Stack>
  );
}