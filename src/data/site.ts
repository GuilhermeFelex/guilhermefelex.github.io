/**
 * Dados compartilhados pelos dois idiomas. Os textos da página ficam em src/i18n/content.ts.
 */
export const site = {
  name: 'Felex',
  fullName: 'Guilherme Felex',
  // Marca comercial: o site vende os serviços da FelexTech; o nome pessoal aparece como fundador.
  brand: 'FelexTech',
  email: 'guilherme.felex@hotmail.com',
  social: {
    github: 'https://github.com/GuilhermeFelex',
    linkedin: 'https://www.linkedin.com/in/guilhermefelex/',
    instagram: 'https://www.instagram.com/felextech'
  },
  /**
   * Analytics sem cookies (GoatCounter). Crie o site em goatcounter.com e informe só o código,
   * por exemplo 'felextech' para felextech.goatcounter.com. Vazio desativa o script.
   */
  goatcounter: ''
};

// Ícones monocromáticos na grade; a cor da marca aparece somente no hover.
export const stack = [
  { name: 'Python', icon: 'simple-icons:python', color: '#ffd43b' },
  { name: 'Next.js', icon: 'simple-icons:nextdotjs', color: '#e7eef2' },
  { name: 'React', icon: 'simple-icons:react', color: '#61dafb' },
  { name: 'TypeScript', icon: 'simple-icons:typescript', color: '#3178c6' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql', color: '#5d99c7' },
  { name: 'Supabase', icon: 'simple-icons:supabase', color: '#3ecf8e' },
  { name: 'Docker', icon: 'simple-icons:docker', color: '#2496ed' },
  { name: 'n8n', icon: 'simple-icons:n8n', color: '#ea4b71' },
  { name: 'OpenAI', icon: 'simple-icons:openai', color: '#e7eef2' },
  { name: 'UiPath', icon: 'simple-icons:uipath', color: '#fa4616' },
  { name: 'Power Platform', icon: 'power-platform', color: '#2fb5a0' },
  { name: 'AWS', icon: 'simple-icons:amazonwebservices', color: '#ff9900' }
];
