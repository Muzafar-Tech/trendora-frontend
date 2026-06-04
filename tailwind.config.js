/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#7c3aed',   // Main purple
        'primary-dark':  '#6d28d9',
        'primary-light': '#ede9fe',
        'primary-hover': '#5b21b6',
        secondary: '#1f2937',   // Dark text
        accent:    '#a78bfa',   // Light purple accent
        surface:   '#f9fafb',   // Page background
        card:      '#ffffff',   // Card background
        border:    '#e5e7eb',   // Default border
        muted:     '#6b7280',   // Muted text
        success:   '#10b981',
        warning:   '#f59e0b',
        danger:    '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card:    '0 2px 12px rgba(124, 58, 237, 0.08)',
        purple:  '0 4px 20px rgba(124, 58, 237, 0.25)',
        soft:    '0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        'gradient-hero':   'linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #f5f3ff 100%)',
        'gradient-section':'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      },
    },
  },
  plugins: [],
}