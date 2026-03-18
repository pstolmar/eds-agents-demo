/* eslint-disable max-len */
/**
 * wm-page-extras.js — 7 professional extras for wm-eds/2 pages.
 * ONLY loads when ?extras=true is present. Zero impact otherwise.
 *
 * 1. Card 3D Tilt Hover — perspective tilt on card mousemove
 * 2. Form Floating Labels — material-style labels that float on focus
 * 3. Scroll Progress Bar — gradient bar at top of viewport
 * 4. Typing Search Placeholder — animated typewriter in search input
 * 5. Smooth Section Reveal — sections fade/slide in on scroll
 * 6. Konami Code Easter Egg — ↑↑↓↓←→←→BA triggers spark overlay
 * 7. Smart Reading Time — word-count reading time badge
 */

/* ──────────── 1. Card 3D Tilt Hover ──────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.cards li');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.transition = 'transform 0.25s ease-out, box-shadow 0.25s ease-out';
    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      card.style.boxShadow = '0 20px 40px rgb(0 0 0 / 12%), 0 4px 12px rgb(0 0 0 / 8%)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ──────────── 2. Form Floating Labels ──────────── */
function initFormMagic() {
  const formFields = document.querySelectorAll('.form-field');
  formFields.forEach((field) => {
    const input = field.querySelector('.form-input');
    const label = field.querySelector('label');
    if (!input || !label) return;

    field.classList.add('extras-float-field');
    input.addEventListener('focus', () => field.classList.add('extras-focused'));
    input.addEventListener('blur', () => {
      field.classList.remove('extras-focused');
      if (input.value) field.classList.add('extras-filled');
      else field.classList.remove('extras-filled');
    });
    if (input.value) field.classList.add('extras-filled');
  });
}

/* ──────────── 3. Scroll Progress Bar ──────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'extras-scroll-bar';
  document.body.appendChild(bar);

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ──────────── 4. Typing Search Placeholder ──────────── */
function initTypingPlaceholder() {
  const input = document.querySelector('.news-search-input');
  if (!input) return;

  const phrases = [
    'Search news...',
    'Try "community"',
    'Try "innovation"',
    'Try "earnings"',
    'Search by topic...',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function tick() {
    if (paused) return;
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx += 1;
      input.placeholder = phrase.substring(0, charIdx);
      if (charIdx >= phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80 + (Math.random() * 40));
    } else {
      charIdx -= 1;
      input.placeholder = phrase.substring(0, charIdx);
      if (charIdx <= 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  /* Pause when user focuses, resume when they blur with empty input */
  input.addEventListener('focus', () => { paused = true; });
  input.addEventListener('blur', () => {
    if (!input.value) {
      paused = false;
      tick();
    }
  });

  tick();
}

/* ──────────── 5. Smooth Section Reveal ──────────── */
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  /* Apply initial hidden state */
  sections.forEach((section, i) => {
    if (i === 0) return; /* Keep first section visible */
    section.classList.add('extras-section-hidden');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('extras-section-hidden');
        entry.target.classList.add('extras-section-reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  sections.forEach((section, i) => {
    if (i > 0) observer.observe(section);
  });
}

/* ──────────── 6. Konami Code Easter Egg ──────────── */
function triggerSparkBurst() {
  const overlay = document.createElement('div');
  overlay.className = 'extras-konami-overlay';
  overlay.innerHTML = `
    <div class="extras-konami-content">
      <div class="extras-konami-spark">\u2728</div>
      <div class="extras-konami-text">You found the secret!</div>
      <div class="extras-konami-sub">Always Low Prices. Always.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* Spark particles */
  const colors = ['#ffc220', '#0053e2', '#76c043', '#f47721'];
  for (let i = 0; i < 30; i += 1) {
    const spark = document.createElement('div');
    spark.className = 'extras-konami-particle';
    spark.style.backgroundColor = colors[i % colors.length];
    const angle = (i / 30) * Math.PI * 2;
    const dist = 100 + (Math.random() * 150);
    spark.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    spark.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    spark.style.animationDelay = `${Math.random() * 0.3}s`;
    overlay.querySelector('.extras-konami-content').appendChild(spark);
  }

  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  }, 3000);
}

function initKonamiCode() {
  const sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === sequence[pos]) {
      pos += 1;
      if (pos >= sequence.length) {
        pos = 0;
        triggerSparkBurst();
      }
    } else {
      pos = 0;
    }
  });
}

/* ──────────── 7. Smart Reading Time ──────────── */
function initReadingTime() {
  const main = document.querySelector('main');
  if (!main) return;

  const text = main.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(wordCount / 220));

  const badge = document.createElement('div');
  badge.className = 'extras-reading-time';
  badge.textContent = `\u{1F4D6} ${minutes} min read`;

  const firstSection = main.querySelector('.section');
  if (firstSection) {
    const wrapper = firstSection.querySelector('.default-content-wrapper');
    const target = wrapper || firstSection;
    target.insertBefore(badge, target.children[1] || null);
  }
}

/* ──────────── Init ──────────── */
export default function initPageExtras() {
  initScrollProgress();
  initCardTilt();
  initFormMagic();
  initTypingPlaceholder();
  initSectionReveal();
  initKonamiCode();
  initReadingTime();
}
