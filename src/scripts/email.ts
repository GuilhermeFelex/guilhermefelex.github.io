/**
 * Monta o email no navegador. O endereço não aparece inteiro no HTML estático, o que dificulta a
 * coleta por robôs de spam. Elementos marcados com `data-mail-user` e `data-mail-domain` recebem:
 * - links: `href` com `mailto:` (e `?subject=` quando houver `data-mail-subject`);
 * - `data-mail-text`: o endereço como texto visível;
 * - `data-copy`: o endereço para o botão de copiar.
 */
export const hydrateEmail = (root: ParentNode = document) => {
  root.querySelectorAll<HTMLElement>('[data-mail-user][data-mail-domain]').forEach((element) => {
    const address = `${element.dataset.mailUser}@${element.dataset.mailDomain}`;
    if (element instanceof HTMLAnchorElement) {
      const subject = element.dataset.mailSubject;
      element.href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
    }
    if ('mailText' in element.dataset) element.textContent = address;
    if ('copy' in element.dataset) element.dataset.copy = address;
  });
};
