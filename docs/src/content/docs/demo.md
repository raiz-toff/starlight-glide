---
title: Glide TOC Demo
description: Showcasing the smooth "moving snake" table of contents indicator.
---

This page demonstrates the **starlight-glide** plugin in action. Scroll down to see the "moving snake" indicator follow your progress through the different sections and nested headings.

## Features

- **Smooth Curves:** Uses SVG cubic-bezier curves for transitions between different indentation levels.
- **Batched Performance:** Optimized to minimize layout shifts and reflows.
- **Fumadocs-inspired:** A premium feel for your documentation.

## Getting Started

To use this plugin, you simply add it to your `astro.config.ts`.

### 1. Installation

```bash
npm install starlight-glide
```

### 2. Configuration

```typescript
// astro.config.ts
import starlight from '@astrojs/starlight'
import starlightGlide from 'starlight-glide'

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightGlide()],
    }),
  ],
})
```

## Deep Nesting Test

This section tests how the snake handles moving between different depths.

### Sub-heading Level 3 (A)
Content for sub-heading A.

### Sub-heading Level 3 (B)
Content for sub-heading B.

## Animation Smoothness

The snake uses CSS transitions for `stroke-dashoffset` and `stroke-dasharray` to ensure 60fps performance during scrolling.

### Transition Timing
We use a custom cubic-bezier timing function to make the movement feel natural and "glidey."

### Responsiveness
The indicator automatically recalculates its path on window resize to stay perfectly aligned with your links.

## Conclusion

The Glide TOC adds that extra touch of polish to your Starlight site, making navigation feel alive.

### Feedback
We love feedback! Let us know what you think.

### Future Plans
Stay tuned for more features like color customization and line weight options.

---

*Scroll back up to see the snake glide back to the top!*
