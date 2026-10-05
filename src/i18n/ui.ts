import { getRelativeLocaleUrl } from 'astro:i18n';

/** Idiomas publicados. A chave é o código usado nas rotas (`/` e `/en/`). */
export const languages = {
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', short: 'PT' },
  en: { htmlLang: 'en', ogLocale: 'en_US', short: 'EN' }
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'pt';

/** URL da página inicial de um idioma, já considerando o `base` do GitHub Pages. */
export const homeUrl = (lang: Lang) => getRelativeLocaleUrl(lang);

export const otherLang = (lang: Lang): Lang => (lang === 'pt' ? 'en' : 'pt');
