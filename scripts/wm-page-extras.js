/* eslint-disable max-len */
/**
 * wm-page-extras.js — 7 fun extras for wm-eds/2 pages (homepage, news, events, forms).
 * ONLY loads when ?extras=true is present. Zero impact otherwise.
 */

/* ──────────── 1. Card 3D Tilt Hover ──────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.cards li, .cards > div > div');
  cards.forEach((card) => {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.boxShadow = '0 12px 30px rgb(0 0 0 / 15%)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ──────────── 2. Form Field Magic (floating labels + submit confetti) ──────────── */
function burstConfetti(anchor) {
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + (rect.width / 2);
  const cy = rect.top;
  const colors = ['#ffc220', '#0053e2', '#22c55e', '#e2004f', '#ff8c00'];

  for (let i = 0; i < 40; i += 1) {
    const dot = document.createElement('div');
    dot.className = 'extras-confetti';
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    dot.style.backgroundColor = colors[i % colors.length];
    const angle = (Math.random() * Math.PI * 2);
    const velocity = 80 + (Math.random() * 120);
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity - 60;
    dot.style.setProperty('--dx', `${dx}px`);
    dot.style.setProperty('--dy', `${dy}px`);
    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
}

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

  /* Confetti burst on successful form submit */
  const forms = document.querySelectorAll('.form-container');
  forms.forEach((form) => {
    const btn = form.querySelector('.form-submit');
    if (!btn) return;

    const formEl = btn.closest('form');
    if (!formEl) return;

    formEl.addEventListener('submit', () => {
      setTimeout(() => {
        if (btn.disabled && btn.classList.contains('form-btn-success')) {
          burstConfetti(btn);
        }
      }, 100);
    });
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

/* ──────────── 5. Hero Parallax Depth ──────────── */
function initHeroParallax() {
  const hero = document.querySelector('.hero-video-wrapper');
  if (!hero) return;

  const content = hero.querySelector('.hero-video-content');
  if (!content) return;

  window.addEventListener('scroll', () => {
    const { scrollY } = window;
    const maxScroll = hero.offsetHeight;
    if (scrollY > maxScroll) return;
    const ratio = scrollY / maxScroll;
    content.style.transform = `translateY(${ratio * 40}px)`;
    content.style.opacity = `${1 - (ratio * 0.6)}`;
  }, { passive: true });
}

/* ──────────── 6. Konami Code Easter Egg ──────────── */
function triggerSparkBurst() {
  const overlay = document.createElement('div');
  overlay.className = 'extras-konami-overlay';
  overlay.innerHTML = `
    <div class="extras-konami-content">
      <div class="extras-konami-spark">✨</div>
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
  badge.innerHTML = `<span>📖</span> ${minutes} min read`;

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
  initHeroParallax();
  initKonamiCode();
  initReadingTime();
}
