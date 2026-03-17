/* eslint-disable max-len */
/**
 * wm-page-builder.js — Client-side page content for paths not on CDN.
 * Injects HTML into main when the CDN returns 404 for known pages.
 */

const VIMEO_DESKTOP = 'https://player.vimeo.com/video/1154793478?h=fb657a5ed6&badge=0&controls=0&loop=1&autopause=0&autoplay=1&background=1&muted=1';
const VIMEO_MOBILE = 'https://player.vimeo.com/video/1138559943?h=e3eda34e94&badge=0&loop=1&controls=0&autopause=0&autoplay=1&background=1&muted=1';

function buildHomepage() {
  return `
<div>
  <div class="hero-video">
    <div><div>${VIMEO_DESKTOP}</div></div>
    <div><div>${VIMEO_MOBILE}</div></div>
    <div><div>Shaping the Future of Retail</div></div>
    <div><div><a href="/wm-eds/2/news/">Learn more</a></div></div>
  </div>
</div>
<div>
  <h2>Latest News</h2>
  <div class="cards">
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/03/13/neighborhood-market-refresh/lead.jpg" alt="Neighborhood Market" loading="lazy"></picture></div>
      <div><p><strong>Moving Fast to Serve You Better: Why We're Refreshing Your Neighborhood Market</strong></p><p>Business</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/03/12/chief-legal-officer/lead.jpg" alt="Chief Legal Officer" loading="lazy"></picture></div>
      <div><p><strong>Walmart Names Erin Nealy Cox as Chief Legal Officer</strong></p><p>Business</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/25/signs-of-strength/lead.jpg" alt="Signs of Strength" loading="lazy"></picture></div>
      <div><p><strong>Signs of Strength</strong></p><p>Working at Walmart</p></div>
    </div>
  </div>
  <p><a href="/wm-eds/2/news/">View newsroom</a></p>
</div>
<div>
  <div class="columns">
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/global/walmart-plus-bag-kitchen-ad.jpg" alt="Walmart+" loading="lazy"></picture></div>
      <div><h2>The membership that gives you free delivery, gas savings, movies & more</h2><p><a href="https://www.walmart.com/plus">Start your free 30-day trial</a></p></div>
    </div>
  </div>
</div>
<div>
  <h2>Explore Walmart</h2>
  <div class="cards">
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/homepage/link-list/working-at-walmart.jpg" alt="Working at Walmart" loading="lazy"></picture></div>
      <div><p><strong>Working at Walmart</strong></p><p><a href="/about/working-at-walmart">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/homepage/link-list/for-investors.jpg" alt="For Investors" loading="lazy"></picture></div>
      <div><p><strong>For Investors</strong></p><p><a href="https://stock.walmart.com/">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/homepage/link-list/sams-club.jpg" alt="Sam's Club" loading="lazy"></picture></div>
      <div><p><strong>Sam's Club</strong></p><p><a href="https://corporate.samsclub.com/">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/homepage/link-list/our-suppliers.jpg" alt="Our Suppliers" loading="lazy"></picture></div>
      <div><p><strong>Our Suppliers</strong></p><p><a href="/suppliers">Learn more</a></p></div>
    </div>
  </div>
</div>
`;
}

function buildNewsEvents() {
  return `
<div>
  <h1>Events</h1>
  <h2>Upcoming Events</h2>
  <div class="cards">
    <div>
      <div></div>
      <div><p><strong>Road to Open Call: Los Angeles</strong></p><p>April 9, 2026 — Los Angeles, CA</p><p><a href="/wm-eds/2/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026">Learn more</a></p></div>
    </div>
    <div>
      <div></div>
      <div><p><strong>Road to Open Call: New Orleans</strong></p><p>April 15, 2026 — New Orleans, LA</p><p><a href="/wm-eds/2/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026">Learn more</a></p></div>
    </div>
    <div>
      <div></div>
      <div><p><strong>Road to Open Call: Dallas</strong></p><p>May 14, 2026 — Dallas, TX</p><p><a href="/wm-eds/2/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026">Learn more</a></p></div>
    </div>
    <div>
      <div></div>
      <div><p><strong>Road to Open Call: Orlando</strong></p><p>May 21, 2026 — Orlando, FL</p><p><a href="/wm-eds/2/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026">Learn more</a></p></div>
    </div>
    <div>
      <div></div>
      <div><p><strong>Annual Shareholders Meeting 2026</strong></p><p>June 4, 2026 — Bentonville, AR</p><p><a href="#">Learn more</a></p></div>
    </div>
    <div>
      <div></div>
      <div><p><strong>Open Call 2026</strong></p><p>October 6-7, 2026 — Bentonville, AR</p><p><a href="/wm-eds/2/suppliers/investing-in-american-jobs/events/annual-open-call/open-call-2026">Learn more</a></p></div>
    </div>
  </div>
</div>
`;
}

function buildContactMediaRelations() {
  return `
<div>
  <h1>Contact Media Relations</h1>
  <p>This form is for working journalists and credentialed bloggers only. Due to a high volume of inquiries, we may not be able to respond to all requests.</p>
  <p>For other resources, visit our <a href="/wm-eds/2/news/">News</a> page or <a href="/content/wm-media-library-eds">Media Library</a>.</p>
  <p>If you are a customer in need of help, please call 1-800-WALMART (1-800-925-6278).</p>
  <h3>Contact Form</h3>
  <div class="form">
    <div><div>contact-media-relations</div></div>
  </div>
</div>
`;
}

function buildNewsListing() {
  return `
<div>
  <h1>News</h1>
  <div class="news-filter">
    <div><div>news-filter</div></div>
  </div>
</div>
<div>
  <div class="cards">
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/03/13/neighborhood-market-refresh/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Moving Fast to Serve You Better: Why We're Refreshing Your Neighborhood Market</strong></p><p>Business — March 13, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/03/12/chief-legal-officer/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart Names Erin Nealy Cox as Chief Legal Officer</strong></p><p>Business — March 12, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/25/signs-of-strength/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Signs of Strength</strong></p><p>Working at Walmart — February 25, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/19/q4-fy26-earnings/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart Releases Q4 FY26 Earnings</strong></p><p>Finance — February 19, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/23/scintilla/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Introducing Scintilla In-Store: The Future of Third-Party Retail Execution at Walmart</strong></p><p>Innovation — February 23, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/11/winter-storm-relief/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart and The Walmart Foundation Announce $1 Million Total Investment in Winter Storm Relief</strong></p><p>Community — February 11, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/04/hunger-is-local/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Hunger is Local. So Are the Solutions.</strong></p><p>Community — February 4, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/02/03/in-calexico/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>In Calexico, a Retail Culture Built to Last</strong></p><p>Working at Walmart — February 3, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/01/28/pharmacy-technicians/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart Boosts Pay Potential for Pharmacy Technicians</strong></p><p>Health & Wellness — January 28, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/01/27/mls-saturday/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Major League Soccer Unveils Walmart Saturday Showdown</strong></p><p>Business — January 27, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/01/22/health-closer-to-home/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Caring for Communities: Why the Future of Health Starts Closer to Home</strong></p><p>Health & Wellness — January 22, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/01/16/leadership-changes/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart Announces Leadership Changes</strong></p><p>Business — January 16, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2026/01/11/google-ai-shopping/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Walmart and Google Turn AI Discovery Into Effortless Shopping</strong></p><p>Innovation — January 11, 2026</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2025/12/19/holiday-shopping-season/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>Our Best Holiday Shopping Season Yet</strong></p><p>Business — December 19, 2025</p></div>
    </div>
    <div>
      <div><picture><img src="https://corporate.walmart.com/content/dam/corporate/images/newsroom/2025/12/16/the-overnighters/lead.jpg" alt="" loading="lazy"></picture></div>
      <div><p><strong>The Overnighters: Inside Walmart's Holiday Rush</strong></p><p>Working at Walmart — December 16, 2025</p></div>
    </div>
  </div>
</div>
`;
}

/** Page registry — maps pathname patterns to content builders */
const PAGES = [
  { match: '/wm-eds/2/index', builder: buildHomepage, title: 'Walmart Corporate' },
  { match: '/wm-eds/2/news/events', builder: buildNewsEvents, title: 'Events' },
  { match: '/wm-eds/2/news/contact-media-relations', builder: buildContactMediaRelations, title: 'Contact Media Relations' },
  { match: '/wm-eds/2/news/index', builder: buildNewsListing, title: 'News' },
  { match: '/wm-eds/2/news', builder: buildNewsListing, title: 'News' },
];

/**
 * Check if current page is a known custom page.
 * If so, inject content into main and update title.
 * Returns true if content was injected.
 */
export default function injectPageContent() {
  if (!window.isErrorPage) return false;

  const { pathname } = window.location;
  const clean = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  const page = PAGES.find((p) => clean === p.match || clean.endsWith(p.match));
  if (!page) return false;

  const main = document.querySelector('main');
  if (!main) return false;

  document.title = page.title;
  main.innerHTML = page.builder();
  main.classList.remove('error');
  window.isErrorPage = false;
  return true;
}
