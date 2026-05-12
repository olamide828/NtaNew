/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0d1b2a',
          900: '#0d1b2a',
          800: '#1a2d42',
          700: '#243d57',
          600: '#2e4d6b',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#e8c97a',
          dark:    '#a8862f',
        },
        cream: {
          DEFAULT: '#faf8f4',
          dark:    '#f0ece3',
        },
      },
      fontFamily: {
        sans:  ['"Inter"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
