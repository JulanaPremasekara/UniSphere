import { Stack } from "expo-router";
import React from 'react';

export default function TutorsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            {/* The main list page */}
            <Stack.Screen name="index" />

            {/* 1. Add the setup screen here */}
            <Stack.Screen 
                name="setup" 
                options={{ 
                    presentation: 'modal',
                    animation: 'slide_from_bottom' 
                }} 
            />

            {/* 2. Add the dynamic tutor profile page */}
            <Stack.Screen name="[id]" />
            
        </Stack>
    );
}