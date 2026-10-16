/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mirrors the CSS variables in src/index.css, which stay the source of truth.
        brand: {
          cream: 'var(--color-bg)', // page background
          navy: 'var(--color-navy)', // text, primary buttons, detail header
          teal: 'var(--color-teal)', // accents, icons
          'teal-strong': 'var(--color-teal-strong)', // CTA fill (AA with white text)
          orange: 'var(--color-orange)', // Vigilance score, fills only
          green: 'var(--color-green)',
          red: 'var(--color-red)',
        },
        ink: { muted: 'var(--color-ink-muted)' },
      },
      borderRadius: { card: 'var(--radius-card)', control: 'var(--radius-control)' },
      boxShadow: { card: 'var(--shadow-card)' },
    },
  },
  plugins: [],
};
