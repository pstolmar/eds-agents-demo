export default function decorate(block) {
  /* Promote bare <img> to <picture> for proper hero background positioning */
  const img = block.querySelector('img');
  if (img && !img.closest('picture')) {
    const picture = document.createElement('picture');
    img.parentElement.replaceChild(picture, img);
    picture.appendChild(img);
    /* Move picture to be a direct child of the hero block for absolute positioning */
    block.prepend(picture);
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
