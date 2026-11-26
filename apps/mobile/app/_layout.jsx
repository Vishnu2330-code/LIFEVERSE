import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useMobileAuth } from '../src/store/useMobileAuth.js';

export default function RootLayout() {
  const { checkAuth } = useMobileAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#080B14" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#080B14' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
