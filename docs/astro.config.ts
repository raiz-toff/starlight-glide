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
      plugins: [starlightGlide({ glassmorphism: true })],
      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started', 'demo'],
        },
      ],
      social: [
        { href: 'https://github.com/raiz-toff/starlight-glide', icon: 'github', label: 'GitHub' },
      ],
      title: 'starlight-glide',
    }),
  ],
})
