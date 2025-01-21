import { EmblaCarouselType } from 'embla-carousel';

const addTogglePrevNextBtnsActive = (
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement,
  elementPrev?: HTMLElement | null,
  elementNext?: HTMLElement | null
): (() => void) => {
  const togglePrevNextBtnsState = (): void => {
    if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled');
    else prevBtn.setAttribute('disabled', 'disabled');

    elementPrev?.classList.toggle('disabled', !emblaApi.canScrollPrev());

    if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled');
    else nextBtn.setAttribute('disabled', 'disabled');
    elementNext?.classList.toggle('disabled', !emblaApi.canScrollNext());
  };

  emblaApi
    .on('select', togglePrevNextBtnsState)
    .on('init', togglePrevNextBtnsState)
    .on('reInit', togglePrevNextBtnsState);

  return (): void => {
    prevBtn.removeAttribute('disabled');
    nextBtn.removeAttribute('disabled');
  };
};

export const addPrevNextBtnsClickHandlers = (
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement,
  elementPrev?: HTMLElement | null,
  elementNext?: HTMLElement | null
): (() => void) => {
  const scrollPrev = (): void => {
    emblaApi.scrollPrev();
  };
  const scrollNext = (): void => {
    emblaApi.scrollNext();
  };
  prevBtn.addEventListener('click', scrollPrev, false);
  nextBtn.addEventListener('click', scrollNext, false);

  const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
    emblaApi,
    prevBtn,
    nextBtn,
    elementPrev,
    elementNext
  );

  return (): void => {
    removeTogglePrevNextBtnsActive();
    prevBtn.removeEventListener('click', scrollPrev, false);
    nextBtn.removeEventListener('click', scrollNext, false);
  };
};

export const addDotBtnsAndClickHandlers = ({
  emblaApi,
  dotsNode,
  btnClass,
  setNumbers
}: {
  emblaApi: EmblaCarouselType;
  dotsNode: HTMLElement;
  btnClass?: string;
  setNumbers?: boolean;
}): (() => void) => {
  let dotNodes: HTMLElement[] = [];

  const addDotBtnsWithClickHandlers = (): void => {
    dotsNode.innerHTML = emblaApi
      .scrollSnapList()
      .map(
        (_, index) => `<button class="${btnClass}" type="button">
      ${setNumbers ? `${index + 1}`.padStart(2, '0') : ''}</button>`
      )
      .join('');

    const scrollTo = (index: number): void => {
      emblaApi.scrollTo(index);
    };

    dotNodes = Array.from(dotsNode.querySelectorAll('button'));
    dotNodes.forEach((dotNode, index) => {
      dotNode.addEventListener('click', () => scrollTo(index), false);
    });
  };

  const toggleDotBtnsActive = (): void => {
    const previous = emblaApi.previousScrollSnap();
    const selected = emblaApi.selectedScrollSnap();
    dotNodes[previous]?.classList.remove('selected');
    dotNodes[selected]?.classList.add('selected');
  };

  emblaApi
    .on('init', addDotBtnsWithClickHandlers)
    .on('reInit', addDotBtnsWithClickHandlers)
    .on('init', toggleDotBtnsActive)
    .on('reInit', toggleDotBtnsActive)
    .on('select', toggleDotBtnsActive);

  return (): void => {
    dotsNode.innerHTML = '';
  };
};
