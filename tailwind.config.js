/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A0C878',
        'primary-bg': '#FFFDF6',
        'secondary-bg': '#FAF6E9',
        accent: '#DDEB9D',
        sidebar: {
          bg: '#FAF6E9',
          hover: '#DDEB9D',
          active: '#A0C878',
          text: '#2D3748',
          icon: '#4A5568',
          border: '#E2E8F0',
        }
      },
      transitionProperty: {
        'width': 'width'
      },
      width: {
        'sidebar-expanded': '240px',
        'sidebar-collapsed': '64px',
      }
    },
  },
  plugins: [],
}