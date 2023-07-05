/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/app/**/*.{js,ts,jsx,tsx,mdx}", // Note the addition of the `app` directory.
    "./renderer/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
