/**
 * Spring physics — overshoots then settles for a bouncy, dynamic feel.
 * Uses CSS spring-inspired cubic-bezier with longer duration.
 */
(function () {
  window.__glidePhysics = window.__glidePhysics || {};
  window.__glidePhysics.spring = {
    name: 'spring',
    // Overshoot curve: fast start, overshoot, settle back
    transition: 'stroke-dashoffset 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), stroke-dasharray 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cssTransition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };
})();
