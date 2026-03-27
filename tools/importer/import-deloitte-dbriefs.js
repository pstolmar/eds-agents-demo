/* eslint-disable */
/* global WebImporter */

/**
 * Deloitte Dbriefs webcasts page import.
 * Embeds webcast data since the Angular SPA content can't be reliably scraped.
 * The dbriefs-filter block JS handles interactive filtering client-side.
 */

const WEBCASTS = [
  { title: 'From vaults to virtual: Digital revolution in the financial system', date: 'Fri. 27 Mar. 2026, 11:00 a.m. ET', type: 'Virtual : Dbriefs', desc: '', img: 'https://media.deloitte.com/is/image/deloitte/Digital%20revolution-imagery-1920-880px-1:720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/from-vaults-to-virtual-digital-revolution-in-the-financial-system.html', register: 'https://my.deloitte.com/us/en/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=8ABgj3lVov1', categories: 'Financial Executives' },
  { title: '2026 State of AI in the Enterprise: The untapped edge', date: 'Fri. 27 Mar. 2026, 12:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Join us to identify where their organization sits on the ambition-to-activation journey, what\u2019s blocking scale, and how to balance productivity wins with deeper reinvention.', img: 'https://media.deloitte.com/is/image/deloitte/2026%20state%20ai_1920x880-2%20(1):720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/2026-state-of-ai-in-the-enterprise-the-untapped-edge.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=30zQ8gVNW69', categories: 'Technology Executives' },
  { title: 'M&A trends 2026: A tale of two markets', date: 'Tue. 31 Mar. 2026, 12:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Learn how leading dealmakers navigated unprecedented volatility in 2025, the emergence of \u201ctwo markets,\u201d and key lessons for M&A in 2026.', img: 'https://media.deloitte.com/is/image/deloitte/dbriefs-trends2026-promo:720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/ma-trends-2026-tale-of-two-markets.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=2ZpjDlmGPdN', categories: 'M&A and Restructuring, Financial Executives' },
  { title: 'Tech Outlook 2026: Agentic AI and infrastructure strategy', date: 'Thu. 02 Apr. 2026, 2:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Review agentic AI use cases, assess infrastructure implications, and learn about strategies to align autonomy, governance, and workload placement.', img: 'https://media.deloitte.com/is/image/deloitte/TMTpromo-Apr2026-DB:720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/tech-outlook-2026-agentic-ai-and-infrastructure-strategy.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=XE5QjdxjP2r', categories: 'Technology Executives, Industries' },
  { title: 'Building your AI in finance roadmap', date: 'Tue. 07 Apr. 2026, 11:00 a.m. ET', type: 'Virtual : Dbriefs', desc: 'Identify a practical framework for creating an AI roadmap within your finance organization.', img: 'https://media.deloitte.com/is/image/deloitte/us-diamond-stone-2:720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/building-your-ai-in-finance-roadmap-2026.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=09RXO1ZMoB8', categories: 'Financial Executives' },
  { title: 'Generative AI and agentic AI: Model validation/testing and monitoring', date: 'Wed. 08 Apr. 2026, 11:00 a.m. ET', type: 'Virtual : Event', desc: 'Explore how GenAI and agentic AI are reshaping risk management practices in the model validation/testing and monitoring space.', img: 'https://media.deloitte.com/is/image/deloitte/Agentic-AI-2026-promo-Dbriefs:720-x-480', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/generative-ai-agentic-ai-model-validation-monitoring.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=7DO6gNAWpQ3', categories: 'Technology Executives, Financial Executives' },
  { title: '2026 insurance M&A outlook Dbriefs webcast', date: 'Tue. 14 Apr. 2026, 11:00 a.m. ET', type: 'Virtual : Dbriefs', desc: 'Identify emerging insurance M&A trends and evaluate strategic considerations for capital deployment and transaction readiness.', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/2026-insurance-ma-outlook.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=kz1RlMWZrMp', categories: 'M&A and Restructuring, Industries' },
  { title: 'After the close: Managing the hidden risks in divestitures', date: 'Wed. 22 Apr. 2026, 11:00 a.m. ET', type: 'Virtual : Dbriefs', desc: 'Identify practical guidance to protect value, accelerate stabilization, and exit divestitures stronger.', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/after-the-close-managing-the-hidden-risks-in-divestitures.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=EjyxPLJYk2L', categories: 'M&A and Restructuring' },
  { title: 'APA/MAP pulse: Trends in US and global transfer pricing dispute resolution', date: 'Fri. 24 Apr. 2026, 12:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Outline practical next steps in pursuing APAs and MAP resolutions by region and topic.', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/apa-map-pulse-trends-us-global-transfer-pricing-dispute-resolution.html', register: 'https://my.deloitte.com/us/en/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=aplRVgnK48g', categories: 'Tax Executives' },
  { title: 'Accounting hot topics for tech-driven companies in a dynamic landscape', date: 'Tue. 05 May 2026, 1:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Discover insights on accounting issues and developments that are top of mind when addressing tech-related arrangements.', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/accounting-hot-topics-for-tech-driven-companies-in-a-dynamic-landscape-2026.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=QokBzW3zm2d', categories: 'Financial Executives, Technology Executives' },
  { title: 'Private companies tax update: Pillar Two, GI3/R&D, and M&A', date: 'Tue. 12 May 2026, 2:00 p.m. ET', type: 'Virtual : Dbriefs', desc: 'Are you ready for the next wave of tax change impacting private companies? A practical discussion on Pillar Two readiness, GI3/R&D incentives, and M&A tax updates.', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/private-companies-tax-update-pillar-two-2026.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=ednx4kEOrXG', categories: 'Tax Executives, Private Companies' },
  { title: 'Quarterly accounting roundup: Q2 2026 update on important developments', date: 'Wed. 17 Jun. 2026, 1:00 p.m. ET', type: 'Virtual : Dbriefs', desc: '', img: '', detail: 'https://www.deloitte.com/us/en/dbriefs-webcasts/quarterly-accounting-roundup-q2-2026-update-important-developments.html', register: 'https://my.deloitte.com/index.html#/signin?site=us_en&pl=en-US&pc=US&pi=dbs&eventid=4xReVYjMDv1', categories: 'Financial Executives' },
];

export default {
  transform: (payload) => {
    const { document } = payload;
    const r = document.createElement('div');

    // Hero
    const heroImgDiv = document.createElement('div');
    const heroPic = document.createElement('picture');
    const heroImg = document.createElement('img');
    heroImg.src = 'https://media.deloitte.com/is/image/deloitte/upcoming-dbriefs-webcasts-header-1920-880';
    heroImg.alt = '';
    heroPic.appendChild(heroImg);
    heroImgDiv.appendChild(heroPic);

    const heroContent = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = 'Dbriefs webcasts';
    heroContent.appendChild(h1);
    const pDesc = document.createElement('p');
    pDesc.textContent = 'Get valuable insights on the important developments that affect your business. Our Dbriefs deliver practical knowledge from Deloitte specialists plus CPE credits.';
    heroContent.appendChild(pDesc);
    const pCta = document.createElement('p');
    const aCta = document.createElement('a');
    aCta.href = 'https://my.deloitte.com/us/en/index.html#/registration?site=us_en&action=optin&sub=a0C300000021TYt&nocheck=true&pl=en-US&pc=US&pi=dbs';
    aCta.textContent = 'Subscribe now';
    pCta.appendChild(aCta);
    heroContent.appendChild(pCta);

    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Hero', cells: [[heroImgDiv], [heroContent]] }));

    // Section: Dbriefs Filter block
    r.appendChild(document.createElement('hr'));

    const filterCells = WEBCASTS.map((wc) => {
      const imgDiv = document.createElement('div');
      if (wc.img) {
        const pic = document.createElement('picture');
        const img = document.createElement('img');
        img.src = wc.img;
        img.alt = wc.title;
        img.loading = 'lazy';
        pic.appendChild(img);
        imgDiv.appendChild(pic);
      }

      const cd = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = wc.title;
      cd.appendChild(h3);
      if (wc.date) { const p = document.createElement('p'); p.textContent = wc.date; cd.appendChild(p); }
      if (wc.type) { const p = document.createElement('p'); p.textContent = wc.type; cd.appendChild(p); }
      if (wc.desc) { const p = document.createElement('p'); p.textContent = wc.desc; cd.appendChild(p); }
      if (wc.register) { const p = document.createElement('p'); const a = document.createElement('a'); a.href = wc.register; a.textContent = 'Register'; p.appendChild(a); cd.appendChild(p); }
      if (wc.detail) { const p = document.createElement('p'); const a = document.createElement('a'); a.href = wc.detail; a.textContent = 'View details'; p.appendChild(a); cd.appendChild(p); }
      if (wc.categories) { const p = document.createElement('p'); p.textContent = 'categories: ' + wc.categories; cd.appendChild(p); }

      return [imgDiv, cd];
    });

    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Dbriefs Filter', cells: filterCells }));

    // Section: Resources
    r.appendChild(document.createElement('hr'));
    const h2r = document.createElement('h2');
    h2r.textContent = 'Dbrief resources';
    r.appendChild(h2r);
    const ul = document.createElement('ul');
    [
      ['Frequently asked questions (FAQ)', 'https://www2.deloitte.com/us/en/pages/dbriefs-webcasts/resources/dbriefs-faqs.html'],
      ['Continuing professional education (CPE) info', '/us/en/dbriefs-webcasts/dbriefs-cpe-information.html'],
      ['Webcast help', '/us/en/dbriefs-webcasts/webcast-help.html'],
      ['On-Demand Webcasts', '/us/en/dbriefs-webcasts/recently-archived-webcasts.html'],
      ['Contact us', 'https://www2.deloitte.com/us/en/pages/dbriefs-webcasts/resources/contact-dbriefs.html'],
    ].forEach(([text, href]) => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = href; a.textContent = text; li.appendChild(a); ul.appendChild(li); });
    r.appendChild(ul);

    // Metadata
    r.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(r, document);

    return [{ element: r, path: '/test/deloitte/us/en/dbriefs-webcasts/upcoming-webcasts/index', report: { title: 'Upcoming Dbriefs webcasts', template: 'deloitte-dbriefs' } }];
  },
};
