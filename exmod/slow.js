(() => {
  const CONFIG = {
    offerCount: 120,
    faqCount: 28,
    paragraphsPerCard: 3,
    initialBurnMs: 2200,
    secondBurnMs: 1600,
    thrashRounds: 18,
    resizeBurnMs: 500,
  };

  const offerTitles = [
    'Growth platform',
    'Partner acceleration',
    'Experience governance',
    'Regional rollout',
    'Narrative automation',
    'Customer journey refresh',
    'Campaign launch kit',
    'Content velocity package',
    'Modernization advisory',
    'Digital foundation update',
    'Brand consistency system',
    'Authoring optimization'
  ];

  function burn(ms) {
    const end = performance.now() + ms;
    let value = 0;
    while (performance.now() < end) {
      for (let i = 1; i < 900; i += 1) {
        value += Math.sqrt((i * 19) % 17) * Math.sin(i + value);
      }
    }
    return value;
  }

  function svgDataUri(seed) {
    const hue1 = (seed * 37) % 360;
    const hue2 = (seed * 59) % 360;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="hsl(${hue1} 90% 60%)"/>
            <stop offset="100%" stop-color="hsl(${hue2} 80% 45%)"/>
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#g)"/>
        <circle cx="${200 + (seed * 13) % 800}" cy="${140 + (seed * 17) % 400}" r="220" fill="rgba(255,255,255,.18)"/>
        <circle cx="${900 + (seed * 11) % 500}" cy="${280 + (seed * 19) % 300}" r="180" fill="rgba(255,255,255,.12)"/>
        <rect x="90" y="640" width="360" height="26" rx="13" fill="rgba(255,255,255,.75)"/>
        <rect x="90" y="690" width="760" height="18" rx="9" fill="rgba(255,255,255,.45)"/>
        <rect x="90" y="726" width="610" height="18" rx="9" fill="rgba(255,255,255,.35)"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function createOfferCard(index) {
    const title = offerTitles[index % offerTitles.length];
    const bullets = [
      'Reusable content pattern',
      'Editorial consistency',
      'Multi-market rollout support'
    ];

    let extraParagraphs = '';
    for (let i = 0; i < CONFIG.paragraphsPerCard; i += 1) {
      extraParagraphs += `
        <p>
          This intentionally verbose description exists to bloat the DOM and to preserve
          enough real-looking content for a believable before-versus-after modernization story.
        </p>
      `;
    }

    return `
      <article class="card">
        <img
          class="card-media"
          src="${svgDataUri(index + 1)}"
          alt="${title}"
          width="1600"
          height="900"
          loading="eager"
          decoding="sync"
        >
        <div class="card-body">
          <h3>${title} ${index + 1}</h3>
          <p>
            A consistent message with an intentionally inefficient implementation.
          </p>
          ${extraParagraphs}
          <ul>
            ${bullets.map((item) => `<li>${item}</li>`).join('')}
          </ul>
          <a href="#faq">Learn more</a>
        </div>
      </article>
    `;
  }

  function createFaqItem(index) {
    return `
      <article class="faq-item">
        <h3>Question ${index + 1}</h3>
        <p>
          The content here is intentionally simple, but the page surrounding it is deliberately
          made expensive so modernization can show a meaningful Lighthouse improvement.
        </p>
      </article>
    `;
  }

  function thrashLayout(elements, rounds) {
    for (let round = 0; round < rounds; round += 1) {
      elements.forEach((el, idx) => {
        el.style.paddingBottom = `${20 + ((idx + round) % 8)}px`;
        void el.offsetHeight;
        el.style.transform = `translateZ(0) scale(${1 + (((idx + round) % 5) * 0.0015)})`;
        void el.offsetWidth;
        el.style.borderRadius = `${18 + ((idx + round) % 12)}px`;
      });
    }
  }

  function expensiveMeasure() {
    const cards = document.querySelectorAll('.card, .faq-item');
    let total = 0;
    cards.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      total += rect.top * (idx + 1) + rect.height;
      if (idx % 9 === 0) {
        el.style.outlineWidth = `${(idx % 4) + 1}px`;
      }
    });
    document.body.dataset.measure = String(Math.floor(total));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const offersGrid = document.getElementById('offers-grid');
    const faqList = document.getElementById('faq-list');
    const scoreLabel = document.getElementById('score-label');

    burn(CONFIG.initialBurnMs);

    const offerMarkup = [];
    for (let i = 0; i < CONFIG.offerCount; i += 1) {
      offerMarkup.push(createOfferCard(i));
    }
    offersGrid.innerHTML = offerMarkup.join('');

    const faqMarkup = [];
    for (let i = 0; i < CONFIG.faqCount; i += 1) {
      faqMarkup.push(createFaqItem(i));
    }
    faqList.innerHTML = faqMarkup.join('');

    const expensiveNodes = [
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('.faq-item'),
      ...document.querySelectorAll('.stats li')
    ];

    thrashLayout(expensiveNodes, CONFIG.thrashRounds);
    burn(CONFIG.secondBurnMs);
    expensiveMeasure();

    window.addEventListener('scroll', expensiveMeasure, { passive: true });
    window.addEventListener('resize', () => {
      burn(CONFIG.resizeBurnMs);
      thrashLayout(expensiveNodes, 4);
      expensiveMeasure();
    });

    setInterval(expensiveMeasure, 2500);

    if (scoreLabel) {
      scoreLabel.textContent = 'Sub-50';
    }

    console.log('Intentionally slow demo page initialized.');
  });
})();
