export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  if (cols[0]) cols[0].classList.add('promo-banner-image');
  if (cols[1]) cols[1].classList.add('promo-banner-text');

  // Remove button styling from the CTA link and add descriptive aria-label
  const cta = block.querySelector('a.button');
  if (cta) {
    cta.classList.remove('button', 'primary', 'secondary');
    const wrapper = cta.closest('.button-container');
    if (wrapper) wrapper.classList.remove('button-container');

    // Add context to generic "Learn more" link text
    const heading = block.querySelector('h3');
    if (heading && cta.textContent.trim().toLowerCase() === 'learn more') {
      cta.setAttribute('aria-label', `Learn more about ${heading.textContent.trim()}`);
    }
  }
}
