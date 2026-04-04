import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { Stack } from 'expo-router'

export default function LostLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index"/>
    </Stack>
  )
}