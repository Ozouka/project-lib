import Alpine from 'alpinejs';

interface MediaParams {
  query: string;
}

interface VisibleParams {
  element: Element;
}

// Define types for the imported modules
type IslandModule = () => Promise<unknown>;
type Islands = { [key: string]: IslandModule };

export const islandsComponents: Islands = import.meta.glob(
  '/src/lib/islands/*.ts'
);

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

export function revive(islands: Islands): void {
  // Process each added node
  async function processNode(node: Node): Promise<void> {
    if (node.nodeType !== 1) return; // Skip if not an element node

    const xData = (node as Element).getAttribute('x-data');

    // If it's inline Alpine code or an empty x-data
    const xInline =
      !xData &&
      ((node as Element).hasAttribute('x-data') ||
        (node as Element).hasAttribute('x-init'));
    if (!xData && !xInline) return;

    const modulePath = `/src/lib/islands/${xData}.ts`;

    if (!xInline && !islands[modulePath]) return;

    try {
      if ((node as Element).hasAttribute('client:visible')) {
        await visible({ element: node as Element });
      } else if ((node as Element).hasAttribute('client:media')) {
        await media({
          query: (node as Element).getAttribute('client:media') ?? ''
        });
      } else if ((node as Element).hasAttribute('client:high')) {
        // High priority task
      } else {
        // 'client:idle' by default
        await idle();
      }

      if (!xInline) {
        await islands[modulePath]();
      }

      Alpine.initTree(node as HTMLElement);
    } catch (error) {
      console.error(`Error processing ${xData}:`, error);
    }
  }

  // Set up a MutationObserver to watch for changes in the DOM
  const observer = new window.MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(processNode);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  document.body.querySelectorAll('*').forEach(processNode);
}
