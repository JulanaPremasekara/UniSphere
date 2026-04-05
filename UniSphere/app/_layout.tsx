import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    
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
<<<<<<< HEAD
        <Stack.Screen name="Tutors" />
=======
        
>>>>>>> 034a85c3b931f366730cd665fa03f770ba58f7d4
      </Stack>
    </GestureHandlerRootView>
    </GluestackUIProvider>
  
  );
}
