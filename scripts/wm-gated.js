/* eslint-disable max-len */

/* ===== wm-gated.js — Simulated SAML SSO gating for /content/gated ===== */

const SAML_IDP = 'idp.walmart.corp';

function makeEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function buildSSOOverlay() {
  const overlay = makeEl('div', 'wm-sso-overlay');
  overlay.id = 'wm-sso-overlay';
  overlay.innerHTML = `
    <div class="wm-sso-modal">
      <div class="wm-sso-logo">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <g fill="#FFC220">
            <polygon points="16,0 18.5,11.5 16,8 13.5,11.5"/>
            <polygon points="16,32 13.5,20.5 16,24 18.5,20.5"/>
            <polygon points="0,16 11.5,13.5 8,16 11.5,18.5"/>
            <polygon points="32,16 20.5,18.5 24,16 20.5,13.5"/>
            <polygon points="2.3,2.3 12.5,10.5 7.5,10 10.5,12.5"/>
            <polygon points="29.7,29.7 19.5,21.5 24.5,22 21.5,19.5"/>
            <polygon points="29.7,2.3 21.5,12.5 22,7.5 19.5,10.5"/>
            <polygon points="2.3,29.7 10.5,19.5 10,24.5 12.5,21.5"/>
          </g>
        </svg>
      </div>
      <h2>Walmart Corporate SSO</h2>
      <p class="wm-sso-subtitle">Sign in with your enterprise credentials</p>
      <div class="wm-sso-provider">
        <span class="wm-sso-lock-icon">
          <svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        </span>
        <span>SAML 2.0 via ${SAML_IDP}</span>
      </div>
      <form class="wm-sso-form">
        <label class="wm-sso-field">
          <span>Corporate Email</span>
          <input type="email" placeholder="first.last@walmart.com" value="jane.smith@walmart.com" />
        </label>
        <label class="wm-sso-field">
          <span>Password</span>
          <input type="password" placeholder="Enter your password" value="••••••••••" />
        </label>
        <button type="submit" class="wm-sso-submit">Sign In with SSO</button>
      </form>
      <div class="wm-sso-footer">
        <span>Protected by SAML 2.0</span>
        <span>Session timeout: 8 hours</span>
      </div>
    </div>
  `;
  return overlay;
}

function simulateSSOFlow(overlay, onSuccess) {
  const form = overlay.querySelector('.wm-sso-form');
  const btn = overlay.querySelector('.wm-sso-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.textContent = 'Authenticating...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    /* Simulate SAML redirect flow */
    setTimeout(() => {
      btn.textContent = 'Redirecting to IdP...';
    }, 600);
    setTimeout(() => {
      btn.textContent = 'Validating assertion...';
    }, 1400);
    setTimeout(() => {
      btn.textContent = 'Session established ✓';
      btn.style.background = '#22c55e';
    }, 2200);
    setTimeout(() => {
      overlay.classList.add('wm-sso-fade-out');
      setTimeout(() => {
        overlay.remove();
        onSuccess();
      }, 400);
    }, 2800);
  });
}

function blurContent() {
  const main = document.querySelector('main');
  if (main) {
    main.style.filter = 'blur(12px)';
    main.style.pointerEvents = 'none';
    main.style.userSelect = 'none';
    main.style.transition = 'filter 0.4s ease';
  }
}

function unblurContent() {
  const main = document.querySelector('main');
  if (main) {
    main.style.filter = '';
    main.style.pointerEvents = '';
    main.style.userSelect = '';
  }
  /* Add session indicator */
  const indicator = makeEl('div', 'wm-session-bar');
  indicator.innerHTML = `
    <span class="wm-sb-lock">🔒</span>
    <span>Authenticated: <strong>Jane Smith</strong> (jane.smith@walmart.com)</span>
    <span class="wm-sb-session">Session: SAML 2.0 | IdP: ${SAML_IDP} | Expires: ${new Date(Date.now() + 8 * 3600000).toLocaleTimeString()}</span>
    <button class="wm-sb-logout">Sign Out</button>
  `;
  document.body.prepend(indicator);
  indicator.querySelector('.wm-sb-logout').addEventListener('click', () => {
    indicator.remove();
    blurContent();
    const newOverlay = buildSSOOverlay();
    document.body.appendChild(newOverlay);
    simulateSSOFlow(newOverlay, unblurContent);
  });
}

export default function init() {
  document.body.classList.add('wm-gated-page');
  blurContent();
  const overlay = buildSSOOverlay();
  document.body.appendChild(overlay);
  simulateSSOFlow(overlay, unblurContent);
}
