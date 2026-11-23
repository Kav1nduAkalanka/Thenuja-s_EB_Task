/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        jira: {
          blue: '#0052CC',
          blueHover: '#0747A6',
          blueLight: '#DEEBFF',
          blueBorder: '#B3D4FF',
          dark: '#172B4D',
          subtle: '#5E6C84',
          muted: '#6B778C',
          bg: '#F4F5F7',
          surface: '#FFFFFF',
          border: '#DFE1E6',
          divider: '#EBECF0',
          hover: '#EBECF0',
          selected: '#DEEBFF',
          green: '#36B37E',
          greenLight: '#E3FCEF',
          greenDark: '#006644',
          amber: '#FFAB00',
          amberLight: '#FFF0B3',
          amberDark: '#172B4D',
          red: '#FF5630',
          redLight: '#FFEBE6',
          purple: '#6554C0',
          purpleLight: '#EAE6FF',
          teal: '#00B8D9',
          tealLight: '#E6FCFF'
        }
      },
      boxShadow: {
        'app-card': '0 1px 1px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
        'app-card-hover': '0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)',
        'app-dropdown': '0 4px 12px rgba(9, 30, 66, 0.15), 0 0 1px rgba(9, 30, 66, 0.31)',
        'app-modal': '0 8px 30px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)'
      }
    },
  },
  plugins: [],
}
