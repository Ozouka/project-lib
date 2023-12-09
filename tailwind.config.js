const plugin = require('tailwindcss/plugin');

/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const sizes = {};

for (let i = 0; i < 500; i++) {
  sizes[i] = `${i / 4}rem`;
  sizes[`${i}.5`] = `${(i + 0.5) / 4}rem`;
}

module.exports = {
  prefix: 'tw-',
  mode: 'jit',
  corePlugins: {
    preflight: false
  },
  content: ['./src/**/*.{ts,js}', './**/*.liquid', './assets/**/*.js'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out'
      },
      spacing: {
        ...sizes
      },
      width: {
        ...sizes
      },
      height: {
        ...sizes
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        'to-lg': { max: '64em' },
        '2xl': '96em',
        'sm-max': { max: '48em' },
        'sm-only': { min: '32em', max: '48em' },
        'md-only': { min: '48em', max: '64em' },
        'lg-only': { min: '64em', max: '80em' },
        'xl-only': { min: '80em', max: '96em' },
        '2xl-only': { min: '96em' }
      }
      // fontFamily: {
      //   sans: ['Britanica', 'sans-serif'],
      //   britanica: ['Britanica', 'sans-serif']
      // },
    }
  },
  plugins: []
};
