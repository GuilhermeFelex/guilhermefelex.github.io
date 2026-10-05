import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserPage = repository.endsWith('.github.io');

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://guilhermefelex.github.io',
  base: repository && !isUserPage ? `/${repository}` : '/',
  output: 'static',
  // Português na raiz e inglês em /en/.
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false }
  },
  // Ícones são embutidos como SVG na build; o sitemap liga as versões de cada idioma.
  integrations: [
    icon(),
    sitemap({ i18n: { defaultLocale: 'pt', locales: { pt: 'pt-BR', en: 'en' } } })
  ],
  build: {
    assets: '_assets'
  }
});
