/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        materialblack : {
          100 : "#141617",
          200 : "1a1a1a",
        },
        primary : {
          100 : "#c48dff",
          200 : "#B065FF",
          300 : "#a450fd",
        }
      },
    },
  },
  plugins: [],
};