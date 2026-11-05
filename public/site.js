const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const desktopMenu = document.querySelector('.services-menu');
const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  if (mobileNav) mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
};
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  mobileNav.hidden = !expanded;
  document.body.classList.toggle('menu-open', expanded);
});
mobileNav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
const desktopQuery = matchMedia('(min-width: 901px)');
desktopQuery.addEventListener('change', event => { if (event.matches) closeMenu(); });
document.addEventListener('click', event => {
  if (desktopMenu?.open && !desktopMenu.contains(event.target)) desktopMenu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
  if (desktopMenu?.open) { desktopMenu.open = false; desktopMenu.querySelector('summary').focus(); }
});

// The video is decorative and silent. Mobile, reduced-motion and data-saving
// visitors receive the still image unless they explicitly choose to play it.
const video = document.querySelector('[data-hero-video]');
const videoButton = document.querySelector('[data-video-toggle]');
if (video && videoButton) {
  let userPaused = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const syncVideoControl = () => {
    const playing = !video.paused;
    videoButton.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} lettering video`);
    videoButton.setAttribute('aria-pressed', String(playing));
    videoButton.querySelector('[data-video-label]').textContent = playing ? 'Pause' : 'Play';
    videoButton.querySelector('svg').innerHTML = playing
      ? '<path d="M6 4h3v12H6zM12 4h3v12h-3z" fill="currentColor"/>'
      : '<path d="M7 4l9 6-9 6z" fill="currentColor"/>';
  };
  video.addEventListener('play', syncVideoControl);
  video.addEventListener('pause', syncVideoControl);
  videoButton.addEventListener('click', async () => {
    if (video.paused) { userPaused = false; try { await video.play(); } catch { syncVideoControl(); } }
    else { userPaused = true; video.pause(); }
  });
  reduced.addEventListener('change', event => { if (event.matches) { userPaused = true; video.pause(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) video.pause();
    else if (!userPaused && !reduced.matches && matchMedia('(min-width: 701px)').matches && !navigator.connection?.saveData) {
      video.play().catch(() => syncVideoControl());
    }
  }, {threshold: .35});
  observer.observe(video);
}

const lightbox = document.querySelector('.lightbox');
let galleryItems = [], galleryIndex = 0, returnFocus;
const showGalleryImage = () => {
  const button = galleryItems[galleryIndex];
  const image = lightbox.querySelector('.lightbox-image img');
  image.src = button.dataset.galleryImage;
  image.alt = button.dataset.caption;
  lightbox.querySelector('#lightbox-caption').textContent = button.dataset.caption;
  lightbox.querySelector('[data-image-counter]').textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
};
const moveGallery = change => {
  galleryIndex = (galleryIndex + change + galleryItems.length) % galleryItems.length;
  showGalleryImage();
};
document.querySelectorAll('[data-gallery-image]').forEach(button => button.addEventListener('click', () => {
  galleryItems = [...button.closest('[data-gallery-group]').querySelectorAll('.gallery-item:not([data-filtered]) [data-gallery-image]')];
  galleryIndex = galleryItems.indexOf(button);
  returnFocus = button;
  showGalleryImage();
  lightbox.showModal();
  document.body.classList.add('dialog-open');
}));
lightbox?.querySelector('[data-close-lightbox]').addEventListener('click', () => lightbox.close());
lightbox?.querySelector('[data-prev-image]').addEventListener('click', () => moveGallery(-1));
lightbox?.querySelector('[data-next-image]').addEventListener('click', () => moveGallery(1));
lightbox?.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); moveGallery(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveGallery(-1); }
});
lightbox?.addEventListener('click', event => {
  const rect = lightbox.getBoundingClientRect();
  if (event.target === lightbox && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) lightbox.close();
});
lightbox?.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus({preventScroll:true}); });
let touchStart = null;
lightbox?.addEventListener('touchstart', event => { touchStart = event.touches[0].clientX; }, {passive:true});
lightbox?.addEventListener('touchend', event => {
  if (touchStart === null) return;
  const delta = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 65) moveGallery(delta < 0 ? 1 : -1);
  touchStart = null;
}, {passive:true});

// The original IONOS/Duda field names, encoded routing fields and action remain
// intact. Preview builds NEVER submit to the production provider. On the original
// host, native form submission is retained rather than guessing its response API.
const form = document.querySelector('#trade-enquiry');
form?.addEventListener('submit', event => {
  const preview = document.body.dataset.preview === 'true';
  const providerHost = ['www.tradeetching.com', 'tradeetching.com'].includes(location.hostname);
  if (preview || !providerHost || form.elements.website.value) {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    status.hidden = false;
    status.innerHTML = 'This review preview does not send enquiries. Please email <a href="mailto:sales@tradeetching.com">sales@tradeetching.com</a> or call <a href="tel:+441536203813">01536 203813</a>. Your message has not been sent.';
    status.focus();
  }
});

// All examples remain present in HTML without JavaScript. Filtering and progressive
// disclosure keep the mobile gallery useful without changing any page addresses.
const filters = document.querySelector('[data-gallery-filters]');
if (filters) {
  const items = [...document.querySelectorAll('.gallery-section .gallery-item')];
  const more = document.querySelector('.gallery-more');
  const moreButton = more.querySelector('[data-load-more]');
  const count = document.querySelector('[data-gallery-count]');
  const announcement = document.querySelector('[data-gallery-announcement]');
  let active = 'all', limit = 18;
  const update = (announce = false) => {
    const matches = items.filter(item => active === 'all' || item.dataset.galleryCategory === active);
    items.forEach(item => {
      const index = matches.indexOf(item);
      item.hidden = index === -1 || index >= limit;
      item.toggleAttribute('data-filtered', index === -1);
    });
    more.hidden = matches.length <= limit;
    const text = `Showing ${Math.min(limit, matches.length)} of ${matches.length} examples`;
    count.textContent = text;
    if (announce) announcement.textContent = text;
  };
  filters.hidden = false;
  filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    active = button.dataset.galleryFilter;
    limit = 18;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update(true);
  }));
  moreButton.addEventListener('click', () => {
    const firstNew = items.filter(item => !item.hasAttribute('data-filtered'))[limit];
    limit += 18;
    update(true);
    firstNew?.querySelector('button').focus({preventScroll:true});
    firstNew?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  update();
}
