/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: { /* Colores */
    extend: {},
    colors: {
      primary: {
        0: '#ffffff',
        100: '#5480E4',
        200: '#6A92F8',
        300: '#9BA2F8', 
        400: '#BEB5F9',
        500: '#684A85', 
        600: '#242424',
        700: '#171717'
      },
    },
  },

  screens: { // Aquí se definen los breakpoints
    'xxs': '240px', 
    'xs': '480px', 
    'sm': '640px', 
    'md': '768px', 
    'lg': '1024px', 
    'xl': '1280px', 
    '2xl': '1536px', 
  },
}