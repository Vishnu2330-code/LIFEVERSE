/**
 * LIFEVERSE Unified Design System Tokens
 * Combining cinematic gaming storytelling, futuristic dashboards, and modern RPG styling.
 */

export const colors = {
  // Backgrounds
  background: {
    primary: '#080B14',
    secondary: '#101625',
    card: '#171E30',
    cardHover: '#1E2740',
    overlay: 'rgba(8, 11, 20, 0.85)',
  },

  // Primary Brand & Accents
  brand: {
    purple: '#8B5CF6',
    purpleLight: '#A78BFA',
    purpleDark: '#6D28D9',
    purpleGlow: 'rgba(139, 92, 246, 0.35)',

    electricBlue: '#38BDF8',
    electricBlueDark: '#0284C7',
    electricBlueGlow: 'rgba(56, 189, 248, 0.35)',

    neonCyan: '#22D3EE',
    neonCyanDark: '#0891B2',
    neonCyanGlow: 'rgba(34, 211, 238, 0.35)',
  },

  // Functional Status Colors
  status: {
    success: '#22C55E',
    successGlow: 'rgba(34, 197, 94, 0.3)',
    warning: '#F59E0B',
    error: '#EF4444',
    errorGlow: 'rgba(239, 68, 68, 0.3)',
    info: '#3B82F6',
  },

  // Gamification & Rewards
  gamification: {
    gold: '#FBBF24',
    goldGlow: 'rgba(251, 191, 36, 0.4)',
    xpPurple: '#A855F7',
    coinYellow: '#FCD34D',
    streakOrange: '#FB923C',
    rankBeginner: '#94A3B8',
    rankExplorer: '#38BDF8',
    rankWarrior: '#8B5CF6',
    rankMaster: '#EC4899',
    rankLegend: '#F59E0B',
  },

  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: '#080B14',
  },

  // Borders
  border: {
    subtle: 'rgba(148, 163, 184, 0.1)',
    medium: 'rgba(148, 163, 184, 0.2)',
    focus: 'rgba(139, 92, 246, 0.6)',
    glowCyan: 'rgba(34, 211, 238, 0.4)',
  },
};

export const typography = {
  fontFamily: {
    heading: "'Space Grotesk', 'Sora', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

export const shadows = {
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  purpleGlow: '0 0 25px rgba(139, 92, 246, 0.45)',
  cyanGlow: '0 0 25px rgba(34, 211, 238, 0.45)',
  goldGlow: '0 0 25px rgba(251, 191, 36, 0.45)',
  card: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
};

export const glassmorphism = {
  card: {
    background: 'rgba(23, 30, 48, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
  },
  nav: {
    background: 'rgba(8, 11, 20, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
  },
  modal: {
    background: 'rgba(16, 22, 37, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
  },
};

export default {
  colors,
  typography,
  shadows,
  glassmorphism,
};
