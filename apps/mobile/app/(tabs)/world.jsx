import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import mobileApiClient from '../../src/services/api.js';
import IsometricWorldView from '../../src/components/IsometricWorldView.jsx';
import MobileCard from '../../src/components/MobileCard.jsx';
import colors from '../../src/theme/colors.js';

export default function MobileWorldScreen() {
  const [world, setWorld] = useState(null);

  useEffect(() => {
    loadWorld();
  }, []);

  const loadWorld = async () => {
    try {
      const res = await mobileApiClient.get('/world');
      if (res.data) setWorld(res.data);
    } catch (err) {
      console.error('Failed to load mobile world:', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>3D Island World</Text>
      <Text style={styles.headerSubtitle}>Synchronized virtual territory rendered natively</Text>

      {/* Native Isometric Grid Representation */}
      <IsometricWorldView world={world} />

      {/* Island Structures List */}
      <Text style={styles.sectionTitle}>Placed Island Structures</Text>
      {world?.buildings?.map((b) => (
        <MobileCard key={b.buildingId} style={styles.buildingCard}>
          <View>
            <Text style={styles.buildingName}>{b.name}</Text>
            <Text style={styles.buildingSub}>Type: {b.buildingType} • Level {b.level}</Text>
          </View>
          <Text style={styles.coordText}>({b.gridX}, {b.gridY})</Text>
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 12,
  },
  buildingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buildingName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  buildingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  coordText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neonCyan,
  },
});
