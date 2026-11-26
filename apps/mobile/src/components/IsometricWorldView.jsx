import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../theme/colors.js';

export const IsometricWorldView = ({ world }) => {
  const buildings = world?.buildings || [];

  return (
    <View style={styles.container}>
      <View style={styles.islandBase}>
        <Text style={styles.biomeTag}>Biome: {world?.theme || 'Futuristic City'}</Text>
        
        {/* Isometric Grid Representation */}
        <View style={styles.grid}>
          {Array.from({ length: 16 }).map((_, idx) => {
            const gridX = idx % 4;
            const gridY = Math.floor(idx / 4);
            const buildingOnTile = buildings.find(
              (b) => b.gridX === gridX && b.gridY === gridY
            );

            return (
              <View
                key={idx}
                style={[
                  styles.tile,
                  buildingOnTile && styles.tileOccupied,
                ]}
              >
                {buildingOnTile ? (
                  <View style={styles.buildingSprite}>
                    <Text style={styles.buildingIcon}>
                      {buildingOnTile.buildingType === 'learning_library'
                        ? '📚'
                        : buildingOnTile.buildingType === 'fitness_arena'
                        ? '🏟️'
                        : '🏛️'}
                    </Text>
                    <Text style={styles.buildingName} numberOfLines={1}>
                      Lv.{buildingOnTile.level}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.tileDot}>•</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  islandBase: {
    width: '100%',
    backgroundColor: '#101625',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neonCyan + '40',
    alignItems: 'center',
  },
  biomeTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neonCyan,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  grid: {
    width: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tile: {
    width: 60,
    height: 60,
    backgroundColor: '#171E30',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileOccupied: {
    backgroundColor: colors.primaryPurple + '20',
    borderColor: colors.primaryPurple,
  },
  tileDot: {
    color: '#334155',
    fontSize: 16,
  },
  buildingSprite: {
    alignItems: 'center',
  },
  buildingIcon: {
    fontSize: 22,
  },
  buildingName: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default IsometricWorldView;
