/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site cleanup.
 * Removes non-authorable content from WKND AEM pages.
 * Selectors from captured DOM of https://wknd.site/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent dialogs, tracking pixels
    WebImporter.DOMUtils.remove(element, [
      '[class*="consent"]',
      '[class*="cookie"]',
      'img[src*="demdex.net"]',
      'img[src*="2o7.net"]',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome: header, footer, language nav, sign-in, separators
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
      '.wknd-sign-in-buttons',
      '.sign-in-buttons',
      '.cmp-languagenavigation',
      '.cmp-separator',
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean up tracking attributes
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
    element.querySelectorAll('[data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-clickable');
    });
  }
}
