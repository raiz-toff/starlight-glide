/**
 * Core router — reads config, detects viewport, and initializes the correct preset.
 * Replaces the old assets/index.js.
 */
(function () {
  function getConfig() {
    // Global config from plugin
    const globalConfig = window.starlightGlideOptions || {};

    // Per-page override from frontmatter (injected by route middleware)
    let pageConfig = {};
    const pageAttr = document.documentElement.getAttribute('data-glide-page');
    if (pageAttr) {
      try { pageConfig = JSON.parse(pageAttr); } catch (e) { /* ignore */ }
    }

    // Merge: per-page overrides global
    return {
      desktop: pageConfig.desktop || globalConfig.desktop || 'snake',
      mobile: pageConfig.mobile || globalConfig.mobile || 'dropdown',
      physics: pageConfig.physics || globalConfig.physics || 'smooth',
      headerText: pageConfig.headerText || globalConfig.headerText || 'On this page',
      depthOffsets: globalConfig.depthOffsets || [8, 24, 40],
      indicatorColor: pageConfig.indicatorColor || globalConfig.indicatorColor,
      trackColor: pageConfig.trackColor || globalConfig.trackColor,
    };
  }

  function setup() {
    const config = getConfig();

    // Resolve physics module
    const physicsRegistry = window.__glidePhysics || {};
    config.physicsModule = physicsRegistry[config.physics] || physicsRegistry.smooth || {
      transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1), stroke-dasharray 0.3s cubic-bezier(0.4,0,0.2,1)'
    };

    const presets = window.__glidePresets || { desktop: {}, mobile: {} };

    if (window.innerWidth > 1152) {
      // Desktop
      const preset = presets.desktop[config.desktop];
      if (preset && typeof preset.init === 'function') {
        preset.init(config);
      }
    } else {
      // Mobile
      const preset = presets.mobile[config.mobile];
      if (preset && typeof preset.init === 'function') {
        preset.init(config);
      }
    }


  }

  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  // Re-run on Astro page transitions
  document.addEventListener('astro:page-load', setup);

  // Reload on breakpoint crossing (desktop ↔ mobile)
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if ((lastWidth > 1152 && window.innerWidth <= 1152) ||
        (lastWidth <= 1152 && window.innerWidth > 1152)) {
      location.reload();
    }
    lastWidth = window.innerWidth;
  }, { passive: true });
})();
