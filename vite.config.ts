import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import shopify from 'vite-plugin-shopify';
import postcss from './postcss.config';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss
  },
  server: {
    hmr: true
  },
  plugins: [
    checker({
      typescript: true
    }),
    shopify({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: './',
      // Front-end source code directory
      sourceCodeDir: 'src',
      // Front-end entry points directory
      entrypointsDir: 'src/entrypoints',
      // Additional files to use as entry points (accepts an array of file paths or glob patterns)
      additionalEntrypoints: [],
      // Specifies the file name of the snippet that loads your assets
      snippetFile: 'vite-tag.liquid'
    })
  ],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]'
      }
    },
    emptyOutDir: true,
    outDir: './assets',
    assetsDir: './'
  }
});
