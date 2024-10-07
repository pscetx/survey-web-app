/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'primary': '#b10913',
      'secondary': '#2f2424',
      'tertiary': '#f5f5f5',
      slate: colors.slate,
      gray: colors.gray,
      red: colors.red,
      amber: colors.amber,
      emerald: colors.emerald,
      sky: colors.sky,
    },
    extend: {},
  },
  plugins: [],
}

