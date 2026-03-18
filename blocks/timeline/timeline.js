/*
 * Timeline Block
 * Animated vertical timeline with alternating left/right milestones.
 * Each row: col 1 = date/year, col 2 = description text
 * Milestones reveal with staggered animation on scroll.
 */
export default function decorate(block) {
  const rows = [...block.children];

  /* Build the timeline rail */
  const rail = document.createElement('div');
  rail.className = 'timeline-rail';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const date = cols[0]?.textContent.trim() || '';
    const bodyHTML = cols[1]?.innerHTML || '';

    const item = document.createElement('div');
    item.className = `timeline-item ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`;

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';

    const card = document.createElement('div');
    card.className = 'timeline-card';

    const dateEl = document.createElement('div');
    dateEl.className = 'timeline-date';
    dateEl.textContent = date;

    const body = document.createElement('div');
    body.className = 'timeline-body';
    body.innerHTML = bodyHTML;

    card.append(dateEl, body);
    item.append(dot, card);
    rail.appendChild(item);
  });

  /* Replace block content with the rail */
  block.textContent = '';
  block.appendChild(rail);

  /* Observe each item for scroll-reveal */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );

  rail.querySelectorAll('.timeline-item').forEach((item) => observer.observe(item));
}
