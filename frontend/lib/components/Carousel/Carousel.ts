import EmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType
} from 'embla-carousel';
import ClassNames from 'embla-carousel-class-names';
import Autoplay from 'embla-carousel-autoplay';

import {
  addDotBtnsAndClickHandlers,
  addPrevNextBtnsClickHandlers
} from '../../utils/emblaCarousel';

type CarouselOptions = {
  mobileActive?: string;
  mobileAlign?: string;
  mobileLoop?: string;
  active?: string;
  align?: string;
  loop?: string;
  activateArrows?: string;
  activateDots?: string;
  activateNumbersInDots?: string;
  autoplay?: string;
  autoplayDelay?: string;
  dotBtnClass?: string;
};

const SELECTORS = {
  carousel: '.carousel',
  btnPrev: '.carousel_prev',
  btnNext: '.carousel_next',
  dots: '.dots',
  overlayPrev: '.carousel_overlay_prev',
  overlayNext: '.carousel_overlay_next'
};

export class Carousel extends HTMLElement {
  emblaApi: EmblaCarouselType | undefined;
  cleanupPrevNextBtns: (() => void) | undefined;
  removeDotBtnsAndClickHandlers: (() => void) | undefined;

  connectedCallback() {
    
    const dataSet = this.dataset as CarouselOptions;

    const getAlignment = (align: string | undefined): EmblaOptionsType['align'] => {
      switch (align) {
        case 'justify-start':
          return 'start';
        case 'justify-center':
          return 'center';
        case 'justify-end':
          return 'end';
        default:
          return 'start';
      }
    };

    const options: EmblaOptionsType = {
      inViewThreshold: 0.9,
      dragFree: true,
      containScroll: 'trimSnaps',
      breakpoints: {
        '(max-width: calc(64em - 1px))': {
          active: dataSet.mobileActive !== 'false',
          align: getAlignment(dataSet.mobileAlign),
          loop: dataSet.mobileLoop === 'true'
        },
        '(min-width: 64em)': {
          active: dataSet.active !== 'false',
          align: getAlignment(dataSet.align),
          loop: dataSet.loop === 'true'
        }
      }
    };

    const emblaNode = this.querySelector<HTMLElement>(SELECTORS.carousel);
    if (!emblaNode) return;

    const overlayPrevNode = this.querySelector<HTMLElement>(
      SELECTORS.overlayPrev
    );
    const overlayNextNode = this.querySelector<HTMLElement>(
      SELECTORS.overlayNext
    );

    const plugins = [ClassNames()];

    if (dataSet.autoplay === 'true') {
      plugins.push(
        Autoplay({
          playOnInit: true,
          stopOnMouseEnter: true,
          stopOnInteraction: false,
          delay: Number(dataSet.autoplayDelay || 4000)
        })
      );
    }

    this.emblaApi = EmblaCarousel(emblaNode, options, plugins);

    if (this.emblaApi && dataSet.activateArrows === 'true') {
      const prevBtnNode = this.querySelector<HTMLElement>(SELECTORS.btnPrev);
      const nextBtnNode = this.querySelector<HTMLElement>(SELECTORS.btnNext);

      if (!prevBtnNode || !nextBtnNode) return;

      this.cleanupPrevNextBtns = addPrevNextBtnsClickHandlers(
        this.emblaApi,
        prevBtnNode,
        nextBtnNode,
        overlayPrevNode,
        overlayNextNode
      );
    }

    if (dataSet.activateDots === 'true') {
      this.renderDots(dataSet.activateNumbersInDots === 'true');
    }
  }

  private renderDots = (setNumbers?: boolean) => {
    const dotsWrapper = this.querySelector<HTMLElement>(SELECTORS.dots);
    if (!dotsWrapper || !this.emblaApi) return;

    this.removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers({
      emblaApi: this.emblaApi,
      dotsNode: dotsWrapper,
      setNumbers,
      btnClass: setNumbers
        ? 'text-comments font-medium uppercase [&.selected]:text-black text-black/20'
        : 'size-1 rounded-full [&.selected]:bg-black bg-black/30'
    });
  };

  disconnectedCallback() {
    this.emblaApi?.destroy();
    this.cleanupPrevNextBtns?.();
    this.removeDotBtnsAndClickHandlers?.();
  }
}