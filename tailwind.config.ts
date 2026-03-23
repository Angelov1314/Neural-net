import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#04070f',
        panel: '#0f172a',
        accent: '#7c3aed',
        glow: '#22d3ee'
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(125,211,252,0.18), 0 0 40px rgba(34,211,238,0.18)'
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 28%), linear-gradient(rgba(15,23,42,0.55), rgba(4,7,15,0.96))'
      }
    }
  },
  plugins: []
};

export default config;
