/* ============================================================
   Portfolio — Liau Libetoe
   Combined, de-duplicated JS
   ============================================================ */

'use strict';

/* ── Helpers ── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ── EmailJS init (single) ── */
(function () {
  emailjs.init('9eiNImI62_6mzNwoH');
})();


/* ── Typed.js ── */
document.addEventListener('DOMContentLoaded', () => {
  const typedEl = $('#typed-role');
  if (typedEl && typeof Typed !== 'undefined') {
    new Typed(typedEl, {
      strings: [
        'SOC Analyst',
        'Cybersecurity Engineer',
        'Threat Hunter',
        'Penetration Tester',
        'Full Stack Developer',
      ],
      typeSpeed: 70,
      backSpeed: 45,
      backDelay: 1800,
      loop: true,
      cursorChar: '|',
    });
  }
});


/* ── Navigation: scroll state + active section ── */
(function () {
  const header    = $('#header');
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  const navLinks  = $$('.nav-links a');
  const sections  = $$('section[id], main > section');

  /* Scrolled class for glassmorphism */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);

    /* Active nav link based on scroll position */
    let current = '';
    sections.forEach(sec => {
      const offset = sec.offsetTop - 120;
      if (window.scrollY >= offset) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* Run once on load */

  /* Hamburger toggle */
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });

    /* Close mobile nav on link click */
    $$('a', mobileNav).forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        mobileNav.setAttribute('aria-hidden', true);
      });
    });
  }
})();


/* ── ScrollReveal animations ── */
(function () {
  if (typeof ScrollReveal === 'undefined' || prefersReducedMotion) return;

  const sr = ScrollReveal({
    distance: '30px',
    duration: 700,
    delay: 80,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    reset: false,
  });

  sr.reveal('.reveal-left',   { origin: 'left' });
  sr.reveal('.reveal-right',  { origin: 'right' });
  sr.reveal('.reveal-bottom', { origin: 'bottom', interval: 100 });
  sr.reveal('.section-label, .section-title, .section-subtitle', {
    origin: 'top',
    interval: 80,
  });
  sr.reveal('.about-card',       { origin: 'bottom', interval: 120 });
  sr.reveal('.skill-group',      { origin: 'bottom', interval: 100 });
  sr.reveal('.cert-card',        { origin: 'bottom', interval: 50  });
  sr.reveal('.project-card',     { origin: 'bottom', interval: 100 });
  sr.reveal('.ach-card',         { origin: 'bottom', interval: 120 });
  sr.reveal('.edu-card',         { origin: 'bottom', interval: 100 });
  sr.reveal('.contact-info',     { origin: 'left'   });
  sr.reveal('.contact-form-wrap',{ origin: 'right'  });
})();


/* ── Certification filter ── */
(function () {
  const filters   = $$('.cert-filter');
  const certCards = $$('.cert-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      /* Update active state */
      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      /* Show / hide cards */
      certCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ── Project filter ── */
(function () {
  const filters      = $$('.proj-filter');
  const projectCards = $$('.project-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.pfilter;

      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.pcat === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ── Cert preview modal ── */
(function () {
  const overlay  = $('#cert-modal');
  const closeBtn = $('#cert-modal-close');

  if (!overlay) return;

  const IMAGE_EXTS = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

  function openModal(card) {
    const name     = card.querySelector('.cert-name')?.textContent ?? '';
    const org      = card.querySelector('.cert-org')?.textContent  ?? '';
    const date     = card.querySelector('.cert-date')?.textContent ?? '';
    const chipEl   = card.querySelector('.cert-issuer-chip');
    const isActive = !!card.querySelector('.cert-status-dot.active-cert');
    const file     = card.dataset.certFile;

    const chipOut = $('#modal-cert-chip');
    chipOut.textContent = chipEl?.textContent ?? '';
    chipOut.className   = `cert-issuer-chip ${chipEl?.classList.value.replace('cert-issuer-chip', '').trim() ?? ''}`;

    const statusOut = $('#modal-cert-status-badge');
    statusOut.textContent  = isActive ? 'Active' : 'Completed';
    statusOut.className    = isActive ? 'cert-status-dot active-cert' : 'cert-status-dot';
    statusOut.style.cssText = 'width:10px;height:10px;display:inline-block;vertical-align:middle;border-radius:50%';

    $('#modal-cert-name').textContent = name;
    $('#modal-cert-org').textContent  = org;
    $('#modal-cert-date').textContent = date;

    const preview = $('#modal-cert-preview');
    const footer  = $('#modal-cert-footer');

    if (file) {
      const encoded = encodeURIComponent(file);
      const url     = `certificates_licenses/${encoded}`;
      if (IMAGE_EXTS.test(file)) {
        preview.innerHTML = `<img src="${url}" alt="Certificate: ${name}"
          style="width:100%;max-height:520px;object-fit:contain;display:block;border-radius:8px">`;
      } else {
        preview.innerHTML = `<iframe src="${url}" title="Certificate: ${name}" loading="lazy"></iframe>`;
      }
      footer.innerHTML = '';
    } else {
      preview.innerHTML =
        `<div class="cert-modal-no-file">
           <i class="bx bx-folder-open" style="font-size:2rem;display:block;margin-bottom:0.5rem"></i>
           Certificate not yet in repository.<br>Available upon request.
         </div>`;
      footer.innerHTML = '';
    }

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    const preview = $('#modal-cert-preview');
    if (preview) preview.innerHTML = '';
  }

  /* Attach to each Preview button */
  $$('.cert-preview-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(btn.closest('.cert-card'));
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });
})();


/* ── Contact form (EmailJS) ── */
(function () {
  const form     = $('#contact-form');
  const feedback = $('#form-feedback');
  const submitBtn = $('#submit-btn');

  if (!form) return;

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = `form-feedback show ${type}`;
  }

  function clearFeedback() {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearFeedback();

    /* Basic validation */
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      setFeedback('Please fill in all required fields.', 'error');
      return;
    }

    /* Loading state */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> <span>Sending…</span>';

    emailjs.sendForm('service_laa7f79', 'template_xdbejdi', this)
      .then(() => {
        form.reset();
        setFeedback('Message sent! I\'ll get back to you shortly.', 'success');
        setTimeout(clearFeedback, 5000);
      })
      .catch(() => {
        setFeedback('Failed to send. Please email me directly at conslibetoe@gmail.com', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bx bx-send"></i> <span>Send Message</span>';
      });
  });
})();
