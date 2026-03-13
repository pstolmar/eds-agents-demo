import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && (div.querySelector('picture') || div.querySelector('img'))) {
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

  /* Generate colorful placeholder for broken video thumbnails */
  const gradients = [
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
    'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    'linear-gradient(135deg, #0d324d 0%, #7f5a83 100%)',
    'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  ];
  function markVideoMissing(wrapper, idx) {
    wrapper.classList.add('cards-video-missing');
    wrapper.style.background = gradients[idx % gradients.length];
  }
  ul.querySelectorAll('.cards-video-image').forEach((wrapper, idx) => {
    const img = wrapper.querySelector('img');
    if (!img) return;
    const src = img.getAttribute('src') || '';
    if (src === 'about:error' || src === '') {
      markVideoMissing(wrapper, idx);
    } else {
      img.addEventListener('error', () => markVideoMissing(wrapper, idx));
    }
  });

  /* Undo EDS button decoration on links inside card bodies */
  ul.querySelectorAll('.cards-video-body .button-container').forEach((bc) => {
    const a = bc.querySelector('a');
    if (a) {
      a.classList.remove('button', 'primary', 'secondary');
      const p = document.createElement('p');
      p.appendChild(a);
      bc.replaceWith(p);
    }
  });
}
