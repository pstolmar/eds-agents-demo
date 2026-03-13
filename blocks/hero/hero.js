export default function decorate(block) {
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    const { href } = link;
    const isVideo = href.includes('vimeo.com')
      || href.includes('youtube.com')
      || href.includes('youtu.be');

    if (isVideo) {
      /* Use local hero image as background — video embeds are domain-restricted */
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      img.src = '/media/industrial-hero.png';
      img.alt = '';
      img.loading = 'eager';
      picture.appendChild(img);
      block.prepend(picture);
    }

    /* Remove the link paragraph regardless */
    const parent = link.closest('p') || link.parentElement;
    if (parent && parent.children.length <= 1) {
      parent.remove();
    } else {
      link.remove();
    }
  });
}
