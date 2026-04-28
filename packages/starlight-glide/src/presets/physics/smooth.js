/**
 * Smooth physics — the default easing.
 * Uses CSS cubic-bezier transitions for a clean, professional feel.
 */
(function () {
  window.__glidePhysics = window.__glidePhysics || {};
  window.__glidePhysics.smooth = {
    name: 'smooth',
    transition: 'stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke-dasharray 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cssTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };
})();
