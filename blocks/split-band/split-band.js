export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells[0]) {
      const labelP = cells[0].querySelector('p');
      if (labelP && labelP.textContent.trim().length < 40) {
        labelP.classList.add('section-label');
      }
    }
    if (cells[1]) {
      cells[1].classList.add('quote-card');
      const paras = cells[1].querySelectorAll('p');
      paras.forEach((p) => {
        if (p.textContent.trim().startsWith('') || p.textContent.trim().startsWith('')) {
          p.classList.add('attribution');
        }
      });
    }
  });
}
