/*
 * ExMod Fast — Restructures flat content into visual sections
 * matching the slow source page layout. Runs after EDS decoration.
 */

export default function init() {
  const main = document.querySelector('main');
  if (!main) return;

  const wrapper = main.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Remove literal "style" / "dark" text from section-metadata that leaked through
  [...wrapper.querySelectorAll('p')].forEach((p) => {
    const t = p.textContent.trim();
    if (t === 'style' || t === 'dark' || t === 'Title' || t === 'Description'
      || t.startsWith('ExMod Fast Demo') || t.startsWith('Same content as the slow demo')) {
      p.remove();
    }
  });

  // Collect all child nodes into an array
  const nodes = [...wrapper.children];

  // Helper: create a section div
  function makeSection(cls) {
    const s = document.createElement('div');
    s.className = `em-section ${cls || ''}`;
    return s;
  }

  // Helper: find node index by text content match
  function findIndex(startFrom, test) {
    for (let i = startFrom; i < nodes.length; i += 1) {
      if (test(nodes[i])) return i;
    }
    return -1;
  }

  // 1. Hero: everything up to the first h2 (the "48" stat)
  const firstH2Idx = findIndex(0, (n) => n.tagName === 'H2' && /^\d/.test(n.textContent.trim()));
  const hero = makeSection('em-hero');
  for (let i = 0; i < (firstH2Idx > 0 ? firstH2Idx : 5); i += 1) {
    if (nodes[i]) hero.appendChild(nodes[i].cloneNode(true));
  }

  // Put CTAs side by side
  const heroButtons = hero.querySelectorAll('.button-container');
  if (heroButtons.length >= 2) {
    const btnRow = document.createElement('div');
    btnRow.className = 'em-hero-actions';
    heroButtons.forEach((bc) => btnRow.appendChild(bc));
    const lede = hero.querySelector('p:not(.button-container):not(:has(em))');
    if (lede) lede.after(btnRow);
  }

  // 2. Stats: collect h2+p pairs for numbers
  const stats = makeSection('em-stats');
  const statsGrid = document.createElement('div');
  statsGrid.className = 'em-stats-grid';
  let i = firstH2Idx > 0 ? firstH2Idx : 5;
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'H2' && /^(\d|Fast)/.test(n.textContent.trim())) {
      const card = document.createElement('div');
      card.className = 'em-stat-card';
      card.appendChild(n.cloneNode(true));
      if (nodes[i + 1] && nodes[i + 1].tagName === 'P') {
        card.appendChild(nodes[i + 1].cloneNode(true));
        i += 2;
      } else {
        i += 1;
      }
      statsGrid.appendChild(card);
    } else {
      break;
    }
  }
  stats.appendChild(statsGrid);

  // 3. Intro section: "Why this page is fast" + "Demo objective"
  const intro = makeSection('em-intro');
  const introLeft = document.createElement('div');
  const introRight = document.createElement('div');
  introRight.className = 'em-callout';
  let inRight = false;
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'H3' && n.textContent.includes('Demo objective')) {
      inRight = true;
    }
    if (n.tagName === 'P' && n.querySelector('em') && !n.textContent.includes('Why')) {
      break; // Next section eyebrow
    }
    if (n.tagName === 'H2' && !n.textContent.includes('Same content')) {
      break;
    }
    if (inRight) {
      introRight.appendChild(n.cloneNode(true));
    } else {
      introLeft.appendChild(n.cloneNode(true));
    }
    i += 1;
  }
  intro.appendChild(introLeft);
  intro.appendChild(introRight);

  // 4. Offers section
  const offers = makeSection('em-offers');
  // Find "Offer grid" eyebrow
  const offerStart = findIndex(i, (n) => n.querySelector && n.querySelector('em') && n.textContent.includes('Offer grid'));
  if (offerStart >= 0) i = offerStart;
  // Collect eyebrow, h2, description
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'P' && n.querySelector('img')) break; // First card image
    offers.appendChild(n.cloneNode(true));
    i += 1;
  }
  // Collect cards (img + strong title + description + link, repeating)
  const grid = document.createElement('div');
  grid.className = 'em-card-grid';
  let card = null;
  while (i < nodes.length) {
    const n = nodes[i];
    // New eyebrow = new section
    if (n.tagName === 'P' && n.querySelector('em') && !n.querySelector('img') && !n.querySelector('strong')) break;
    if (n.tagName === 'H2') break;

    if (n.tagName === 'P' && n.querySelector('img')) {
      // Start new card
      if (card) grid.appendChild(card);
      card = document.createElement('div');
      card.className = 'em-card';
      const img = n.querySelector('img');
      if (img) {
        const media = document.createElement('div');
        media.className = 'em-card-media';
        media.appendChild(img.cloneNode(true));
        card.appendChild(media);
      }
      const body = document.createElement('div');
      body.className = 'em-card-body';
      card.appendChild(body);
    } else if (card) {
      card.querySelector('.em-card-body').appendChild(n.cloneNode(true));
    }
    i += 1;
  }
  if (card) grid.appendChild(card);
  offers.appendChild(grid);

  // 5. Proof points section
  const proof = makeSection('em-split');
  const proofLeft = document.createElement('div');
  const proofRight = document.createElement('div');
  proofRight.className = 'em-quote-card';
  let inQuote = false;
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'P' && n.querySelector('em') && n.textContent.includes('FAQ')) break;
    if (n.tagName === 'H3' && n.textContent.includes('goal is not')) {
      inQuote = true;
    }
    if (inQuote) {
      proofRight.appendChild(n.cloneNode(true));
    } else {
      proofLeft.appendChild(n.cloneNode(true));
    }
    i += 1;
  }
  proof.appendChild(proofLeft);
  proof.appendChild(proofRight);

  // 6. FAQ section
  const faq = makeSection('em-faq');
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'P' && n.querySelector('em') && n.textContent.includes('Next step')) break;
    if (n.tagName === 'H3') {
      const item = document.createElement('div');
      item.className = 'em-faq-item';
      item.appendChild(n.cloneNode(true));
      // Collect following p
      if (nodes[i + 1] && nodes[i + 1].tagName === 'P') {
        item.appendChild(nodes[i + 1].cloneNode(true));
        i += 2;
      } else {
        i += 1;
      }
      faq.appendChild(item);
    } else {
      faq.appendChild(n.cloneNode(true));
      i += 1;
    }
  }

  // 7. CTA band
  const cta = makeSection('em-cta-band');
  const ctaLeft = document.createElement('div');
  while (i < nodes.length) {
    const n = nodes[i];
    if (n.tagName === 'P' && n.querySelector('a.button')) {
      cta.appendChild(ctaLeft);
      cta.appendChild(n.cloneNode(true));
      i += 1;
      break;
    }
    ctaLeft.appendChild(n.cloneNode(true));
    i += 1;
  }
  if (!cta.children.length && ctaLeft.children.length) cta.appendChild(ctaLeft);

  // 8. Footer
  const footer = document.createElement('div');
  footer.className = 'em-section em-footer';
  footer.innerHTML = '<div>ExMod fast demo artifact</div><div>Built only for side-by-side modernization demos</div>';

  // Replace the flat content with structured sections
  wrapper.innerHTML = '';
  [hero, stats, intro, offers, proof, faq, cta, footer].forEach((s) => {
    if (s.children.length > 0) wrapper.appendChild(s);
  });
}
