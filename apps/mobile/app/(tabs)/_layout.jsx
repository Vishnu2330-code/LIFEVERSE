import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../src/theme/colors.js';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#080B14',
          borderTopColor: colors.borderSubtle,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.neonCyan,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚔️</Text>,
        }}
      />
      <Tabs.Screen
        name="world"
        options={{
          title: 'World',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🌐</Text>,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🛡️</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
