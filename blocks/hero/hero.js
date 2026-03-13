export default function decorate(block) {
  // Look for video links (Vimeo/YouTube) in the hero content and convert to background iframe
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    const { href } = link;
    let embedUrl = null;

    if (href.includes('vimeo.com')) {
      // Extract Vimeo video ID
      const match = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match) {
        embedUrl = `https://player.vimeo.com/video/${match[1]}?muted=1&autoplay=1&autopause=0&loop=1&controls=0&background=1`;
      }
    } else if (href.includes('youtube.com') || href.includes('youtu.be')) {
      // Extract YouTube video ID
      const match = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (match) {
        embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${match[1]}`;
      }
    }

    if (embedUrl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'hero-video-bg';
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.allow = 'autoplay; fullscreen';
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(iframe);
      block.prepend(wrapper);
      // Remove the link from the content
      const parent = link.closest('p') || link.parentElement;
      if (parent && parent.children.length <= 1) {
        parent.remove();
      } else {
        link.remove();
      }
    }
  });
}
