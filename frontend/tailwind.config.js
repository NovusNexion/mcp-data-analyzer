/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          morandi: {
            bg: '#f4f1ea',
            sidebar: '#faf8f5',
            border: '#e0dbd1',
            primary: '#b8a9c9',
            'primary-hover': '#a392b5',
            'user-bubble': '#d4d9e6',
            'assistant-bubble': '#e8e3da',
            text: '#4a4540',
            'text-muted': '#8a847c',
            danger: '#c9b5b0',
          }
        }
      },
    },
    plugins: [],
  }