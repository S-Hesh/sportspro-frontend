// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'),    // Use the correct Tailwind plugin
    require('autoprefixer'),   // Autoprefixer for cross-browser support
  ],
};
