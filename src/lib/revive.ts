// Define interfaces for function parameters
interface MediaParams {
  query: string;
}

interface VisibleParams {
  element: Element;
}

export const islandsComponents = import.meta.glob('@/islands/*.js');

function media({ query }: MediaParams): Promise<boolean> {
  const mediaQuery = window.matchMedia(query);
  return new Promise(resolve => {
    if (mediaQuery.matches) {
      resolve(true);
    } else {
      mediaQuery.addEventListener('change', () => resolve(true), {
        once: true
      });
    }
  });
}

function visible({ element }: VisibleParams): Promise<boolean> {
  return new Promise(resolve => {
    const observer = new window.IntersectionObserver(entries => {
      entries.some(entry => {
        if (entry.isIntersecting) {
          observer.disconnect();
          resolve(true);
          return true;
        }
        return false;
      });
    });

    observer.observe(element);
  });
}

function idle(): Promise<void> {
  return new Promise(resolve => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve());
    } else {
      setTimeout(() => resolve(), 200);
    }
  });
}

// Define types for the imported modules
type IslandModule = () => void;
type Islands = { [key: string]: IslandModule };

export function revive(islands: Islands): void {
  async function dfs(node: Element): Promise<void> {
    const tagName = node.tagName.toLowerCase();
    const potentialJsPath = `/frontend/islands/${tagName}.js`;
    const isPotentialCustomElementName = /-/.test(tagName);

    if (isPotentialCustomElementName && islands[potentialJsPath]) {
      if (node.hasAttribute('client:visible')) {
        await visible({ element: node });
      }

      const clientMedia = node.getAttribute('client:media');
      if (clientMedia) {
        await media({ query: clientMedia });
      }

      if (node.hasAttribute('client:idle')) {
        await idle();
      }

      islands[potentialJsPath]();
    }

    let child = node.firstElementChild;

    while (child) {
      dfs(child);
      child = child.nextElementSibling;
    }
  }

  const observer = new window.MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i += 1) {
      const { addedNodes } = mutations[i];
      for (let j = 0; j < addedNodes.length; j += 1) {
        const node = addedNodes[j];
        if (node.nodeType === 1 && node instanceof Element) {
          dfs(node);
        }
      }
    }
  });

  dfs(document.body);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
