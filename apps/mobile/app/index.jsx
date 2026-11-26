import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useMobileAuth } from '../src/store/useMobileAuth.js';
import colors from '../src/theme/colors.js';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useMobileAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        LIFE<Text style={styles.highlight}>VERSE</Text>
      </Text>
      <Text style={styles.tagline}>Turn Your Real Life Into an Adventure</Text>
      <ActivityIndicator size="large" color={colors.primaryPurple} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  highlight: {
    color: colors.electricBlue,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  loader: {
    marginTop: 32,
  },
});
