export default function decorate(block) {
  const form = document.createElement('form');
  form.className = 'form-container';

  const rows = [...block.children];
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const label = cols[0].textContent.trim();
    const typeOrValue = cols[1].textContent.trim().toLowerCase();

    if (typeOrValue === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'form-submit';
      button.textContent = label || 'Submit';
      form.appendChild(button);
    } else {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'form-field';

      if (label) {
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.setAttribute('for', label.toLowerCase().replace(/\s+/g, '-'));
        fieldWrapper.appendChild(labelEl);
      }

      const input = document.createElement('input');
      input.type = typeOrValue || 'text';
      input.name = label.toLowerCase().replace(/\s+/g, '-');
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.placeholder = label;
      input.required = true;
      fieldWrapper.appendChild(input);

      form.appendChild(fieldWrapper);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
    // eslint-disable-next-line no-alert
    alert('Thank you for your submission!');
    form.reset();
  });

  block.textContent = '';
  block.appendChild(form);
}
