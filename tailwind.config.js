/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090d16',
        surface: '#111827',
        'surface-elevated': '#1e293b',
        border: '#334155',
        aqi: {
          good: '#10b981',        // Green (0-50)
          moderate: '#f59e0b',    // Yellow/Amber (51-100)
          unhealthy: '#f97316',   // Orange (101-200)
          hazardous: '#ef4444',   // Red (> 200)
          severe: '#7f1d1d',      // Deep Maroon (> 300)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'glow-yellow': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'glow-orange': '0 0 20px -5px rgba(249, 115, 22, 0.4)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
