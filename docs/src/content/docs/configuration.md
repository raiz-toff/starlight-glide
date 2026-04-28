---
title: Configuration
description: Learn how to customize the Starlight Glide plugin.
---

`starlight-glide` is fully modular — pick your desktop indicator, mobile view, and animation physics. By default, it **automatically inherits** your theme colors (`--sl-color-accent` and `--sl-color-gray-5`), ensuring it matches Rapide or standard Starlight perfectly with zero configuration.

## Usage

Pass the options to the `starlightGlide()` plugin in your `astro.config.mjs` file:

```javascript
// astro.config.mjs
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightGlide from 'starlight-glide';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightGlide({
          desktop: 'snake',       // or 'dot'
          mobile: 'dropdown',     // or 'minimal'
          physics: 'smooth',      // or 'spring', 'snap'
          glassmorphism: true,
        }),
      ],
    }),
  ],
});
```

## Presets

### `desktop`

- **Type**: `'snake' | 'dot'`
- **Default**: `'snake'`

Choose the desktop TOC indicator style:

| Preset | Description |
| --- | --- |
| `snake` | SVG path "dancing snake" that flows along the heading tree |
| `dot` | A glowing dot that slides along a vertical track line |

### `mobile`

- **Type**: `'dropdown' | 'minimal'`
- **Default**: `'dropdown'`

Choose the mobile TOC view:

| Preset | Description |
| --- | --- |
| `dropdown` | Progress circle + section title + collapsible dropdown menu |
| `minimal` | Thin progress bar + section title, no dropdown |

### `physics`

- **Type**: `'smooth' | 'spring' | 'snap'`
- **Default**: `'smooth'`

Choose how the indicator animates between sections:

| Preset | Description |
| --- | --- |
| `smooth` | Clean, professional cubic-bezier easing |
| `spring` | Bouncy overshoot then settle — dynamic feel |
| `snap` | Instant, crisp transitions — zero delay |

## Colors

`starlight-glide` uses a "Smart Inheritance" system. By default, it detects your Starlight theme's accent and gray variables. You only need to set these options if you want the TOC to use colors that differ from the rest of your site.

### `indicatorColor`

- **Type**: `string`
- **Default**: `(inherited from theme)`

The color of the active indicator (snake, dot, or mobile progress). Defaults to your theme's accent color. Accepts any CSS color value or variable.

### `trackColor`

- **Type**: `string`
- **Default**: `(inherited from theme)`

The color of the background track/rail. Defaults to a subtle gray from your theme.


## Other Options

### `glassmorphism`

- **Type**: `boolean`
- **Default**: `false`

Enables a translucent glass effect for the TOC sidebar and mobile dropdown.

### `headerText`

- **Type**: `string`
- **Default**: `'On this page'`

The title text displayed at the top of the desktop TOC.

### `depthOffsets`

- **Type**: `[number, number, number]`
- **Default**: `[8, 24, 40]`

Horizontal pixel offsets for heading depths (H2, H3, H4). Only applies to the `snake` desktop preset.

## Per-Page Overrides

You can override the preset on a specific page using the `glide` frontmatter field.

**Step 1:** Extend your content schema in `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glideSchema } from 'starlight-glide/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({ extend: glideSchema }),
  }),
};
```

**Step 2:** Use the `glide` field in any page's frontmatter:

```md
---
title: My Special Page
glide:
  desktop: dot
  physics: spring
  indicatorColor: '#ff6b6b'
---
```

This page will use the `dot` desktop indicator with `spring` physics, while all other pages use the global config.
