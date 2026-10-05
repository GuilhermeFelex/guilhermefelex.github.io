/**
 * Validação de conteúdo, SEO e comportamento do site construído.
 *
 * Complementa validate-a11y (acessibilidade) e validate-responsive (layout). Cada verificação tem um
 * identificador (ex.: "1-marca", "V4-curriculo") que corresponde ao plano de melhorias do site.
 * Usa a build em dist/ servida pelo `astro preview`, ou a URL em SITE_BASE_URL.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { chromium } from 'playwright';
import YAML from 'yaml';

const root = process.cwd();
const dist = path.join(root, 'dist');
const baseUrl = process.env.SITE_BASE_URL ?? 'http://127.0.0.1:4332';
const startsServer = !process.env.SITE_BASE_URL;
const email = 'guilherme.felex@hotmail.com';
const accent = 'rgb(110, 203, 255)';
// Mesmo valor do token --text-soft (#c9d6dd) em src/styles/tokens.css.
const textSoft = 'rgb(201, 214, 221)';

const results = [];
const check = (id, passed, detail = '') => results.push({ id, passed: Boolean(passed), detail });
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(dist, file));

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(baseUrl)).ok) return;
    } catch {
      // O preview ainda está iniciando.
    }
    await wait(300);
  }
  throw new Error(`O servidor não respondeu em ${baseUrl}.`);
}

/** Conta páginas de um PDF pelos objetos /Type /Page (sem /Pages). */
const pdfPages = (file) => (fs.readFileSync(file, 'latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;

let server;
let browser;

try {
  // ---------- Verificações estáticas sobre dist/ ----------
  const htmlFiles = ['index.html', 'en/index.html', 'cv/index.html', 'en/cv/index.html', '404.html'];
  for (const file of htmlFiles) {
    check(`W2-email-oculto ${file}`, exists(file) && !read(file).includes(email) && !/@hotmail\.com/.test(read(file)), 'endereço completo não pode estar no HTML');
  }

  for (const [file, lang] of [['index.html', 'pt'], ['en/index.html', 'en']]) {
    const html = read(file);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const service = ld['@graph'].find((node) => node['@type'] === 'ProfessionalService');
    const offers = service?.hasOfferCatalog?.itemListElement ?? [];
    check(`V3-dados-estruturados ${lang}`,
      service && offers.length === 4 && offers.every((offer) => offer.itemOffered?.['@type'] === 'Service' && offer.itemOffered.name) && !JSON.stringify(ld).includes('@hotmail'),
      `${offers.length} serviços no catálogo`);
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1] ?? '';
    const expected = lang === 'en' ? 'og-felex-en.jpg' : 'og-felex.jpg';
    check(`V6-imagem-social ${lang}`, og.endsWith(`/images/${expected}`) && exists(`images/${expected}`), og);
    check(`W1-manifest-link ${lang}`, html.includes('rel="manifest" href="/site.webmanifest"'));
  }

  const manifest = JSON.parse(read('site.webmanifest'));
  const iconsOk = manifest.icons.every((icon) => exists(icon.src.slice(1)));
  check('W1-manifest', manifest.name && manifest.short_name === 'FelexTech' && manifest.icons.length >= 2 && iconsOk, `${manifest.icons.length} ícones`);

  const notFound = read('404.html');
  check('V5-pagina-404', notFound.includes('name="robots" content="noindex"') && notFound.includes('href="/"') && notFound.includes('href="/en/"') && notFound.includes('lang="en"'));
  const sitemap = read('sitemap-0.xml');
  check('V5/V4-fora-do-sitemap', !/404|\/cv\//.test(sitemap) && sitemap.includes('/en/'), 'sitemap sem 404 e sem /cv/');

  for (const file of ['curriculo-guilherme-felex.pdf', 'en/resume-guilherme-felex.pdf']) {
    const full = path.join(dist, file);
    const pages = exists(file) ? pdfPages(full) : 0;
    check(`V4-curriculo ${file}`, exists(file) && fs.statSync(full).size > 10_000 && pages >= 1 && pages <= 3, `${pages} página(s)`);
  }
  check('V4-curriculo-noindex', read('cv/index.html').includes('content="noindex"') && read('en/cv/index.html').includes('content="noindex"'));

  const dependabot = YAML.parse(fs.readFileSync(path.join(root, '.github/dependabot.yml'), 'utf8'));
  const ecosystems = dependabot.updates.map((update) => update['package-ecosystem']);
  check('V7-dependabot', dependabot.version === 2 && ecosystems.includes('npm') && ecosystems.includes('github-actions'), ecosystems.join(', '));

  // ---------- Verificações no navegador ----------
  if (startsServer) {
    const astroCli = path.join(root, 'node_modules', 'astro', 'astro.js');
    const { port } = new URL(baseUrl);
    server = spawn(process.execPath, [astroCli, 'preview', '--host', '127.0.0.1', '--port', port], { cwd: root, stdio: 'ignore', windowsHide: true });
  }
  await waitForServer();
  browser = await chromium.launch({ channel: process.env.RESPONSIVE_BROWSER_CHANNEL ?? 'chrome', headless: true });

  for (const lang of ['pt', 'en']) {
    const pagePath = lang === 'pt' ? '/' : '/en/';
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(new URL(pagePath, baseUrl).href, { waitUntil: 'networkidle' });

    const data = await page.evaluate(() => {
      const style = (selector, prop) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element)[prop] : null;
      };
      const all = (selector) => [...document.querySelectorAll(selector)];
      const titleSpan = document.querySelector('.section-title span');
      const titleLabel = document.querySelector('.section-title p, .section-title h2');
      return {
        brand: document.querySelector('.brand-name')?.textContent?.trim(),
        footer: document.querySelector('.footer-brand strong')?.textContent?.trim(),
        h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
        diagram: all('.diagram-node text').map((node) => node.textContent),
        about: document.querySelector('.about-copy')?.textContent ?? '',
        hasStackSection: Boolean(document.querySelector('#stack')),
        chips: all('.stack-chips li').length,
        chipIcons: all('.stack-chip-icon').filter((icon) => icon.getBoundingClientRect().width >= 14).length,
        careerSize: parseFloat(style('.career-title', 'fontSize')),
        projectsSize: parseFloat(style('.projects-intro h2', 'fontSize')),
        servicesBg: style('.services', 'backgroundImage'),
        ctaBg: style('.contact-link', 'backgroundColor'),
        bodyText: ['.project-item > p', '.expertise-item p', '.process-list p', '.career-description', '.service-deliverables li', '.project-highlights li']
          .map((selector) => ({ selector, size: parseFloat(style(selector, 'fontSize')), color: style(selector, 'color') })),
        labelGap: titleSpan && titleLabel ? titleLabel.getBoundingClientRect().left - titleSpan.getBoundingClientRect().right : 999,
        mailtos: all('a[href^="mailto:"]').map((a) => a.getAttribute('href')),
        emailText: document.querySelector('.contact-email')?.textContent,
        cvLinks: all('a[download]').map((a) => a.getAttribute('href')),
        processMarkers: all('.process-list li').filter((li) => getComputedStyle(li, '::before').content !== 'none').length
      };
    });

    check(`1-marca ${lang}`, data.brand === 'FelexTech' && data.footer === 'FelexTech', `${data.brand} / ${data.footer}`);
    const heroOk = lang === 'pt' ? data.h1.includes('tiram o trabalho manual') : data.h1.includes('take manual work');
    const diagramOk = data.diagram.includes('ERP / SAP') && data.diagram.includes('WhatsApp') && !data.diagram.some((label) => /Marketplace/.test(label));
    check(`2-hero ${lang}`, heroOk && diagramOk, `${data.h1} | ${data.diagram.join(', ')}`);
    check(`5-sobre-sem-empresas ${lang}`, !/CSN|Biti9|Nubank|Sigma/.test(data.about));
    check(`8-hierarquia ${lang}`, data.careerSize < data.projectsSize * 0.75 && data.servicesBg.includes('gradient'), `trajetória ${data.careerSize}px × projetos ${data.projectsSize}px`);
    check(`9-stack-compacta ${lang}`, !data.hasStackSection && data.chips === 12 && data.chipIcons === 12, `${data.chips} chips, ${data.chipIcons} ícones visíveis`);
    check(`10-cta-preenchido ${lang}`, data.ctaBg === accent, data.ctaBg);
    const smallText = data.bodyText.filter((item) => item.size < 15 || item.color !== textSoft);
    check(`11-legibilidade ${lang}`, smallText.length === 0, smallText.map((item) => `${item.selector} ${item.size}px ${item.color}`).join('; '));
    check(`12-rotulo-junto ${lang}`, data.labelGap >= 0 && data.labelGap <= 48, `${Math.round(data.labelGap)}px entre número e rótulo`);
    check(`detalhe-como-trabalho ${lang}`, data.processMarkers === 4);

    const subjects = lang === 'pt' ? ['Projeto%20FelexTech', 'Oportunidade%20de%20trabalho'] : ['FelexTech%20project', 'Job%20opportunity'];
    check(`W2-email-montado ${lang}`,
      data.emailText === email && subjects.every((subject) => data.mailtos.includes(`mailto:${email}?subject=${subject}`)),
      data.mailtos.join(' | '));
    const cvExpected = lang === 'pt' ? '/curriculo-guilherme-felex.pdf' : '/en/resume-guilherme-felex.pdf';
    check(`V4-link-curriculo ${lang}`, data.cvLinks.length === 2 && data.cvLinks.every((href) => href === cvExpected) && (await fetch(new URL(cvExpected, baseUrl))).ok);

    // V8: sem permissão de área de transferência, o botão avisa e seleciona o email.
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('negado')) }, configurable: true });
    });
    await page.locator('.copy-email').click();
    await page.waitForFunction(() => /is-(copied|failed)/.test(document.querySelector('.copy-email')?.className ?? ''));
    const failed = await page.evaluate(() => ({
      state: document.querySelector('.copy-email')?.classList.contains('is-failed'),
      selection: window.getSelection()?.toString(),
      status: document.querySelector('[data-copy-status]')?.textContent
    }));
    check(`V8-copiar-falha ${lang}`, failed.state && failed.selection === email && failed.status, failed.status ?? '');
    await context.close();

    // V8: com permissão, o email vai para a área de transferência.
    const okContext = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const okPage = await okContext.newPage();
    await okPage.goto(new URL(pagePath, baseUrl).href, { waitUntil: 'networkidle' });
    await okPage.locator('.copy-email').click();
    // O clique dispara uma cópia assíncrona: espera o botão sair do estado inicial antes de conferir.
    await okPage.waitForFunction(() => /is-(copied|failed)/.test(document.querySelector('.copy-email')?.className ?? ''));
    const copied = await okPage.evaluate(async () => ({
      className: document.querySelector('.copy-email')?.className,
      clipboard: await navigator.clipboard.readText()
    }));
    check(`V8-copiar-ok ${lang}`, copied.className.includes('is-copied') && copied.clipboard === email, `${copied.className} | ${copied.clipboard}`);
    await okContext.close();

    // V8 e W2 no celular: cards alinhados ao título; sem JS o email aparece na forma legível.
    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(new URL(pagePath, baseUrl).href);
    const mobileData = await mobilePage.evaluate(() => ({
      title: document.querySelector('#services-title')?.getBoundingClientRect().left,
      card: document.querySelector('.expertise-item')?.getBoundingClientRect().left,
      fallback: document.querySelector('.contact-email')?.textContent
    }));
    check(`V8-alinhamento-celular ${lang}`, Math.abs(mobileData.title - mobileData.card) <= 1, `título ${mobileData.title}px, card ${mobileData.card}px`);
    check(`W2-sem-js ${lang}`, /\[(arroba|at)\]/.test(mobileData.fallback ?? ''), mobileData.fallback ?? '');
    await mobile.close();
  }

  const notFoundPage = await browser.newPage();
  const response = await notFoundPage.goto(new URL('/pagina-que-nao-existe', baseUrl).href);
  check('V5-404-servida', response.status() === 404 && (await notFoundPage.locator('h1').textContent()).includes('não encontrada'));
  await notFoundPage.close();
} finally {
  await browser?.close();
  server?.kill();
}

const failures = results.filter((result) => !result.passed);
for (const result of results) {
  console.log(`${result.passed ? 'ok  ' : 'FALHA'} ${result.id}${result.detail ? ` — ${result.detail}` : ''}`);
}
console.log(`\n${results.length - failures.length}/${results.length} verificações aprovadas.`);
if (failures.length) process.exit(1);
