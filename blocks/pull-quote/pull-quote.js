/*
 * Pull Quote Block
 * Decorative blockquote with large quotation mark, accent border,
 * and fade-in-on-scroll reveal animation.
 * Row 1 = quote text, Row 2 = attribution (optional)
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  rows[0].classList.add('pull-quote-text');
  if (rows[1]) rows[1].classList.add('pull-quote-attribution');

  // Decorative opening quotation mark
  const mark = document.createElement('div');
  mark.className = 'pull-quote-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = '\u201C';
  block.prepend(mark);

  // Fade in on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        block.classList.add('visible');
        observer.disconnect();
      }
    },
    { threshold: 0.15 },
  );

  observer.observe(block);
}
