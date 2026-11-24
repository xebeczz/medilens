/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mint: '#72D9C2', teal2: '#15333A', navy: '#101B27', bgmain: '#F3F5F2',
        ink: '#202B30', muted: '#728087', border: '#E1E8E5',
        success: '#36A987', warning: '#E7AA50', danger: '#D96A6A', info: '#6E9FCB'
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: { card: '0 1px 3px rgba(16,27,39,0.06), 0 1px 2px rgba(16,27,39,0.04)' }
    }
  },
  plugins: []
}
