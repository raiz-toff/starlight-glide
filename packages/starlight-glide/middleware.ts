/**
 * Route middleware for per-page Glide configuration.
 * Reads the `glide` frontmatter field and injects it as a data attribute
 * so client-side JS can read per-page overrides.
 */

// @ts-ignore — Starlight route data API
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context: any) => {
  const routeData = context.locals.starlightRoute;
  if (!routeData?.entry?.data) return;

  const glideConfig = routeData.entry.data.glide;
  if (glideConfig && typeof glideConfig === 'object') {
    // Inject per-page config as a script that sets a data attribute
    routeData.head = routeData.head || [];
    routeData.head.push({
      tag: 'script',
      content: `document.documentElement.setAttribute('data-glide-page', ${JSON.stringify(JSON.stringify(glideConfig))});`,
    });
  }
});
