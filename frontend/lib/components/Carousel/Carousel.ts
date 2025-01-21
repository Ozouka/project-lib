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
  mobileAlign?: EmblaOptionsType['align'];
  mobileLoop?: string;
  active?: string;
  align?: EmblaOptionsType['align'];
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

    const options: EmblaOptionsType = {
      inViewThreshold: 0.9,
      breakpoints: {
        '(max-width: calc(64em - 1px))': {
          active: dataSet.mobileActive !== 'false',
          align: dataSet.mobileAlign || 'center',
          loop: dataSet.mobileLoop === 'true'
        },
        '(min-width: 64em)': {
          active: dataSet.active !== 'false',
          align: dataSet.align || 'start',
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

    if (dataSet.autoplay === 'true') {
      this.emblaApi = EmblaCarousel(emblaNode, options, [
        Autoplay({
          playOnInit: true,
          stopOnMouseEnter: true,
          stopOnInteraction: false,
          delay: Number(dataSet.autoplayDelay || 4000)
        }),
        ClassNames()
      ]);
    } else {
      this.emblaApi = EmblaCarousel(emblaNode, options);
    }

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

    if (dataSet.activateDots) {
      this.renderDots(this.dataset.activateNumbersInDots === 'true');
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

    if (this.cleanupPrevNextBtns) {
      this.cleanupPrevNextBtns();
    }

    if (this.removeDotBtnsAndClickHandlers) {
      this.removeDotBtnsAndClickHandlers();
    }
  }
}
