script.js
// Wait until all HTML elements are loaded
document.addEventListener("DOMContentLoaded", () => {
  // ===== MOBILE MENU =====
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");
  const body = document.body;

  function openMenu() {
    body.classList.add("show-mobile-menu");
  }

  function closeMenu() {
    body.classList.remove("show-mobile-menu");
  }

  // Add event listeners safely
  if (menuOpenButton) menuOpenButton.addEventListener("click", openMenu);
  if (menuCloseButton) menuCloseButton.addEventListener("click", closeMenu);

  // Close menu with Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  // ===== ABOUT SECTION SLIDER =====
  (function initAboutSlider() {
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

    showSlide(0);
    startAutoPlay();

    if (wrap) {
      wrap.addEventListener('mouseenter', stopAutoPlay);
      wrap.addEventListener('mouseleave', startAutoPlay);
    }
  })();

  // ===== MENU SEARCH FUNCTION =====
  const searchForm = document.querySelector("#menuSearchForm");
  const searchInput = document.querySelector("#menuSearch");
  const menuItems = document.querySelectorAll(".menu-item");
  const noResults = document.querySelector("#menuNoResults");
  const liveRegion = document.querySelector("#menuSearchLive");

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => e.preventDefault());

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      let matchCount = 0;

      menuItems.forEach((item) => {
        const name = item.textContent.toLowerCase();
        const flavors = item.dataset.flavors.toLowerCase();

        if (name.includes(query) || flavors.includes(query)) {
          item.style.display = "";
          matchCount++;
        } else {
          item.style.display = "none";
        }
      });

      if (matchCount === 0) {
        noResults.hidden = false;
        liveRegion.textContent = "No menu items match your search.";
      } else {
        noResults.hidden = true;
        liveRegion.textContent = `${matchCount} menu item${matchCount > 1 ? "s" : ""} found.`;
      }
    });
  }

  // ===== REVIEW SLIDER =====
  (function () {
    const slider = document.querySelector(".review-slider");
    if (!slider) return;

    const track = slider.querySelector(".slides");
    const cards = Array.from(track.children);
    if (!track || cards.length === 0) return;

    const swipeHint = document.querySelector(".swipe-hint");
    let hasSwiped = false;

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;
    let width = slider.clientWidth;

    function setWidth() {
      width = slider.clientWidth;
      snap();
    }

    function snap() {
      track.style.transition = "transform 0.35s ease";
      track.style.transform = `translateX(${-index * width}px)`;

      const fill = slider.querySelector(".progress-fill");
      if (fill) {
        const progress = ((index + 1) / cards.length) * 100;
        fill.style.width = `${progress}%`;
      }
    }

    function onDown(clientX) {
      dragging = true;
      startX = clientX;
      deltaX = 0;
      track.style.transition = "none";
    }

    function onMove(clientX) {
      if (!dragging) return;
      deltaX = clientX - startX;
      track.style.transform = `translateX(${-(index * width) + deltaX}px)`;
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      const threshold = Math.max(60, width * 0.18);
      if (deltaX > threshold && index > 0) index--;
      else if (deltaX < -threshold && index < cards.length - 1) index++;
      snap();

      if (!hasSwiped && Math.abs(deltaX) > 50 && swipeHint) {
        hasSwiped = true;
        swipeHint.classList.add("fade-out");
      }
    }

    slider.addEventListener("mousedown", (e) => onDown(e.clientX));
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", onUp);

    slider.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
    slider.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
    slider.addEventListener("touchend", onUp);

    slider.tabIndex = 0;
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" && index < cards.length - 1) {
        index++;
        snap();
      }
      if (e.key === "ArrowLeft" && index > 0) {
        index--;
        snap();
      }
    });

    window.addEventListener("resize", setWidth);
    snap();
  })();

  // ===== CONTACT FORM =====
  const form = document.getElementById("contactForm");
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const ratingInputs = document.querySelectorAll("input[name='rating']");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll(".error-message").forEach((msg) => {
        msg.textContent = "";
      });

      if (nameInput.value.trim().length < 2) {
        showError(nameInput, "Please enter your full name.");
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        isValid = false;
      }

      if (messageInput.value.trim().length < 5) {
        showError(messageInput, "Please enter a longer message (min. 5 characters).");
        isValid = false;
      }

      const ratingSelected = Array.from(ratingInputs).some((r) => r.checked);
      if (!ratingSelected) {
        alert("Please select a star rating before submitting.");
        isValid = false;
      }

      if (isValid) {
        alert("✅ Thank you! Your message has been successfully submitted.");
        form.reset();
      }
    });

    function showError(input, message) {
      const error = input.parentElement.querySelector(".error-message");
      if (error) {
        error.textContent = message;
        error.style.color = "#d9534f";
        error.style.fontSize = "0.85rem";
      }
    }
  }

  // ===== REVEAL EFFECT =====
  const elementsToReveal = document.querySelectorAll(
    'section, .menu-item, .review-card, .team-member, .about-image-frame, .contact-form, .hero-details, .hero-image-section'
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elementsToReveal.forEach((el) => {
    el.style.willChange = "opacity, transform";
    observer.observe(el);
  });
});
