export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // First cell: label + heading + list (left column)
    if (cells[0]) {
      const labelP = cells[0].querySelector('p');
      if (labelP && labelP.textContent.trim().length < 40) {
        labelP.classList.add('section-label');
      }
    }
    // Second cell: quote card (right column)
    if (cells[1]) {
      cells[1].classList.add('quote-card');
      const bq = cells[1].querySelector('blockquote');
      // Find the attribution paragraph (the one after blockquote)
      const paras = cells[1].querySelectorAll('p');
      paras.forEach((p) => {
        if (p.textContent.trim().startsWith('') || p.textContent.trim().startsWith('')) {
          p.classList.add('attribution');
        }
      });
    }
  });
}
