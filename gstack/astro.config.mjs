import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL ?? 'https://tiennm99.github.io';
const basePath = process.env.SITE_BASE ?? '/try-gstack';

export default defineConfig({
  site: siteUrl,
  base: basePath,
  trailingSlash: 'always',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  build: {
    assets: 'assets',
  },
});
