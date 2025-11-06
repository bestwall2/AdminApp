/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#ffffff',
        'text-light': '#1f2937',
        'primary-light': '#3b82f6',
        'secondary-light': '#9ca3af',
        'card-light': '#f9fafb',
        'background-dark': '#111827',
        'text-dark': '#f9fafb',
        'primary-dark': '#60a5fa',
        'secondary-dark': '#6b7280',
        'card-dark': '#1f2937',
      },
    },
  },
  plugins: [],
};
