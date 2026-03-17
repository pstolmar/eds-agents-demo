/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base: hero. Source: corporate.walmart.com/suppliers/investing-in-american-jobs
 * Source selector: .media-hero-2-0
 * Source DOM structure: .media-hero-2 > .title-container-large (headings) + .description-container (text)
 * Background video via YouTube iframe, with text overlay.
 *
 * Block library structure (hero):
 * Row 1: Background image (optional)
 * Row 2: Title + Subheading + CTA (optional)
 */
export default function parse(element, { document }) {
  // Extract background video from Vimeo/YouTube iframe
  // Source: .background-container contains an iframe with the video
  const iframe = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"]');
  let videoUrl = null;
  if (iframe) {
    const src = iframe.getAttribute('src') || '';
    const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const ytMatch = src.match(/youtube\.com\/embed\/([^?]+)/);
    if (vimeoMatch) {
      videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
    } else if (ytMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
    }
  }

  // Extract background image from video poster or any image in the hero
  // Source: .media-hero-2 contains an iframe for video and optional background images
  const bgImage = element.querySelector('img[class*="hero"], img[class*="background"], .media-hero-2 img, img');

  // Extract heading text
  // Source: .title-container-large contains <p> elements with title text
  const titleContainer = element.querySelector('.title-container-large, [class*="title-container"]');
  const headings = titleContainer
    ? Array.from(titleContainer.querySelectorAll('p, h1, h2'))
    : Array.from(element.querySelectorAll('h1, h2, [class*="title"] > p'));

  // Extract description text
  // Source: .description-container contains <p> elements with body text
  const descContainer = element.querySelector('.description-container, [class*="description-container"]');
  const descriptions = descContainer
    ? Array.from(descContainer.querySelectorAll('p'))
    : [];

  // Extract CTA links
  // Source: .content-block-cta-v3 or any anchor links in the hero
  const ctaLinks = Array.from(element.querySelectorAll('a.content-block-cta-v3, a[class*="cta"], a[href]'));

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1: Background image (if available)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + description + CTA)
  const contentCell = [];

  // Combine heading paragraphs into a single h1
  if (headings.length > 0) {
    const h1 = document.createElement('h1');
    h1.textContent = headings.map((h) => h.textContent.trim()).join(' ');
    contentCell.push(h1);
  }

  // Add description paragraphs
  descriptions.forEach((desc) => {
    if (desc.textContent.trim()) {
      contentCell.push(desc);
    }
  });

  // Add video background link (hero.js will detect and convert to iframe)
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    contentCell.push(videoLink);
  }

  // Add CTA links
  ctaLinks.forEach((link) => {
    if (link.textContent.trim() && link.getAttribute('href')) {
      contentCell.push(link);
    }
  });

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
