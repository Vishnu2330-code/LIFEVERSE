import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import mobileApiClient from '../../src/services/api.js';
import { useMobileGamification } from '../../src/store/useMobileGamification.js';
import MobileCard from '../../src/components/MobileCard.jsx';
import MobileButton from '../../src/components/MobileButton.jsx';
import colors from '../../src/theme/colors.js';

export default function MobileQuestsScreen() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { triggerHapticReward } = useMobileGamification();

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const res = await mobileApiClient.get('/quests');
      if (res.data) setQuests(res.data);
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await mobileApiClient.post(`/quests/${id}/complete`);
      if (res.success && res.data?.rewards) {
        triggerHapticReward(res.data.rewards);
        loadQuests();
      }
    } catch (err) {
      console.error('Complete quest error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Quest Log</Text>
      <Text style={styles.headerSubtitle}>Complete missions to generate XP & virtual coins</Text>

      <FlatList
        data={quests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MobileCard style={styles.questCard}>
            <View style={styles.questHeader}>
              <Text style={styles.difficultyTag}>{item.difficulty?.toUpperCase()}</Text>
              <Text style={styles.categoryTag}>{item.category}</Text>
            </View>

            <Text
              style={[
                styles.title,
                item.status === 'completed' && styles.completedTitle,
              ]}
            >
              {item.title}
            </Text>

            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}

            <View style={styles.cardFooter}>
              {item.status === 'completed' ? (
                <Text style={styles.rewardClaimed}>Claimed (+{item.xpEarned || 25} XP)</Text>
              ) : (
                <MobileButton
                  title="Mark Completed"
                  variant="cyan"
                  onPress={() => handleComplete(item._id)}
                />
              )}
            </View>
          </MobileCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    paddingHorizontal: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  questCard: {
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  difficultyTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neonCyan,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardFooter: {
    marginTop: 8,
  },
  rewardClaimed: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.successGreen,
  },
});
