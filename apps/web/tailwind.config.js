/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#080B14',
          secondary: '#101625',
          card: '#171E30',
          cardHover: '#1E2740',
        },
        brand: {
          purple: '#8B5CF6',
          purpleLight: '#A78BFA',
          purpleDark: '#6D28D9',
          electricBlue: '#38BDF8',
          neonCyan: '#22D3EE',
        },
        gamification: {
          gold: '#FBBF24',
          xp: '#A855F7',
          streak: '#FB923C',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glowPurple: '0 0 25px rgba(139, 92, 246, 0.45)',
        glowCyan: '0 0 25px rgba(34, 211, 238, 0.45)',
        glowGold: '0 0 25px rgba(251, 191, 36, 0.45)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
