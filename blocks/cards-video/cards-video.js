import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-video-image';
      } else {
        div.className = 'cards-video-body';
      }
    });

    // Add play button overlay to image area
    const imageDiv = li.querySelector('.cards-video-image');
    if (imageDiv) {
      const overlay = document.createElement('div');
      overlay.className = 'cards-video-play-overlay';
      overlay.innerHTML = '<span class="cards-video-play-icon"></span>';
      imageDiv.appendChild(overlay);
    }

    // Style the duration badge
    const body = li.querySelector('.cards-video-body');
    if (body) {
      const paragraphs = body.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (/^\d+:\d{2}$/.test(text)) {
          p.className = 'cards-video-duration';
        }
      });
    }

    // Make card clickable if there's a link
    const link = li.querySelector('a');
    if (link) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          link.click();
        }
      });
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const src = img.src || img.getAttribute('src');
    try {
      const url = new URL(src, window.location.href);
      if (url.origin === window.location.origin) {
        img.closest('picture').replaceWith(
          createOptimizedPicture(src, img.alt, false, [{ width: '750' }]),
        );
      }
    } catch {
      // keep original image for invalid URLs
    }
  });
  block.replaceChildren(ul);
}
