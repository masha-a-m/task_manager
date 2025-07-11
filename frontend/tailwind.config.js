/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      safelist: [
        'bg-red-500',
        'bg-orange-500',
        'bg-blue-500',
        'bg-gray-500',
      ],
      // colors: {
      //   red: {
      //     500: '#ef4444',
      //   },
      //   orange: {
      //     500: '#f97316',
      //   },
      //   blue: {
      //     500: '#3b82f6',
      //   },
      //   gray: {
      //     500: '#6b7280',
      //   }
      // }
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}