/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F80ED',
          hover: '#1B6BD8',
          light: '#EAF2FD',
        },
        navy: {
          DEFAULT: '#1F3A5F',
          dark: '#13243B',
          light: '#2D4E7B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F4F6F9',
        },
        text: {
          primary: '#1F2937',
          muted: '#6B7280',
        },
        border: {
          DEFAULT: '#E3E7EE',
        },
        success: {
          DEFAULT: '#27AE60',
          light: '#E8F8F0',
        },
        speaking: {
          DEFAULT: '#F2994A',
          light: '#FEF4EA',
        },
        danger: {
          DEFAULT: '#D64545',
          light: '#FBEEEE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
