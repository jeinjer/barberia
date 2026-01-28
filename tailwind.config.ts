/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esta línea es vital
  ],
  darkMode: 'class', // Agregá esto para que el modo oscuro funcione por clases
  theme: {
    extend: {},
  },
  plugins: [],
}