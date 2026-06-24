/* ===================================================================
   THE HILLTOP SAUNA — shared interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
  initContactForm();
});

/* ---- Mobile navigation ---- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
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
    if (successPanel) successPanel.classList.add('is-visible');
    form.querySelector('button[type="submit"]').textContent = 'Message sent';
    form.querySelector('button[type="submit"]').disabled = true;
  });
}
