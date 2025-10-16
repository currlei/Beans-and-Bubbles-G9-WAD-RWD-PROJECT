// Global site scripts
(function () {
  const body = document.body;
  const openBtn = document.getElementById('menu-open-button');
  const closeBtn = document.getElementById('menu-close-button');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function openMenu() {
    body.classList.add('show-mobile-menu');
  }
  function closeMenu() {
    body.classList.remove('show-mobile-menu');
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Close with Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Optional: click outside to close when menu is open
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('show-mobile-menu')) return;
    const target = e.target;
    if (!navMenu) return;
    if (navMenu.contains(target)) return;
    if (openBtn && openBtn.contains(target)) return;
    closeMenu();
  });
})();

// About section image slider
(function initAboutSlider(){
  const mainImage = document.getElementById('about-main-image');
  const prev = document.getElementById('about-prev');
  const next = document.getElementById('about-next');
  const indicatorsEl = document.getElementById('about-indicators');

  if (!mainImage || !prev || !next || !indicatorsEl) return;

  const images = [
    'images/about/cold-brew.jpg',
    'images/about/cup-cappuccino.jpg',
    'images/about/hero-bg.jpg',
    'images/about/about.jpg'
  ];

  let current = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let autoPlayTimer = null;
  const AUTO_PLAY_DELAY = 5000;

  // Build indicators
  images.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', `Show image ${i + 1}`);
    btn.setAttribute('role', 'tab');
    btn.dataset.index = i;
    if (i === 0) btn.setAttribute('aria-current','true');
    indicatorsEl.appendChild(btn);
  });
  const indicatorButtons = Array.from(indicatorsEl.querySelectorAll('button'));

  function showSlide(idx) {
    const safeIndex = (idx + images.length) % images.length;
    const src = images[safeIndex] || images[0];
    mainImage.style.transition = 'opacity 280ms ease';
    mainImage.style.opacity = 0;
    setTimeout(() => {
      mainImage.src = src;
      mainImage.alt = `About image ${safeIndex + 1}`;
      mainImage.style.opacity = 1;
    }, 280);

    indicatorButtons.forEach((btn, i) => {
      if (i === safeIndex) btn.setAttribute('aria-current','true');
      else btn.removeAttribute('aria-current');
    });
    current = safeIndex;
    resetAutoPlay();
  }

  function prevSlide() { showSlide(current - 1); }
  function nextSlide() { showSlide(current + 1); }

  prev.addEventListener('click', prevSlide);
  next.addEventListener('click', nextSlide);
  indicatorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.dataset.index, 10);
      showSlide(i);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  const wrap = mainImage.closest('.about-image-wrap');
  if (wrap) {
    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    wrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const MIN_SWIPE = 30;
      if (Math.abs(diff) > MIN_SWIPE) {
        if (diff > 0) nextSlide(); else prevSlide();
      }
    }, {passive: true});
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }
  function stopAutoPlay() {
    if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
  }
  function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

  // init
  showSlide(0);
  startAutoPlay();

  if (wrap) {
    wrap.addEventListener('mouseenter', stopAutoPlay);
    wrap.addEventListener('mouseleave', startAutoPlay);
  }
})();
