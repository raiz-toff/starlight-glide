import type { StarlightPlugin } from '@astrojs/starlight/types'
import { fileURLToPath } from 'node:url'

export type DesktopPreset = 'snake' | 'dot';
export type MobilePreset = 'dropdown' | 'minimal';
export type PhysicsPreset = 'smooth' | 'spring' | 'snap';

export interface StarlightGlideOptions {
  /**
   * Desktop TOC indicator preset.
   * - `'snake'` — SVG path "dancing snake" indicator (default)
   * - `'dot'` — Glowing dot that slides along a vertical track
   * @default 'snake'
   */
  desktop?: DesktopPreset;
  /**
   * Mobile TOC view preset.
   * - `'dropdown'` — Progress circle + collapsible dropdown menu (default)
   * - `'minimal'` — Thin progress bar + section title, no dropdown
   * @default 'dropdown'
   */
  mobile?: MobilePreset;
  /**
   * Animation physics preset.
   * - `'smooth'` — Clean cubic-bezier easing (default)
   * - `'spring'` — Bouncy overshoot then settle
   * - `'snap'` — Instant, crisp transitions
   * @default 'smooth'
   */
  physics?: PhysicsPreset;
  /**
   * Enable a glassmorphic aesthetic for the TOC and dropdown menus.
   * @default false
   */
  glassmorphism?: boolean;
  /**
   * The text to display as the TOC header on desktop.
   * @default 'On this page'
   */
  headerText?: string;
  /**
   * The color of the active indicator.
   * @default 'var(--sl-color-accent)' (inherited from theme)
   */
  indicatorColor?: string;
  /**
   * The color of the background track.
   * @default 'var(--sl-color-gray-5)' (inherited from theme)
   */
  trackColor?: string;
  /**
   * Horizontal offsets for different heading depths (H2, H3, H4).
   * Only applies to the 'snake' desktop preset.
   * @default [8, 24, 40]
   */
  depthOffsets?: [number, number, number];
}

export default function starlightGlide(options?: StarlightGlideOptions): StarlightPlugin {
  const desktopPreset = options?.desktop ?? 'snake';
  const mobilePreset = options?.mobile ?? 'dropdown';
  const physicsPreset = options?.physics ?? 'smooth';
  const isGlassmorphic = options?.glassmorphism ?? false;

  return {
    name: 'starlight-glide',
    hooks: {
      'config:setup'({ config, updateConfig, addIntegration, addRouteMiddleware }) {
        // --- Resolve file paths for selected presets ---
        const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

        // Core files
        const baseCssPath = resolve('./src/core/base.css');
        const coreJsPath = resolve('./src/core/index.js');
        const observerJsPath = resolve('./src/core/observer.js');

        // Selected desktop preset
        const desktopJsPath = resolve(`./src/presets/desktop/${desktopPreset}/init.js`);
        const desktopCssPath = resolve(`./src/presets/desktop/${desktopPreset}/styles.css`);

        // Selected mobile preset
        const mobileJsPath = resolve(`./src/presets/mobile/${mobilePreset}/init.js`);
        const mobileCssPath = resolve(`./src/presets/mobile/${mobilePreset}/styles.css`);

        // Selected physics
        const physicsJsPath = resolve(`./src/presets/physics/${physicsPreset}.js`);

        // --- Build runtime config ---
        const configScript = `window.starlightGlideOptions = ${JSON.stringify({
          desktop: desktopPreset,
          mobile: mobilePreset,
          physics: physicsPreset,
          headerText: options?.headerText ?? 'On this page',
          depthOffsets: options?.depthOffsets ?? [8, 24, 40],
          indicatorColor: options?.indicatorColor,
          trackColor: options?.trackColor,
        })};`;

        const styleTag = `
          .right-sidebar[data-glide-toc],
          mobile-starlight-toc {
            ${options?.indicatorColor ? `--glide-indicator-color: ${options.indicatorColor};` : ''}
            ${options?.trackColor ? `--glide-track-color: ${options.trackColor};` : ''}
          }
        `;

        // --- Merge with existing config (don't overwrite) ---
        const existingHead = config.head ?? [];
        const existingCss = config.customCss ?? [];

        const customHead = [
          { tag: 'script', content: configScript },
          { tag: 'style', content: styleTag },
          ...(isGlassmorphic ? [{ tag: 'script', content: `document.documentElement.classList.add('glide-glassmorphism');` }] : []),
          ...existingHead,
        ] as any;


        // Prepend plugin CSS (base + preset CSS), user CSS always wins
        updateConfig({
          customCss: [baseCssPath, desktopCssPath, mobileCssPath, ...existingCss],
          head: customHead,
        })

        // --- Inject JS: observer + physics + presets + core router ---
        addIntegration({
          name: 'starlight-glide-integration',
          hooks: {
            'astro:config:setup': ({ injectScript }) => {
              injectScript('page', `
                import "${observerJsPath}";
                import "${physicsJsPath}";
                import "${desktopJsPath}";
                import "${mobileJsPath}";
                import "${coreJsPath}";
              `)
            },
          },
        })

        // --- Register route middleware for per-page config ---
        addRouteMiddleware({
          entrypoint: fileURLToPath(new URL('./middleware.ts', import.meta.url)),
        })
      },
    },
  }
}
