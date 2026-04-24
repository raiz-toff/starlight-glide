import type { StarlightPlugin } from '@astrojs/starlight/types'
import { fileURLToPath } from 'node:url'

export interface StarlightGlideOptions {
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
   * The color of the active "snake" indicator.
   * @default 'var(--sl-color-accent)'
   */
  indicatorColor?: string;
  /**
   * The color of the background track.
   * @default 'var(--sl-color-gray-5)'
   */
  trackColor?: string;
  /**
   * Horizontal offsets for different heading depths (H2, H3, H4).
   * @default [8, 24, 40]
   */
  depthOffsets?: [number, number, number];
}

export default function starlightGlide(options?: StarlightGlideOptions): StarlightPlugin {
  const isGlassmorphic = options?.glassmorphism ?? false;

  return {
    name: 'starlight-glide',
    hooks: {
      'config:setup'({ updateConfig, addIntegration }) {
        const cssPath = fileURLToPath(new URL('./src/assets/index.css', import.meta.url))
        const jsPathDesktop = fileURLToPath(new URL('./src/assets/desktop.js', import.meta.url))
        const jsPathMobile = fileURLToPath(new URL('./src/assets/mobile.js', import.meta.url))
        const jsPathIndex = fileURLToPath(new URL('./src/assets/index.js', import.meta.url))

        const configScript = `window.starlightGlideOptions = ${JSON.stringify({
          headerText: options?.headerText ?? 'On this page',
          depthOffsets: options?.depthOffsets ?? [8, 24, 40],
        })};`;

        const styleTag = `
          :root {
            ${options?.indicatorColor ? `--glide-indicator-color: ${options.indicatorColor};` : '--glide-indicator-color: var(--sl-color-accent);'}
            ${options?.trackColor ? `--glide-track-color: ${options.trackColor};` : '--glide-track-color: var(--sl-color-gray-5);'}
          }
        `;

        const customHead = [
          { tag: 'script', content: configScript },
          { tag: 'style', content: styleTag },
          ...(isGlassmorphic ? [{ tag: 'script', content: `document.documentElement.classList.add('glide-glassmorphism');` }] : [])
        ] as any;

        updateConfig({
          customCss: [cssPath],
          head: customHead,
        })

        addIntegration({
          name: 'starlight-glide-integration',
          hooks: {
            'astro:config:setup': ({ injectScript }) => {
              injectScript('page', `
                import "${jsPathDesktop}";
                import "${jsPathMobile}";
                import "${jsPathIndex}";
              `)
            },
          },
        })
      },
    },
  }
}
