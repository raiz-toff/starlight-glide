import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema'
import { glideSchema } from 'starlight-glide/schema';

export const collections = {
  docs: defineCollection({ 
    loader: docsLoader(), 
    schema: docsSchema({ extend: glideSchema }) 
  }),
}
