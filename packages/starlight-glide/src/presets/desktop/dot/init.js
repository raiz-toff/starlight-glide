/**
 * Desktop Preset: Dot
 * A glowing dot that slides along a vertical track line.
 */
(function () {
  window.__glidePresets = window.__glidePresets || { desktop: {}, mobile: {} };

  window.__glidePresets.desktop.dot = {
    init(config) {
      const sidebar = document.querySelector('starlight-toc nav ul') || document.querySelector('.right-sidebar nav ul');
      if (!sidebar || sidebar.querySelector('.glide-dot-track') || sidebar.closest('mobile-starlight-toc')) return;

      // Mark sidebar for CSS scoping
      const sidebarContainer = sidebar.closest('.right-sidebar');
      if (sidebarContainer) sidebarContainer.setAttribute('data-glide-toc', '');

      // Add top padding
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

      // Create the vertical track line
      const track = document.createElement('div');
      track.className = 'glide-dot-track';
      track.setAttribute('aria-hidden', 'true');

      // Create the dot indicator
      const dot = document.createElement('div');
      dot.className = 'glide-dot-indicator';
      track.appendChild(dot);

      sidebar.style.position = 'relative';
      sidebar.insertBefore(track, sidebar.firstChild);

      const physics = config.physicsModule;

      function positionDot(link) {
        const sidebarRect = sidebar.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        const y = linkRect.top - sidebarRect.top + linkRect.height / 2 + sidebar.scrollTop;
        dot.style.transition = physics.cssTransition;
        dot.style.transform = `translateY(${y}px)`;
        dot.classList.add('active');
      }

      // Use shared observer
      window.__glideObserver.observe(tocLinks, (activeLink) => {
        positionDot(activeLink);
      });

      // Initial position
      requestAnimationFrame(() => {
        if (tocLinks[0]) positionDot(tocLinks[0]);
      });

      window.addEventListener('resize', () => {
        const active = sidebar.querySelector('a.toc-active') || tocLinks[0];
        if (active) positionDot(active);
      });
    }
  };
})();
