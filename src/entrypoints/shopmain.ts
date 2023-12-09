// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill'; // https://vitejs.dev/config/build-options#build-modulepreload

import Alpine from 'alpinejs';
import { islandsComponents, revive } from '@/lib/revive';

window.Alpine = Alpine;

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Set boilerplate
   */
  revive(islandsComponents);
});

document.addEventListener('alpine:init', () => {});

// Alpine.start();
