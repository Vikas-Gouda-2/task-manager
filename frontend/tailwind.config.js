/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'aurora-1': 'aurora-1 20s linear infinite',
        'aurora-2': 'aurora-2 25s linear infinite',
        'aurora-3': 'aurora-3 30s linear infinite',
        'subtle-pulse': 'subtlePulse 4s ease-in-out infinite',
        'liquid-morph': 'liquidMorph 8s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stretchGrow: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' }
        },
        liquidMorph: {
          '0%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }
        },
        'aurora-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
          '25%': { transform: 'translate(20vw, 20vh) scale(1.1) rotate(90deg)' },
          '50%': { transform: 'translate(40vw, -10vh) scale(0.9) rotate(180deg)' },
          '75%': { transform: 'translate(-20vw, 30vh) scale(1.2) rotate(270deg)' },
        },
        'aurora-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
          '25%': { transform: 'translate(-30vw, 15vh) scale(1.2) rotate(-90deg)' },
          '50%': { transform: 'translate(10vw, -30vh) scale(0.8) rotate(-180deg)' },
          '75%': { transform: 'translate(25vw, 25vh) scale(1.1) rotate(-270deg)' },
        },
        'aurora-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(15vw, -20vh) scale(1.3)' },
          '66%': { transform: 'translate(-15vw, 10vh) scale(0.8)' },
        }
      }
    },
  },
  plugins: [],
}
