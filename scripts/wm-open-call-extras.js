/* eslint-disable max-len */
/**
 * wm-open-call-extras.js — 12 fun extras for the Open Call 2026 page.
 * ONLY loads when ?extras=true is present. Zero impact otherwise.
 */

/* ──────────── 1. Scroll-Reveal Animations ──────────── */
function initScrollReveal() {
  const sections = document.querySelectorAll('main .section');
  sections.forEach((s) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(40px)';
    s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((s) => observer.observe(s));
}

/* ──────────── 2. Animated Number Counters ──────────── */
function initCounters() {
  const main = document.querySelector('main');
  if (!main) return;
  const text = main.textContent;

  const targets = [
    { find: '$350 billion', display: '$350B', value: 350 },
    { find: '750,000', display: '750,000', value: 750000 },
    { find: '$176 billion', display: '$176B', value: 176 },
  ];

  targets.forEach((t) => {
    // Re-walk each time since previous replacements invalidate text nodes
    const w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    let tn = null;
    let n;
    // eslint-disable-next-line no-cond-assign
    while (n = w.nextNode()) {
      if (n.textContent.includes(t.find)) { tn = n; break; }
    }
    if (!tn || !tn.parentNode) return;
    const span = document.createElement('span');
    span.className = 'wm-counter';
    span.dataset.target = t.value;
    span.textContent = t.find;
    span.style.cssText = 'color:#0053e2;font-weight:700;';
    const parts = tn.textContent.split(t.find);
    const parent = tn.parentNode;
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(parts[0]));
    frag.appendChild(span);
    if (parts[1]) frag.appendChild(document.createTextNode(parts[1]));
    parent.replaceChild(frag, tn);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const original = el.textContent;
      const prefix = original.startsWith('$') ? '$' : '';
      const isBillion = original.includes('billion');
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const current = Math.round(target * eased);
        if (isBillion) {
          el.textContent = `${prefix}${current} billion`;
        } else {
          el.textContent = current.toLocaleString();
        }
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.wm-counter').forEach((c) => counterObserver.observe(c));
}

/* ──────────── 3. Live Countdown Timer ──────────── */
function initCountdown() {
  const target = new Date('2026-10-06T08:00:00-05:00');
  const bar = document.createElement('div');
  bar.className = 'wm-countdown';
  bar.innerHTML = '<div class="wm-cd-label">Open Call 2026</div><div class="wm-cd-timer"></div>';
  const firstSection = document.querySelector('main .section');
  if (firstSection) firstSection.prepend(bar);

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) { bar.querySelector('.wm-cd-timer').textContent = 'Event is LIVE!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    bar.querySelector('.wm-cd-timer').innerHTML = `<span>${d}<small>days</small></span><span>${h}<small>hrs</small></span><span>${m}<small>min</small></span><span>${s}<small>sec</small></span>`;
  }
  update();
  setInterval(update, 1000);
}

/* ──────────── 4. Interactive US Tour Map ──────────── */
function initTourMap() {
  const stops = [
    { city: 'Los Angeles, CA', x: 10, y: 62 },
    { city: 'New Orleans, LA', x: 58, y: 72 },
    { city: 'Dallas, TX', x: 48, y: 68 },
    { city: 'Orlando, FL', x: 72, y: 75 },
    { city: 'Baltimore, MD', x: 78, y: 42 },
    { city: 'Indianapolis, IN', x: 63, y: 42 },
    { city: 'Salt Lake City, UT', x: 22, y: 38 },
    { city: 'Atlanta, GA', x: 68, y: 62 },
  ];

  const mapWrap = document.createElement('div');
  mapWrap.className = 'wm-tour-map';
  mapWrap.innerHTML = `
    <h3>Road to Open Call Tour Stops</h3>
    <div class="wm-map-container">
      <svg viewBox="0 0 100 80" class="wm-map-usa">
        <path d="M5,20 Q15,10 30,15 Q45,8 60,12 Q75,8 90,15 L92,25 Q95,35 90,45 L88,55 Q85,65 75,70 L65,75 Q55,78 45,75 L30,72 Q20,70 12,65 L8,55 Q3,45 5,35 Z" fill="#e8f0fe" stroke="#0053e2" stroke-width="0.5"/>
      </svg>
      ${stops.map((s, i) => `<div class="wm-map-pin" style="left:${s.x}%;top:${s.y}%" data-city="${s.city}" data-idx="${i}"><div class="wm-pin-dot"></div><div class="wm-pin-label">${s.city}</div></div>`).join('')}
    </div>
  `;

  const tourH3 = document.querySelector('#this-years-tour-stops');
  if (tourH3) tourH3.parentElement.insertBefore(mapWrap, tourH3);

  // Animate pins sequentially
  const pins = mapWrap.querySelectorAll('.wm-map-pin');
  pins.forEach((pin, i) => {
    pin.style.animationDelay = `${i * 0.3}s`;
  });
}

/* ──────────── 5. Performance HUD ──────────── */
function initPerfHUD() {
  const hud = document.createElement('div');
  hud.className = 'wm-perf-hud';
  hud.innerHTML = '<div class="wm-hud-title">Performance</div><div class="wm-hud-content"></div>';
  document.body.appendChild(hud);

  let frames = 0;
  let lastTime = performance.now();
  let fps = 0;

  function measureFPS() {
    frames += 1;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round(frames * 1000 / (now - lastTime));
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(measureFPS);
  }
  requestAnimationFrame(measureFPS);

  setInterval(() => {
    const domNodes = document.querySelectorAll('*').length;
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint');
    const mem = performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)}MB` : 'N/A';

    hud.querySelector('.wm-hud-content').innerHTML = `
      <div><span>FPS</span><strong style="color:${fps >= 50 ? '#22c55e' : fps >= 30 ? '#f59e0b' : '#ef4444'}">${fps}</strong></div>
      <div><span>DOM</span><strong>${domNodes}</strong></div>
      <div><span>FCP</span><strong>${fcp ? `${Math.round(fcp.startTime)}ms` : '—'}</strong></div>
      <div><span>Heap</span><strong>${mem}</strong></div>
    `;
  }, 500);
}

/* ──────────── 6. Scroll Progress Indicator ──────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'wm-scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ──────────── 7. Reading Time Badge ──────────── */
function initReadingTime() {
  const main = document.querySelector('main');
  if (!main) return;
  const words = main.textContent.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const badge = document.createElement('div');
  badge.className = 'wm-reading-time';
  badge.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M10 5v5l3.5 3.5"/></svg> ${minutes} min read`;
  const h1 = main.querySelector('h1');
  if (h1) h1.after(badge);
}

/* ──────────── 8. Confetti Burst ──────────── */
function initConfetti() {
  const carousel = document.querySelector('.carousel-wrapper');
  if (!carousel) return;

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      fireConfetti();
    }
  }, { threshold: 0.3 });
  observer.observe(carousel);
}

function fireConfetti() {
  const colors = ['#0053e2', '#ffc220', '#76c043', '#e8491d', '#fff'];
  const container = document.createElement('div');
  container.className = 'wm-confetti-container';
  document.body.appendChild(container);

  for (let i = 0; i < 80; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'wm-confetti-piece';
    piece.style.cssText = `
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      width:${4 + Math.random() * 6}px;
      height:${4 + Math.random() * 6}px;
      animation-duration:${1.5 + Math.random() * 2}s;
      animation-delay:${Math.random() * 0.5}s;
    `;
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 4000);
}

/* ──────────── 9. Parallax Hero ──────────── */
function initParallax() {
  const heroImg = document.querySelector('main .section:first-child picture img');
  if (!heroImg) return;
  heroImg.style.transition = 'transform 0.1s linear';

  window.addEventListener('scroll', () => {
    const rect = heroImg.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      heroImg.style.transform = `translateY(${offset}px) scale(1.1)`;
    }
  }, { passive: true });

  heroImg.parentElement.style.overflow = 'hidden';
}

/* ──────────── 10. Dark Mode Toggle ──────────── */
function initDarkMode() {
  const btn = document.createElement('button');
  btn.className = 'wm-dark-toggle';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
  btn.title = 'Toggle Dark Mode';
  document.body.appendChild(btn);

  let dark = false;
  btn.addEventListener('click', () => {
    dark = !dark;
    document.body.classList.toggle('wm-dark', dark);
    btn.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
  });
}

/* ──────────── 11. Floating Action Menu ──────────── */
function initFAB() {
  const fab = document.createElement('div');
  fab.className = 'wm-fab';
  fab.innerHTML = `
    <button class="wm-fab-main" title="Quick Actions">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
    </button>
    <div class="wm-fab-actions">
      <button title="Share Page" onclick="navigator.share?.({title:document.title,url:location.href}).catch(()=>{})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
      </button>
      <button title="Print Page" onclick="window.print()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      </button>
      <button title="Back to Top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(fab);

  const mainBtn = fab.querySelector('.wm-fab-main');
  let open = false;
  mainBtn.addEventListener('click', () => {
    open = !open;
    fab.classList.toggle('open', open);
    mainBtn.style.transform = open ? 'rotate(45deg)' : '';
  });
}

/* ──────────── 12. Ambient Particles ──────────── */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'wm-particles';
  const hero = document.querySelector('main .section:first-child');
  if (!hero) return;
  hero.style.position = 'relative';
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w; let h;

  function resize() {
    w = hero.offsetWidth;
    h = hero.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 0.3 - 0.1;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > w + 10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 83, 226, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 40; i += 1) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ──────────── Init All Extras ──────────── */
export default function initOpenCallExtras() {
  initScrollProgress();
  initReadingTime();
  initCountdown();
  initCounters();
  initTourMap();
  initParallax();
  initConfetti();
  initDarkMode();
  initFAB();
  initPerfHUD();
  initParticles();

  // Scroll reveal last so sections start hidden
  requestAnimationFrame(() => initScrollReveal());
}
