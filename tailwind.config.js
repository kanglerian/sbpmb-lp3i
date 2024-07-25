/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lp3i: {
          '50': '#D9F0FF',
          '100': '#006CB2',
          '200': '#005F9C',
          '300': '#00568D',
          '400': '#004D7E',
          '500': '#00426D',
          '600': '#00395E',
          '700': '#003354',
          '800': '#002A45',
          '900': '#001E32',
        },
      },
    },
  },
  plugins: [],
}

