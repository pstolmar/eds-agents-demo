import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-media-image';
      } else {
        div.className = 'cards-media-body';
      }
    });
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
