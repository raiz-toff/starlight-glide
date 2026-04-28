/**
 * Desktop Preset: Snake
 * The signature SVG path "dancing snake" indicator.
 * Refactored from the original desktop.js.
 */
(function () {
  window.__glidePresets = window.__glidePresets || { desktop: {}, mobile: {} };

  window.__glidePresets.desktop.snake = {
    init(config) {
      const sidebar = document.querySelector('starlight-toc nav ul') || document.querySelector('.right-sidebar nav ul');
      if (!sidebar || sidebar.querySelector('.toc-svg-track') || sidebar.closest('mobile-starlight-toc')) return;

      // Mark sidebar for CSS scoping
      const sidebarContainer = sidebar.closest('.right-sidebar');
      if (sidebarContainer) sidebarContainer.setAttribute('data-glide-toc', '');

      // Add top padding for the header
      const nav = sidebar.closest('nav');
      if (nav) nav.style.paddingTop = '4rem';

      // Inject header
      const existingHeader = sidebar.parentElement.querySelector('.desktop-toc-header');
      if (!existingHeader) {
        const header = document.createElement('h2');
        header.className = 'desktop-toc-header';
        header.textContent = config.headerText;
        sidebar.parentElement.insertBefore(header, sidebar);
      }

      const tocLinks = Array.from(sidebar.querySelectorAll('a[href^="#"]'));
      if (!tocLinks.length) return;

      // Inject the SVG track and the "snake" path
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('toc-svg-track');
      svg.setAttribute('aria-hidden', 'true');

      const trackPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      trackPath.classList.add('toc-path-track');

      const snakePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      snakePath.classList.add('toc-path-snake');

      svg.append(trackPath, snakePath);
      sidebar.insertBefore(svg, sidebar.firstChild);

      // X-coordinates for different heading depths
      const X_BY_DEPTH = config.depthOffsets;

      // Cache depths
      const depthCache = new Map();
      function getLinkDepth(link) {
        if (depthCache.has(link)) return depthCache.get(link);
        let depth = 0, el = link.parentElement;
        while (el && el !== sidebar) {
          if (el.tagName === 'UL') depth++;
          el = el.parentElement;
        }
        const d = Math.min(depth, X_BY_DEPTH.length - 1);
        depthCache.set(link, d);
        return d;
      }

      // Coordinate calculation
      function buildPoints() {
        const ulRect = sidebar.getBoundingClientRect();
        const rects = tocLinks.map(link => link.getBoundingClientRect());

        return tocLinks.map((link, i) => {
          const r = rects[i];
          if (!r.height || r.width === 0) {
            return { x: X_BY_DEPTH[getLinkDepth(link)], y: 0, h: 0, hidden: true };
          }
          return {
            x: X_BY_DEPTH[getLinkDepth(link)],
            y: r.top - ulRect.top + r.height / 2 + sidebar.scrollTop,
            h: r.height,
          };
        });
      }

      function pointsToPath(pts) {
        const validPts = pts.filter(p => !p.hidden);
        if (!validPts.length) return '';
        let d = `M ${validPts[0].x} ${validPts[0].y}`;
        const CURVE_SIZE = 12;
        for (let i = 1; i < validPts.length; i++) {
          const p0 = validPts[i - 1], p1 = validPts[i];
          if (p0.x === p1.x) {
            d += ` L ${p1.x} ${p1.y}`;
          } else {
            const midY = (p0.y + p1.y) / 2;
            d += ` L ${p0.x} ${midY - CURVE_SIZE / 2}`;
            d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${midY + CURVE_SIZE / 2}`;
            d += ` L ${p1.x} ${p1.y}`;
          }
        }
        return d;
      }

      function getPathLengthAtPoint(pathEl, tx, ty) {
        const total = pathEl.getTotalLength();
        let lo = 0, hi = total;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          const ptLo = pathEl.getPointAtLength(lo + (mid - lo) / 2);
          const ptHi = pathEl.getPointAtLength(mid + (hi - mid) / 2);
          if (Math.hypot(ptLo.x - tx, ptLo.y - ty) < Math.hypot(ptHi.x - tx, ptHi.y - ty)) hi = mid;
          else lo = mid;
        }
        return (lo + hi) / 2;
      }

      let points = [];
      let activeIndex = 0;
      const physics = config.physicsModule;

      function redraw() {
        points = buildPoints();
        const d = pointsToPath(points);
        if (!d) return;
        trackPath.setAttribute('d', d);
        snakePath.setAttribute('d', d);
        repositionSnake(activeIndex, false);
      }

      function repositionSnake(index, animate = true) {
        if (!points.length || !points[index] || points[index].hidden) return;
        const pt = points[index];
        const total = trackPath.getTotalLength();
        const centerLen = getPathLengthAtPoint(trackPath, pt.x, pt.y);
        const halfH = pt.h / 2;
        const startLen = Math.max(0, centerLen - halfH);
        const endLen = Math.min(total, centerLen + halfH);
        const segLen = endLen - startLen;

        snakePath.style.transition = animate ? physics.transition : 'none';
        snakePath.setAttribute('stroke-dasharray', `${segLen} ${total}`);
        snakePath.setAttribute('stroke-dashoffset', `${-startLen}`);
        snakePath.style.opacity = '1';
      }

      // Use shared observer
      window.__glideObserver.observe(tocLinks, (activeLink, index) => {
        activeIndex = index;
        repositionSnake(activeIndex, true);
      });

      requestAnimationFrame(redraw);
      window.addEventListener('resize', redraw);
    }
  };
})();
