import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kreoon: { DEFAULT: '#FF6B00', dark: '#CC5500', light: '#FFF8F0' },
        surface: { DEFAULT: '#F5F5F5', dark: '#1a1a1a', darker: '#0A0A0A' },
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
