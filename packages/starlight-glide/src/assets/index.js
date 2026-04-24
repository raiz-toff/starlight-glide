function setup() {
  if (window.innerWidth > 1152) {
    if (typeof window.initDesktop === 'function') window.initDesktop();
  } else {
    if (typeof window.initMobile === 'function') window.initMobile();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if ((lastWidth > 1152 && window.innerWidth <= 1152) || 
      (lastWidth <= 1152 && window.innerWidth > 1152)) {
    location.reload(); 
  }
  lastWidth = window.innerWidth;
}, { passive: true });
