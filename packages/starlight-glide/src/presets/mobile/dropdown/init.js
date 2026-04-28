/**
 * Mobile Preset: Dropdown
 * Progress circle + section title bar + dropdown TOC menu.
 * Refactored from the original mobile.js.
 */
(function () {
  window.__glidePresets = window.__glidePresets || { desktop: {}, mobile: {} };

  window.__glidePresets.mobile.dropdown = {
    init(config) {
      const mobileSummary = document.querySelector('mobile-starlight-toc summary');
      const sidebar = document.querySelector('.right-sidebar nav');
      if (!mobileSummary || mobileSummary.querySelector('.toc-progress-circle')) return;

      // 1. Clean and Inject Summary UI
      const caret = mobileSummary.querySelector('.caret');
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '0.5rem';
      container.style.width = '100%';

      const circleContainer = document.createElement('div');
      circleContainer.classList.add('toc-progress-circle');
      circleContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8.5" stroke="var(--sl-color-gray-5)" stroke-width="2" fill="none" opacity="0.3"></circle>
          <circle class="progress-ring" cx="10" cy="10" r="8.5" stroke="var(--glide-indicator-color, var(--sl-color-accent))" stroke-width="2" fill="none" stroke-dasharray="53.4" stroke-dashoffset="53.4" stroke-linecap="round"></circle>
        </svg>
      `;

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('displaytext');

      container.append(circleContainer, titleSpan);
      if (caret) {
        caret.style.marginInlineStart = 'auto';
        container.append(caret);
      }

      mobileSummary.innerHTML = '';
      mobileSummary.appendChild(container);
      mobileSummary.classList.add('glide-ready');

      // 2. Scroll Logic
      let currentActiveLink = null;
      let isAtBottom = false;

      const updateMobileProgress = () => {
        const ring = mobileSummary.querySelector('.progress-ring');
        if (ring) {
          const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
          const offset = 53.4 - (Math.max(0, Math.min(1, scrollPct)) * 53.4);
          ring.style.strokeDashoffset = offset;
        }

        // Bottom-of-page fallback for the active section title
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);
        const links = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];
        
        if (atBottom && !isAtBottom) {
          isAtBottom = true;
          const lastLink = links[links.length - 1];
          if (lastLink) titleSpan.textContent = lastLink.textContent;
        } else if (!atBottom && isAtBottom) {
          isAtBottom = false;
          if (currentActiveLink) titleSpan.textContent = currentActiveLink.textContent;
        }
      };

      const observer = new IntersectionObserver((entries) => {
        const activeEntry = entries.find(e => e.isIntersecting);
        if (!activeEntry) return;
        const links = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];
        const activeLink = links.find(l => l.getAttribute('href')?.split('#')[1] === activeEntry.target.id);
        if (activeLink) {
          currentActiveLink = activeLink;
          if (!isAtBottom) {
            titleSpan.textContent = activeLink.textContent;
          }
        }
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });

      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      headings.forEach(h => observer.observe(h));

      window.addEventListener('scroll', updateMobileProgress, { passive: true });
      updateMobileProgress();

      // Dynamically adjust main-frame padding
      const mainFrame = document.querySelector('.main-frame');
      if (mainFrame) {
        mainFrame.style.paddingTop = `calc(var(--sl-nav-height) + 3rem)`;
      }
    }
  };
})();
