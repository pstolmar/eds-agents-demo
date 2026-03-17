/* eslint-disable */
/* global WebImporter */

/**
 * Parser for AEM Forms iframe → embed block.
 * Source selector: iframe[src*="aemform"]
 * Converts server-rendered AEM Form iframes to an EDS embed block.
 */
export default function parse(element, { document }) {
  const src = element.getAttribute('src') || '';
  if (!src) return;

  // Normalise to absolute URL
  const url = src.startsWith('/') ? `https://corporate.walmart.com${src}` : src;

  const cells = [[[url]]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
