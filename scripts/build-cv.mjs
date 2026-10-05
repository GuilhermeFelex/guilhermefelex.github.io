/**
 * Gera o currículo em PDF a partir das páginas /cv/ e /en/cv/ já construídas em dist/.
 *
 * Roda depois de `astro build` (ver o script "build" do package.json): sobe o `astro preview`,
 * abre cada página no Chrome via Playwright e salva o PDF ao lado do site publicado.
 * No CI, falhar aqui reprova a build; localmente, sem Chrome disponível, apenas avisa.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist');
const port = process.env.CV_PORT ?? '4398';
const baseUrl = `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env.CI);

// Mantém em sincronia com `cvFiles` em src/i18n/ui.ts.
const targets = [
  { page: '/cv/', output: 'curriculo-guilherme-felex.pdf' },
  { page: '/en/cv/', output: 'en/resume-guilherme-felex.pdf' }
];

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`${baseUrl}/cv/`)).ok) return;
    } catch {
      // O preview ainda está iniciando.
    }
    await wait(300);
  }
  throw new Error(`O preview não respondeu em ${baseUrl}.`);
}

let server;
let browser;

try {
  const astroCli = path.join(root, 'node_modules', 'astro', 'astro.js');
  server = spawn(process.execPath, [astroCli, 'preview', '--host', '127.0.0.1', '--port', port], {
    cwd: root,
    stdio: 'ignore',
    windowsHide: true
  });
  await waitForServer();

  browser = await chromium.launch({ channel: process.env.RESPONSIVE_BROWSER_CHANNEL ?? 'chrome', headless: true });
  const page = await browser.newPage();

  for (const target of targets) {
    await page.goto(`${baseUrl}${target.page}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const output = path.join(dist, target.output);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await page.pdf({ path: output, format: 'A4', printBackground: true, preferCSSPageSize: true });
    const { size } = await fs.stat(output);
    if (size < 10_000) throw new Error(`${target.output} ficou com apenas ${size} bytes.`);
    console.log(`Currículo gerado: dist/${target.output} (${Math.round(size / 1024)} KB)`);
  }
} catch (error) {
  if (isCI) throw error;
  console.warn(`Aviso: currículo em PDF não gerado (${error.message}). O link de download ficará quebrado nesta build local.`);
} finally {
  await browser?.close();
  server?.kill();
}
