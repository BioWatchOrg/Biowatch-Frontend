/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#eeeae3', // page background (landing, auth forms)
          navy: '#1c2e6b', // headings, detail-page header, navigation
          teal: '#2aaa8a', // CTA buttons, Export PDF, active accent
          orange: '#f5a42a', // Vigilance score, anomaly warnings
        },
      },
    },
  },
  plugins: [],
};
