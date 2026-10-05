import type { Lang } from './ui';

/**
 * Textos da página por idioma. O português define o formato; o inglês precisa ter as mesmas chaves.
 * Dados que não mudam com o idioma (email, redes, stack) ficam em src/data/site.ts.
 *
 * Sistemas corporativos aparecem com nomes descritivos (ex.: "sistema de logística rodoviária"),
 * nunca pelo nome interno do produto.
 */
const pt = {
  meta: {
    title: 'FelexTech | Guilherme Felex — Integração, Automação e IA',
    description: 'FelexTech, por Guilherme Felex: automação, integrações, sistemas internos e IA aplicada. Serviços para empresas e trajetória para recrutadores.',
    imageAlt: 'FelexTech — Integração, Automação e IA',
    role: 'Analista de Dados e Automação Sênior'
  },
  skipLink: 'Ir para o conteúdo',
  header: {
    brandLabel: 'FelexTech — voltar ao início',
    menu: 'Menu',
    navLabel: 'Navegação principal',
    nav: { about: 'Sobre', services: 'Serviços', projects: 'Projetos', career: 'Trajetória', contact: 'Contato' },
    switchLabel: 'Read this page in English'
  },
  hero: {
    kicker: 'Integração · Automação · IA',
    location: 'São Paulo, Brasil',
    titleStart: 'Automação e integrações que',
    titleAccent: 'tiram o trabalho manual',
    titleEnd: 'da sua operação.',
    lead: 'Pela FelexTech, ajudo empresas a conectar sistemas, automatizar rotinas e aplicar IA em processos que ainda dependem de trabalho manual. São mais de 4 anos fazendo isso em siderurgia, mineração, agronegócio e banco digital.',
    ctaPrimary: 'Ver serviços',
    ctaSecondary: 'Trajetória'
  },
  diagram: {
    label: 'Diagrama: ERP/SAP, planilhas e WhatsApp conectados por orquestração com n8n e IA a sistemas e painéis',
    inputs: 'entradas',
    orchestration: 'orquestração',
    outputs: 'saídas',
    inputNodes: ['ERP / SAP', 'Planilhas', 'WhatsApp'],
    outputNodes: ['Sistemas', 'Painéis'],
    core: 'IA',
    coreSub: 'n8n · agentes',
    footnote: 'regras · aprovação · rastreabilidade'
  },
  about: {
    label: 'Sobre',
    lead: 'Tecnologia só importa quando resolve o que está travando a operação.',
    introBefore: 'Sou ',
    introAfter: ', desenvolvedor de automação e integrações há mais de 4 anos. Trabalho entre negócio e engenharia: conecto ERPs, planilhas, APIs e modelos de IA para tirar trabalho manual da operação, tanto em grandes empresas quanto em projetos pela FelexTech.',
    body: 'Meu trabalho começa entendendo o processo — mapeando, documentando e conversando com quem opera — e termina com uma solução em produção que as pessoas conseguem usar, manter e evoluir.'
  },
  services: {
    label: 'Serviços',
    title: 'O que a FelexTech entrega.',
    intro: 'Projetos sob medida para empresas que querem tirar trabalho manual da operação, do diagnóstico à solução em produção.',
    tagsLabel: 'Tecnologias de',
    deliverablesLabel: 'Entregas de',
    items: [
      {
        icon: 'lucide:workflow',
        title: 'Automação',
        description: 'Robôs que tiram da equipe o trabalho repetitivo em ERPs, planilhas e portais.',
        deliverables: ['Robôs em Python ou UiPath, com logs e evidências', 'Lançamentos no SAP e em portais a partir de planilhas'],
        tags: ['RPA', 'UiPath', 'Python', 'Power Automate']
      },
      {
        icon: 'lucide:cable',
        title: 'Integrações',
        description: 'Sistemas que conversam entre si, sem retrabalho nem copia e cola.',
        deliverables: ['Fluxos n8n versionados e monitorados', 'APIs e webhooks seguros para parceiros'],
        tags: ['APIs', 'n8n', 'Webhooks', 'SAP', 'WhatsApp']
      },
      {
        icon: 'lucide:app-window',
        title: 'Sistemas internos',
        description: 'Aplicações web sob medida para o que planilha e e-mail já não dão conta.',
        deliverables: ['Login com MFA, perfis de acesso e auditoria', 'Deploy em nuvem com CI/CD'],
        tags: ['Next.js', 'React', 'tRPC', 'PostgreSQL']
      },
      {
        icon: 'lucide:brain-circuit',
        title: 'IA aplicada',
        description: 'IA conectada aos seus dados e regras, com controle sobre o que ela pode responder.',
        deliverables: ['Assistentes com RAG sobre a sua base de conhecimento', 'Consultas aos seus dados com acesso controlado'],
        tags: ['RAG', 'Agentes', 'MCP', 'OpenAI']
      }
    ],
    processLabel: 'Como trabalho',
    process: [
      { title: 'Diagnóstico', text: 'Entendo o processo com quem opera e defino o que vale automatizar.' },
      { title: 'Proposta', text: 'Escopo, prazo e critério de pronto combinados antes de começar.' },
      { title: 'Entrega', text: 'Versões curtas, validadas com o time, até chegar à produção.' },
      { title: 'Evolução', text: 'Documentação e passagem de conhecimento para o time manter e evoluir.' }
    ]
  },
  projects: {
    label: 'Projetos',
    title: 'Soluções para operações reais.',
    intro: 'Quatro casos recentes, do mapeamento ao deploy. A maior parte do código é corporativa e privada, por isso os sistemas aparecem com nomes descritivos.',
    highlightsLabel: 'Destaques de',
    items: [
      {
        number: '01',
        title: 'Sistemas internos',
        context: 'Mineração · 2026',
        description: 'Sistema de gestão laboratorial que rastreia lotes, amostras, medições e aprovações, construído sobre um template próprio reutilizado pelo time.',
        highlights: [
          'MFA, controle de acesso por perfil e auditoria no banco',
          '40 migrations SQL versionadas e leitura por views',
          'Docker, Nginx e CI para homologação e produção'
        ],
        tags: ['Next.js', 'tRPC', 'PostgreSQL', 'Supabase Auth']
      },
      {
        number: '02',
        title: 'Framework de RPA',
        context: 'Mineração · 2025–2026',
        description: 'Padrão corporativo de robôs em Python e automações fiscais no SAP Business One, depois de liderar um programa de RPA na CSN.',
        highlights: [
          'Fila de itens, retry, logs e evidências em caso de erro',
          'Lançamento de CT-e e fechamento de pedidos a partir de planilhas',
          'Qualidade com testes, tipagem e lint'
        ],
        tags: ['Python', 'UiPath', 'SAP B1', 'OCR']
      },
      {
        number: '03',
        title: 'Integrações',
        context: 'Mineração · 2026',
        description: 'n8n como hub de integrações da área, com fluxos versionados e uma API B2B para parceiros externos.',
        highlights: [
          'Backup versionado de workflows com diff e alertas no Teams',
          'Canal de denúncias via WhatsApp como máquina de estados',
          'API B2B com OAuth 2.0, webhooks assinados e rastreio por request'
        ],
        tags: ['n8n', 'WhatsApp', 'Fastify', 'AWS']
      },
      {
        number: '04',
        title: 'IA aplicada',
        context: 'FelexTech · 2026',
        description: 'RAG supervisionado para conhecimento contábil e tributário, que prefere não responder a responder errado.',
        highlights: [
          'Busca híbrida, léxica e vetorial, com pgvector',
          'Abstenção segura em cálculos tributários conclusivos',
          'API FastAPI validada com 100 cenários de teste'
        ],
        tags: ['RAG', 'pgvector', 'FastAPI', 'Python']
      }
    ],
    contributionsLabel: 'Também contribuí em',
    contributions: [
      'plataforma SaaS de CRM com WhatsApp e IA (frontend React)',
      'sistema de logística rodoviária',
      'plataforma de dados com Airflow e dbt'
    ],
    evidence: 'Experimentos e projetos públicos no'
  },
  career: {
    label: 'Trajetória',
    title: 'Da automação de tela à arquitetura de sistemas.',
    items: [
      {
        period: '2025 — hoje',
        company: 'Sigma Lithium',
        role: 'Analista de Dados e Automação Sênior',
        description: 'Lidero inovação e a estratégia de IA da área: n8n como hub de integrações, sistemas internos, RPA em Python e CI/CD.'
      },
      {
        period: '2024 — 2025',
        company: 'Nubank',
        role: 'RPA Software Engineer',
        description: 'Automações com UiPath, Python e Zapier, ferramentas internas para o time de desenvolvimento e IA para extrair dados não estruturados.'
      },
      {
        period: '2023 — 2024',
        company: 'Biti9',
        role: 'Desenvolvedor RPA',
        description: 'Automações em UiPath e Python para um time dedicado a um cliente do agronegócio, com extração e lançamento de dados no SAP.'
      },
      {
        period: '2022 — 2023',
        company: 'CSN',
        role: 'Analista de TI · Estagiário',
        description: 'Responsável pelo programa de RPA: coordenei uma equipe terceira com Scrum e code review e cuidei de contrato e RFP.'
      }
    ],
    educationLabel: 'Formação',
    education: [
      'Análise e Desenvolvimento de Sistemas — Cruzeiro do Sul Virtual, 2023',
      'Técnico em Mecatrônica — Senai São Paulo, 2020'
    ],
    certificationsLabel: 'Certificações',
    certifications: ['UiPath RPA Developer', 'UiPath RPA Business Analyst', 'Power Platform Digital Belt', 'Scrum (Certiprof)'],
    languagesLabel: 'Idiomas',
    languages: 'Português nativo; inglês e espanhol do básico ao intermediário',
    linkedinCta: 'Perfil completo no LinkedIn',
    cvCta: 'Baixar currículo (PDF)'
  },
  stack: {
    label: 'Stack atual'
  },
  cv: {
    title: 'Currículo — Guilherme Felex',
    description: 'Currículo de Guilherme Felex: automação, integrações, sistemas internos e IA aplicada.',
    summary: 'Resumo',
    experience: 'Experiência',
    projects: 'Projetos selecionados',
    skills: 'Competências',
    location: 'São Paulo, Brasil'
  },
  contact: {
    eyebrow: 'Disponível para projetos e oportunidades',
    title: 'Tem um processo que pode funcionar melhor?',
    lead: 'Vamos conversar sobre o problema antes de falar sobre a ferramenta.',
    clients: {
      title: 'Para empresas',
      text: 'Conte qual processo trava a sua operação e marcamos uma conversa de diagnóstico.',
      cta: 'Falar sobre um projeto',
      subject: 'Projeto FelexTech'
    },
    recruiters: {
      title: 'Para recrutadores',
      text: 'Aberto a posições em automação, integrações e IA aplicada. A trajetória completa está no LinkedIn.',
      cta: 'Ver perfil no LinkedIn',
      emailCta: 'Enviar uma oportunidade',
      subject: 'Oportunidade de trabalho'
    },
    copy: 'Copiar',
    copied: 'Copiado',
    copiedStatus: 'Email copiado para a área de transferência.',
    copyFailed: 'Selecionado',
    copyFailedStatus: 'Não foi possível copiar. O email ficou selecionado; use Ctrl+C.',
    emailFallback: 'guilherme.felex [arroba] hotmail.com',
    remote: 'disponível para trabalho remoto'
  },
  footer: {
    slogan: 'Construir. Integrar. Automatizar.',
    backToTop: 'Voltar ao topo'
  }
};

export type Content = typeof pt;

const en: Content = {
  meta: {
    title: 'FelexTech | Guilherme Felex — Integration, Automation & AI',
    description: 'FelexTech by Guilherme Felex: automation, integrations, internal systems and applied AI. Services for companies and a career track for recruiters.',
    imageAlt: 'FelexTech — Integration, Automation and AI',
    role: 'Senior Data and Automation Analyst'
  },
  skipLink: 'Skip to content',
  header: {
    brandLabel: 'FelexTech — back to top',
    menu: 'Menu',
    navLabel: 'Main navigation',
    nav: { about: 'About', services: 'Services', projects: 'Projects', career: 'Career', contact: 'Contact' },
    switchLabel: 'Ler esta página em português'
  },
  hero: {
    kicker: 'Integration · Automation · AI',
    location: 'São Paulo, Brazil',
    titleStart: 'Automation and integrations that',
    titleAccent: 'take manual work',
    titleEnd: 'out of your operations.',
    lead: 'Through FelexTech, I help companies connect systems, automate routines and apply AI to processes that still rely on manual work. I have been doing this for more than 4 years in steel, mining, agribusiness and digital banking.',
    ctaPrimary: 'See services',
    ctaSecondary: 'Career'
  },
  diagram: {
    label: 'Diagram: ERP/SAP, spreadsheets and WhatsApp connected through n8n and AI orchestration to systems and dashboards',
    inputs: 'inputs',
    orchestration: 'orchestration',
    outputs: 'outputs',
    inputNodes: ['ERP / SAP', 'Spreadsheets', 'WhatsApp'],
    outputNodes: ['Systems', 'Dashboards'],
    core: 'AI',
    coreSub: 'n8n · agents',
    footnote: 'rules · approval · traceability'
  },
  about: {
    label: 'About',
    lead: 'Technology only matters when it unblocks the operation.',
    introBefore: "I'm ",
    introAfter: ', an automation and integration developer with more than 4 years of experience. I work between business and engineering: I connect ERPs, spreadsheets, APIs and AI models to take manual work out of operations, both at large companies and in FelexTech projects.',
    body: 'My work starts by understanding the process — mapping it, documenting it and talking to the people who run it — and ends with a production solution people can actually use, maintain and evolve.'
  },
  services: {
    label: 'Services',
    title: 'What FelexTech delivers.',
    intro: 'Tailored projects for companies that want to take manual work out of their operations, from diagnosis to a solution in production.',
    tagsLabel: 'Technologies for',
    deliverablesLabel: 'Deliverables for',
    items: [
      {
        icon: 'lucide:workflow',
        title: 'Automation',
        description: 'Bots that take repetitive work in ERPs, spreadsheets and portals off your team.',
        deliverables: ['Python or UiPath bots with logs and evidence', 'SAP and portal entries driven by spreadsheets'],
        tags: ['RPA', 'UiPath', 'Python', 'Power Automate']
      },
      {
        icon: 'lucide:cable',
        title: 'Integrations',
        description: 'Systems that talk to each other, with no rework and no copy-paste.',
        deliverables: ['Versioned, monitored n8n workflows', 'Secure APIs and webhooks for partners'],
        tags: ['APIs', 'n8n', 'Webhooks', 'SAP', 'WhatsApp']
      },
      {
        icon: 'lucide:app-window',
        title: 'Internal systems',
        description: 'Custom web applications for what spreadsheets and email can no longer handle.',
        deliverables: ['MFA login, access profiles and auditing', 'Cloud deployment with CI/CD'],
        tags: ['Next.js', 'React', 'tRPC', 'PostgreSQL']
      },
      {
        icon: 'lucide:brain-circuit',
        title: 'Applied AI',
        description: 'AI connected to your data and rules, with control over what it is allowed to answer.',
        deliverables: ['RAG assistants over your knowledge base', 'Data queries with controlled access'],
        tags: ['RAG', 'Agents', 'MCP', 'OpenAI']
      }
    ],
    processLabel: 'How I work',
    process: [
      { title: 'Diagnosis', text: 'I map the process with the people who run it and define what is worth automating.' },
      { title: 'Proposal', text: 'Scope, timeline and definition of done agreed before we start.' },
      { title: 'Delivery', text: 'Short iterations, validated with your team, all the way to production.' },
      { title: 'Evolution', text: 'Documentation and knowledge transfer so your team can maintain and evolve it.' }
    ]
  },
  projects: {
    label: 'Projects',
    title: 'Solutions for real operations.',
    intro: 'Four recent cases, from process mapping to deployment. Most of the code is corporate and private, so systems are described rather than named.',
    highlightsLabel: 'Highlights of',
    items: [
      {
        number: '01',
        title: 'Internal systems',
        context: 'Mining · 2026',
        description: 'A laboratory management system that tracks batches, samples, measurements and approvals, built on an in-house template the team reuses.',
        highlights: [
          'MFA, role-based access control and database auditing',
          '40 versioned SQL migrations and view-based reads',
          'Docker, Nginx and CI for staging and production'
        ],
        tags: ['Next.js', 'tRPC', 'PostgreSQL', 'Supabase Auth']
      },
      {
        number: '02',
        title: 'RPA framework',
        context: 'Mining · 2025–2026',
        description: 'A corporate standard for Python bots and tax automations in SAP Business One, after leading an RPA program at CSN.',
        highlights: [
          'Work-item queue, retries, logs and evidence on failure',
          'Freight invoice entry and order closing from spreadsheets',
          'Quality gates with tests, typing and linting'
        ],
        tags: ['Python', 'UiPath', 'SAP B1', 'OCR']
      },
      {
        number: '03',
        title: 'Integrations',
        context: 'Mining · 2026',
        description: 'n8n as the team’s integration hub, with versioned workflows and a B2B API for external partners.',
        highlights: [
          'Versioned workflow backups with diffs and Teams alerts',
          'WhatsApp whistleblowing channel built as a state machine',
          'B2B API with OAuth 2.0, signed webhooks and request tracing'
        ],
        tags: ['n8n', 'WhatsApp', 'Fastify', 'AWS']
      },
      {
        number: '04',
        title: 'Applied AI',
        context: 'FelexTech · 2026',
        description: 'Supervised RAG for accounting and tax knowledge that would rather not answer than answer wrong.',
        highlights: [
          'Hybrid lexical and vector search with pgvector',
          'Safe abstention on conclusive tax calculations',
          'FastAPI service validated against 100 test scenarios'
        ],
        tags: ['RAG', 'pgvector', 'FastAPI', 'Python']
      }
    ],
    contributionsLabel: 'Also contributed to',
    contributions: [
      'a SaaS CRM platform with WhatsApp and AI (React frontend)',
      'a road logistics system',
      'a data platform with Airflow and dbt'
    ],
    evidence: 'Public experiments and projects on'
  },
  career: {
    label: 'Career',
    title: 'From screen automation to systems architecture.',
    items: [
      {
        period: '2025 — now',
        company: 'Sigma Lithium',
        role: 'Senior Data and Automation Analyst',
        description: 'I lead innovation and the team’s AI strategy: n8n as the integration hub, internal systems, Python RPA and CI/CD.'
      },
      {
        period: '2024 — 2025',
        company: 'Nubank',
        role: 'RPA Software Engineer',
        description: 'Automations with UiPath, Python and Zapier, internal tools for the development team and AI to extract unstructured data.'
      },
      {
        period: '2023 — 2024',
        company: 'Biti9',
        role: 'RPA Developer',
        description: 'UiPath and Python automations for a team dedicated to an agribusiness client, extracting and entering data in SAP.'
      },
      {
        period: '2022 — 2023',
        company: 'CSN',
        role: 'IT Analyst · Intern',
        description: 'Owned the RPA program: coordinated an outsourced team with Scrum and code review, and handled contracts and RFPs.'
      }
    ],
    educationLabel: 'Education',
    education: [
      'Systems Analysis and Development — Cruzeiro do Sul Virtual, 2023',
      'Mechatronics Technician — Senai São Paulo, 2020'
    ],
    certificationsLabel: 'Certifications',
    certifications: ['UiPath RPA Developer', 'UiPath RPA Business Analyst', 'Power Platform Digital Belt', 'Scrum (Certiprof)'],
    languagesLabel: 'Languages',
    languages: 'Native Portuguese; English and Spanish from basic to intermediate',
    linkedinCta: 'Full profile on LinkedIn',
    cvCta: 'Download résumé (PDF)'
  },
  stack: {
    label: 'Current stack'
  },
  cv: {
    title: 'Résumé — Guilherme Felex',
    description: 'Résumé of Guilherme Felex: automation, integrations, internal systems and applied AI.',
    summary: 'Summary',
    experience: 'Experience',
    projects: 'Selected projects',
    skills: 'Skills',
    location: 'São Paulo, Brazil'
  },
  contact: {
    eyebrow: 'Available for projects and opportunities',
    title: 'Have a process that could work better?',
    lead: "Let's talk about the problem before talking about the tool.",
    clients: {
      title: 'For companies',
      text: 'Tell me which process is holding your operation back and we will set up a diagnosis call.',
      cta: 'Talk about a project',
      subject: 'FelexTech project'
    },
    recruiters: {
      title: 'For recruiters',
      text: 'Open to roles in automation, integrations and applied AI. My full career is on LinkedIn.',
      cta: 'See LinkedIn profile',
      emailCta: 'Send an opportunity',
      subject: 'Job opportunity'
    },
    copy: 'Copy',
    copied: 'Copied',
    copiedStatus: 'Email copied to clipboard.',
    copyFailed: 'Selected',
    copyFailedStatus: 'Could not copy. The email is selected; press Ctrl+C.',
    emailFallback: 'guilherme.felex [at] hotmail.com',
    remote: 'available for remote work'
  },
  footer: {
    slogan: 'Build. Integrate. Automate.',
    backToTop: 'Back to top'
  }
};

export const content: Record<Lang, Content> = { pt, en };
