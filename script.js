/* ===================================================================
   THE HILLTOP SAUNA — shared interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
  initContactForm();
  initNavScroll();
  initFacStory();
  initTestimonials();
  initSessions();
  initGalleryCarousel();
  initStatCounters();
  initScienceBenefits();
  initAboutStats();
  initBringCards();
  updateCartBadge();
  initCartPage();
});

/* ---- Mobile navigation ---- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  const nav = document.querySelector('.nav');

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (nav) nav.classList.toggle('nav--menu-open', isOpen);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (nav) nav.classList.remove('nav--menu-open');
    });
  });
}

/* ---- Gallery lightbox ---- */
function initGallery() {
  const items = document.querySelectorAll('.gallery__item');
  const lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  const mediaWrap = lightbox.querySelector('.lightbox__media');
  const caption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const ph = item.querySelector('.ph');
      const label = item.querySelector('.gallery__caption');

      mediaWrap.innerHTML = '';
      if (img) {
        mediaWrap.className = 'lightbox__media';
        const clone = new Image();
        clone.src = img.src;
        clone.alt = img.alt;
        mediaWrap.appendChild(clone);
      } else {
        mediaWrap.className = 'lightbox__media ph ' + (ph ? ph.classList[1] : '');
      }

      caption.textContent = label ? label.textContent : '';
      lightbox.classList.add('is-open');
      closeBtn.focus();
    });
  });

  const closeLightbox = () => lightbox.classList.remove('is-open');

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successPanel = form.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          if (successPanel) successPanel.classList.add('is-visible');
          submitBtn.textContent = 'Message sent';
          submitBtn.disabled = true;
          form.reset();
        } else {
          submitBtn.textContent = 'Something went wrong — try again';
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Something went wrong — try again';
      });
  });
}

// ── Nav scroll background ─────────────────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Testimonials carousel ─────────────────────────────────────────────
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial--featured');
  const dots = document.querySelectorAll('.t-dot');
  const prev = document.querySelector('.t-prev');
  const next = document.querySelector('.t-next');
  if (!slides.length) return;

  let current = 0;

  function show(idx) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }

  slides[0].classList.add('is-active');

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

  // Auto-rotate every 5 seconds
  setInterval(() => show(current + 1), 5000);
}

// ── Gallery carousel ──────────────────────────────────────────────────
function initGalleryCarousel() {
  const track = document.querySelector('.gallery-carousel__track');
  const prev = document.querySelector('.gallery-carousel__btn--prev');
  const next = document.querySelector('.gallery-carousel__btn--next');
  if (!track || !next) return;

  const scrollBy = () => track.querySelector('.gallery-carousel__item').offsetWidth + 3;

  next.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
  prev.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
}

// ── Sessions cards ────────────────────────────────────────────────────
function initSessions() {
  const cards = document.querySelectorAll('.session-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
}

// ── Facilities scroll story ───────────────────────────────────────────
function initFacStory() {
  const slides = document.querySelectorAll('.fac-story__slide');
  const dots = document.querySelectorAll('.fac-story__dot');
  const dotsNav = document.querySelector('.fac-story__dots');
  const section = document.querySelector('.fac-story');
  if (!slides.length) return;

  // Show/hide dots based on whether section is in view
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (dotsNav) dotsNav.classList.toggle('is-visible', e.isIntersecting);
    });
  }, { threshold: 0.1 });
  if (section) sectionObserver.observe(section);

  // Animate each slide as it enters the viewport
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const idx = parseInt(e.target.dataset.index);
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      }
    });
  }, { threshold: 0.4 });

  slides.forEach(slide => slideObserver.observe(slide));

  // Dot click scrolls to that slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── Stat counters ─────────────────────────────────────────────────────
function initStatCounters() {
  const stats = document.querySelectorAll('.science-stat');
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target);
    const countEl = el.querySelector('.science-stat__count');
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach(s => observer.observe(s));
}

// ── Science benefit slide-ins ─────────────────────────────────────────
function initScienceBenefits() {
  const items = document.querySelectorAll('.science-benefit');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

// ── About page stat counters ───────────────────────────────────────────
function initAboutStats() {
  const stats = document.querySelectorAll('.about-stat[data-target]');
  const allStats = document.querySelectorAll('.about-stat');
  if (!allStats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target);
    const countEl = el.querySelector('.about-stat__count');
    if (!countEl) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        if (e.target.dataset.target) animate(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  allStats.forEach(s => observer.observe(s));
}

// ── Shop cart ──────────────────────────────────────────────────────────
const CART_KEY = 'hilltop_cart';
const CART_PAYPAL_EMAIL = 'soulsource999@icloud.com';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.qty * item.price, 0);
}

function formatGBP(amount) {
  return '£' + amount.toFixed(2);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    el.classList.toggle('is-empty', count === 0);
  });
}

function stepQty(inputId, delta) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const min = parseInt(input.min, 10) || 1;
  const max = parseInt(input.max, 10) || 99;
  const next = Math.min(max, Math.max(min, (parseInt(input.value, 10) || 1) + delta));
  input.value = next;
}

function addToCart(id, name, size, price, qtyInputId, buttonEl) {
  const input = document.getElementById(qtyInputId);
  const qty = Math.max(1, parseInt(input ? input.value : 1, 10) || 1);

  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, size, price, qty });
  }
  saveCart(cart);

  if (buttonEl) {
    const original = buttonEl.textContent;
    buttonEl.textContent = 'Added ✓';
    buttonEl.disabled = true;
    setTimeout(() => {
      buttonEl.textContent = original;
      buttonEl.disabled = false;
    }, 1200);
  }
}

function updateCartItemQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  qty = Math.max(1, parseInt(qty, 10) || 1);
  item.qty = qty;
  saveCart(cart);
}

function removeCartItem(id) {
  saveCart(getCart().filter((item) => item.id !== id));
}

function renderCart() {
  const list = document.querySelector('[data-cart-list]');
  if (!list) return;

  const cart = getCart();
  const emptyState = document.querySelector('[data-cart-empty]');
  const summary = document.querySelector('[data-cart-summary]');

  if (!cart.length) {
    list.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (summary) summary.style.display = 'flex';

  list.innerHTML = cart.map((item) => `
    <div class="cart-row" data-cart-row="${item.id}">
      <div class="cart-row__info">
        <strong>${item.name}</strong>
        <span>${item.size}</span>
      </div>
      <div class="qty-stepper qty-stepper--sm">
        <button type="button" class="qty-stepper__btn" onclick="cartRowStep('${item.id}',-1)" aria-label="Decrease quantity">&#8722;</button>
        <input type="number" class="qty-stepper__input" min="1" max="20" value="${item.qty}" inputmode="numeric" onchange="updateCartItemQty('${item.id}', this.value)">
        <button type="button" class="qty-stepper__btn" onclick="cartRowStep('${item.id}',1)" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-row__price">${formatGBP(item.price * item.qty)}</div>
      <button type="button" class="cart-row__remove" onclick="removeCartItem('${item.id}')" aria-label="Remove ${item.name} ${item.size}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  `).join('');

  const totalEl = document.querySelector('[data-cart-total]');
  if (totalEl) totalEl.textContent = formatGBP(cartTotal());
}

function cartRowStep(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, Math.min(20, item.qty + delta));
  saveCart(cart);
}

function checkoutWithPaypal() {
  const cart = getCart();
  if (!cart.length) return;

  const form = document.createElement('form');
  form.action = 'https://www.paypal.com/cgi-bin/webscr';
  form.method = 'post';
  form.target = '_blank';

  const fields = {
    cmd: '_cart',
    upload: '1',
    business: CART_PAYPAL_EMAIL,
    currency_code: 'GBP',
  };

  cart.forEach((item, i) => {
    const n = i + 1;
    fields[`item_name_${n}`] = `${item.name} - ${item.size}`;
    fields[`amount_${n}`] = item.price.toFixed(2);
    fields[`quantity_${n}`] = item.qty;
  });

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function initCartPage() {
  if (!document.querySelector('[data-cart-list]')) return;
  renderCart();
  const checkoutBtn = document.querySelector('[data-cart-checkout]');
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWithPaypal);
}

// ── What to bring cards ───────────────────────────────────────────────
function initBringCards() {
  const cards = document.querySelectorAll('.bring-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('is-visible'), i * 120);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c => observer.observe(c));
}
