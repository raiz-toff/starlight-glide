/**
 * Mobile Preset: Minimal
 * A thin progress bar across the top + section title. No dropdown.
 */
(function () {
  window.__glidePresets = window.__glidePresets || { desktop: {}, mobile: {} };

  window.__glidePresets.mobile.minimal = {
    init(config) {
      const mobileToc = document.querySelector('mobile-starlight-toc');
      if (!mobileToc || mobileToc.querySelector('.glide-minimal-bar')) return;

      const sidebar = document.querySelector('.right-sidebar nav');

      // Hide the default summary/dropdown entirely
      const summary = mobileToc.querySelector('summary');
      const details = mobileToc.querySelector('details');

      // Create minimal bar
      const bar = document.createElement('div');
      bar.className = 'glide-minimal-bar';

      const progressTrack = document.createElement('div');
      progressTrack.className = 'glide-minimal-progress-track';

      const progressFill = document.createElement('div');
      progressFill.className = 'glide-minimal-progress-fill';
      progressTrack.appendChild(progressFill);

      const sectionTitle = document.createElement('span');
      sectionTitle.className = 'glide-minimal-title';

      bar.append(progressTrack, sectionTitle);

      // Insert the minimal bar at the top of the mobile TOC
      if (mobileToc.firstChild) {
        mobileToc.insertBefore(bar, mobileToc.firstChild);
      } else {
        mobileToc.appendChild(bar);
      }

      // Hide the original summary/details
      if (summary) summary.style.display = 'none';

      // Scroll progress
      let currentActiveLink = null;
      let isAtBottom = false;

      const updateProgress = () => {
        const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const pct = Math.max(0, Math.min(1, scrollPct)) * 100;
        progressFill.style.width = `${pct}%`;

        // Bottom-of-page fallback for the active section title
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);
        const links = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];
        
        if (atBottom && !isAtBottom) {
          isAtBottom = true;
          const lastLink = links[links.length - 1];
          if (lastLink) sectionTitle.textContent = lastLink.textContent;
        } else if (!atBottom && isAtBottom) {
          isAtBottom = false;
          if (currentActiveLink) sectionTitle.textContent = currentActiveLink.textContent;
        }
      };

      // Section title tracking
      const observer = new IntersectionObserver((entries) => {
        const activeEntry = entries.find(e => e.isIntersecting);
        if (!activeEntry) return;
        const links = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];
        const activeLink = links.find(l => l.getAttribute('href')?.split('#')[1] === activeEntry.target.id);
        if (activeLink) {
          currentActiveLink = activeLink;
          if (!isAtBottom) {
            sectionTitle.textContent = activeLink.textContent;
          }
        }
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });

      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      headings.forEach(h => observer.observe(h));

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();

      // Adjust main-frame padding
      const mainFrame = document.querySelector('.main-frame');
      if (mainFrame) {
        mainFrame.style.paddingTop = `calc(var(--sl-nav-height) + 2rem)`;
      }
    }
  };
})();
