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

  /* ExMod fast page: dark glassmorphism theme v1.2 */
  if (pathname.includes('/test/fast') || pathname.includes('/content/test/fast')) {
    document.body.classList.add('exmod-fast');
    loadCSS(`${window.hlx.codeBasePath}/styles/exmod-fast.css`);
    import('./exmod-fast.js').then((mod) => mod.default());
  }

  /* AskWalmart: decorate after sections load so accordions exist */
  if (pathname.includes('askwalmart')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/wm-askwalmart.css`);
    const mod = await import('./wm-askwalmart.js');
    mod.default();
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

