/**
 * Auditoria de acessibilidade com axe-core nas duas versões do site.
 *
 * Usa a build de produção (rode `npm run build` antes) servida pelo `astro preview`,
 * ou a URL informada em A11Y_BASE_URL. Reprova qualquer violação WCAG 2.1 A/AA.
 * Também verifica o menu móvel aberto, que só existe depois de interação.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = process.env.A11Y_BASE_URL ?? 'http://127.0.0.1:4331';
const startsServer = !process.env.A11Y_BASE_URL;
const pages = ['/', '/en/'];
const utilityPages = ['/cv/', '/en/cv/', '/pagina-que-nao-existe'];
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** Espera o servidor responder antes de abrir o navegador. */
async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // O preview ainda está iniciando; a próxima tentativa ocorre abaixo.
    }
    await wait(500);
  }
  throw new Error(`O servidor não respondeu em ${baseUrl} após 30 segundos.`);
}

/** Chama o CLI pelo mesmo Node, como no teste responsivo, para evitar o EINVAL do npm.cmd no Windows. */
function startServer() {
  const astroCli = path.join(root, 'node_modules', 'astro', 'astro.js');
  const { port } = new URL(baseUrl);
  return spawn(process.execPath, [astroCli, 'preview', '--host', '127.0.0.1', '--port', port], {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true
  });
}

/** Resume as violações em uma linha por nó, com o seletor para localizar o problema. */
function describe(violations) {
  return violations.flatMap((violation) =>
    violation.nodes.map((node) => `[${violation.impact}] ${violation.id}: ${violation.help} → ${node.target.join(' ')}`)
  );
}

let server;
let browser;

try {
  if (startsServer) server = startServer();
  await waitForServer();

  browser = await chromium.launch({
    channel: process.env.RESPONSIVE_BROWSER_CHANNEL ?? 'chrome',
    headless: true
  });

  const failures = [];

  for (const pagePath of pages) {
    const url = new URL(pagePath, baseUrl).href;

    // Desktop com todo o conteúdo revelado: a animação de entrada não pode esconder problemas de contraste.
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const desktop = await desktopContext.newPage();
    await desktop.goto(url, { waitUntil: 'networkidle' });
    const desktopResult = await new AxeBuilder({ page: desktop }).withTags(tags).analyze();
    failures.push(...describe(desktopResult.violations).map((line) => `${pagePath} desktop: ${line}`));
    await desktopContext.close();

    // Celular com o menu aberto.
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
    const mobile = await mobileContext.newPage();
    await mobile.goto(url, { waitUntil: 'networkidle' });
    await mobile.locator('.menu-button').click();
    await mobile.locator('.site-nav a').first().waitFor({ state: 'visible' });
    const mobileResult = await new AxeBuilder({ page: mobile }).withTags(tags).analyze();
    failures.push(...describe(mobileResult.violations).map((line) => `${pagePath} menu móvel: ${line}`));
    await mobileContext.close();

    console.log(`${pagePath}: ${desktopResult.passes.length} regras aprovadas no desktop.`);
  }

  // Páginas utilitárias (currículo e 404): sem menu, só a verificação de desktop.
  for (const pagePath of utilityPages) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(new URL(pagePath, baseUrl).href, { waitUntil: 'networkidle' });
    const result = await new AxeBuilder({ page }).withTags(tags).analyze();
    failures.push(...describe(result.violations).map((line) => `${pagePath}: ${line}`));
    await context.close();
    console.log(`${pagePath}: ${result.passes.length} regras aprovadas.`);
  }

  if (failures.length) {
    throw new Error(`Auditoria de acessibilidade falhou:\n- ${failures.join('\n- ')}`);
  }

  console.log(`Acessibilidade aprovada (axe, ${tags.join(', ')}): ${[...pages, ...utilityPages].join(', ')}.`);
} finally {
  await browser?.close();
  server?.kill();
}
