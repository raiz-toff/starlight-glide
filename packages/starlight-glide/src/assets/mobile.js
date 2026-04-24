window.initMobile = function initMobile() {
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
      <circle class="progress-ring" cx="10" cy="10" r="8.5" stroke="var(--sl-color-accent)" stroke-width="2" fill="none" stroke-dasharray="53.4" stroke-dashoffset="53.4" stroke-linecap="round"></circle>
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
  const updateMobileProgress = () => {
    const ring = mobileSummary.querySelector('.progress-ring');
    if (!ring) return;
    const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const offset = 53.4 - (Math.max(0, Math.min(1, scrollPct)) * 53.4);
    ring.style.strokeDashoffset = offset;
  };

  const observer = new IntersectionObserver((entries) => {
    const activeEntry = entries.find(e => e.isIntersecting);
    if (!activeEntry) return;
    const links = sidebar ? Array.from(sidebar.querySelectorAll('a')) : [];
    const activeLink = links.find(l => l.getAttribute('href')?.split('#')[1] === activeEntry.target.id);
    if (activeLink) titleSpan.textContent = activeLink.textContent;
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
  headings.forEach(h => observer.observe(h));

  window.addEventListener('scroll', updateMobileProgress, { passive: true });
  updateMobileProgress();
}
