import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
        div.className = 'cards-gallery-image';
      } else {
        div.className = 'cards-gallery-body';
      }
    });
    // Style the asset count badge
    const body = li.querySelector('.cards-gallery-body');
    if (body) {
      const paragraphs = body.querySelectorAll('p');
      if (paragraphs.length >= 2) {
        paragraphs[paragraphs.length - 1].className = 'cards-gallery-asset-count';
      }
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

  /* Detect broken / missing images */
  ul.querySelectorAll('.cards-gallery-image').forEach((wrapper) => {
    const img = wrapper.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src') || '';
    if (src === 'about:error' || src === '') {
      wrapper.classList.add('cards-gallery-missing');
    } else {
      img.addEventListener('error', () => wrapper.classList.add('cards-gallery-missing'));
    }
  });
}
