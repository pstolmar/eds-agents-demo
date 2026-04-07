export default function decorate(block) {
  /* Move <picture>/<img> to be a direct child of the hero block for absolute positioning */
  const img = block.querySelector('img');
  if (img) {
    let picture = img.closest('picture');
    if (!picture) {
      picture = document.createElement('picture');
      img.parentElement.replaceChild(picture, img);
      picture.appendChild(img);
    }
    /* Remove the now-empty image wrapper row */
    const emptyRow = [...block.children].find(
      (row) => row.tagName === 'DIV' && !row.textContent.trim() && !row.querySelector('img'),
    );
    if (emptyRow) emptyRow.remove();
    block.prepend(picture);
  }

  /* Light variant when no background image or video is present */
  if (!block.querySelector('img') && !block.querySelector('video')) {
    block.classList.add('hero-light');
  }

  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    const { href } = link;
    const isVideo = href.includes('vimeo.com')
      || href.includes('youtube.com')
      || href.includes('youtu.be');

    if (isVideo) {
      /* Use local hero image as background — video embeds are domain-restricted */
      const bgPicture = document.createElement('picture');
      const bgImg = document.createElement('img');
      bgImg.src = '/media/industrial-hero.png';
      bgImg.alt = '';
      bgImg.loading = 'eager';
      bgPicture.appendChild(bgImg);
      block.prepend(bgPicture);

      /* Remove only video link paragraphs */
      const parent = link.closest('p') || link.parentElement;
      if (parent && parent.children.length <= 1) {
        parent.remove();
      } else {
        link.remove();
      }
    }
  });
}
