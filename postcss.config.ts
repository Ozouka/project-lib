import postcssImport from 'postcss-import';
import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './tailwind.config';

const config = {
  plugins: [
    postcssImport(),
    tailwindcssNesting,
    tailwindcss(tailwindConfig),
    autoprefixer
  ]
};

export default config;
