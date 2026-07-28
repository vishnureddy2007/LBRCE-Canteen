/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // toggled via `dark` class on <html>
  theme: {
    extend: {
      colors: {
        brand: {
          blue:          '#1E3A8A', // Deep LBRCE Royal Blue
          'blue-dark':   '#172554',
          'blue-light':  '#2563EB',
          'blue-accent': '#3B82F6',
          orange:        '#F97316', // Vibrant Canteen Orange
          'orange-dark': '#EA580C',
          'orange-light':'#FB923C',
        },
        slate: {
          950: '#030712',
          900: '#0B0F17', // Modern deep dark mode background
          800: '#111827', // Card surface background
          700: '#1F2937', // Border colors
          600: '#374151',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glow-orange': '0 0 20px -3px rgba(249, 115, 22, 0.35)',
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};