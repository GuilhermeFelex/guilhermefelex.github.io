/**
 * Caminho do CLI do Astro, lido do campo "bin" do pacote instalado.
 * Os scripts chamam o CLI pelo mesmo Node (evita o EINVAL do npm.cmd no Windows) e o caminho
 * muda entre versões (astro.js no Astro 5, bin/astro.mjs no Astro 7).
 */
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const astroPackage = require('astro/package.json');
const bin = typeof astroPackage.bin === 'string' ? astroPackage.bin : astroPackage.bin.astro;

export const astroCli = path.join(path.dirname(require.resolve('astro/package.json')), bin);
