import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1180px' },
    },
    extend: {
      colors: {
        navy: { DEFAULT: '#0a1e3a', deep: '#061528' },
        ivory: { DEFAULT: '#f5f1e8', soft: '#ebe5d6' },
        brass: { DEFAULT: '#b08d57', deep: '#7a5e30' },
        ink: '#1a1a1a',
        rule: 'rgba(10, 30, 58, 0.18)',

        // shadcn semantic tokens, mapped to brand palette
        border: 'hsl(35 33% 78%)',
        input: 'hsl(35 33% 78%)',
        ring: 'hsl(35 36% 36%)',
        background: '#f5f1e8',
        foreground: '#0a1e3a',
        primary: { DEFAULT: '#0a1e3a', foreground: '#f5f1e8' },
        secondary: { DEFAULT: '#ebe5d6', foreground: '#0a1e3a' },
        destructive: { DEFAULT: '#b00020', foreground: '#f5f1e8' },
        muted: { DEFAULT: '#ebe5d6', foreground: 'rgba(26,26,26,0.65)' },
        accent: { DEFAULT: '#b08d57', foreground: '#0a1e3a' },
        popover: { DEFAULT: '#ffffff', foreground: '#0a1e3a' },
        card: { DEFAULT: '#ffffff', foreground: '#0a1e3a' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Cormorant', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Type scale that matches the v1 hero clamp behaviour
        hero: ['clamp(2.85rem, 11.4vw, 5.6rem)', { lineHeight: '1.03', letterSpacing: '-0.012em' }],
        display: ['clamp(2.2rem, 6vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        title: ['clamp(1.4rem, 3vw, 1.85rem)', { lineHeight: '1.15' }],
      },
      borderRadius: { lg: '0', md: '0', sm: '0' },
      letterSpacing: { wider: '0.1em', widest: '0.22em' },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--reka-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--reka-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.9s ease both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
