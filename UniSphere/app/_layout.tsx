<<<<<<< HEAD
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
=======
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
>>>>>>> 38c5d82b312eaeb60c7d2795c730b22e6d55a1a5

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => { SplashScreen.hideAsync(); }, []);

  return (
<<<<<<< HEAD
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="dark">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="events/create"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </QueryClientProvider>
=======
    <GluestackUIProvider mode="dark">
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="marketplace"/>
        <Stack.Screen name="events/create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="Tutors" />
        <Stack.Screen name="studyGroup" />
      </Stack>
    </GestureHandlerRootView>
    </GluestackUIProvider>
>>>>>>> 38c5d82b312eaeb60c7d2795c730b22e6d55a1a5
  );
}