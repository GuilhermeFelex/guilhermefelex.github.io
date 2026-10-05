import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserPage = repository.endsWith('.github.io');

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://guilhermefelex.github.io',
  base: repository && !isUserPage ? `/${repository}` : '/',
  output: 'static',
  // Ícones são embutidos como SVG na build; o sitemap acompanha as páginas geradas.
  integrations: [icon(), sitemap()],
  build: {
    assets: '_assets'
  }
});
