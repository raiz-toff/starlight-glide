/**
 * Zod schema extension for the `glide` frontmatter field.
 * Users can import this in their content.config.ts to enable per-page TOC config.
 *
 * Usage in content.config.ts:
 *   import { docsSchema } from '@astrojs/starlight/schema';
 *   import { glideSchema } from 'starlight-glide/schema';
 *
 *   export const collections = {
 *     docs: defineCollection({
 *       schema: docsSchema({ extend: glideSchema }),
 *     }),
 *   };
 */
import { z } from 'astro:content';

export const glideSchema = z.object({
  glide: z.object({
    /** Override the desktop preset for this page */
    desktop: z.enum(['snake', 'dot']).optional(),
    /** Override the mobile preset for this page */
    mobile: z.enum(['dropdown', 'minimal']).optional(),
    /** Override the physics preset for this page */
    physics: z.enum(['smooth', 'spring', 'snap']).optional(),
    /** Override the indicator color for this page */
    indicatorColor: z.string().optional(),
    /** Override the track color for this page */
    trackColor: z.string().optional(),
  }).optional(),
});
