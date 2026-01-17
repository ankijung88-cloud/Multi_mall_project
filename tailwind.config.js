/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hanbok: {
          jade: '#00B894',
          sunset: '#FF6B9D',
          royal: '#6C5CE7',
          sky: '#74B9FF',
          cloud: '#F8F9FA',
          charcoal: '#2D3436',
          gold: '#FDCB6E',
          'light-jade': '#55EFC4',
          'light-pink': '#FD79A8',
        },
      },
      backgroundImage: {
        'gradient-jade-sky': 'linear-gradient(135deg, #00B894 0%, #74B9FF 100%)',
        'gradient-sunset-royal': 'linear-gradient(135deg, #FF6B9D 0%, #6C5CE7 100%)',
        'gradient-royal-gold': 'linear-gradient(135deg, #6C5CE7 0%, #FDCB6E 100%)',
        'gradient-hanbok': 'linear-gradient(135deg, #00B894 0%, #FF6B9D 50%, #6C5CE7 100%)',
      },
      fontFamily: {
        'hanbok': ['"Nanum Myeongjo"', '"Noto Sans KR"', 'serif'],
        'korean': ['"Noto Sans KR"', 'sans-serif'],
      },
      // 애니메이션
      animation: {
        'slide-left': 'slide-in-left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-right': 'slide-in-right 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'slide-in-left': {
          'from': { opacity: '0', transform: 'translateX(-50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      // 테두리 반경
      borderRadius: {
        'street': '16px',
      },
    },
  },
  plugins: [],
}
