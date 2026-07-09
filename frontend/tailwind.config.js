/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // toggled via `dark` class on <html>
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   '#6366F1',
          'blue-dark': '#4F46E5',
          'blue-light': '#818CF8',
          orange: '#06B6D4',
          'orange-dark': '#0891B2',
          'orange-light': '#22D3EE',
        },
        slate: {
          950: '#030303',
          900: '#050507', // Sleek black background for dark mode pages
          800: '#121214', // Charcoal background for dark mode cards/navbars
          700: '#1F1F23', // Professional thin dark borders
          600: '#3F3F46', // Dark gray for secondary borders/text
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 16px -2px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};