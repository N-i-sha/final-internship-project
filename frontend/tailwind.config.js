/** @type {import('tailwindcss').Config} */
// tailwind.config.js
// Tells Tailwind which files to scan for class names.
// Only classes found in these files are included in the final CSS bundle.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // All React component files
  ],
  theme: {
    extend: {
      // Custom animation for the typing indicator dots
      animation: {
        "bounce-dot": "bounce-dot 1.2s ease-in-out infinite",
      },
      keyframes: {
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%":           { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
