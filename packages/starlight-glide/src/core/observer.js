/**
 * Shared heading observer utility for all presets.
 * Registers on window.__glideObserver for use by preset init functions.
 */
(function () {
  window.__glideObserver = {
    /**
     * Build a map from heading IDs to { link, index } for a given set of TOC links.
     * @param {HTMLAnchorElement[]} tocLinks
     * @returns {Map<string, { link: HTMLAnchorElement, index: number }>}
     */
    buildLinkMap(tocLinks) {
      const linkMap = new Map();
      tocLinks.forEach((link, i) => {
        const id = link.getAttribute('href')?.slice(1);
        if (id) linkMap.set(decodeURIComponent(id), { link, index: i });
      });
      return linkMap;
    },

    /**
     * Observe headings and call back when the active one changes.
     * @param {HTMLAnchorElement[]} tocLinks - TOC anchor elements
     * @param {(activeLink: HTMLAnchorElement, activeIndex: number) => void} onActiveChange
     * @param {{ rootMargin?: string, threshold?: number }} [options]
     * @returns {{ destroy: () => void }} cleanup handle
     */
    observe(tocLinks, onActiveChange, options = {}) {
      const linkMap = this.buildLinkMap(tocLinks);
      const headings = Array.from(linkMap.keys())
        .map(id => document.getElementById(id))
        .filter(Boolean);

      const rootMargin = options.rootMargin || '-100px 0px -66% 0px';
      const threshold = options.threshold || 0;

      let currentActiveLink = null;
      let currentActiveIndex = 0;
      let isAtBottom = false;

      const observer = new IntersectionObserver(entries => {
        const intersecting = entries.filter(e => e.isIntersecting);
        if (intersecting.length > 0) {
          const best = intersecting.reduce((prev, curr) =>
            Math.abs(curr.boundingClientRect.top - 100) < Math.abs(prev.boundingClientRect.top - 100) ? curr : prev
          );

          const entry = linkMap.get(best.target.id);
          if (entry) {
            currentActiveLink = entry.link;
            currentActiveIndex = entry.index;
            if (!isAtBottom) {
              tocLinks.forEach(a => a.classList.toggle('toc-active', a === entry.link));
              onActiveChange(entry.link, entry.index);
            }
          }
        }
      }, { rootMargin, threshold });

      headings.forEach(h => observer.observe(h));

      // Handle the edge case where the page ends early (content is too short)
      // and the final headings can't physically scroll to the top threshold.
      const onScroll = () => {
        // Check if we hit the absolute bottom of the scrollable page area
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);
        
        if (atBottom && !isAtBottom) {
          isAtBottom = true;
          const lastIndex = tocLinks.length - 1;
          const lastLink = tocLinks[lastIndex];
          if (lastLink) {
            tocLinks.forEach(a => a.classList.toggle('toc-active', a === lastLink));
            onActiveChange(lastLink, lastIndex);
          }
        } else if (!atBottom && isAtBottom) {
          isAtBottom = false;
          if (currentActiveLink) {
            tocLinks.forEach(a => a.classList.toggle('toc-active', a === currentActiveLink));
            onActiveChange(currentActiveLink, currentActiveIndex);
          }
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      // Call it once initially in case the page is already fully visible
      requestAnimationFrame(onScroll);

      return {
        destroy() {
          observer.disconnect();
          window.removeEventListener('scroll', onScroll);
        }
      };
    }
  };
})();
