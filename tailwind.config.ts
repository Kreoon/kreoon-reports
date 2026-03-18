import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kreoon: { DEFAULT: '#7c3aed', dark: '#6d28d9', light: '#a855f7' },
        surface: { DEFAULT: '#F5F5F5', dark: '#1a1a24', darker: '#0a0a0f' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
