import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMobileAuth } from '../../src/store/useMobileAuth.js';
import { useMobileGamification } from '../../src/store/useMobileGamification.js';
import mobileApiClient from '../../src/services/api.js';
import MobileCard from '../../src/components/MobileCard.jsx';
import MobileButton from '../../src/components/MobileButton.jsx';
import colors from '../../src/theme/colors.js';

export default function MobileProfileScreen() {
  const { user, logout } = useMobileAuth();
  const { profile, fetchProfile } = useMobileGamification();
  const [inventoryCount, setInventoryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await mobileApiClient.get('/inventory');
      if (res.data) setInventoryCount(res.data.length);
    } catch (e) {}
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of LIFEVERSE?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Player Profile</Text>

      {/* Profile Card */}
      <MobileCard style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {user?.username?.charAt(0).toUpperCase() || 'H'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.rankBadge}>{profile?.rank || 'Beginner'} • Level {profile?.level || 1}</Text>
      </MobileCard>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <MobileCard style={styles.statBox}>
          <Text style={styles.statLabel}>Total XP</Text>
          <Text style={styles.statVal}>{profile?.totalXp?.toLocaleString() || 0}</Text>
        </MobileCard>
        <MobileCard style={styles.statBox}>
          <Text style={styles.statLabel}>Coins</Text>
          <Text style={[styles.statVal, { color: colors.gold }]}>{profile?.coins || 0}</Text>
        </MobileCard>
      </View>

      <View style={styles.statsRow}>
        <MobileCard style={styles.statBox}>
          <Text style={styles.statLabel}>Best Streak</Text>
          <Text style={[styles.statVal, { color: colors.streakOrange }]}>{profile?.streakCount || 0}d</Text>
        </MobileCard>
        <MobileCard style={styles.statBox}>
          <Text style={styles.statLabel}>Vault Items</Text>
          <Text style={[styles.statVal, { color: colors.neonCyan }]}>{inventoryCount}</Text>
        </MobileCard>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <MobileButton
          title="Sign Out"
          variant="secondary"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
  },
  username: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  rankBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neonCyan,
    backgroundColor: colors.neonCyan + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 4,
  },
  actions: {
    marginTop: 20,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.errorRed + '40',
  },
});
