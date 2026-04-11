/* ============================================
   STUDIO — Light Factory Style
   Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // ---- DOM ----
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxInfo = document.getElementById('lightbox-info');
  const lightboxClose = document.getElementById('lightbox-close');
  const workTrack = document.getElementById('work-track');
  const workSection = document.getElementById('work');
  const counterCurrent = document.querySelector('.work-counter-current');

  // ---- Custom Cursor ----
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    })();

    // Hover states for cursor
    const hoverTargets = document.querySelectorAll('a, button, .work-item, .video-card, .model-card, .ui-card, .service-row');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });
  }

  // ---- Nav Scroll ----
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- Mobile Menu ----
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function updateActiveNav() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // ---- Horizontal Scroll for Work Section ----
  function initHorizontalScroll() {
    if (!workTrack || !workSection) return;

    const workItems = workTrack.querySelectorAll('.work-item');
    if (workItems.length === 0) return;

    // Calculate total scrollable width
    function getScrollAmount() {
      const trackWidth = workTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      return Math.max(0, trackWidth - viewportWidth + 100);
    }

    let scrollAmount = getScrollAmount();

    window.addEventListener('resize', () => {
      scrollAmount = getScrollAmount();
    });

    // On scroll, translate the track
    function onScroll() {
      const rect = workSection.getBoundingClientRect();
      const sectionTop = -rect.top;
      const sectionHeight = rect.height;

      if (sectionTop > 0 && sectionTop < sectionHeight) {
        const progress = Math.min(sectionTop / scrollAmount, 1);
        const translateX = -progress * scrollAmount;
        workTrack.style.transform = `translateX(${translateX}px)`;

        // Update counter
        const itemIndex = Math.min(
          Math.floor(progress * workItems.length),
          workItems.length - 1
        );
        if (counterCurrent) {
          counterCurrent.textContent = String(itemIndex + 1).padStart(2, '0');
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  initHorizontalScroll();

  // ---- Scroll Reveal ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-text, .reveal-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => {
      el.classList.remove('revealed');
      observer.observe(el);
    });
  }

  initScrollReveal();

  // ---- Skill Bars ----
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    fills.forEach(fill => {
      fill.style.width = '0%';
      observer.observe(fill);
    });
  }

  initSkillBars();

  // ---- Count Up ----
  function initCountUp() {
    const nums = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target, 0, parseInt(entry.target.dataset.count), 2000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    nums.forEach(num => {
      num.textContent = '0';
      observer.observe(num);
    });
  }

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  initCountUp();

  // ---- 3D Tilt ----
  document.querySelectorAll('[data-tilt]').forEach(viewport => {
    viewport.addEventListener('mousemove', (e) => {
      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      viewport.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      viewport.style.transition = 'none';
    });

    viewport.addEventListener('mouseleave', () => {
      viewport.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      viewport.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ---- Lightbox ----
  function openLightbox(src, info) {
    lightboxImg.src = src;
    lightboxInfo.textContent = info || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Work items → lightbox
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.work-img img');
      const name = item.querySelector('.work-name');
      if (img && name) openLightbox(img.src, name.textContent);
    });
  });

  // ---- Hero Parallax ----
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.15) translateY(${y * 0.25}px)`;
      }
    });
  }

  // ---- Magnetic Buttons ----
  document.querySelectorAll('.nav-contact, .work-view-all-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

})();
