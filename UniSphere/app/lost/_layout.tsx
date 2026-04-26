import React from "react";
import { Stack } from "expo-router";

export default function LostLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[itemId]" />
      <Stack.Screen name="create" options={{ presentation: "modal" }} />
    </Stack>
  );
}