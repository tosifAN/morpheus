/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0', transform: 'translateY(-10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' }
            },
            scaleIn: {
                '0%': { transform: 'scale(0.9)', opacity: '0' },
                '100%': { transform: 'scale(1)', opacity: '1' }
            },
            slideUp: {
              '0%': { 
                opacity: '0',
                transform: 'translateY(20px)'
              },
              '100%': { 
                opacity: '1',
                transform: 'translateY(0)'
              },
            }
        },

        animation: {
            fadeIn: 'fadeIn 0.5s ease-out',
            scaleIn: 'scaleIn 0.2s ease-out',
            slideUp: 'slideUp 0.5s ease-out',
        }
    }
},
  plugins: [],
}
