/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Aquí agregamos las animaciones 
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out', 
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' }, // Inicia con opacidad 0
          '100%': { opacity: '1' }, // Termina con opacidad 1
        },
      },
      // Colores personalizados
      colors: {
        primary: {
          0: '#ffffff',
          100: '#5480E4',
          150: '#6687d4',
          200: '#6A92F8',
          300: '#9BA2F8', 
          400: '#BEB5F9',
          450: '#9380BF',
          500: '#684A85', 
          600: '#242424',
          650: '#3c3c3c',
          700: '#171717'
        },
      },
    },
  },

  screens: { // Breakpoints personalizados
    'xxs': '240px', 
    'xs': '480px', 
    'sm': '640px', 
    'md': '768px', 
    'lg': '1024px', 
    'xl': '1280px', 
    '2xl': '1536px', 
  },
};