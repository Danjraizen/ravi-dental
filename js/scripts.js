/* ============================================
   Dr. Ravi's Dental & Orofacial Pain Clinic
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function toggleMobileMenu() {
    const isOpen = mobileNav.classList.contains('open');
    mobileToggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', !isOpen);
  }

  if (mobileToggle) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }
  if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      toggleMobileMenu();
      if (mobileToggle) mobileToggle.focus();
    }
  });

  // Mobile dropdowns
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const menu = this.nextElementSibling;
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open');
      const icon = this.querySelector('.dropdown-arrow');
      if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
      this.setAttribute('aria-expanded', !isOpen);
    });
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
  });

  // Desktop dropdown keyboard support
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    const parent = toggle.closest('.dropdown');
    const menu = parent.querySelector('.dropdown-menu');
    const items = menu ? menu.querySelectorAll('a, button') : [];

    toggle.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.setAttribute('aria-expanded', 'true');
        if (items.length > 0) items[0].focus();
      }
    });

    parent.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      if (e.key === 'ArrowDown' && items.length > 0) {
        e.preventDefault();
        const current = document.activeElement;
        const idx = Array.from(items).indexOf(current);
        if (idx < items.length - 1) items[idx + 1].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const current = document.activeElement;
        const idx = Array.from(items).indexOf(current);
        if (idx > 0) items[idx - 1].focus();
        else { toggle.focus(); toggle.setAttribute('aria-expanded', 'false'); }
      }
    });
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  });

  // Close desktop dropdowns on click outside
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (!drop.contains(e.target)) {
        const toggle = drop.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // FAQ accordion with ARIA
  document.querySelectorAll('.faq-question').forEach(q => {
    const id = q.closest('.faq-item').id || 'faq-' + Math.random().toString(36).slice(2, 8);
    q.closest('.faq-item').id = id;
    const panel = q.nextElementSibling;
    q.setAttribute('aria-expanded', 'false');
    q.setAttribute('aria-controls', id + '-panel');
    if (panel) panel.setAttribute('id', id + '-panel');
    q.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Animated counters
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // Scroll animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => scrollObserver.observe(el));

  // Gallery lightbox
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (lightboxImg) lightboxImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          if (mobileNav && mobileNav.classList.contains('open')) toggleMobileMenu();
        }
      }
    });
  });

  // Form validation
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--accent)';
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) e.preventDefault();
    });
  });

  // Booking feature flag (set to true to enable)
  const ENABLE_BOOKING = false;
  if (ENABLE_BOOKING) {
    document.querySelectorAll('.booking-section').forEach(el => el.classList.add('enabled'));
  }
});
