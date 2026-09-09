document.documentElement.classList.add('js');

(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const year = document.querySelector('[data-year]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = new Date().getFullYear();

  // Keep the navigation legible once it leaves the hero.
  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 56);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Accessible mobile navigation drawer.
  let lastFocused = null;
  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    lastFocused?.focus();
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    lastFocused = document.activeElement;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    const firstLink = mobileMenu.querySelector('a');
    window.setTimeout(() => firstLink?.focus(), 160);
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) closeMenu();

    if (event.key === 'Tab' && mobileMenu?.classList.contains('is-open')) {
      const focusable = [menuToggle, ...mobileMenu.querySelectorAll('a, button:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Subtle, one-time section reveals.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Live status uses the café's local time in India, not the visitor's timezone.
  const status = document.querySelector('[data-open-status]');
  const updateOpenStatus = () => {
    if (!status) return;
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const hour = Number(parts.find(part => part.type === 'hour')?.value ?? 0);
    const minute = Number(parts.find(part => part.type === 'minute')?.value ?? 0);
    const totalMinutes = hour * 60 + minute;
    const isOpen = totalMinutes >= 12 * 60;
    status.classList.toggle('is-open', isOpen);
    const label = status.querySelector('span');
    if (label) label.textContent = isOpen ? 'Open now · closes at 12 AM' : 'Closed now · opens at 12 PM';
  };
  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60_000);

  // Keyboard-friendly gallery lightbox.
  const galleryButtons = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('figure img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  const closeButton = lightbox?.querySelector('.lightbox-close');
  const previousButton = lightbox?.querySelector('.lightbox-prev');
  const nextButton = lightbox?.querySelector('.lightbox-next');
  let galleryIndex = 0;
  let galleryTrigger = null;

  const updateLightbox = index => {
    if (!lightboxImage || !lightboxCaption || !galleryButtons.length) return;
    galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
    const selected = galleryButtons[galleryIndex];
    const image = selected.dataset.full;
    const alt = selected.dataset.alt || selected.querySelector('img')?.alt || '';
    lightboxImage.src = image;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
  };

  const openLightbox = index => {
    if (!lightbox) return;
    galleryTrigger = galleryButtons[index];
    updateLightbox(index);
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
    closeButton?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function') lightbox.close();
    else lightbox.removeAttribute('open');
    galleryTrigger?.focus();
  };

  galleryButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index)));
  closeButton?.addEventListener('click', closeLightbox);
  previousButton?.addEventListener('click', () => updateLightbox(galleryIndex - 1));
  nextButton?.addEventListener('click', () => updateLightbox(galleryIndex + 1));
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') updateLightbox(galleryIndex - 1);
    if (event.key === 'ArrowRight') updateLightbox(galleryIndex + 1);
  });

  // Close the mobile drawer if the layout changes back to desktop.
  window.matchMedia('(min-width: 981px)').addEventListener?.('change', event => {
    if (event.matches) closeMenu();
  });
})();
