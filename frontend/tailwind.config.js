import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        triangleFloat: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-30px) translateX(-10px) rotate(10deg) scale(1.1)' },
          '50%': { transform: 'translateY(-40px) translateX(10px) rotate(-10deg) scale(1.05)' },
          '75%': { transform: 'translateY(-30px) translateX(-5px) rotate(5deg) scale(1.15)' },
          '100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
        },
      },
      animation: {
        'triangle-float': 'triangleFloat 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
