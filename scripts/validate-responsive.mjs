/**
 * Validação visual automatizada para os breakpoints do portfólio.
 *
 * O script inicia o Astro localmente, abre o site em um Chrome controlado pelo
 * Playwright e registra screenshots para cada largura importante. Os arquivos
 * em artifacts/ são evidências locais e não devem ser versionados.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { chromium } from 'playwright';

const root = process.cwd();
const outputDir = path.join(root, 'artifacts', 'responsive');
const baseUrl = process.env.RESPONSIVE_BASE_URL ?? 'http://127.0.0.1:4321';
const viewports = [320, 375, 768, 1024, 1440];
// Português na raiz e inglês em /en/; o prefixo identifica as screenshots de cada idioma.
const pages = [{ slug: 'pt', path: '/' }, { slug: 'en', path: '/en/' }];
const height = Number(process.env.RESPONSIVE_HEIGHT ?? 900);
const startsServer = !process.env.RESPONSIVE_BASE_URL;

/** Espera o servidor responder antes de abrir o navegador. */
async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // O Astro ainda está iniciando; a próxima tentativa ocorre abaixo.
    }
    await wait(500);
  }
  throw new Error(`O servidor não respondeu em ${baseUrl} após 30 segundos.`);
}

/** Inicia o servidor somente quando uma URL externa não foi informada. */
function startServer() {
  // Chamar o CLI pelo mesmo Node evita o erro EINVAL que ocorre ao executar npm.cmd no Windows.
  const astroCli = path.join(root, 'node_modules', 'astro', 'astro.js');
  return spawn(process.execPath, [astroCli, 'dev', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true
  });
}

function expectedLayout(width) {
  if (width <= 560) return { menuVisible: true, projectColumns: 1 };
  if (width <= 720) return { menuVisible: true, projectColumns: 2 };
  if (width <= 900) return { menuVisible: false, projectColumns: 2 };
  return { menuVisible: false, projectColumns: 2 };
}

let server;
let browser;

try {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  if (startsServer) server = startServer();
  await waitForServer();

  // Usa o Chrome já instalado. Em CI, defina RESPONSIVE_BROWSER_CHANNEL ou instale o browser do Playwright.
  browser = await chromium.launch({
    channel: process.env.RESPONSIVE_BROWSER_CHANNEL ?? 'chrome',
    headless: true
  });

  const context = await browser.newContext({ viewport: { width: 1440, height } });
  const page = await context.newPage();
  const results = [];
  const failures = [];

  for (const { slug, path: pagePath } of pages) for (const width of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto(new URL(pagePath, baseUrl).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // A captura full-page não dispara o IntersectionObserver das seções fora da viewport.
    // Revelamos os elementos somente no navegador de teste para a evidência representar a página completa.
    await page.locator('.reveal').evaluateAll((elements) => {
      elements.forEach((element) => element.classList.add('is-visible'));
    });

    // A barra do Astro e as transições são úteis no desenvolvimento, mas não devem alterar a evidência final.
    await page.addStyleTag({
      content: 'astro-dev-toolbar { display: none !important; } .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }'
    });

    const metrics = await page.evaluate(() => {
      const menu = document.querySelector('.menu-button');
      const projectList = document.querySelector('.project-list');
      const columns = getComputedStyle(projectList).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length;
      const clientWidth = document.documentElement.clientWidth;
      const overflowElements = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: element.className,
            id: element.id,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            position: style.position
          };
        })
        .filter((element) => element.right > clientWidth + 1 || element.left < -1)
        .slice(0, 12);

      return {
        viewport: window.innerWidth,
        horizontalOverflow: document.documentElement.scrollWidth > clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth,
        overflowElements,
        menuVisible: getComputedStyle(menu).display !== 'none',
        projectColumns: columns
      };
    });

    const expected = expectedLayout(width);
    let menuAccessibility = { passed: true };

    // Em celular, valida o ciclo de foco: Tab não pode alcançar o conteúdo atrás do menu.
    if (expected.menuVisible) {
      await page.locator('.menu-button').click();
      await page.locator('.site-nav a').first().waitFor({ state: 'visible' });

      const openedMenu = await page.evaluate(() => ({
        expanded: document.querySelector('.menu-button')?.getAttribute('aria-expanded'),
        navigationHidden: document.querySelector('.site-nav')?.getAttribute('aria-hidden'),
        mainIsInert: document.querySelector('main')?.hasAttribute('inert')
      }));

      // A partir do último link, Tab deve voltar ao botão do menu, não ao conteúdo da página.
      await page.locator('.site-nav a').last().focus();
      await page.keyboard.press('Tab');
      const focusLoopsInsideMenu = await page.evaluate(
        () => document.activeElement?.classList.contains('menu-button')
      );

      await page.keyboard.press('Escape');
      // Espera o fade do menu terminar para a screenshot não registrar o menu semitransparente.
      await page.waitForTimeout(300);
      const closedMenu = await page.evaluate(() => ({
        expanded: document.querySelector('.menu-button')?.getAttribute('aria-expanded'),
        mainIsInert: document.querySelector('main')?.hasAttribute('inert'),
        buttonHasFocus: document.activeElement?.classList.contains('menu-button')
      }));

      menuAccessibility = {
        passed: openedMenu.expanded === 'true'
          && openedMenu.navigationHidden === 'false'
          && openedMenu.mainIsInert
          && focusLoopsInsideMenu
          && closedMenu.expanded === 'false'
          && !closedMenu.mainIsInert
          && closedMenu.buttonHasFocus
      };
    }

    const checks = {
      viewportMatches: metrics.viewport === width,
      noHorizontalOverflow: !metrics.horizontalOverflow,
      menuMatchesBreakpoint: metrics.menuVisible === expected.menuVisible,
      projectsMatchBreakpoint: metrics.projectColumns === expected.projectColumns,
      menuAccessible: menuAccessibility.passed
    };
    const result = { page: pagePath, width, height, ...metrics, expected, menuAccessibility, checks };
    results.push(result);

    await page.screenshot({ path: path.join(outputDir, `portfolio-${slug}-${width}.png`), fullPage: true });

    for (const [name, passed] of Object.entries(checks)) {
      if (!passed) failures.push(`${pagePath} ${width}px: ${name}`);
    }
  }

  await fs.writeFile(
    path.join(outputDir, 'report.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results, failures }, null, 2)
  );

  if (failures.length) {
    throw new Error(`Validação responsiva falhou:\n- ${failures.join('\n- ')}`);
  }

  console.log(`Validação responsiva aprovada em ${pages.map((item) => item.path).join(' e ')}: ${viewports.join(', ')}px.`);
  console.log(`Evidências salvas em ${path.relative(root, outputDir)}.`);
} finally {
  await browser?.close();
  server?.kill();
}
