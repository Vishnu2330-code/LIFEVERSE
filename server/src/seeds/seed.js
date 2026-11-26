import { connectDB, disconnectDB } from '../config/db.js';
import { ENV } from '../config/env.js';
import {
  User,
  GamificationProfile,
  AvatarItem,
  Building,
  MarketplaceItem,
  Achievement,
  LearningRoadmap,
  Challenge,
  SystemSetting,
  Quest,
  Habit,
  Goal,
  VirtualWorld,
  Avatar,
} from '../models/index.js';
import { USER_ROLES, RANKS } from '@lifeverse/shared';

export async function runSeeds() {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Seeding initial Administrator...');
    const adminEmail = ENV.ADMIN_EMAIL.toLowerCase();
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const passwordHash = await User.hashPassword(ENV.ADMIN_PASSWORD);
      admin = await User.create({
        username: ENV.ADMIN_USERNAME,
        email: adminEmail,
        passwordHash,
        role: USER_ROLES.ADMIN,
        status: 'active',
        isEmailVerified: true,
      });

      await GamificationProfile.create({
        userId: admin._id,
        totalXp: 5000,
        level: 10,
        rank: 'Explorer',
        coins: 1000,
      });

      console.log(`[Seed] Administrator account created: ${adminEmail}`);
    } else {
      admin.passwordHash = await User.hashPassword('AdminPass123!');
      await admin.save();
      console.log(`[Seed] Administrator account verified & updated: ${adminEmail}`);
    }

    // Seed Demo Player Alex
    console.log('[Seed] Seeding Demo Player (Alex)...');
    const playerEmail = 'alex@lifeverse.io';
    let player = await User.findOne({ email: playerEmail });
    const playerPassHash = await User.hashPassword('PlayerPass123!');

    if (!player) {
      player = await User.create({
        username: 'AlexTheAdventurer',
        email: playerEmail,
        passwordHash: playerPassHash,
        role: USER_ROLES.USER,
        status: 'active',
        isEmailVerified: true,
      });

      await GamificationProfile.create({
        userId: player._id,
        totalXp: 850,
        level: 4,
        rank: RANKS.BEGINNER,
        coins: 350,
        streakCount: 5,
        totalQuestsCompleted: 8,
        totalHabitsCompleted: 24,
        totalWorkoutsCompleted: 6,
        totalLearningHours: 14,
      });

      // Seed initial World for player
      await VirtualWorld.create({
        userId: player._id,
        islandName: "Alex's Sky Haven",
        theme: 'floating_islands',
        gridSize: 16,
        buildings: [],
      });

      // Seed initial Avatar for player
      await Avatar.create({
        userId: player._id,
        equipped: {
          body: 'default_body',
          hair: 'hair_style_1',
          face: 'face_expressive',
          clothing: 'starter_tunic',
        },
      });

      // Seed Quests for player
      await Quest.create([
        {
          userId: player._id,
          title: 'Complete 30-minute Morning Run',
          description: 'Outdoor endurance jog to boost cardio health and stamina.',
          category: 'fitness',
          difficulty: 'medium',
          priority: 'high',
          status: 'pending',
          xpReward: 60,
          coinReward: 15,
        },
        {
          userId: player._id,
          title: 'Master React Three Fiber Shaders',
          description: 'Study custom GLSL uniforms and vertex displacement.',
          category: 'learning',
          difficulty: 'hard',
          priority: 'medium',
          status: 'in_progress',
          xpReward: 120,
          coinReward: 30,
        },
        {
          userId: player._id,
          title: 'Organize Workspace Desk & Cable Routing',
          description: 'Declutter physical desk to prepare for deep work sessions.',
          category: 'productivity',
          difficulty: 'easy',
          priority: 'low',
          status: 'pending',
          xpReward: 30,
          coinReward: 10,
        },
      ]);

      // Seed Habits for player
      await Habit.create([
        {
          userId: player._id,
          title: 'Drink 2.5L Water Daily',
          frequency: 'daily',
          targetPerPeriod: 1,
          currentStreak: 5,
          longestStreak: 12,
          xpPerCheckIn: 20,
          coinsPerCheckIn: 5,
          color: '#38BDF8',
        },
        {
          userId: player._id,
          title: 'Read 20 Pages of Tech / Fiction',
          frequency: 'daily',
          targetPerPeriod: 1,
          currentStreak: 3,
          longestStreak: 7,
          xpPerCheckIn: 25,
          coinsPerCheckIn: 5,
          color: '#8B5CF6',
        },
      ]);

      // Seed Goal for player
      await Goal.create({
        userId: player._id,
        title: 'Launch LIFEVERSE Production Ecosystem',
        description: 'Complete Web, Mobile, and Backend architecture with 100% test coverage.',
        category: 'work',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progressPercentage: 80,
        milestones: [
          { title: 'Build Full Stack Monorepo', isCompleted: true },
          { title: 'Pass 100% Integration Test Suite', isCompleted: true },
          { title: 'Launch 3D Web & Mobile Views', isCompleted: true },
          { title: 'Deploy on Production Cloud', isCompleted: false },
        ],
      });

      console.log(`[Seed] Demo Player account & starter assets created: ${playerEmail}`);
    } else {
      player.passwordHash = playerPassHash;
      await player.save();
      let prof = await GamificationProfile.findOne({ userId: player._id });
      if (!prof) {
        await GamificationProfile.create({
          userId: player._id,
          totalXp: 850,
          level: 4,
          rank: RANKS.BEGINNER,
          coins: 350,
          streakCount: 5,
          totalQuestsCompleted: 8,
          totalHabitsCompleted: 24,
          totalWorkoutsCompleted: 6,
          totalLearningHours: 14,
        });
      }
      let world = await VirtualWorld.findOne({ userId: player._id });
      if (!world) {
        await VirtualWorld.create({
          userId: player._id,
          islandName: "Alex's Sky Haven",
          theme: 'floating_islands',
          gridSize: 16,
          buildings: [],
        });
      }
      console.log(`[Seed] Demo Player account verified & updated: ${playerEmail}`);
    }

    // 1. Seed Avatar Items
    console.log('[Seed] Seeding Avatar Items...');
    const avatarItems = [
      {
        itemId: 'default_body',
        name: 'Adventurer Body',
        category: 'body',
        isDefault: true,
        assetRef: 'mesh_body_default',
        description: 'Standard athletic avatar frame.',
      },
      {
        itemId: 'hair_style_1',
        name: 'Cyber Spikes',
        category: 'hair',
        isDefault: true,
        assetRef: 'hair_cyber_spikes',
        description: 'Futuristic spiky haircut.',
      },
      {
        itemId: 'face_expressive',
        name: 'Determined Gaze',
        category: 'face',
        isDefault: true,
        assetRef: 'face_determined',
        description: 'Focused expression for high achievers.',
      },
      {
        itemId: 'outfit_novice_adventurer',
        name: 'Novice Adventurer Tunic',
        category: 'outfit',
        isDefault: true,
        assetRef: 'outfit_novice',
        description: 'Comfortable lightweight gear for beginners.',
      },
      {
        itemId: 'shoes_leather_boots',
        name: 'Trail Runner Boots',
        category: 'shoes',
        isDefault: true,
        assetRef: 'shoes_trail_boots',
        description: 'Durable boots crafted for exploration.',
      },
      {
        itemId: 'armor_cyber_plate',
        name: 'Neon Cyber Armor',
        category: 'armor',
        coinCost: 150,
        levelRequired: 5,
        rarity: 'rare',
        assetRef: 'armor_neon_plate',
        description: 'Luminescent chestplate with kinetic shielding.',
      },
      {
        itemId: 'accessory_ar_visor',
        name: 'Holo-Tech Visor',
        category: 'accessories',
        coinCost: 100,
        levelRequired: 3,
        rarity: 'rare',
        assetRef: 'acc_holo_visor',
        description: 'Head-up display projecting productivity stats.',
      },
      {
        itemId: 'effect_quantum_wings',
        name: 'Quantum Light Wings',
        category: 'effects',
        coinCost: 350,
        levelRequired: 15,
        rarity: 'legendary',
        assetRef: 'fx_quantum_wings',
        description: 'Photonic wings radiating celestial energy.',
      },
    ];

    for (const item of avatarItems) {
      await AvatarItem.findOneAndUpdate({ itemId: item.itemId }, item, { upsert: true });
    }

    // 2. Seed Virtual Buildings
    console.log('[Seed] Seeding Virtual Buildings...');
    const buildings = [
      {
        buildingType: 'learning_library',
        name: 'Codex Knowledge Library',
        category: 'learning',
        levelRequired: 1,
        coinCost: 100,
        assetRef: 'bldg_library',
        description: 'Archive of masteries and learned skills.',
      },
      {
        buildingType: 'fitness_arena',
        name: 'Titan Fitness Arena',
        category: 'fitness',
        levelRequired: 3,
        coinCost: 200,
        assetRef: 'bldg_gym',
        description: 'Training complex boosting daily vitality.',
      },
      {
        buildingType: 'productivity_tower',
        name: 'Ascent Productivity Spire',
        category: 'productivity',
        levelRequired: 5,
        coinCost: 300,
        assetRef: 'bldg_tower',
        description: 'High-altitude research center for focus and output.',
      },
      {
        buildingType: 'meditation_garden',
        name: 'Zen Sanctuary Garden',
        category: 'health',
        levelRequired: 2,
        coinCost: 150,
        assetRef: 'bldg_garden',
        description: 'Quiet koi pond and cherry blossom trees for mental clarity.',
      },
      {
        buildingType: 'achievement_monument',
        name: 'Monument of Champions',
        category: 'world',
        levelRequired: 10,
        coinCost: 500,
        assetRef: 'bldg_monument',
        description: 'Towering crystal obelisk celebrating life achievements.',
      },
    ];

    for (const b of buildings) {
      await Building.findOneAndUpdate({ buildingType: b.buildingType }, b, { upsert: true });
    }

    // 3. Seed Marketplace Catalog
    console.log('[Seed] Seeding Marketplace Items...');
    const marketplaceItems = [
      {
        itemId: 'armor_cyber_plate',
        title: 'Neon Cyber Armor',
        category: 'avatar_outfit',
        itemType: 'avatar_item',
        coinCost: 150,
        levelRequired: 5,
        previewUrl: '/assets/marketplace/armor_cyber.png',
        description: 'Defend your goals in style with luminous neon cyber armor.',
        isFeatured: true,
      },
      {
        itemId: 'accessory_ar_visor',
        title: 'Holo-Tech Visor',
        category: 'avatar_accessory',
        itemType: 'avatar_item',
        coinCost: 100,
        levelRequired: 3,
        previewUrl: '/assets/marketplace/visor.png',
        description: 'Tactical HUD visor showing your daily mission telemetry.',
        isFeatured: true,
      },
      {
        itemId: 'effect_quantum_wings',
        title: 'Quantum Light Wings',
        category: 'visual_effect',
        itemType: 'avatar_item',
        coinCost: 350,
        levelRequired: 15,
        previewUrl: '/assets/marketplace/wings.png',
        description: 'Unleash legendary celestial energy aura behind your character.',
        isFeatured: true,
      },
      {
        itemId: 'blueprint_fitness_arena',
        title: 'Titan Fitness Arena Blueprint',
        category: 'building',
        itemType: 'building',
        coinCost: 200,
        levelRequired: 3,
        previewUrl: '/assets/marketplace/arena.png',
        description: 'Permit to construct the Titan Arena on your virtual world island.',
        isFeatured: false,
      },
      {
        itemId: 'blueprint_productivity_tower',
        title: 'Productivity Spire Blueprint',
        category: 'building',
        itemType: 'building',
        coinCost: 300,
        levelRequired: 5,
        previewUrl: '/assets/marketplace/tower.png',
        description: 'Architectural blueprint for the soaring focus spire.',
        isFeatured: false,
      },
      {
        itemId: 'theme_space_colony',
        title: 'Space Colony World Theme',
        category: 'world_theme',
        itemType: 'world_theme',
        coinCost: 400,
        levelRequired: 8,
        previewUrl: '/assets/marketplace/space_theme.png',
        description: 'Transform your island into a futuristic Martian biome.',
        isFeatured: true,
      },
    ];

    for (const m of marketplaceItems) {
      await MarketplaceItem.findOneAndUpdate({ itemId: m.itemId }, m, { upsert: true });
    }

    // 4. Seed Core Achievements
    console.log('[Seed] Seeding Achievements...');
    const achievements = [
      {
        key: 'first_quest',
        title: 'First Step',
        description: 'Complete your first real-life quest.',
        category: 'productivity',
        icon: 'footprints',
        condition: { metric: 'totalQuestsCompleted', threshold: 1 },
        xpReward: 50,
        coinReward: 25,
      },
      {
        key: 'quest_master_10',
        title: 'Task Conqueror',
        description: 'Complete 10 quests.',
        category: 'productivity',
        icon: 'swords',
        condition: { metric: 'totalQuestsCompleted', threshold: 10 },
        xpReward: 100,
        coinReward: 50,
      },
      {
        key: 'habit_streak_7',
        title: 'Consistency King',
        description: 'Maintain a 7-day habit streak.',
        category: 'habits',
        icon: 'flame',
        condition: { metric: 'streakCount', threshold: 7 },
        xpReward: 150,
        coinReward: 75,
      },
      {
        key: 'level_5_explorer',
        title: 'Rising Explorer',
        description: 'Reach Level 5 and advance to the Explorer rank.',
        category: 'productivity',
        icon: 'compass',
        condition: { metric: 'level', threshold: 5 },
        xpReward: 200,
        coinReward: 100,
      },
      {
        key: 'fitness_starter',
        title: 'Iron Will',
        description: 'Log 5 workout sessions.',
        category: 'fitness',
        icon: 'dumbbell',
        condition: { metric: 'totalWorkoutsCompleted', threshold: 5 },
        xpReward: 100,
        coinReward: 50,
      },
    ];

    for (const a of achievements) {
      await Achievement.findOneAndUpdate({ key: a.key }, a, { upsert: true });
    }

    // 5. Seed Initial Challenge
    console.log('[Seed] Seeding Community Challenge...');
    const existingChallenge = await Challenge.findOne({ title: 'Global 7-Day Productivity Sprint' });
    if (!existingChallenge) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      await Challenge.create({
        title: 'Global 7-Day Productivity Sprint',
        description: 'Complete at least 5 quests over the next 7 days with the global LIFEVERSE community.',
        category: 'productivity',
        type: 'community',
        startDate: now,
        endDate: nextWeek,
        criteria: { metric: 'quests_completed', targetValue: 5 },
        xpReward: 200,
        coinReward: 100,
        status: 'active',
      });
    }

    // 6. System Settings
    await SystemSetting.findOneAndUpdate(
      { key: 'xp_multiplier' },
      { key: 'xp_multiplier', value: 1.0, description: 'Global XP boost multiplier' },
      { upsert: true }
    );

    console.log('[Seed] Seeding completed successfully! 🌱');
  } catch (error) {
    console.error('[Seed] Seeding error:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSeeds()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runSeeds;
