/**
 * GREAT INDIAN TRADE ALLIANCE (GITA) — CORE INTERACTIONS & ACCORDION
 * Pure Vanilla ES6 — Zero Build Dependencies — Hostinger FTP Ready
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDetection();
  initStickyHeader();
  initMobileDrawer();
  highlightActiveNav();
  initFaqAccordion();
  initRfqForm();
  initStatCounters();
  initHeroVideo();
  initMobileBottomBar();
  initResponsiveTables();
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

// Dynamic Mobile & Touch Device Detection Engine
function initMobileDetection() {
  const detectDevice = () => {
    const isMobileWidth = window.innerWidth <= 768;
    const isSmallPhone = window.innerWidth <= 480;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isMobile = isMobileWidth || isMobileUA;

    document.documentElement.classList.toggle('is-mobile-device', isMobile);
    document.documentElement.classList.toggle('is-small-phone', isSmallPhone);
    document.documentElement.classList.toggle('is-touch-device', isTouch);
    document.documentElement.setAttribute('data-device', isMobile ? 'mobile' : 'desktop');
    document.documentElement.setAttribute('data-touch', isTouch ? 'true' : 'false');

    if (isMobile) {
      document.body.classList.add('has-mobile-bottom-bar');
    } else {
      document.body.classList.remove('has-mobile-bottom-bar');
    }
  };

  detectDevice();
  window.addEventListener('resize', detectDevice, { passive: true });
  window.addEventListener('orientationchange', detectDevice, { passive: true });
}

// Mobile Quick-Action Floating Bottom Bar (High-Converting Thumb Ergonomics)
function initMobileBottomBar() {
  if (document.querySelector('.mobile-bottom-bar')) return;

  const currentPath = window.location.pathname;
  const isHomePage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
  const rfqLink = isHomePage ? '#rfq' : 'index.html#rfq';

  const bottomBar = document.createElement('nav');
  bottomBar.className = 'mobile-bottom-bar';
  bottomBar.setAttribute('aria-label', 'Mobile Quick Actions');
  bottomBar.innerHTML = `
    <a href="tel:+919599037511" class="mobile-bottom-item" title="Call Trade Desk">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span>Call Desk</span>
    </a>

    <a href="https://wa.me/919599037511?text=Hello%20GITA%20Trade%20Desk%2C%20I%20would%20like%20to%20inquire%20about%20importing%20rice%20from%20India." class="mobile-bottom-item highlight" target="_blank" rel="noopener noreferrer" title="Chat on WhatsApp">
      <svg viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.589 1.221.771 1.394.858.173.086.274.072.375-.043s.433-.505.549-.679c.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.071.043.417-.101.822z"/>
      </svg>
      <span>WhatsApp</span>
    </a>

    <a href="${rfqLink}" class="mobile-bottom-item" title="Commercial RFQ Quote">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>RFQ Desk</span>
    </a>

    <a href="products.html" class="mobile-bottom-item" title="Rice Products &amp; Specs">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <span>Products</span>
    </a>
  `;

  document.body.appendChild(bottomBar);

  // Smooth scroll for in-page RFQ clicks
  const rfqBottomLink = bottomBar.querySelector(`a[href="#rfq"]`);
  if (rfqBottomLink) {
    rfqBottomLink.addEventListener('click', (e) => {
      const rfqElem = document.getElementById('rfq');
      if (rfqElem) {
        e.preventDefault();
        rfqElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

// Mobile Spec Tables Touch Scroll Enhancer
function initResponsiveTables() {
  const tableWraps = document.querySelectorAll('.specs-table-wrap');
  tableWraps.forEach(wrap => {
    if (wrap.previousElementSibling?.classList.contains('mobile-swipe-hint')) return;

    const hint = document.createElement('div');
    hint.className = 'mobile-swipe-hint';
    hint.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <span>Swipe horizontally to view full grain specifications</span>
    `;
    wrap.parentNode.insertBefore(hint, wrap);
  });
}
