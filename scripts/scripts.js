import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Reconstruct carousel and embed blocks on open-call-2026 page.
 * The AEM content pipeline flattens carousel block tables into
 * p > a[href="/"] > picture elements with counter text.
 * This reconstructs proper block tables before decoration.
 */
function fixOpenCallContent(main) {
  if (!window.location.pathname.includes('open-call-2026')) return;

  const section = main.querySelector(':scope > div');
  if (!section) return;

  // 1. Find flattened carousel images: p > a[href="/"] > picture
  const carouselParagraphs = [...section.querySelectorAll('p')]
    .filter((p) => p.querySelector('a[href="/"] > picture'));

  if (carouselParagraphs.length > 0) {
    const seenSrcs = new Set();
    const uniqueImgs = [];
    carouselParagraphs.forEach((p) => {
      const img = p.querySelector('img');
      const src = img?.getAttribute('src') || '';
      if (src && !seenSrcs.has(src)) {
        seenSrcs.add(src);
        uniqueImgs.push(p.querySelector('picture'));
      }
    });

    // Build carousel block table
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    uniqueImgs.forEach((pic) => {
      const row = document.createElement('div');
      const imgCell = document.createElement('div');
      const contentCell = document.createElement('div');
      imgCell.appendChild(pic.cloneNode(true));
      row.appendChild(imgCell);
      row.appendChild(contentCell);
      carousel.appendChild(row);
    });

    // Remove flattened carousel elements
    carouselParagraphs.forEach((p) => p.remove());
    [...section.querySelectorAll('p')].forEach((p) => {
      if (/^\d+ of \d+$/.test(p.textContent.trim())) p.remove();
    });

    // Insert carousel after the tour stops list
    const tourList = section.querySelector('ul');
    if (tourList) tourList.after(carousel);
  }

  // 2. Add native form block for Open Call registration
  const applyP = [...section.querySelectorAll('p')]
    .find((p) => p.textContent.includes('apply today'));
  if (applyP) {
    const formBlock = document.createElement('div');
    formBlock.className = 'form';
    const row = document.createElement('div');
    const cell = document.createElement('div');
    cell.textContent = 'open-call-registration';
    row.appendChild(cell);
    formBlock.appendChild(row);
    applyP.after(formBlock);
  }

  // 3. Fix "Learn More opens in a new tab"
  [...main.querySelectorAll('a')].forEach((a) => {
    if (a.textContent.trim() === 'Learn More opens in a new tab') {
      a.textContent = 'Learn More';
    }
  });

  // 4. Add card styling class to the columns block container
  const columnsDiv = section.querySelector('.columns');
  if (columnsDiv) {
    columnsDiv.classList.add('columns-card');
  }
}

/**
 * Auto-detect flat "resource grid" content pattern (logo img, h4, description, view link)
 * and restructure into a cards block with resource variant for 3-column grid display.
 * Works on supply-chain-resources and any page with the same content structure.
 */
function autoResourceGrid(main) {
  /* Look in raw section divs (runs before decorateSections) */
  const section = main.querySelector(':scope > div');
  if (!section) return;

  /* Detect resource pattern: p with img followed by h4, repeating 3+ times */
  const h4s = [...section.querySelectorAll('h4')];
  if (h4s.length < 3) return;

  /* Count how many h4s are preceded by an img paragraph */
  const matching = h4s.filter((h4) => {
    const prev = h4.previousElementSibling;
    return prev?.tagName === 'P' && (prev.querySelector('img') || prev.querySelector('picture'));
  });
  if (matching.length < 3) return;

  /* Build cards block from the repeating pattern */
  const cardsBlock = document.createElement('div');
  cardsBlock.className = 'cards resource';

  matching.forEach((h4) => {
    const imgP = h4.previousElementSibling;
    const descP = h4.nextElementSibling;
    const viewP = descP?.nextElementSibling;

    const row = document.createElement('div');
    const imgCell = document.createElement('div');
    const bodyCell = document.createElement('div');

    const img = imgP.querySelector('img');
    if (img) {
      const pic = document.createElement('picture');
      pic.appendChild(img.cloneNode(true));
      imgCell.appendChild(pic);
    }

    bodyCell.appendChild(h4.cloneNode(true));
    if (descP?.tagName === 'P') bodyCell.appendChild(descP.cloneNode(true));
    if (viewP?.tagName === 'P' && viewP.querySelector('a')) bodyCell.appendChild(viewP.cloneNode(true));

    row.appendChild(imgCell);
    row.appendChild(bodyCell);
    cardsBlock.appendChild(row);

    /* Remove originals */
    imgP.remove();
    h4.remove();
    if (descP?.tagName === 'P') descP.remove();
    if (viewP?.tagName === 'P' && viewP.querySelector('a')) viewP.remove();
  });

  /* Insert cards block after h1 if present, else at start */
  const h1 = section.querySelector('h1');
  if (h1) h1.after(cardsBlock);
  else section.prepend(cardsBlock);
}

/**
 * Auto-detect article listing pattern (p>a>img + p>a date + h6>a title + p>a desc)
 * and restructure into a horizontal cards block. Works on about-us-manufacturing-initiative
 * and any page with linked article teasers.
 */
function autoArticleListing(main) {
  const sections = [...main.querySelectorAll(':scope > div')];
  sections.forEach((section) => {
    /* Find h6 elements that contain a link — these are article titles */
    const h6s = [...section.querySelectorAll('h6')];
    const articles = h6s.filter((h6) => {
      const link = h6.querySelector('a');
      if (!link) return false;
      /* Check preceding siblings: should have p with img (image) and p>a (date) */
      const dateP = h6.previousElementSibling;
      const imgP = dateP?.previousElementSibling;
      /* Use 'img' not 'a > img' since EDS wraps imgs in <picture> elements */
      return dateP?.tagName === 'P' && dateP.querySelector('a')
        && imgP?.tagName === 'P' && imgP.querySelector('img');
    });
    if (articles.length < 1) return;

    /* Build cards block with horizontal variant */
    const cardsBlock = document.createElement('div');
    cardsBlock.className = 'cards horizontal';

    articles.forEach((h6) => {
      const dateP = h6.previousElementSibling;
      const imgP = dateP.previousElementSibling;
      const descP = h6.nextElementSibling;
      const href = h6.querySelector('a')?.getAttribute('href') || '';

      const row = document.createElement('div');
      const imgCell = document.createElement('div');
      const bodyCell = document.createElement('div');

      /* Image cell */
      const img = imgP.querySelector('img');
      if (img) {
        const pic = document.createElement('picture');
        pic.appendChild(img.cloneNode(true));
        imgCell.appendChild(pic);
      }

      /* Body cell: title + description (skip date, the original doesn't show it) */
      const titleEl = document.createElement('h6');
      titleEl.textContent = h6.textContent;
      bodyCell.appendChild(titleEl);
      if (descP?.tagName === 'P' && descP.querySelector('a[href]')) {
        const desc = document.createElement('p');
        desc.textContent = descP.textContent;
        bodyCell.appendChild(desc);
      }

      /* Add a link for the whole card */
      if (href) {
        const linkEl = document.createElement('p');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = href;
        linkEl.appendChild(a);
        bodyCell.appendChild(linkEl);
      }

      row.appendChild(imgCell);
      row.appendChild(bodyCell);
      cardsBlock.appendChild(row);

      /* Remove originals */
      imgP.remove();
      dateP.remove();
      h6.remove();
      if (descP?.tagName === 'P' && descP.querySelector('a[href]')) descP.remove();
    });

    /* Insert where the first article was */
    const remaining = section.querySelector('h2');
    if (remaining) {
      /* Find the h2 that comes after where articles were */
      const allH2s = [...section.querySelectorAll('h2')];
      const ecosystemH2 = allH2s.find((h) => h.textContent.includes('Ecosystem'));
      if (ecosystemH2) ecosystemH2.before(cardsBlock);
      else section.appendChild(cardsBlock);
    } else {
      section.appendChild(cardsBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // Fix content before decoration (pipeline workarounds)
  fixOpenCallContent(main);
  autoResourceGrid(main);
  autoArticleListing(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  /* Prevent indexing of demo wm-eds pages */
  if (window.location.pathname.includes('/wm-eds/')) {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
  }

  /* Early demo-mode detection: block sensitive content BEFORE body appears */
  const eagerParams = new URLSearchParams(window.location.search);
  const eagerDemo = eagerParams.get('demo');
  if (eagerDemo && ['gated', 'partly-gated', 'personalized'].includes(eagerDemo)) {
    const blocker = document.createElement('div');
    blocker.id = 'wm-demo-blocker';
    blocker.setAttribute(
      'style',
      'position:fixed;inset:0;z-index:9999;background:#041f41;display:flex;align-items:center;justify-content:center;',
    );
    blocker.innerHTML = '<div style="color:#fff;font-family:Helvetica Neue,sans-serif;text-align:center">'
      + '<div style="width:48px;height:48px;border:3px solid rgba(255,255,255,.2);border-top-color:#ffc220;border-radius:50%;animation:wm-spin 0.8s linear infinite;margin:0 auto 16px"></div>'
      + '<div style="font-size:14px;opacity:0.7">Loading secure content\u2026</div></div>';
    const spinStyle = document.createElement('style');
    spinStyle.textContent = '@keyframes wm-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(spinStyle);
    document.body.appendChild(blocker);
  }

  const main = doc.querySelector('main');
  if (main) {
    // Inject content for custom pages that don't exist on CDN
    if (window.isErrorPage && window.location.pathname.includes('/wm-eds/2/')) {
      const { default: injectPageContent } = await import('./wm-page-builder.js');
      await injectPageContent();
    }
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  /* page-specific modules */
  const { pathname } = window.location;
  const params = new URLSearchParams(window.location.search);

  /* Demo mode: ?demo=gated|partly-gated|personalized works on ANY page */
  const demoMode = params.get('demo');
  const demoContent = {
    gated: { css: 'wm-gated.css', js: './wm-gated.js', sections: ['<h1>Walmart Associate Resource Portal</h1><p>This page contains restricted content that requires Single Sign-On authentication to access.</p>', '<h2>Quarterly Business Review — Q1 2026</h2><p>Revenue growth across all segments exceeded projections by 3.2%. E-commerce GMV reached $24.8B.</p><h3>Key Metrics</h3><ul><li>Comparable store sales: +5.1%</li><li>E-commerce growth: +22% YoY</li><li>Walmart+ subscribers: 38M</li></ul>', '<h2>Strategic Initiatives Pipeline</h2><p>Marketplace expansion continues with 420 new sellers onboarded in Q1.</p>', '<h3>Confidential: M&amp;A Pipeline</h3><p>Three active targets in advanced due diligence. Combined estimated deal value: $8.2B.</p>'] },
    'partly-gated': { css: 'wm-partly-gated.css', js: './wm-partly-gated.js', sections: ['<h1>Walmart Operations Dashboard</h1><p>Real-time operational tools for authorized store managers and pricing analysts.</p>', '<h2>Inventory Status</h2><p>Widget: Inventory Tracker | Access Group: Store Managers</p>', '<h2>Price Management</h2><p>Widget: AEM Screens Price Updater | Access Group: Pricing Analysts</p>'] },
    personalized: { css: 'wm-personalized.css', js: './wm-personalized.js', sections: ['<h1>Welcome to Walmart</h1><p>Discover what\'s new at your local store and online.</p>', '<h2>Recommended for You</h2><p>Based on your browsing history and purchase patterns.</p>', '<h2>Your Store</h2><p>Find everything you need at your neighborhood Walmart.</p>', '<h2>Trending in Your Area</h2><p>See what other shoppers near you are buying right now.</p>'] },
  };

  if (demoMode && demoContent[demoMode] && !pathname.includes('media-library')) {
    const demo = demoContent[demoMode];
    const m = doc.querySelector('main');
    if (m) {
      m.innerHTML = demo.sections.map((s) => `<div>${s}</div>`).join('');
      decorateSections(m);
      decorateBlocks(m);
    }
    loadCSS(`${window.hlx.codeBasePath}/styles/${demo.css}`);
    import(demo.js).then((mod) => {
      mod.default();
      /* Remove the blocking overlay after module initializes */
      const blocker = document.getElementById('wm-demo-blocker');
      if (blocker) {
        blocker.style.transition = 'opacity 0.3s ease';
        blocker.style.opacity = '0';
        setTimeout(() => blocker.remove(), 300);
      }
    });
  } else if (pathname.includes('media-library')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-media-library.css`);
    if (params.has('extras')) {
      loadCSS(`${window.hlx.codeBasePath}/styles/wm-extras.css`);
    }
    import('./wm-media-library.js').then((mod) => mod.default());
    /* Media library + partly-gated: overlay SSO that toggles viewer/admin modes */
    if (demoMode === 'partly-gated') {
      loadCSS(`${window.hlx.codeBasePath}/styles/wm-partly-gated.css`);
      import('./wm-partly-gated.js').then((mod) => {
        if (mod.initMediaLibraryGate) mod.initMediaLibraryGate();
        /* Remove the early blocker — the SSO gate overlay takes over */
        const blocker = document.getElementById('wm-demo-blocker');
        if (blocker) {
          blocker.style.transition = 'opacity 0.3s ease';
          blocker.style.opacity = '0';
          setTimeout(() => blocker.remove(), 300);
        }
      });
    }
  } else if (pathname.includes('/partly-gated')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-partly-gated.css`);
    import('./wm-partly-gated.js').then((mod) => mod.default());
  } else if (pathname.includes('/gated')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-gated.css`);
    import('./wm-gated.js').then((mod) => mod.default());
  } else if (pathname.includes('/personalized')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-personalized.css`);
    import('./wm-personalized.js').then((mod) => mod.default());
  }

  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  /* WKND pages: load visual effects after sections decorated */
  if (pathname.includes('/test/wknd') || pathname.includes('/content/test/wknd')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wknd-effects.css`);
    import('./wknd-effects.js').then((mod) => mod.default());
  }

  /* AskWalmart: decorate after sections load so accordions exist */
  if (pathname.includes('askwalmart')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-askwalmart.css`);
    const mod = await import('./wm-askwalmart.js');
    mod.default();
  }

  /* Open Call 2026: fun extras gated behind ?extras=true */
  if (pathname.includes('open-call-2026') && params.has('extras')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-open-call-extras.css`);
    const extMod = await import('./wm-open-call-extras.js');
    extMod.default();
  }

  /* wm-eds/2 page extras: 7 fun features gated behind ?extras=true */
  if (pathname.includes('/wm-eds/2/') && !pathname.includes('open-call-2026') && params.has('extras')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-page-extras.css`);
    const pageMod = await import('./wm-page-extras.js');
    pageMod.default();
  }

  /* CWV timing overlay: ?timing=true on any wm-eds/2 page */
  if (pathname.includes('/wm-eds/2/') && params.get('timing') === 'true') {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-timing.css`);
    const timingMod = await import('./wm-timing.js');
    timingMod.default();
  }

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
