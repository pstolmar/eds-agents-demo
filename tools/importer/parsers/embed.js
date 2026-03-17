/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block.
 * Base: embed. Source: corporate.walmart.com/suppliers/investing-in-american-jobs
 * Source selector: .video-2\.0
 * Source DOM structure:
 *   .video-2.0
 *     .video-component
 *       .video-wrapper
 *         iframe[src="https://player.vimeo.com/video/{id}?..."]
 *
 * Block library structure (embed):
 * Single row with 1 cell containing a link to the video URL.
 * Vimeo player URLs are converted to clean vimeo.com URLs.
 */
export default function parse(element, { document }) {
  const iframe = element.querySelector('iframe');
  if (!iframe) return;

  let videoUrl = iframe.getAttribute('src') || '';

  // Convert Vimeo player URL to clean URL
  const vimeoMatch = videoUrl.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vimeoMatch) {
    videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
  }

  // Convert YouTube embed URL to clean URL
  const youtubeMatch = videoUrl.match(/youtube\.com\/embed\/([^?&]+)/);
  if (youtubeMatch) {
    videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
  }

  const cells = [];
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  cells.push([[link]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
