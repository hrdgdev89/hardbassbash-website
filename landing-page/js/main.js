/* ============================================================
   HARDBASSBASH — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.navbar__mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.navbar__mobile a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ===== ACTIVE NAV LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ===== CITY / EVENT FILTER ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-city]');

  if (filterBtns.length && filterItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const city = btn.dataset.filter;

        filterItems.forEach(item => {
          const show = city === 'all' || item.dataset.city === city;
          item.style.display = show ? '' : 'none';
          if (show) {
            item.style.animation = 'fadeInUp 0.4s ease both';
          }
        });
      });
    });
  }

  /* ===== SMOOTH SCROLL for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== MARQUEE DUPLICATE (for seamless loop) ===== */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* ===== HERO BG PARALLAX (subtle) ===== */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.06) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ===== CONTACT FORM SUBMISSION ===== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'MESSAGE SENT ✓';
        btn.style.background = '#1a6b30';
        btn.style.borderColor = '#1a6b30';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ===== ANALYTICS: GA4 + Meta Pixel helpers ===== */
  window.trackEvent = (category, action, label) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, { event_category: category, event_label: label });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', { content_name: label });
    }
  };

  // Track CTA clicks
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      window.trackEvent('CTA', 'click', btn.textContent.trim());
    });
  });

});
