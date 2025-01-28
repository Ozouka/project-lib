// eslint-disable-next-line import/no-unresolved
import 'vite/modulepreload-polyfill'; // https://vitejs.dev/config/build-options#build-modulepreload

import Alpine from 'alpinejs';
import { islandsComponents, revive } from '@/lib/revive';
import { Carousel } from '../../frontend/lib/components/Carousel';

window.Alpine = Alpine;

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Set boilerplate
   */
  revive(islandsComponents);

  console.log('DOMContentLoaded main ts is good now');
  customElements.define('carousel-component', Carousel);

  console.log('Carousel component defined');
  
  Alpine.start();
});

document.addEventListener('alpine:init', () => {});
