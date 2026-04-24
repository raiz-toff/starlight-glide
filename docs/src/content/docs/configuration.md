---
title: Configuration
description: Learn how to customize the Starlight Glide plugin.
---

`starlight-glide` offers several options to customize the appearance and behavior of the Table of Contents indicator.

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
          glassmorphism: true,
          headerText: 'Jump to Section',
          indicatorColor: 'var(--sl-color-accent)',
          trackColor: 'var(--sl-color-gray-5)',
          depthOffsets: [8, 24, 40],
        }),
      ],
    }),
  ],
});
```

## Reference

### `glassmorphism`

- **Type**: `boolean`
- **Default**: `false`

Enables a premium, translucent glass effect for the right sidebar (desktop) and the TOC dropdown (mobile). It uses `backdrop-filter` and `color-mix` to create a theme-aware blurred background.

### `headerText`

- **Type**: `string`
- **Default**: `'On this page'`

The title text displayed at the top of the desktop Table of Contents. This header is isolated from the mobile view to prevent layout conflicts.

### `indicatorColor`

- **Type**: `string`
- **Default**: `'var(--sl-color-accent)'`

The color of the active "snake" indicator and the mobile progress ring. You can use hex codes, HSL, or any valid CSS color/variable.

### `trackColor`

- **Type**: `string`
- **Default**: `'var(--sl-color-gray-5)'`

The color of the faint background line that the snake indicator follows.

### `depthOffsets`

- **Type**: `[number, number, number]`
- **Default**: `[8, 24, 40]`

An array of three numbers representing the horizontal pixel offsets for different heading depths (H2, H3, and H4). This allows you to control the "indentation" curve of the snake indicator.
