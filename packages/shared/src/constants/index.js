/**
 * LIFEVERSE Shared Constants
 */

export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
};

export const RANKS = {
  BEGINNER: 'Beginner',
  EXPLORER: 'Explorer',
  WARRIOR: 'Warrior',
  MASTER: 'Master',
  LEGEND: 'Legend',
};

export const RANK_THRESHOLDS = [
  { minLevel: 1, maxLevel: 5, rank: RANKS.BEGINNER, color: '#94A3B8' },
  { minLevel: 6, maxLevel: 15, rank: RANKS.EXPLORER, color: '#38BDF8' },
  { minLevel: 16, maxLevel: 30, rank: RANKS.WARRIOR, color: '#8B5CF6' },
  { minLevel: 31, maxLevel: 50, rank: RANKS.MASTER, color: '#EC4899' },
  { minLevel: 51, maxLevel: Infinity, rank: RANKS.LEGEND, color: '#FBBF24' },
];

export const QUEST_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const QUEST_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const QUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const CATEGORIES = {
  PRODUCTIVITY: 'productivity',
  FITNESS: 'fitness',
  LEARNING: 'learning',
  EDUCATION: 'education',
  CAREER: 'career',
  CREATIVITY: 'creativity',
  HEALTH: 'health',
  PERSONAL_DEVELOPMENT: 'personal_development',
  CUSTOM: 'custom',
};

export const DEFAULT_REWARDS = {
  EASY_QUEST: { xp: 10, coins: 5 },
  MEDIUM_QUEST: { xp: 25, coins: 10 },
  HARD_QUEST: { xp: 50, coins: 20 },
  HABIT_CHECKIN: { xp: 10, coins: 5 },
  GOAL_MILESTONE: { xp: 50, coins: 25 },
  GOAL_COMPLETION: { xp: 100, coins: 50 },
  WORKOUT_COMPLETION: { xp: 30, coins: 15 },
  LEARNING_SESSION: { xp: 25, coins: 10 },
  COMMUNITY_CHALLENGE: { xp: 150, coins: 75 },
};

export const WORLD_THEMES = [
  { id: 'futuristic_city', name: 'Futuristic City', description: 'Gleaming skyscrapers, hoverways, and neon power grids.' },
  { id: 'fantasy_island', name: 'Fantasy Island', description: 'Floating islands, ancient runes, and mystical flora.' },
  { id: 'nature_village', name: 'Nature Village', description: 'Serene waterfalls, bamboo groves, and zen sanctuaries.' },
  { id: 'space_colony', name: 'Space Colony', description: 'Orbital domes, solar arrays, and high-tech command nodes.' },
  { id: 'cyberpunk_city', name: 'Cyberpunk Metropolis', description: 'Rain-slicked alleyways, holographic billboards, and synthwave lights.' },
];

export const AVATAR_ITEM_CATEGORIES = {
  BODY: 'body',
  HAIR: 'hair',
  FACE: 'face',
  OUTFIT: 'outfit',
  ACCESSORIES: 'accessories',
  SHOES: 'shoes',
  ARMOR: 'armor',
  BACKGROUND: 'background',
  EFFECTS: 'effects',
};

export const BUILDING_TYPES = {
  LEARNING_LIBRARY: 'learning_library',
  FITNESS_ARENA: 'fitness_arena',
  PRODUCTIVITY_TOWER: 'productivity_tower',
  MEDITATION_GARDEN: 'meditation_garden',
  CREATIVITY_STUDIO: 'creativity_studio',
  CAREER_HEADQUARTERS: 'career_headquarters',
  ACHIEVEMENT_MONUMENT: 'achievement_monument',
};
