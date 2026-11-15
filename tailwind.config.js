/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#070A11',
          card: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          muted: '#64748B',
        },
        ipl: {
          gold: '#F59E0B',
          'gold-light': '#FBBF24',
          csk: '#F9CD05',
          mi: '#004BA0',
          rcb: '#EC1C24',
          kkr: '#3A225D',
          srh: '#F26522',
          rr: '#EA1A85',
          gt: '#1B2133',
          lsg: '#0057E7',
          dc: '#004C93',
          pk: '#ED1B24'
        },
        neon: {
          cyan: '#06B6D4',
          green: '#10B981',
          purple: '#8B5CF6',
          pink: '#F43F5E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.3)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
