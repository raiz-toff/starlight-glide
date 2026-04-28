/**
 * Snap physics — instant position change with a subtle opacity fade.
 * For users who prefer crisp, immediate transitions.
 */
(function () {
  window.__glidePhysics = window.__glidePhysics || {};
  window.__glidePhysics.snap = {
    name: 'snap',
    transition: 'stroke-dashoffset 0.08s linear, stroke-dasharray 0.08s linear',
    cssTransition: 'all 0.1s linear',
  };
})();
