/* ═══════════════════════════════════════════════════════
   WKND Visual Effects — Scroll-triggered animations
   Uses IntersectionObserver for performance.
   No external dependencies.
   ═══════════════════════════════════════════════════════ */

/**
 * 1. Homepage Rolodex Carousel — scroll-triggered flip
 */
function initRolodexCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  carousel.classList.add('rolodex-mode');

  const slides = carousel.querySelectorAll('.carousel-slide');
  if (slides.length < 2) return;

  // First slide is always visible
  slides[0].classList.add('rolodex-revealed');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('rolodex-revealed')) {
        entry.target.classList.add('rolodex-revealing');
        entry.target.addEventListener('animationend', () => {
          entry.target.classList.remove('rolodex-revealing');
          entry.target.classList.add('rolodex-revealed');
        }, { once: true });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  slides.forEach((slide, i) => {
    if (i > 0) observer.observe(slide);
  });
}

/**
 * 2. Card Rolodex — scroll-triggered flip-in for list items
 */
function initCardRolodex() {
  const lists = document.querySelectorAll('.default-content-wrapper ul');

  lists.forEach((list) => {
    const items = list.querySelectorAll('li');
    if (items.length < 2) return;

    items.forEach((item) => {
      item.classList.add('card-flip-ready');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.classList.contains('card-flip-ready')) {
          // Stagger: delay based on position in viewport
          const idx = [...entry.target.parentElement.children].indexOf(entry.target);
          const delay = (idx % 4) * 120;

          setTimeout(() => {
            entry.target.classList.remove('card-flip-ready');
            entry.target.classList.add('card-flipping');
            entry.target.addEventListener('animationend', () => {
              entry.target.classList.remove('card-flipping');
              entry.target.classList.add('card-flipped');
            }, { once: true });
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    items.forEach((item) => observer.observe(item));
  });
}

/**
 * 3. Adventures Paint-in Cards — grey to color on scroll
 */
function initPaintInCards() {
  const cards = document.querySelectorAll('.cards > ul > li');
  if (cards.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger the paint-in reveal
        const idx = [...entry.target.parentElement.children].indexOf(entry.target);
        const delay = (idx % 4) * 200;

        setTimeout(() => {
          entry.target.classList.add('paint-revealed');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((card) => observer.observe(card));
}

/**
 * 4. Magazine Filmstrip — collect images, build strip, animate
 */
function initFilmstrip() {
  const main = document.querySelector('main');
  if (!main) return;

  // Collect all images from the page
  const images = [...main.querySelectorAll('img')].filter((img) => {
    const src = img.getAttribute('src') || '';
    return src && !src.includes('icon') && img.naturalWidth > 50;
  });

  if (images.length < 3) return;

  // Create filmstrip container
  const strip = document.createElement('div');
  strip.className = 'wknd-filmstrip';
  strip.setAttribute('aria-label', 'Image filmstrip');

  const track = document.createElement('div');
  track.className = 'wknd-filmstrip-track';

  // Create backdrop + lightbox for hover float
  const backdrop = document.createElement('div');
  backdrop.className = 'wknd-filmstrip-backdrop';

  const lightbox = document.createElement('div');
  lightbox.className = 'wknd-filmstrip-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Image preview');

  const lbImg = document.createElement('img');
  lbImg.alt = 'Preview';
  lightbox.appendChild(lbImg);

  // Double the images for seamless loop
  const allSrcs = images.map((img) => ({
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt') || '',
  }));
  const doubled = [...allSrcs, ...allSrcs];

  doubled.forEach(({ src, alt }) => {
    const frame = document.createElement('div');
    frame.className = 'wknd-filmstrip-frame';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    frame.appendChild(img);

    // Click: float image to center
    frame.addEventListener('click', () => {
      lbImg.src = src;
      lbImg.alt = alt;
      backdrop.classList.add('active');
      lightbox.classList.add('active');
    });

    track.appendChild(frame);
  });

  // Close lightbox
  backdrop.addEventListener('click', () => {
    backdrop.classList.remove('active');
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', () => {
    backdrop.classList.remove('active');
    lightbox.classList.remove('active');
  });

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      backdrop.classList.remove('active');
      lightbox.classList.remove('active');
    }
  });

  strip.appendChild(track);

  // Insert before footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.before(strip);
    document.body.appendChild(backdrop);
    document.body.appendChild(lightbox);
  }
}

/**
 * 5. Magazine Inner Nav
 */
function initInnerNav() {
  // Build inner nav from the page's nav list (Home > Magazine, Adventures, etc.)
  const navList = document.querySelector('main .default-content-wrapper ul:has(> li > ul)');
  if (!navList) return;

  const links = navList.querySelectorAll('a');
  if (links.length < 2) return;

  const nav = document.createElement('nav');
  nav.className = 'wknd-inner-nav';
  nav.setAttribute('aria-label', 'Page navigation');

  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = link.textContent.trim();

    // Mark current page as active
    if (window.location.pathname.includes(a.getAttribute('href').replace('.html', ''))) {
      a.classList.add('active');
    }
    nav.appendChild(a);
  });

  // Remove the original nav list
  navList.remove();

  // Insert inner nav after header
  const firstSection = document.querySelector('main > .section');
  if (firstSection) firstSection.prepend(nav);
}

/**
 * 6. Magazine Cleanup — hide sign-in and extra content
 */
function cleanupMagazine() {
  // Find and remove "Members Only" content and everything after it in the same wrapper
  const allH2s = document.querySelectorAll('main h2');
  allH2s.forEach((h2) => {
    if (h2.textContent.trim() === 'Members Only') {
      // Remove all siblings from this h2 onward within its parent wrapper
      const wrapper = h2.closest('.default-content-wrapper') || h2.parentElement;
      let el = h2;
      const toRemove = [];
      while (el) {
        toRemove.push(el);
        el = el.nextElementSibling;
      }
      toRemove.forEach((node) => node.remove());
      // If wrapper is now empty, remove it
      if (wrapper && !wrapper.textContent.trim()) wrapper.remove();
    }
  });

  // Remove metadata block visual display
  const metadata = document.querySelector('.metadata');
  if (metadata) metadata.closest('.section')?.remove();
}

/**
 * Main initialization — detect page type and apply effects
 */
export default function initWKNDEffects() {
  document.body.classList.add('wknd-page');

  const path = window.location.pathname;

  if (path.includes('/test/wknd/us/en/adventures') || path.includes('/content/test/wknd/us/en/adventures')) {
    // Adventures page: paint-in cards
    initPaintInCards();
  } else if (path.includes('/test/wknd/us/en/magazine') || path.includes('/content/test/wknd/us/en/magazine')) {
    // Magazine page: inner nav first (before cleanup removes nav list), then cleanup, then effects
    initInnerNav();
    cleanupMagazine();
    initPaintInCards();
    // Delay filmstrip to allow images to load
    setTimeout(initFilmstrip, 1500);
  } else if (path.includes('/test/wknd') || path.includes('/content/test/wknd')) {
    // Homepage: rolodex + card animations
    initRolodexCarousel();
    initCardRolodex();
  }
}
