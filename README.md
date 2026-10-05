# Portfólio Felex

Portfólio pessoal de **Felex**, com foco em integração de sistemas, automação, RPA, agentes de IA e produtos digitais. É um site estático, rápido e responsivo, construído com Astro e preparado para publicação no GitHub Pages.

## Tecnologias

- [Astro](https://astro.build/)
- TypeScript
- CSS modular nativo
- GitHub Actions + GitHub Pages

## Rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:4321` no navegador.

## Comandos disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento com atualização automática. |
| `npm run build` | Valida TypeScript/Astro, gera a versão de produção em `dist/` e o currículo em PDF (precisa do Chrome instalado). |
| `npm run preview` | Abre localmente a versão gerada pelo build. |
| `npm run validate:responsive` | Testa os breakpoints das duas versões no Chrome e salva screenshots em `artifacts/responsive/`. |
| `npm run validate:a11y` | Audita acessibilidade (axe, WCAG 2.1 AA) na build, incluindo o menu móvel aberto, o currículo e a 404. Rode `npm run build` antes. |
| `npm run validate:site` | Confere conteúdo, SEO e comportamento na build: marca, e-mail oculto, dados estruturados, 404, manifest, currículo e botão de copiar. |
| `npm run lighthouse` | Roda o Lighthouse CI sobre `dist/` e salva os relatórios em `artifacts/lighthouse/`. |

## Estrutura do projeto

```text
brand/                # Kit de marca completo e arquivos legados (fora do deploy)
public/               # Somente o que o site publica: favicons, imagem OG e robots.txt
src/
├── assets/brand/     # Imagens otimizadas na build (astro:assets)
├── components/       # Home (página completa), Resume (currículo), Header, HeroDiagram, SectionTitle e Analytics
├── icons/            # Ícones SVG locais usados pelo astro-icon (ex.: power-platform)
├── data/site.ts      # Dados sem idioma: email, redes, stack (ícone + cor) e analytics
├── i18n/             # Textos em português e inglês (content.ts) e utilidades de idioma (ui.ts)
├── layouts/          # Estrutura HTML compartilhada e metadados
├── pages/            # index e cv em português (/ e /cv/), em inglês (/en/ e /en/cv/) e a 404 bilíngue
├── scripts/email.ts  # Monta o e-mail no navegador (o endereço completo não fica no HTML)
└── styles/           # Estilos separados por responsabilidade
    ├── tokens.css    # Cores, fontes, espaçamentos e variáveis globais
    ├── base.css      # Reset, acessibilidade e animações compartilhadas
    ├── layout.css    # Cabeçalho, navegação, contêiner e rodapé
    ├── sections.css  # Hero, projetos, especialidades, stack e contato
    └── responsive.css # Regras para tablet, celular e menos movimento

scripts/
├── validate-responsive.mjs # Validação automática dos breakpoints no navegador
├── validate-a11y.mjs       # Auditoria de acessibilidade com axe-core (inclui currículo e 404)
├── validate-site.mjs       # Verificações de conteúdo, SEO e comportamento
├── build-cv.mjs            # Gera o currículo em PDF a partir de /cv/ e /en/cv/ depois da build
└── generate-og-en.mjs      # Refaz a imagem de compartilhamento em inglês (uso manual)
```

O arquivo `src/styles/global.css` é somente o ponto de entrada que importa os módulos na ordem correta.

## Qualidade

A cada push na `main` (e em PRs para ela), o workflow gera a build (com o currículo em PDF) e roda acessibilidade (axe), a validação de conteúdo (`validate:site`), a validação responsiva e o Lighthouse antes de publicar. O Dependabot abre PRs semanais de atualização, que passam pelas mesmas verificações. O deploy só acontece se tudo passar. Os relatórios ficam disponíveis como artefato `quality-reports` na execução do workflow. O Lighthouse exige nota mínima de 95 em acessibilidade e SEO e de 90 em boas práticas; desempenho abaixo de 90 gera apenas aviso.

## Validação responsiva

Execute a validação visual automática com:

```bash
npm run validate:responsive
```

O teste inicia o Astro, abre o site no Chrome com Playwright e verifica as larguras **320px, 375px, 768px, 1024px e 1440px** em `/` e `/en/`. Ele reprova scroll horizontal e mudanças inesperadas no menu ou na grade de projetos. As screenshots e o relatório JSON ficam em `artifacts/responsive/`, diretório que já está ignorado pelo Git.

## Personalizar o conteúdo

Os textos ficam em [`src/i18n/content.ts`](src/i18n/content.ts), com um bloco para português e outro para inglês. O TypeScript exige que os dois tenham as mesmas chaves, então a build falha se uma tradução ficar faltando. Lá ficam hero, sobre, especialidades, projetos, contato e metadados de SEO.

Em [`src/data/site.ts`](src/data/site.ts) ficam os dados que não mudam com o idioma: nome, email, redes sociais, stack e o código do analytics.

## Analytics

O site usa [GoatCounter](https://www.goatcounter.com/), que conta visitas sem cookies e sem banner de consentimento. Para ativar, crie uma conta, escolha um código (ex.: `felextech`) e preencha `goatcounter` em `src/data/site.ts`. O script só entra na build de produção. Cliques em "Iniciar conversa", LinkedIn, "Copiar email", GitHub e na troca de idioma são registrados como eventos.

Os ícones usam [astro-icon](https://www.astroicon.dev/) com os sets do Iconify: `simple-icons:*` para marcas e `lucide:*` para ícones de interface. Para um ícone que não existe nesses sets, salve o SVG em `src/icons/` (com `fill="currentColor"`) e use o nome do arquivo. As fontes (Manrope e DM Mono) vêm do Fontsource e são servidas pelo próprio site. O sitemap é gerado na build pelo `@astrojs/sitemap`.

Os links de GitHub e LinkedIn ficam ocultos no rodapé enquanto estiverem vazios. Basta adicionar uma URL válida para exibi-los.

Para ajustar o visual, comece por `src/styles/tokens.css`. Ele concentra as cores, fontes, largura máxima e demais valores reutilizados em toda a página.

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy.yml` faz o deploy automaticamente a cada push para a branch `main`.

No GitHub, configure uma única vez:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **GitHub Actions** como fonte.
3. Faça push para `main` ou execute manualmente o workflow **Deploy to GitHub Pages** na aba **Actions**.

O `astro.config.mjs` identifica automaticamente se o repositório é uma página de usuário (`usuario.github.io`) ou de projeto (`usuario.github.io/repositorio`) e ajusta a rota base.
