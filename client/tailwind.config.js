/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
      'xxs': '0.625rem',
      },
      colors:{
        materialblack : {
          100 : "#141617",
          200 : "#1a1a1a",
          300: "#2a2a2a",
          400: "#3b3b3b",
          500: "#4d4d4d",
        },
        primary : {
          100 : "#c48dff",
          200 : "#B065FF",
          300 : "#a450fd",
        },
        offwhite : '#FAF9F6'
      },
    },
  },
  plugins: [],
};