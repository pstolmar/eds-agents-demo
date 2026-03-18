/* eslint-disable max-len */
/**
 * Form Block — renders styled HTML forms.
 * Supports two modes:
 * 1. Template mode: single cell with form ID (e.g., "contact-media-relations")
 * 2. Row mode: rows of [label, type] pairs
 */

const FORM_TEMPLATES = {
  'contact-media-relations': {
    fields: [
      {
        name: 'name', label: 'Full Name', type: 'text', required: true,
      },
      {
        name: 'email', label: 'Email Address', type: 'email', required: true,
      },
      {
        name: 'phone', label: 'Phone Number', type: 'tel', required: false,
      },
      {
        name: 'outlet', label: 'Media Outlet / Publication', type: 'text', required: true,
      },
      {
        name: 'topic', label: 'Topic', type: 'select', required: true, options: ['General Inquiry', 'Company News', 'Financial', 'Sustainability', 'Community', 'Suppliers', 'Technology', 'Other'],
      },
      {
        name: 'message', label: 'Message', type: 'textarea', required: true, rows: 5,
      },
    ],
    submitText: 'Submit Inquiry',
  },
  'open-call-registration': {
    fields: [
      {
        name: 'first-name', label: 'First Name', type: 'text', required: true,
      },
      {
        name: 'last-name', label: 'Last Name', type: 'text', required: true,
      },
      {
        name: 'company-name', label: 'Company Name', type: 'text', required: true,
      },
      {
        name: 'email', label: 'Email address', type: 'email', required: true,
      },
    ],
    submitText: 'Submit',
  },
};

function createField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-field';

  const label = document.createElement('label');
  label.setAttribute('for', `form-${field.name}`);
  label.textContent = field.label;
  if (field.required) {
    const req = document.createElement('span');
    req.className = 'form-required';
    req.textContent = ' *';
    label.appendChild(req);
  }
  wrapper.appendChild(label);

  let input;
  if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = field.rows || 4;
  } else if (field.type === 'select') {
    input = document.createElement('select');
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = `Select ${field.label}...`;
    ph.disabled = true;
    ph.selected = true;
    input.appendChild(ph);
    (field.options || []).forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      input.appendChild(o);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.id = `form-${field.name}`;
  input.name = field.name;
  if (field.required) input.required = true;
  input.className = 'form-input';

  input.addEventListener('blur', () => {
    if (!input.checkValidity()) {
      input.classList.add('form-shake', 'form-invalid');
      setTimeout(() => input.classList.remove('form-shake'), 500);
    } else {
      input.classList.remove('form-invalid');
    }
  });

  wrapper.appendChild(input);
  return wrapper;
}

function buildCaptcha() {
  const wrap = document.createElement('div');
  wrap.className = 'form-captcha';
  wrap.innerHTML = `
    <label class="captcha-label">
      <input type="checkbox" class="captcha-checkbox" required>
      <span class="captcha-box"></span>
      <span class="captcha-text">I'm not a robot</span>
    </label>
    <div class="captcha-badge">reCAPTCHA</div>
  `;
  return wrap;
}

function buildFromTemplate(block, template) {
  const form = document.createElement('form');
  form.className = 'form-container';
  form.noValidate = true;

  template.fields.forEach((f) => form.appendChild(createField(f)));
  form.appendChild(buildCaptcha());

  const submitWrap = document.createElement('div');
  submitWrap.className = 'form-submit-wrap';
  submitWrap.innerHTML = `<button type="submit" class="form-submit">${template.submitText || 'Submit'}</button>`;
  form.appendChild(submitWrap);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const captcha = form.querySelector('.captcha-checkbox');
    if (!captcha.checked) {
      captcha.closest('.captcha-label').classList.add('form-shake');
      setTimeout(() => captcha.closest('.captcha-label').classList.remove('form-shake'), 500);
      return;
    }
    if (!form.checkValidity()) {
      [...form.querySelectorAll('.form-input')].forEach((inp) => {
        if (!inp.checkValidity()) {
          inp.classList.add('form-shake', 'form-invalid');
          setTimeout(() => inp.classList.remove('form-shake'), 500);
        }
      });
      return;
    }
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Submitted!';
    btn.disabled = true;
    btn.classList.add('form-btn-success');
  });

  block.appendChild(form);
}

function buildFromRows(block, rows) {
  const form = document.createElement('form');
  form.className = 'form-container';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const lbl = cols[0].textContent.trim();
    const typeVal = cols[1].textContent.trim().toLowerCase();

    if (typeVal === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'form-submit';
      button.textContent = lbl || 'Submit';
      form.appendChild(button);
    } else {
      form.appendChild(createField({
        name: lbl.toLowerCase().replace(/\s+/g, '-'),
        label: lbl,
        type: typeVal || 'text',
        required: true,
      }));
    }
  });

  form.appendChild(buildCaptcha());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    if (btn) {
      btn.textContent = 'Submitted!';
      btn.disabled = true;
      btn.classList.add('form-btn-success');
    }
  });

  block.appendChild(form);
}

export default function decorate(block) {
  const rows = [...block.children];
  const text = block.textContent.trim();
  const template = FORM_TEMPLATES[text];

  block.textContent = '';

  if (template) {
    buildFromTemplate(block, template);
  } else if (rows.length > 1) {
    buildFromRows(block, rows);
  } else {
    block.innerHTML = '<p class="form-placeholder">Form preview — connect to AEM Forms for full functionality.</p>';
  }
}
