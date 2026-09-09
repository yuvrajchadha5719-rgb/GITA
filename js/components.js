/**
 * GREAT INDIAN TRADE ALLIANCE (GITA) — CORE INTERACTIONS & ACCORDION
 * Pure Vanilla ES6 — Zero Build Dependencies — Hostinger FTP Ready
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  highlightActiveNav();
  initFaqAccordion();
  initRfqForm();
  initStatCounters();
  initHeroVideo();
});

// Sticky Header Transition
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Mobile Drawer Toggle
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any nav link inside drawer
  const drawerLinks = drawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Active Nav Link Highlighter
function highlightActiveNav() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    
    if (linkPage === page || (page === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Clickable FAQ Accordion Dropdown
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Optional: Close all other open accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

// Interactive Commercial RFQ Form
function initRfqForm() {
  const rfqForm = document.getElementById('rfqForm');
  if (!rfqForm) return;

  rfqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = rfqForm.querySelector('[name="buyer_name"]')?.value || '';
    const company = rfqForm.querySelector('[name="company_name"]')?.value || '';
    const product = rfqForm.querySelector('[name="product_grade"]')?.value || '';
    const volume = rfqForm.querySelector('[name="volume"]')?.value || 'Discuss on Later';
    const port = rfqForm.querySelector('[name="destination_port"]')?.value || '';

    const text = encodeURIComponent(
      `Hello GITA Rice Export Desk,\n\nI would like to request an official Commercial Quote (RFQ):\n- Buyer Name: ${name}\n- Company: ${company}\n- Grade / Variety: ${product}\n- Volume: ${volume}\n- Destination Seaport & Country: ${port}\n\nPlease share current mill-gate / containerized pricing and proforma specifications.`
    );

    const whatsappUrl = `https://wa.me/919599037511?text=${text}`;
    window.open(whatsappUrl, '_blank');
  });
}

// Upward Animated Number Counters (0 to target in 2 seconds)
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = parseInt(el.getAttribute('data-duration'), 10) || 2000; // 2000ms (2 seconds)
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad progression
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(easeOut * target);

      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(counter => animateCounter(counter));
  }
}

// Ambient Hero Background Video Controller
function initHeroVideo() {
  const videoWrap = document.getElementById('heroVideoWrap');
  const iframe = document.getElementById('heroBgVideo');
  const nativeVideo = document.getElementById('heroBgNativeVideo');
  const toggleBtn = document.getElementById('heroVideoToggle');
  if (!videoWrap) return;

  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let usingNative = false;

  // Check if native video file is available and playable
  if (nativeVideo) {
    nativeVideo.addEventListener('loadeddata', () => {
      usingNative = true;
      nativeVideo.style.display = 'block';
      if (iframe) iframe.style.display = 'none';
      nativeVideo.play().catch(() => {});
    });

    nativeVideo.addEventListener('error', () => {
      // If local video fails to load, fallback to YouTube iframe
      usingNative = false;
      nativeVideo.style.display = 'none';
      if (iframe) iframe.style.display = 'block';
    });

    if (nativeVideo.readyState >= 2) {
      usingNative = true;
      nativeVideo.style.display = 'block';
      if (iframe) iframe.style.display = 'none';
      nativeVideo.play().catch(() => {});
    }
  }

  // Active command dispatcher for YouTube iframe
  const sendCommand = (func, args = '') => {
    try {
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: func, args: args }),
        '*'
      );
    } catch (err) {
      // Cross-origin restriction fallback
    }
  };

  const startPlayback = () => {
    if (usingNative && nativeVideo) {
      nativeVideo.play().catch(() => {});
    } else {
      sendCommand('mute');
      sendCommand('playVideo');
    }
  };

  if (iframe) {
    iframe.addEventListener('load', () => {
      startPlayback();
      setTimeout(startPlayback, 600);
      setTimeout(startPlayback, 1600);
    });
  }

  // Also trigger after DOM ready
  setTimeout(startPlayback, 800);
  setTimeout(startPlayback, 2000);

  // Video Toggle Play / Pause
  if (toggleBtn) {
    let isPlaying = true;
    const iconPause = toggleBtn.querySelector('.icon-pause');
    const iconPlay = toggleBtn.querySelector('.icon-play');
    const labelSpan = toggleBtn.querySelector('span');

    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        if (usingNative && nativeVideo) {
          nativeVideo.pause();
        } else {
          sendCommand('pauseVideo');
        }
        isPlaying = false;
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'inline-block';
        if (labelSpan) labelSpan.textContent = 'Play Video';
        if (iframe) iframe.style.opacity = '0.3';
        if (nativeVideo) nativeVideo.style.opacity = '0.3';
      } else {
        if (usingNative && nativeVideo) {
          nativeVideo.play().catch(() => {});
        } else {
          sendCommand('mute');
          sendCommand('playVideo');
        }
        isPlaying = true;
        if (iconPause) iconPause.style.display = 'inline-block';
        if (iconPlay) iconPlay.style.display = 'none';
        if (labelSpan) labelSpan.textContent = 'Ambient Video';
        if (iframe) iframe.style.opacity = '1';
        if (nativeVideo) nativeVideo.style.opacity = '1';
      }
    });
  }
}


