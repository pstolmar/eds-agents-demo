/**
 * Hero Video Block — renders dual Vimeo iframes (desktop + mobile)
 * with text overlay. Expects block rows: [desktop-url, mobile-url, headline, subheadline, cta]
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const desktopUrl = rows[0]?.textContent.trim() || '';
  const mobileUrl = rows[1]?.textContent.trim() || desktopUrl;
  const headline = rows[2]?.textContent.trim() || '';
  const ctaRow = rows[3];
  const ctaLink = ctaRow?.querySelector('a');
  const ctaText = ctaLink?.textContent.trim() || ctaRow?.textContent.trim() || '';
  const ctaHref = ctaLink?.href || '#';

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-video-wrapper';

  wrapper.innerHTML = `
    <div class="hero-video-bg">
      <div class="hero-video-overlay"></div>
      <iframe class="hero-video-desktop" src="${desktopUrl}"
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>
      <iframe class="hero-video-mobile" src="${mobileUrl}"
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>
    </div>
    <div class="hero-video-content">
      ${headline ? `<h1>${headline}</h1>` : ''}
      ${ctaText ? `<a href="${ctaHref}" class="hero-video-cta">${ctaText}</a>` : ''}
    </div>
  `;

  block.appendChild(wrapper);
}
