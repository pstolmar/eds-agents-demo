export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // First cell: text content with section label
    if (cells[0]) {
      const firstP = cells[0].querySelector('p');
      if (firstP && firstP.textContent.toLowerCase().includes('why')) {
        firstP.classList.add('section-label');
      }
    }
    // Second cell: callout card
    if (cells[1]) {
      cells[1].classList.add('callout');
    }
  });
}
