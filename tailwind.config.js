/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EBE3D5',
          300: '#DDD1BD',
          400: '#C7B79D',
          500: '#AC977B',
        },
        walnut: {
          50: '#F7F4F1',
          100: '#EFE8E1',
          200: '#DFD1C4',
          300: '#C4AEA0',
          400: '#9E7E6A',
          500: '#7B5C47',
          600: '#5F4432',
          700: '#4A3324',
          800: '#382519',
          900: '#26170E',
          950: '#170E08',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#2A2928',
          900: '#1A1918',
          950: '#111110',
        },
        moss: {
          50: '#F4F6F4',
          100: '#E6EAE5',
          200: '#CCD5CB',
          300: '#A9B9A7',
          400: '#839881',
          500: '#647A62',
          600: '#4F614D',
          700: '#3E4D3D',
          800: '#323E32',
          900: '#2A332A',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        progress: 'progress 3s linear infinite',
      },
    },
  },
  plugins: [],
}
