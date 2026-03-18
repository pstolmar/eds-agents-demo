/* eslint-disable no-console, max-len */
/**
 * wm-timing.js — Real Core Web Vitals measurement overlay.
 * Activated with ?timing=true on any wm-eds/2 page.
 *
 * Measures:
 *   TTFB  — Time to First Byte
 *   FCP   — First Contentful Paint
 *   LCP   — Largest Contentful Paint
 *   CLS   — Cumulative Layout Shift
 *   INP   — Interaction to Next Paint
 *   Resources — count & total transfer size
 */

/* ── Thresholds (Google "good" / "needs improvement" / "poor") ── */
const THRESHOLDS = {
  ttfb: [800, 1800],
  fcp: [1800, 3000],
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
  inp: [200, 500],
};

function grade(metric, value) {
  const t = THRESHOLDS[metric];
  if (!t) return 'neutral';
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'warn';
  return 'poor';
}

function fmt(metric, value) {
  if (metric === 'cls') return value.toFixed(3);
  return `${Math.round(value)} ms`;
}

/* ── Build the overlay panel ── */
function createPanel() {
  const panel = document.createElement('div');
  panel.className = 'wm-timing-panel';
  panel.innerHTML = `
    <div class="wm-timing-header">
      <span class="wm-timing-title">CWV Performance</span>
      <button class="wm-timing-minimize" title="Minimize">\u2013</button>
    </div>
    <div class="wm-timing-body">
      <div class="wm-timing-row" data-metric="ttfb">
        <span class="wm-timing-label">TTFB</span>
        <span class="wm-timing-value wm-timing-pending">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="fcp">
        <span class="wm-timing-label">FCP</span>
        <span class="wm-timing-value wm-timing-pending">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="lcp">
        <span class="wm-timing-label">LCP</span>
        <span class="wm-timing-value wm-timing-pending">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="cls">
        <span class="wm-timing-label">CLS</span>
        <span class="wm-timing-value wm-timing-pending">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="inp">
        <span class="wm-timing-label">INP</span>
        <span class="wm-timing-value wm-timing-pending">waiting\u2026</span>
      </div>
      <div class="wm-timing-divider"></div>
      <div class="wm-timing-row" data-metric="resources">
        <span class="wm-timing-label">Resources</span>
        <span class="wm-timing-value wm-timing-neutral">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="weight">
        <span class="wm-timing-label">Page weight</span>
        <span class="wm-timing-value wm-timing-neutral">\u2026</span>
      </div>
      <div class="wm-timing-row" data-metric="domload">
        <span class="wm-timing-label">DOM Load</span>
        <span class="wm-timing-value wm-timing-neutral">\u2026</span>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  /* Minimize toggle */
  const btn = panel.querySelector('.wm-timing-minimize');
  const body = panel.querySelector('.wm-timing-body');
  btn.addEventListener('click', () => {
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? '' : 'none';
    btn.textContent = collapsed ? '\u2013' : '+';
  });

  /* Make draggable */
  const header = panel.querySelector('.wm-timing-header');
  let dragging = false;
  let dx = 0;
  let dy = 0;
  header.addEventListener('mousedown', (e) => {
    if (e.target === btn) return;
    dragging = true;
    dx = e.clientX - panel.offsetLeft;
    dy = e.clientY - panel.offsetTop;
    header.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - dx}px`;
    panel.style.top = `${e.clientY - dy}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
    header.style.cursor = 'grab';
  });

  return panel;
}

function updateMetric(panel, metric, value) {
  const row = panel.querySelector(`[data-metric="${metric}"]`);
  if (!row) return;
  const valEl = row.querySelector('.wm-timing-value');
  valEl.textContent = fmt(metric, value);
  valEl.className = `wm-timing-value wm-timing-${grade(metric, value)}`;
}

function updateRaw(panel, metric, text, cls) {
  const row = panel.querySelector(`[data-metric="${metric}"]`);
  if (!row) return;
  const valEl = row.querySelector('.wm-timing-value');
  valEl.textContent = text;
  if (cls) valEl.className = `wm-timing-value wm-timing-${cls}`;
}

/* ── Observers ── */
function observeMetrics(panel) {
  /* TTFB — available immediately from Navigation Timing */
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) {
      updateMetric(panel, 'ttfb', nav.responseStart);
    }
  } catch { /* ignore */ }

  /* FCP */
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entry = list.getEntries().find((e) => e.name === 'first-contentful-paint');
      if (entry) updateMetric(panel, 'fcp', entry.startTime);
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch { /* ignore */ }

  /* LCP */
  try {
    let lcpValue = 0;
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        lcpValue = last.startTime;
        updateMetric(panel, 'lcp', lcpValue);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    /* Finalize on first interaction or visibility change */
    ['keydown', 'click', 'scroll'].forEach((evt) => {
      document.addEventListener(evt, () => {
        if (lcpValue) updateMetric(panel, 'lcp', lcpValue);
      }, { once: true, passive: true });
    });
  } catch { /* ignore */ }

  /* CLS */
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          updateMetric(panel, 'cls', clsValue);
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch { /* ignore */ }

  /* INP */
  try {
    let inpValue = 0;
    const inpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const dur = entry.duration;
        if (dur > inpValue) {
          inpValue = dur;
          updateMetric(panel, 'inp', inpValue);
        }
      });
    });
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch {
    updateRaw(panel, 'inp', 'n/a', 'neutral');
  }

  /* Resource stats */
  function updateResources() {
    const entries = performance.getEntriesByType('resource');
    const count = entries.length;
    let totalBytes = 0;
    entries.forEach((e) => {
      totalBytes += e.transferSize || 0;
    });
    const kb = (totalBytes / 1024).toFixed(0);
    const display = totalBytes > 1048576
      ? `${(totalBytes / 1048576).toFixed(1)} MB`
      : `${kb} KB`;
    updateRaw(panel, 'resources', `${count} requests`, 'neutral');
    updateRaw(panel, 'weight', display, 'neutral');
  }

  /* DOM Load */
  function updateDomLoad() {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.domContentLoadedEventEnd) {
        updateRaw(panel, 'domload', `${Math.round(nav.domContentLoadedEventEnd)} ms`, 'neutral');
      }
    } catch { /* ignore */ }
  }

  /* Poll resource/DOM stats briefly then settle */
  let polls = 0;
  const interval = setInterval(() => {
    updateResources();
    updateDomLoad();
    polls += 1;
    if (polls > 20) clearInterval(interval);
  }, 500);
}

/* ── Init ── */
export default function initTiming() {
  const panel = createPanel();
  observeMetrics(panel);
  console.log('[wm-timing] CWV Performance overlay active');
}
