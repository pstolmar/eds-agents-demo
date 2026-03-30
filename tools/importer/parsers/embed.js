/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed block.
 * Base: embed. Source: deloitte.com/us/en.html
 * Source selector: .cmp-video__homepage
 * Source DOM structure:
 *   .cmp-video.cmp-video__homepage
 *     .cmp-video__container-video
 *       video > source[src="...mpd"]
 *     .cmp-video__container-text
 *       .cmp-title > .cmp-title__text (h2 heading)
 *       .cmp-video__cta > a (CTA link)
 *
 * Block library structure (embed):
 * Single row with 1 cell containing a link to the video URL.
 */
export default function parse(element, { document }) {
  // Extract video source URL from video element or iframe
  const videoSource = element.querySelector('video source');
  const iframe = element.querySelector('iframe');
  let videoUrl = '';

  if (videoSource) {
    videoUrl = videoSource.getAttribute('src') || '';
  } else if (iframe) {
    videoUrl = iframe.getAttribute('src') || '';
    // Convert Vimeo/YouTube embed URLs
    const vimeoMatch = videoUrl.match(/player\.vimeo\.com\/video\/(\d+)/);
    const ytMatch = videoUrl.match(/youtube\.com\/embed\/([^?&]+)/);
    if (vimeoMatch) videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
    else if (ytMatch) videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
  }

  if (!videoUrl) return;

  const cells = [];
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  cells.push([[link]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
