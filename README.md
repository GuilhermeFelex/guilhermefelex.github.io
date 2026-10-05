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
| `npm run build` | Valida TypeScript/Astro e gera a versão de produção em `dist/`. |
| `npm run preview` | Abre localmente a versão gerada pelo build. |
| `npm run validate:responsive` | Testa os breakpoints no Chrome e salva screenshots locais em `artifacts/responsive/`. |

## Estrutura do projeto

```text
brand/                # Kit de marca completo e arquivos legados (fora do deploy)
public/               # Somente o que o site publica: favicons, imagem OG e robots.txt
src/
├── assets/brand/     # Imagens otimizadas na build (astro:assets)
├── components/       # Header, HeroDiagram (diagrama animado) e SectionTitle
├── icons/            # Ícones SVG locais usados pelo astro-icon (ex.: power-platform)
├── data/site.ts      # Conteúdo: perfil, projetos, stack (ícone + cor) e links sociais
├── layouts/          # Estrutura HTML compartilhada e metadados
├── pages/index.astro # Página principal do portfólio
└── styles/           # Estilos separados por responsabilidade
    ├── tokens.css    # Cores, fontes, espaçamentos e variáveis globais
    ├── base.css      # Reset, acessibilidade e animações compartilhadas
    ├── layout.css    # Cabeçalho, navegação, contêiner e rodapé
    ├── sections.css  # Hero, projetos, especialidades, stack e contato
    └── responsive.css # Regras para tablet, celular e menos movimento

scripts/
└── validate-responsive.mjs # Validação automática dos breakpoints no navegador
```

O arquivo `src/styles/global.css` é somente o ponto de entrada que importa os módulos na ordem correta.

## Validação responsiva

Execute a validação visual automática com:

```bash
npm run validate:responsive
```

O teste inicia o Astro, abre o site no Chrome com Playwright e verifica as larguras **320px, 375px, 768px, 1024px e 1440px**. Ele reprova scroll horizontal e mudanças inesperadas no menu ou na grade de projetos. As cinco screenshots e o relatório JSON ficam em `artifacts/responsive/`, diretório que já está ignorado pelo Git.

## Personalizar o conteúdo

Edite [`src/data/site.ts`](src/data/site.ts) para atualizar:

- Nome, localização e redes sociais;
- Especialidades e tecnologias;
- Projetos em destaque;
- Stack atual.

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
