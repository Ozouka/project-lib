import Alpine from 'alpinejs';

console.log('Run module test.ts');

Alpine.data('test', () => ({
  open: false,

  init() {
    console.log('Init Alpine Component test.ts');
  }
}));
