/* eslint-disable */
/* global WebImporter */

/**
 * Deloitte Insights hub page import.
 * Uses extracted content data for reliable import of this complex multi-section page.
 */

const INSIGHTS_DATA = {
  title: 'Helping future-focused leaders navigate what\u2019s next',
  subtitle: 'Deloitte Insights and our research centers deliver proprietary research designed to help organizations turn their aspirations into action.',
  featured: [
    {
      title: 'Top 10 most-read business insights',
      desc: 'In this quarter\u2019s list of the top 10 most-read Deloitte Insights content, executives are turning to business insights on topics ranging from workforce planning in the AI era, to global trade and tariffs, to shifting M&A strategies.',
      img: '/images/deloitte/insights-top10.jpg',
      href: '/us/en/insights/top-10-business-insights.html',
      time: '',
    },
    {
      title: 'Bridging the AI value gap: Are team dynamics the missing link?',
      desc: 'Survey findings suggest the strongest AI outcomes may come from larger, cognitively diverse, highly connected teams that invest in people, not just the tech.',
      img: '/images/deloitte/insights-ai-value-gap.jpg',
      href: '/us/en/insights/topics/talent/ai-roi-and-team-structure.html',
      time: '6-min read',
    },
    {
      title: '2026 Global Human Capital Trends',
      desc: 'Technology scales. Humans differentiate. Explore the 2026 Global Human Capital Trends and discover why the human edge now drives advantage.',
      img: '/images/deloitte/insights-human-capital.jpg',
      href: '/us/en/insights/topics/talent/human-capital-trends.html',
      time: '9-min read',
    },
    {
      title: 'Strategies for finding\u2014and unlocking\u2014the hidden potential in your workforce',
      desc: 'Your workforce may be wasting hidden capacity. Here\u2019s how to unlock unseen talent, slash busywork, and outpace competitors.',
      img: '/images/deloitte/insights-workforce.jpg',
      href: '/us/en/insights/topics/talent/future-of-workforce-planning/hidden-workforce-capabilities.html',
      time: '17-min read',
    },
  ],
  videos: [
    { title: 'Video: The human advantage in the age of AI', img: '/images/deloitte/insights-video-human-advantage.jpg', href: 'https://www.youtube.com/watch?v=l7kXEtca41U' },
    { title: 'Video: Function reinvention in the age of AI', img: '/images/deloitte/insights-video-function.jpg', href: 'https://www.youtube.com/watch?v=ZI-2B10UkBw' },
    { title: 'Video: AI trust and data integrity in hiring', img: '/images/deloitte/insights-video-ai-trust.jpg', href: 'https://www.youtube.com/watch?v=M9bw7BAZWWY' },
    { title: 'Video: Dealing with AI\u2019s cultural debt', img: '/images/deloitte/insights-video-cultural-debt.jpg', href: 'https://www.youtube.com/watch?v=KVTn3zdbCYI' },
    { title: 'Video: Orchestration at speed: Beyond AI adoption', img: '/images/deloitte/insights-video-orchestration.jpg', href: 'https://www.youtube.com/watch?v=1ShG_gOz65k' },
  ],
  topics: [
    { title: 'Governance and Board', desc: 'Tech transformation; talent and equity; climate actions; stakeholder activism: Today\u2019s board agendas are more packed than ever.', img: '/images/deloitte/insights-governance.jpg', href: '/us/en/insights/topics/governance-and-board.html' },
    { title: 'Technology', desc: 'The global economy is driven by and dependent on rapidly evolving technologies. Do you have the tools to put strategy before gadgetry?', img: '/images/deloitte/insights-technology.jpg', href: '/us/en/insights/topics/technology-management.html' },
    { title: 'Innovation', desc: 'Breakthroughs can come from everywhere. With the business landscape rapidly transforming, innovation is more critical than ever.', img: '/images/deloitte/insights-innovation.jpg', href: '/us/en/insights/topics/innovation.html' },
  ],
  trending: [
    { title: 'AI is likely to impact careers. How can organizations help build a resilient early career workforce?', href: '/us/en/insights/topics/talent/ai-in-the-workplace.html', img: '/images/deloitte/insights-ai-careers.jpg', time: '15-min read' },
    { title: 'Gen Zs and millennials at work: Pursuing a balance of money, meaning, and well-being', href: '/us/en/insights/topics/talent/2025-gen-z-millennial-survey.html', img: '/images/deloitte/insights-gen-z.jpg', time: '11-min read' },
    { title: 'Tech Trends 2026', href: '/us/en/insights/topics/technology-management/tech-trends.html', img: '/images/deloitte/insights-tech-trends.jpg', time: '4-min read' },
    { title: '2026 Industry outlooks', href: '/us/en/Industries/industry-outlooks.html', img: '/images/deloitte/insights-industry-outlooks.jpg' },
  ],
  magazine: {
    title: 'Deloitte Insights Magazine',
    issue: 'Issue 33: Advancing the AI conversation',
    desc: 'Artificial intelligence has gone from a fringe technology to what many consider to be must-have, market-making and -shaping tech.',
    cover: '/images/deloitte/insights-magazine.jpg',
    href: '/us/en/insights/deloitte-insights-magazine.html',
  },
  centers: [
    { name: 'Cross-industry (Center for Integrated Research)', href: '/us/en/insights/research-centers/center-for-integrated-research.html' },
    { name: 'Economics (Global Economics Research Center)', href: '/us/en/insights/research-centers/economics.html' },
    { name: 'Consumer (Consumer Industry Center)', href: '/us/en/insights/research-centers/consumer-industry-center.html' },
    { name: 'Energy & Industrials', href: '/us/en/insights/research-centers/center-energy-industrials.html' },
    { name: 'Financial Services', href: '/us/en/insights/research-centers/center-for-financial-services.html' },
    { name: 'Government & Public Services', href: '/us/en/insights/research-centers/center-for-government-insights.html' },
    { name: 'Life Sciences & Health Care', href: '/us/en/insights/research-centers/center-for-health-solutions.html' },
    { name: 'Tech, Media & Telecom', href: '/us/en/insights/research-centers/center-for-technology-media-telecommunications.html' },
  ],
  topicLinks: [
    { label: 'Business Strategy & Growth', href: '/us/en/insights/topics/business-strategy-growth.html' },
    { label: 'Leadership', href: '/us/en/insights/topics/leadership.html' },
    { label: 'Operations', href: '/us/en/insights/topics/operations.html' },
    { label: 'Technology', href: '/us/en/insights/topics/technology-management.html' },
    { label: 'Workforce', href: '/us/en/insights/topics/talent.html' },
    { label: 'Economics', href: '/us/en/insights/topics/economy.html' },
  ],
};

function makeImg(doc, src, alt) {
  const d = doc.createElement('div');
  const pic = doc.createElement('picture');
  const img = doc.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.loading = 'lazy';
  pic.appendChild(img);
  d.appendChild(pic);
  return d;
}

function makeContent(doc, item) {
  const d = doc.createElement('div');
  const pT = doc.createElement('p');
  const s = doc.createElement('strong');
  s.textContent = item.title;
  pT.appendChild(s);
  d.appendChild(pT);
  if (item.desc) { const p = doc.createElement('p'); p.textContent = item.desc; d.appendChild(p); }
  if (item.time) { const p = doc.createElement('p'); p.textContent = item.time; d.appendChild(p); }
  const pL = doc.createElement('p');
  const a = doc.createElement('a');
  a.href = item.href;
  a.textContent = item.href.includes('youtube') ? item.href : 'Read more';
  pL.appendChild(a);
  d.appendChild(pL);
  return d;
}

export default {
  transform: (payload) => {
    const { document } = payload;
    const r = document.createElement('div');

    // Hero
    const hc = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = INSIGHTS_DATA.title;
    hc.appendChild(h1);
    const ps = document.createElement('p');
    ps.textContent = INSIGHTS_DATA.subtitle;
    hc.appendChild(ps);
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Hero', cells: [[hc]] }));

    // Topics
    r.appendChild(document.createElement('hr'));
    const h2t = document.createElement('h2');
    h2t.textContent = 'Topics for you';
    r.appendChild(h2t);
    const tp = document.createElement('p');
    INSIGHTS_DATA.topicLinks.forEach((t, i) => { if (i > 0) tp.appendChild(document.createTextNode(' | ')); const a = document.createElement('a'); a.href = t.href; a.textContent = t.label; tp.appendChild(a); });
    r.appendChild(tp);

    // Featured
    r.appendChild(document.createElement('hr'));
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Cards', cells: INSIGHTS_DATA.featured.map(i => [makeImg(document, i.img, i.title), makeContent(document, i)]) }));

    // Trending
    r.appendChild(document.createElement('hr'));
    const h2tr = document.createElement('h2');
    h2tr.textContent = 'Trending insights';
    r.appendChild(h2tr);
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Cards', cells: INSIGHTS_DATA.trending.map(i => [makeImg(document, i.img, i.title), makeContent(document, i)]) }));

    // Videos
    r.appendChild(document.createElement('hr'));
    const h2v = document.createElement('h2');
    h2v.textContent = 'Watch and learn';
    r.appendChild(h2v);
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Cards', cells: INSIGHTS_DATA.videos.map(i => [makeImg(document, i.img, i.title), makeContent(document, i)]) }));

    // Topics spotlight
    r.appendChild(document.createElement('hr'));
    const h2s = document.createElement('h2');
    h2s.textContent = 'Explore our topics';
    r.appendChild(h2s);
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Cards', cells: INSIGHTS_DATA.topics.map(i => [makeImg(document, i.img, i.title), makeContent(document, i)]) }));

    // Magazine
    r.appendChild(document.createElement('hr'));
    const mc = document.createElement('div');
    const h2m = document.createElement('h2');
    h2m.textContent = INSIGHTS_DATA.magazine.title;
    mc.appendChild(h2m);
    const pi = document.createElement('p');
    const si = document.createElement('strong');
    si.textContent = INSIGHTS_DATA.magazine.issue;
    pi.appendChild(si);
    mc.appendChild(pi);
    const pd = document.createElement('p');
    pd.textContent = INSIGHTS_DATA.magazine.desc;
    mc.appendChild(pd);
    const pl = document.createElement('p');
    const al = document.createElement('a');
    al.href = INSIGHTS_DATA.magazine.href;
    al.textContent = 'Read the latest issue';
    pl.appendChild(al);
    mc.appendChild(pl);
    r.appendChild(WebImporter.Blocks.createBlock(document, { name: 'Columns', cells: [[makeImg(document, INSIGHTS_DATA.magazine.cover, 'Magazine cover'), mc]] }));

    // Research Centers
    r.appendChild(document.createElement('hr'));
    const h2c = document.createElement('h2');
    h2c.textContent = 'Research centers';
    r.appendChild(h2c);
    const pc = document.createElement('p');
    pc.textContent = 'Deloitte\'s research centers fuel the insights that drive decision-making.';
    r.appendChild(pc);
    const ul = document.createElement('ul');
    INSIGHTS_DATA.centers.forEach(c => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = c.href; a.textContent = c.name; li.appendChild(a); ul.appendChild(li); });
    r.appendChild(ul);

    // Metadata
    r.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(r, document);

    return [{ element: r, path: '/test/deloitte/us/en/insights/index', report: { title: 'Deloitte Insights', template: 'deloitte-insights' } }];
  },
};
