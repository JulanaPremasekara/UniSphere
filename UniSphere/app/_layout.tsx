import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "../global.css";

// ✅ ADD THIS (fix for react-native-svg + buffer issue)
import { Buffer } from "buffer";
(globalThis as any).Buffer = Buffer;

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="dark">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="events/create"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}