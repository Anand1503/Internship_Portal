/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elegant dark theme with rose quartz accents
        rose: {
          50: '#faf8f9',
          100: '#f5f1f2',
          200: '#ebe3e5',
          300: '#dccfd2',
          400: '#bcabae', // Main rose quartz
          500: '#a89295',
          600: '#8d7477',
          700: '#705d5f',
          800: '#5c4d4f',
          900: '#4e4244',
        },
        night: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#0f0f0f', // Main night black
        },
        jet: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#2d2e2e', // Main jet
        },
        dim: {
          50: '#f7f6f6',
          100: '#e3e2e2',
          200: '#c8c6c6',
          300: '#a5a2a2',
          400: '#868282',
          500: '#716969', // Main dim gray
          600: '#5e5757',
          700: '#4e4848',
          800: '#433e3e',
          900: '#3b3737',
        },
        // Keep white/light variants
        light: {
          50: '#ffffff',
          100: '#fbfbfb', // Main white
          200: '#f7f7f7',
          300: '#f0f0f0',
          400: '#e8e8e8',
          500: '#d4d4d4',
          600: '#b8b8b8',
          700: '#9a9a9a',
          800: '#7a7a7a',
          900: '#5a5a5a',
        },
        // Alias for consistency
        primary: {
          50: '#faf8f9',
          100: '#f5f1f2',
          200: '#ebe3e5',
          300: '#dccfd2',
          400: '#bcabae',
          500: '#a89295',
          600: '#8d7477',
          700: '#705d5f',
          800: '#5c4d4f',
          900: '#4e4244',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
