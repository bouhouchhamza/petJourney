/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FDF9F3',
          secondary: '#F7F3ED',
        },
        primary: {
          DEFAULT: '#5D3C18',
        },
        status: {
          success: '#15803D',
          error: '#BA1A1A',
        },
        text: {
          heading: '#444343',
          body: '#48473E',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', '"Noto Serif"', 'serif'],
        body: ['Inter', '"Nimbus Sans"', 'sans-serif'],
      },
      borderRadius: {
        'custom': '8px',
        'custom-lg': '12px',
      },
      boxShadow: {
        'custom': '0px 12px 40px rgba(28, 28, 24, 0.04)',
      }
    },
  },
  plugins: [],
}
