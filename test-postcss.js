const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

const css = '@tailwind base; @tailwind components; @tailwind utilities;';
postcss([tailwindcss()])
  .process(css, { from: undefined })
  .then(result => console.log('Success:', result.css.substring(0, 200)))
  .catch(err => console.error('Error:', err.message));