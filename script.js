// Mobile menu toggle
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton && menuCloseButton) {
  menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
  });
  menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
  });
}


(function () {
  const openBtn = document.getElementById('menu-open-button');
  const closeBtn = document.getElementById('menu-close-button');
  const body = document.body;

  function openMenu() {
    body.classList.add('menu-open');
    // If you also open the menu visually, add that logic here (e.g., navMenu.classList.add('is-open'))
  }
  function closeMenu() {
    body.classList.remove('menu-open');
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // If you close the menu by clicking outside, or Escape, also remove the class
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();



// find the images array inside initAboutSlider()
const images = [
  { src: 'images/about.jpg',  alt: 'Interior of Beans & Bubbles café with warm seating' },
  { src: 'images/cup-cappuccino.jpg', alt: 'Freshly brewed coffee being poured' },
  { src: 'images/about3.jpg', alt: 'Customers enjoying drinks in cozy corner' },
  { src: 'images/about4.jpg', alt: 'Barista preparing latte art' },
  { src: 'images/about5.jpg', alt: 'Cozy corner seating with plants' }
];

// Review slider (existing)
const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.review-card');
const totalSlides = slideItems.length;
let index = 0;

function updateSlide() {
  if (!slides) return;
  slides.style.transform = `translateX(-${index * 100}%)`;
}

const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (nextBtn) nextBtn.addEventListener('click', () => {
  index = (index + 1) % totalSlides;
  updateSlide();
});
if (prevBtn) prevBtn.addEventListener('click', () => {
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlide();
});

// Auto slide
let reviewAuto = setInterval(() => {
  if (totalSlides > 0) {
    index = (index + 1) % totalSlides;
    updateSlide();
  }
}, 6000);

// Contact form validation (existing)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const status = document.getElementById('formStatus');

    // reset
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    if (!name.value.trim()) {
      name.nextElementSibling.textContent = 'Please enter your name.';
      name.nextElementSibling.style.display = 'block';
      isValid = false;
    }
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
    if (!email.value.match(emailPattern)) {
      email.nextElementSibling.textContent = 'Please enter a valid email.';
      email.nextElementSibling.style.display = 'block';
      isValid = false;
    }
    if (!message.value.trim()) {
      message.nextElementSibling.textContent = 'Please enter your message.';
      message.nextElementSibling.style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      status.style.color = '#bb601a';
      status.textContent = 'Message sent successfully! We’ll get back to you soon.';
      this.reset();
    } else {
      status.style.color = '#bb601a';
      status.textContent = 'Please correct the errors and try again.';
    }
  });
}


/* ===========================
   About section image slider
   - prev/next buttons
   - indicators
   - keyboard left/right
   - touch swipe
   =========================== */
(function initAboutSlider(){
  const images = [
    'images/about.jpg',
    'images/about2.jpg',
    'images/about3.jpg'
  ];

  // If additional images are not present, the first will be used fallback.
  const mainImage = document.getElementById('about-main-image');
  const prev = document.getElementById('about-prev');
  const next = document.getElementById('about-next');
  const indicatorsEl = document.getElementById('about-indicators');

  if (!mainImage || !prev || !next || !indicatorsEl) return;

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

  function showSlide(index) {
    const safeIndex = (index + images.length) % images.length;
    const src = images[safeIndex] || images[0];
    // Smooth fade out / in using opacity
    mainImage.style.transition = 'opacity 280ms ease';
    mainImage.style.opacity = 0;
    // small timeout to let fade-out happen
    setTimeout(() => {
      mainImage.src = src;
      mainImage.alt = `About image ${safeIndex + 1}`;
      mainImage.style.opacity = 1;
    }, 280);

    // update indicators
    indicatorButtons.forEach((btn, i) => {
      if (i === safeIndex) {
        btn.setAttribute('aria-current','true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    current = safeIndex;
    resetAutoPlay();
  }

  function prevSlide() {
    showSlide(current - 1);
  }
  function nextSlide() {
    showSlide(current + 1);
  }

  // events
  prev.addEventListener('click', prevSlide);
  next.addEventListener('click', nextSlide);

  indicatorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      showSlide(idx);
    });
  });

  // keyboard navigation when image is focused or anywhere on page (global)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // touch gestures for mobile
  const wrap = mainImage.closest('.about-image-wrap');
  if (wrap) {
    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    wrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
  }

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const MIN_SWIPE = 30; // px
    if (Math.abs(diff) > MIN_SWIPE) {
      if (diff > 0) { // left swipe -> next
        nextSlide();
      } else { // right swipe -> prev
        prevSlide();
      }
    }
  }

  // small accessibility: when images fail to load, keep previous image
  mainImage.addEventListener('error', () => {
    // no-op fallback
    console.warn('About image failed to load:', mainImage.src);
  });

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // initialize
  showSlide(0);
  startAutoPlay();

  // pause autoplay when pointer is over image (desktop)
  wrap.addEventListener('mouseenter', stopAutoPlay);
  wrap.addEventListener('mouseleave', startAutoPlay);

  // expose for debugging (optional)
  window.__aboutSlider = {
    show: showSlide,
    next: nextSlide,
    prev: prevSlide,
    currentIndex: () => current
  };
})();

/* ===========================
   MENU SEARCH (flavors-only)
   - filters menu items using only the data-flavors attribute
   - debounced input
   - clear button and live region updates
   =========================== */

(function initMenuSearch() {
  const searchInput = document.getElementById('menuSearch');
  const searchBtn = document.getElementById('menuSearchBtn');
  const clearBtn = document.getElementById('menuClear');
  const liveRegion = document.getElementById('menuSearchLive');
  const noResultsEl = document.getElementById('menuNoResults');
  const form = document.getElementById('menuSearchForm');

  const menuGrid = document.getElementById('menuGrid') || document.querySelector('.menu-grid');
  if (!searchInput || !menuGrid) return;

  const items = Array.from(menuGrid.querySelectorAll('.menu-item'));

  // Normalize string for comparisons
  function norm(str) {
    return (str || '').toLowerCase().normalize('NFKD').replace(/\s+/g, ' ').trim();
  }

  // Parse flavors attribute into array of normalized flavors
  function flavorsForItem(item) {
    const raw = item.dataset.flavors || '';
    // split on comma (allow optional spaces). also accept semicolons or pipes if present.
    return raw.split(/[;,|]/).map(s => s.trim().toLowerCase()).filter(Boolean);
  }

  // Check whether an item matches all tokens in the query, but only using flavors
  function itemMatches(item, query) {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return true;

    const flavors = flavorsForItem(item);
    if (flavors.length === 0) return false; // no flavors => won't match non-empty query

    // For each token, require it to match at least one flavor.
    // Matching rule: token is contained within a flavor (sub-string match) OR exactly equals flavor.
    return tokens.every(token => flavors.some(fl => fl.includes(token)));
  }

  // Update visible items based on current query
  function filterItems() {
    const q = norm(searchInput.value);
    let visible = 0;

    items.forEach(item => {
      const matched = itemMatches(item, q);
      // Use aria-hidden and display to keep semantic structure but hide visually
      if (matched) {
        item.style.display = '';
        item.setAttribute('aria-hidden', 'false');
        visible++;
      } else {
        item.style.display = 'none';
        item.setAttribute('aria-hidden', 'true');
      }
    });

    // show/hide no results message
    if (visible === 0) {
      noResultsEl.hidden = false;
    } else {
      noResultsEl.hidden = true;
    }

    // update live region for assistive tech
    liveRegion.textContent = q.length === 0
      ? `${items.length} items shown`
      : `${visible} result${visible !== 1 ? 's' : ''} for "${searchInput.value.trim()}"`;
  }

  // Debounce helper
  let debounceTimer = null;
  function debouncedFilter() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterItems();
    }, 180);
  }

  // Wire events
  searchInput.addEventListener('input', debouncedFilter);

  // If the search form is submitted (Enter or search button), prevent page reload and run filter immediately
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (debounceTimer) clearTimeout(debounceTimer);
      filterItems();
      searchInput.focus();
    });
  } else if (searchBtn) {
    // fallback: search button click
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (debounceTimer) clearTimeout(debounceTimer);
      filterItems();
      searchInput.focus();
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      if (debounceTimer) clearTimeout(debounceTimer);
      filterItems();
      searchInput.focus();
    });
  }

  // Allow Enter in input to perform immediate filter (prevent accidental form submit if form missing)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceTimer) clearTimeout(debounceTimer);
      filterItems();
    }
  });

  // initialize (show all items by default)
  filterItems();

  // expose for debugging/testing
  window.__menuSearch = {
    filter: filterItems,
    inputEl: searchInput,
    items
  };
})();

