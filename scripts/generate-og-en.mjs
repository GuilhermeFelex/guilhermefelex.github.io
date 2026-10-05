/**
 * Gera public/images/og-felex-en.jpg: a arte original (brand/legado/og-felex-original.png) com o
 * subtítulo trocado para inglês. Rodar manualmente quando a arte mudar: node scripts/generate-og-en.mjs
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
import fs from 'node:fs';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const sharp = require('sharp');

const root = process.cwd();
const art = pathToFileURL(path.join(root, 'brand/legado/og-felex-original.png')).href;
const font = pathToFileURL(path.join(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')).href;
const html = `<!doctype html><html><head><style>
@font-face { font-family: Manrope; src: url('${font}') format('woff2'); font-weight: 200 800; }
html, body { margin: 0; }
.stage { position: relative; width: 1730px; height: 909px; background: url('${art}') 0 0 / 1730px 909px no-repeat; }
.patch { position: absolute; left: 112px; top: 404px; width: 610px; height: 66px; background: rgb(0, 7, 12); }
.tagline { position: absolute; left: 130px; top: 409px; color: #f2f6f8; font: 400 39px/1 Manrope; letter-spacing: .035em; white-space: nowrap; }
</style></head><body><div class="stage"><div class="patch"></div><div class="tagline" id="t">Integration · Automation · AI</div></div></body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1730, height: 909 } });
// O navegador só carrega a arte local a partir de uma página também local.
const htmlFile = path.join(os.tmpdir(), 'felextech-og-en.html');
fs.writeFileSync(htmlFile, html);
await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const width = await page.evaluate(() => document.getElementById('t').getBoundingClientRect().width);
const png = await page.screenshot({ type: 'png' });
await browser.close();
fs.rmSync(htmlFile);
const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, 'public/images/og-felex-en.jpg'));
console.log(`tagline ${Math.round(width)}px; og-felex-en.jpg ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
