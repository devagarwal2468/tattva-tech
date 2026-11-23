/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand blue sampled from the Tattva "T" mark (navy -> royal blue -> cyan)
        brand: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bdd1ff',
          300: '#8fb1ff',
          400: '#5b86ff',
          500: '#3461fb',
          600: '#1f45ec',
          700: '#1935cf',
          800: '#1a2ea6',
          900: '#1b2d82',
          950: '#141c4d',
        },
        canvas: '#f8f7f4',
        line: '#e9e6df',
        ink: {
          50: '#f6f7fb',
          100: '#eceef5',
          200: '#d6dae7',
          300: '#b2b9cf',
          400: '#8a93b0',
          500: '#646e8d',
          600: '#4b5472',
          700: '#363d58',
          800: '#1d2338',
          900: '#0f1426',
          950: '#070a17',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Inter Tight Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      maxWidth: {
        site: '80rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,20,38,0.03), 0 8px 24px -12px rgba(15,20,38,0.08)',
        'card-hover': '0 2px 6px rgba(15,20,38,0.04), 0 24px 48px -20px rgba(15,20,38,0.18)',
        float: '0 30px 60px -25px rgba(23,40,120,0.35)',
        glow: '0 0 0 1px rgba(91,134,255,0.25), 0 20px 60px -20px rgba(52,97,251,0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rise: {
          '0%': { transform: 'translateY(14px)' },
          '100%': { transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.2,0.7,0.2,1) both',
        rise: 'rise 0.8s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 40s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
