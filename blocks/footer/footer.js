import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const isWmEds2 = window.location.pathname.includes('/wm-eds/2/');

  let footerPath;
  if (footerMeta) {
    footerPath = new URL(footerMeta, window.location).pathname;
  } else if (isWmEds2) {
    footerPath = '/content/wm-eds/2/footer';
  } else {
    footerPath = '/footer';
  }

  let fragment = await loadFragment(footerPath);
  if (!fragment) fragment = await loadFragment(`/content${footerPath}`);

  block.textContent = '';
  const footer = document.createElement('div');

  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  } else {
    /* Fallback: Walmart-branded footer when no fragment is available */
    footer.innerHTML = `<div class="default-content-wrapper">
      <p>Copyright &copy; 2026 Walmart Inc. All rights reserved.</p>
      <p><a href="https://corporate.walmart.com/privacy-security">Privacy &amp; Security</a> / <a href="https://corporate.walmart.com/california-supply-chain-act">California Supply Chain Act</a> / <a href="https://corporate.walmart.com/terms-of-use">Terms of Use</a> / <a href="https://corporate.walmart.com/privacy-security/do-not-sell-my-personal-information">Do Not Sell or Share My Personal Information</a></p>
    </div>`;
  }

  block.append(footer);
}
