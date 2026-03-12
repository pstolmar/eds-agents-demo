/* eslint-disable max-len */

/* ===== wm-partly-gated.js — Separately gated widgets with blur-on-unfocus ===== */

function makeEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

/* ─── Mock Data ─── */
const INVENTORY_ITEMS = [
  {
    sku: 'WM-GV-001', name: 'Great Value Whole Milk 1gal', qty: 342, reorder: 100, price: 3.64, status: 'ok',
  },
  {
    sku: 'WM-GV-027', name: 'Great Value Bread Wheat', qty: 89, reorder: 150, price: 1.48, status: 'low',
  },
  {
    sku: 'WM-EQ-103', name: 'Equate Ibuprofen 200mg 100ct', qty: 256, reorder: 50, price: 4.97, status: 'ok',
  },
  {
    sku: 'WM-SP-044', name: 'Spring Valley Vitamin D3', qty: 12, reorder: 75, price: 6.88, status: 'critical',
  },
  {
    sku: 'WM-MW-089', name: 'Mainstays Bath Towel Set', qty: 178, reorder: 40, price: 9.97, status: 'ok',
  },
  {
    sku: 'WM-OL-201', name: "Ol' Roy Dog Food 50lb", qty: 45, reorder: 60, price: 22.98, status: 'low',
  },
];

const PRICING_UPDATES = [
  {
    sku: 'WM-GV-001', name: 'Great Value Whole Milk', current: 3.64, proposed: 3.48, screen: 'Dairy Aisle #2', reason: 'Competitor match',
  },
  {
    sku: 'WM-SP-044', name: 'Spring Valley Vitamin D3', current: 6.88, proposed: 5.97, screen: 'Pharmacy Display', reason: 'Clearance',
  },
  {
    sku: 'WM-MW-089', name: 'Mainstays Bath Towel Set', current: 9.97, proposed: 12.97, screen: 'Home Dept Endcap', reason: 'Cost increase',
  },
];

const SAML_IDP = 'idp.walmart.corp';

/* ─── Mini SSO Dialog ─── */
function showWidgetSSO(widget, group, level, onAuth) {
  const existing = widget.querySelector('.wm-widget-sso');
  if (existing) existing.remove();

  const sso = makeEl('div', 'wm-widget-sso');
  sso.innerHTML = `
    <div class="wm-ws-dialog">
      <div class="wm-ws-header">
        <svg viewBox="0 0 16 16" fill="#FFC220" width="20" height="20"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="#FFC220" stroke-width="1.5"/></svg>
        <span>Widget Authentication Required</span>
      </div>
      <div class="wm-ws-body">
        <p><strong>Group:</strong> ${group}</p>
        <p><strong>Auth Level:</strong> ${level}</p>
        <p><strong>IdP:</strong> ${SAML_IDP}</p>
        <button class="wm-ws-auth-btn">Authenticate</button>
      </div>
    </div>
  `;
  widget.appendChild(sso);

  sso.querySelector('.wm-ws-auth-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = sso.querySelector('.wm-ws-auth-btn');
    btn.textContent = 'Verifying...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Authorized ✓';
      btn.style.background = '#22c55e';
    }, 800);
    setTimeout(() => {
      sso.classList.add('wm-ws-fade-out');
      setTimeout(() => {
        sso.remove();
        onAuth();
      }, 300);
    }, 1200);
  });
}

/* ─── Build Inventory Widget ─── */
function buildInventoryWidget(container) {
  container.innerHTML = '';
  const widget = makeEl('div', 'wm-inv-widget');
  widget.innerHTML = `
    <div class="wm-inv-header">
      <h3>Live Inventory — Store #4208 Bentonville</h3>
      <span class="wm-inv-refresh">↻ Auto-refresh: 30s</span>
    </div>
    <table class="wm-inv-table">
      <thead>
        <tr><th>SKU</th><th>Product</th><th>Qty</th><th>Reorder</th><th>Price</th><th>Status</th></tr>
      </thead>
      <tbody></tbody>
    </table>
    <div class="wm-inv-summary">
      <span>Total SKUs: ${INVENTORY_ITEMS.length}</span>
      <span class="wm-inv-low">Low Stock: ${INVENTORY_ITEMS.filter((i) => i.status !== 'ok').length}</span>
      <span>Last sync: ${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  const tbody = widget.querySelector('tbody');
  INVENTORY_ITEMS.forEach((item) => {
    const statusCls = { ok: 'wm-inv-ok', low: 'wm-inv-low', critical: 'wm-inv-critical' };
    const statusLabel = { ok: 'In Stock', low: 'Low', critical: 'Critical' };
    const tr = makeEl('tr', '');
    tr.innerHTML = `
      <td><code>${item.sku}</code></td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.reorder}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><span class="wm-inv-status ${statusCls[item.status]}">${statusLabel[item.status]}</span></td>
    `;
    tbody.appendChild(tr);
  });
  container.appendChild(widget);
}

/* ─── Build Pricing Widget ─── */
function buildPricingWidget(container) {
  container.innerHTML = '';
  const widget = makeEl('div', 'wm-price-widget');
  widget.innerHTML = `
    <div class="wm-price-header">
      <h3>AEM Screens — Price Update Console</h3>
      <span class="wm-price-badge">ELEVATED ACCESS</span>
    </div>
    <div class="wm-price-list"></div>
    <div class="wm-price-actions">
      <button class="wm-price-push-btn">Push All Updates to AEM Screens</button>
      <span class="wm-price-note">Changes propagate to in-store digital signage within 60 seconds</span>
    </div>
  `;

  const list = widget.querySelector('.wm-price-list');
  PRICING_UPDATES.forEach((p) => {
    const diff = p.proposed - p.current;
    const direction = diff > 0 ? 'up' : 'down';
    const card = makeEl('div', 'wm-price-card');
    card.innerHTML = `
      <div class="wm-price-card-top">
        <div>
          <strong>${p.name}</strong>
          <code>${p.sku}</code>
        </div>
        <div class="wm-price-change wm-price-${direction}">
          $${p.current.toFixed(2)} → $${p.proposed.toFixed(2)}
        </div>
      </div>
      <div class="wm-price-card-meta">
        <span>Screen: ${p.screen}</span>
        <span>Reason: ${p.reason}</span>
      </div>
      <div class="wm-price-card-actions">
        <button class="wm-price-approve">Approve</button>
        <button class="wm-price-reject">Reject</button>
      </div>
    `;
    card.querySelector('.wm-price-approve').addEventListener('click', (e) => {
      e.target.textContent = 'Approved ✓';
      e.target.disabled = true;
      e.target.style.background = '#22c55e';
      e.target.style.color = '#fff';
    });
    card.querySelector('.wm-price-reject').addEventListener('click', (e) => {
      e.target.textContent = 'Rejected ✗';
      e.target.disabled = true;
      e.target.style.background = '#ef4444';
      e.target.style.color = '#fff';
    });
    list.appendChild(card);
  });

  widget.querySelector('.wm-price-push-btn').addEventListener('click', (e) => {
    e.target.textContent = 'Pushing to screens...';
    e.target.disabled = true;
    setTimeout(() => {
      e.target.textContent = 'Updates pushed to 3 screens ✓';
      e.target.style.background = '#22c55e';
    }, 1500);
  });

  container.appendChild(widget);
}

/* ─── Blur on Unfocus ─── */
function setupBlurBehavior(widget, group, level, buildFn) {
  let authenticated = false;
  const content = widget;

  function blur() {
    content.classList.add('wm-widget-blurred');
    authenticated = false;
  }

  function authenticate() {
    showWidgetSSO(content, group, level, () => {
      content.classList.remove('wm-widget-blurred');
      authenticated = true;
      buildFn(content);
    });
  }

  /* Initial state: blurred */
  content.classList.add('wm-widget-blurred');

  /* Click to authenticate */
  content.addEventListener('click', () => {
    if (!authenticated) authenticate();
  });

  /* Blur on mouse leave */
  content.addEventListener('mouseleave', () => {
    if (authenticated) {
      setTimeout(() => blur(), 500);
    }
  });

  /* Blur on tab switch */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && authenticated) blur();
  });

  /* Blur on window blur */
  window.addEventListener('blur', () => {
    if (authenticated) blur();
  });
}

export default function init() {
  document.body.classList.add('wm-partly-gated-page');

  /* Find widget containers */
  const main = document.querySelector('main');
  if (!main) return;

  const sections = [...main.querySelectorAll('.section')];

  /* Inventory widget — look for section with "Inventory" heading */
  const invSection = sections.find((s) => {
    const h = s.querySelector('h2');
    return h && h.textContent.toLowerCase().includes('inventory');
  });
  if (invSection) {
    const container = invSection.querySelector('.default-content-wrapper') || invSection;
    /* Keep the heading, replace the rest */
    const heading = container.querySelector('h2');
    const widgetWrap = makeEl('div', 'wm-widget-container wm-widget-inventory');
    widgetWrap.innerHTML = '<div class="wm-widget-placeholder">🔒 Click to authenticate and view Inventory Tracker</div>';
    if (heading) heading.after(widgetWrap);
    else container.appendChild(widgetWrap);
    /* Remove old content paragraphs */
    container.querySelectorAll('.partly-gated, p:not(.wm-widget-container p)').forEach((el) => {
      if (el !== heading && !el.closest('.wm-widget-container')) el.remove();
    });
    setupBlurBehavior(widgetWrap, 'Store Managers, Inventory Analysts', 'SAML L2', buildInventoryWidget);
  }

  /* Pricing widget */
  const priceSection = sections.find((s) => {
    const h = s.querySelector('h2');
    return h && h.textContent.toLowerCase().includes('price');
  });
  if (priceSection) {
    const container = priceSection.querySelector('.default-content-wrapper') || priceSection;
    const heading = container.querySelector('h2');
    const widgetWrap = makeEl('div', 'wm-widget-container wm-widget-pricing');
    widgetWrap.innerHTML = '<div class="wm-widget-placeholder">🔒 Click to authenticate and view Price Update Console</div>';
    if (heading) heading.after(widgetWrap);
    else container.appendChild(widgetWrap);
    container.querySelectorAll('.partly-gated, p:not(.wm-widget-container p)').forEach((el) => {
      if (el !== heading && !el.closest('.wm-widget-container')) el.remove();
    });
    setupBlurBehavior(widgetWrap, 'Pricing Analysts, Regional Directors', 'SAML L3 (Elevated)', buildPricingWidget);
  }
}
