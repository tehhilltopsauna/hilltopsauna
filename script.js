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
  const hero = document.querySelector('.hero--photo');
  if (!nav) return;

  if (!hero) {
    nav.classList.add('nav--scrolled');
    return;
  }

  const threshold = hero.offsetHeight;

  const update = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > threshold);
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
