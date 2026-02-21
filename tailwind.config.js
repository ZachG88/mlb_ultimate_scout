/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#010810',
          900: '#030C1C',
          800: '#061728',
          700: '#0D2540',
          600: '#163558',
          500: '#1E4A7A',
        },
        mlb: {
          red:    '#C8102E',
          blue:   '#2563EB',
          silver: '#C4CED4',
        },
        status: {
          live:      '#16A34A',
          final:     '#6B7280',
          scheduled: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'field-gradient': 'radial-gradient(ellipse 80% 60% at 10% 5%, rgba(37,99,235,0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 95%, rgba(200,16,46,0.10) 0%, transparent 55%)',
      },
    },
  },
  plugins: [],
}
