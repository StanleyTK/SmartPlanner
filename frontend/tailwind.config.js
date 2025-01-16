/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Correct path to scan all files
    "./src/app/**/*.{js,ts,jsx,tsx}", // Include app directory
    "./src/components/**/*.{js,ts,jsx,tsx}", // Include components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
