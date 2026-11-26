import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useMobileAuth } from '../../src/store/useMobileAuth.js';
import { useMobileGamification } from '../../src/store/useMobileGamification.js';
import mobileApiClient from '../../src/services/api.js';
import MobileCard from '../../src/components/MobileCard.jsx';
import MobileButton from '../../src/components/MobileButton.jsx';
import colors from '../../src/theme/colors.js';

export default function MobileHomeScreen() {
  const { user } = useMobileAuth();
  const { profile, fetchProfile, triggerHapticReward } = useMobileGamification();

  const [quests, setQuests] = useState([]);
  const [habits, setHabits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      fetchProfile();
      const [questsRes, habitsRes] = await Promise.all([
        mobileApiClient.get('/quests?status=pending&limit=4'),
        mobileApiClient.get('/habits'),
      ]);
      if (questsRes.data) setQuests(questsRes.data);
      if (habitsRes.data) setHabits(habitsRes.data);
    } catch (err) {
      console.error('Mobile load error:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCompleteQuest = async (id) => {
    try {
      const res = await mobileApiClient.post(`/quests/${id}/complete`);
      if (res.success && res.data?.rewards) {
        triggerHapticReward(res.data.rewards);
        loadData();
      }
    } catch (err) {
      console.error('Quest complete error:', err);
    }
  };

  const handleHabitCheckIn = async (id) => {
    try {
      const res = await mobileApiClient.post(`/habits/${id}/check-in`);
      if (res.success && res.data?.rewards) {
        triggerHapticReward(res.data.rewards);
        loadData();
      }
    } catch (err) {
      console.error('Habit checkin error:', err);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryPurple} />}
    >
      {/* Hero Player Card */}
      <MobileCard style={styles.heroCard}>
        <View style={styles.playerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'H'}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.rankBadge}>{profile?.rank || 'Beginner'} • Lv {profile?.level || 1}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {profile?.streakCount || 0}d</Text>
          </View>
        </View>

        {/* Level XP Bar */}
        <View style={styles.xpContainer}>
          <View style={styles.xpTextRow}>
            <Text style={styles.xpLabel}>Level Progress</Text>
            <Text style={styles.xpValue}>
              {profile?.currentLevelXp || 0} / {profile?.xpRequiredForNext || 100} XP
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${profile?.progressPercentage || 0}%` }]} />
          </View>
        </View>

        {/* Coins Pill */}
        <View style={styles.coinRow}>
          <Text style={styles.coinText}>🪙 {profile?.coins || 0} Virtual Coins</Text>
        </View>
      </MobileCard>

      {/* Active Quests Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Quests</Text>
      </View>

      {quests.map((q) => (
        <MobileCard key={q._id} style={styles.questCard}>
          <View style={styles.questDetails}>
            <Text style={styles.difficultyTag}>{q.difficulty?.toUpperCase()} • {q.category}</Text>
            <Text style={styles.questTitle}>{q.title}</Text>
          </View>
          <MobileButton
            title="Claim"
            variant="cyan"
            onPress={() => handleCompleteQuest(q._id)}
            style={styles.actionBtn}
          />
        </MobileCard>
      ))}

      {/* Daily Habits Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Habits Check-In</Text>
      </View>

      {habits.slice(0, 3).map((h) => (
        <MobileCard key={h._id} style={styles.habitCard}>
          <View>
            <Text style={styles.habitTitle}>{h.title}</Text>
            <Text style={styles.habitStreak}>🔥 {h.currentStreak || 0} day streak</Text>
          </View>
          {h.isCheckedInToday ? (
            <Text style={styles.checkedInBadge}>Done Today</Text>
          ) : (
            <MobileButton
              title="Check In"
              variant="secondary"
              onPress={() => handleHabitCheckIn(h._id)}
              style={styles.actionBtn}
            />
          )}
        </MobileCard>
      ))}
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
  heroCard: {
    backgroundColor: colors.secondaryBackground,
    borderColor: colors.primaryPurple + '40',
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  playerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rankBadge: {
    fontSize: 12,
    color: colors.neonCyan,
    fontWeight: '600',
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: colors.streakOrange + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  streakText: {
    color: colors.streakOrange,
    fontWeight: '700',
    fontSize: 12,
  },
  xpContainer: {
    marginVertical: 10,
  },
  xpTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 11,
    color: colors.neonCyan,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#080B14',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryPurple,
    borderRadius: 4,
  },
  coinRow: {
    marginTop: 8,
  },
  coinText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questDetails: {
    flex: 1,
    marginRight: 10,
  },
  difficultyTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neonCyan,
    marginBottom: 2,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  habitStreak: {
    fontSize: 12,
    color: colors.streakOrange,
    marginTop: 2,
    fontWeight: '600',
  },
  checkedInBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successGreen,
    backgroundColor: colors.successGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
