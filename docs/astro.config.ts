import vercel from '@astrojs/vercel'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGlide from 'starlight-glide'

export default defineConfig({
  adapter: vercel(),
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/raiz-toff/starlight-glide/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'script',
          content: `
            if (new URLSearchParams(window.location.search).get('embed') === 'true') {
              document.documentElement.setAttribute('data-embed', 'true');
            }
          `,
        },
      ],
      plugins: [starlightGlide({ glassmorphism: true })],

      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started', 'configuration'],
        },
        {
          label: 'Demos',
          items: [
            'demos',
            'demo-snake', 
            'demo-dot', 
            'demo-dropdown',
            'demo-minimal', 
            'demo-smooth', 
            'demo-spring', 
            'demo-snap'
          ],

        },
      ],
      social: [
        { href: 'https://github.com/raiz-toff/starlight-glide', icon: 'github', label: 'GitHub' },
      ],
      title: 'starlight-glide',
    }),
  ],
})
