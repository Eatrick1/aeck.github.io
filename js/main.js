// AEMI Website - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // NAVBAR + TOPBAR SCROLL EFFECT
  // =============================================
  const navbar = document.querySelector('.navbar');
  const topbar = document.querySelector('.topbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
      topbar?.classList.add('scrolled-away');
    } else {
      navbar?.classList.remove('scrolled');
      topbar?.classList.remove('scrolled-away');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // =============================================
  // MOBILE SIDEBAR NAV  (matches events.html pattern)
  // =============================================
  const hamburger    = document.getElementById('hamburger');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const navOverlay   = document.getElementById('navOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    hamburger?.classList.add('open');
    mobileSidebar?.classList.add('open');
    navOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    hamburger?.classList.remove('open');
    mobileSidebar?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  navOverlay?.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  // =============================================
  // SCROLL ANIMATIONS (fade-in, fade-left, fade-right, scale-in)
  // =============================================
  const animEls = document.querySelectorAll('.fade-in, .fade-left, .fade-right, .scale-in');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => animObserver.observe(el));

  // =============================================
  // LEADERSHIP FLY-IN ON SCROLL
  // =============================================
  const flyEls = document.querySelectorAll('.leader-fly-in');
  const flyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('flew-in'), delay);
        flyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  flyEls.forEach(el => flyObserver.observe(el));

  // =============================================
  // ACTIVE NAV LINK HIGHLIGHT
  // =============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // =============================================
  // FORM HANDLERS
  // =============================================
  const giveForm = document.getElementById('giveForm');
  if (giveForm) {
    giveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your generosity! Your giving information has been received. Our team will be in touch.');
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! We will get back to you within 2 business days. God bless you!');
      contactForm.reset();
    });
  }

  const prayerForm = document.getElementById('prayerForm');
  if (prayerForm) {
    prayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Your prayer request has been received. Our prayer team will be praying for you!');
      prayerForm.reset();
    });
  }

  // =============================================
  // GIVE PAGE AMOUNT BUTTONS
  // =============================================
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput && btn.dataset.amount) customInput.value = btn.dataset.amount;
    });
  });

});

// =============================================
// CINEMATIC HERO SLIDESHOW
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('#heroDots .dot');
  const progressBar = document.getElementById('heroProgressBar');
  const captionText = document.getElementById('heroCaptionText');

  if (!slides.length) return;

  const DURATION = 6000;
  let current = 0;
  let timer;
  let isTransitioning = false;

  function goTo(index) {
    if (isTransitioning || index === current) return;
    isTransitioning = true;

    const prev = current;
    current = ((index % slides.length) + slides.length) % slides.length;

    slides[prev].classList.remove('active');
    requestAnimationFrame(() => {
      slides[current].classList.add('active');
      updateDots();
      updateCaption();
      setTimeout(() => { isTransitioning = false; }, 1400);
    });

    resetProgress();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function updateCaption() {
    if (!captionText) return;
    captionText.style.opacity = '0';
    setTimeout(() => {
      captionText.textContent = slides[current].dataset.caption || '';
      captionText.style.opacity = '1';
    }, 300);
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DURATION);
    resetProgress();
  }

  function stopTimer() {
    clearInterval(timer);
    if (progressBar) {
      const w = getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = w;
    }
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); }));

  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopTimer);
    heroSection.addEventListener('mouseleave', startTimer);

    // Touch swipe support
    let touchX = 0;
    heroSection.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    heroSection.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { stopTimer(); goTo(current + (diff > 0 ? 1 : -1)); startTimer(); }
    }, { passive: true });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopTimer(); goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { stopTimer(); goTo(current + 1); startTimer(); }
  });

  // Boot
  slides[0].classList.add('active');
  updateDots();
  updateCaption();
  setTimeout(startTimer, 500);

});

// =============================================
// YOUTUBE VIDEO MODAL
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  const modal          = document.getElementById('videoModal');
  const closeModalBtn  = document.querySelector('.close-modal');
  const youtubePlayer  = document.getElementById('youtubePlayer');
  const playButton     = document.getElementById('playButton');
  const sermonThumb    = document.getElementById('sermonThumbnail');
  const sermonItems    = document.querySelectorAll('.sermon-item');
  const defaultVideoId = '_sehCnWAeQ4';

  if (!modal) return;

  function openVideo(videoId) {
    if (youtubePlayer) {
      youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (youtubePlayer) {
      youtubePlayer.src = '';
      setTimeout(() => {
        youtubePlayer.src = `https://www.youtube.com/embed/${defaultVideoId}?enablejsapi=1&rel=0`;
      }, 100);
    }
  }

  playButton?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openVideo(sermonThumb?.getAttribute('data-video-id') || defaultVideoId);
  });

  sermonThumb?.addEventListener('click', (e) => {
    if (e.target.closest('.sermon-play-btn')) return;
    openVideo(sermonThumb.getAttribute('data-video-id') || defaultVideoId);
  });

  sermonItems.forEach(item => {
    item.addEventListener('click', function () {
      openVideo(this.getAttribute('data-video-id') || defaultVideoId);
    });
  });

  closeModalBtn?.addEventListener('click', (e) => { e.preventDefault(); closeVideo(); });

  modal.addEventListener('click', (e) => { if (e.target === modal) closeVideo(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeVideo();
  });

});