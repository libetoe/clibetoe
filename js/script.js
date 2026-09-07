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
  if (typeof emailjs === 'undefined') return; // guarded like every other optional dependency below —
  emailjs.init('9eiNImI62_6mzNwoH');            // a slow/blocked CDN shouldn't take the rest of the page's JS down with it
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


/* ── Motion (motion.dev) — spring entrances, real per-item stagger ──
   Self-hosted at js/vendor/motion.min.js (MIT), exposes window.Motion.
   Replaces ScrollReveal: same fail-open guard (undefined library or
   prefers-reduced-motion means content just stays visible, no JS-driven
   hiding), but entrances now spring rather than linear-fade, and card
   grids stagger relative to each other instead of a fixed interval
   applied uniformly to everything on the page. */
(function () {
  if (typeof Motion === 'undefined' || prefersReducedMotion) return;
  const { animate, inView, stagger } = Motion;
  const spring = { type: 'spring', stiffness: 130, damping: 18, mass: 0.7 };

  /* A container's children animate together, staggered, the first time
     the container scrolls into view. */
  function revealGroup(containerSelector, itemSelector, opts = {}) {
    const { y = 22, staggerDelay = 0.06, amount = 0.18 } = opts;
    $$(containerSelector).forEach(container => {
      const items = $$(itemSelector, container);
      if (!items.length) return;
      animate(items, { opacity: 0, y }, { duration: 0 });
      inView(container, () => {
        animate(items, { opacity: 1, y: 0 }, { ...spring, delay: stagger(staggerDelay) });
      }, { amount });
    });
  }

  /* A single element slides in from a side/direction when it scrolls into view. */
  function revealSingle(selector, opts = {}) {
    const { x = 0, y = 0, amount = 0.2 } = opts;
    $$(selector).forEach(el => {
      animate(el, { opacity: 0, x, y }, { duration: 0 });
      inView(el, () => animate(el, { opacity: 1, x: 0, y: 0 }, spring), { amount });
    });
  }

  revealSingle('.about-text',        { x: -24 });
  revealSingle('.contact-info',      { x: -24 });
  revealSingle('.contact-form-wrap', { x: 24 });
  revealSingle('.achievement-featured', { y: 24, amount: 0.15 });

  revealGroup('.section',            '.section-label, .section-title, .section-subtitle', { y: 14, staggerDelay: 0.06, amount: 0.3 });
  revealGroup('.about-cards',        '.about-card',   { staggerDelay: 0.08 });
  revealGroup('.skills-primary',     '.skill-group',  { staggerDelay: 0.1  });
  revealGroup('.skills-secondary',   '.skill-group',  { staggerDelay: 0.06 });
  revealGroup('.cert-featured-grid', '.cert-card',    { staggerDelay: 0.04 });
  revealGroup('.projects-grid',      '.project-card', { staggerDelay: 0.07 });
  revealGroup('.achievements-grid',  '.ach-card',     { staggerDelay: 0.08 });
  revealGroup('.edu-grid',           '.edu-card',     { staggerDelay: 0.08 });
  revealGroup('.timeline',           '.timeline-item',{ staggerDelay: 0.1  });

  /* The hero is the one orchestrated, signature motion moment — a
     deliberate sequence instead of the same fade applied to everything
     down the page. Runs once, on load, since the hero is always the
     first thing in view. */
  const heroBeats = [
    ['.hero-badge',  14],
    ['.hero-name',   18],
    ['.hero-role',   14],
    ['.hero-bio',    14],
    ['.hero-stats',  14],
    ['.hero-ctas',   14],
    ['.hero-social', 10],
  ];
  const heroEls = heroBeats.map(([sel, y]) => [$(sel), y]).filter(([el]) => el);
  heroEls.forEach(([el, y]) => animate(el, { opacity: 0, y }, { duration: 0 }));
  const heroImg = $('.hero-image');
  if (heroImg) animate(heroImg, { opacity: 0, scale: 0.94 }, { duration: 0 });

  heroEls.forEach(([el], i) => animate(el, { opacity: 1, y: 0 }, { ...spring, delay: 0.08 * i }));
  if (heroImg) animate(heroImg, { opacity: 1, scale: 1 }, { ...spring, delay: 0.08 * heroEls.length });

  /* Content-aware hover: a card's border/glow tints toward the accent
     only when it belongs to the identity-defining categories (SOC/SIEM,
     cybersecurity, security-tagged projects) — motion carrying the same
     signal the color system already encodes, not decoration on top of it. */
  const ACCENT_CATEGORIES = new Set(['cybersec', 'soc', 'security']);
  function wireHoverAccent(selector, dataKey) {
    $$(selector).forEach(card => {
      const isCore = ACCENT_CATEGORIES.has(card.dataset[dataKey]);
      card.style.setProperty('--hover-accent', isCore ? 'var(--accent-500)' : 'var(--text-faint)');
    });
  }
  wireHoverAccent('.cert-card', 'category');
  wireHoverAccent('.project-card', 'pcat');
})();


/* ── Certification filter (applies to both the featured cards and the archive rows) ── */
(function () {
  const filters = $$('.cert-filter');
  const items   = $$('.cert-card, .cert-archive-row');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ── Certification archive toggle ── */
(function () {
  const toggle  = $('#cert-archive-toggle');
  const archive = $('#cert-archive');
  if (!toggle || !archive) return;

  const total = $$('.cert-archive-row').length + $$('.cert-featured-grid .cert-card').length;
  const label = $('.toggle-label', toggle);

  toggle.addEventListener('click', () => {
    const isOpen = archive.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    label.textContent = isOpen ? 'Show fewer certifications' : `Show all ${total} certifications`;
    if (isOpen) archive.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
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

    if (typeof emailjs === 'undefined') {
      setFeedback('Message service unavailable right now. Please email me directly at conslibetoe@gmail.com', 'error');
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
