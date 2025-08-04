/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-3px)' },
          '40%': { transform: 'translateX(3px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wobble: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(-5deg)' },
          '30%': { transform: 'rotate(5deg)' },
          '45%': { transform: 'rotate(-3deg)' },
          '60%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-2deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        bounceOnce: 'bounceOnce 0.4s ease-in-out',
        wobble: 'wobble 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
}

