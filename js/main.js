// AEMI Website - Main JavaScript
// Complete file with all functionality

// =============================================
// MAIN DOM CONTENT LOADED FUNCTION
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Navbar + topbar scroll effect ----
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

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // ---- Give page amount buttons ----
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput && btn.dataset.amount) {
        customInput.value = btn.dataset.amount;
      }
    });
  });

  // ---- Smooth animations on scroll (fade-in, fade-left, fade-right, scale-in) ----
  const animEls = document.querySelectorAll('.fade-in, .fade-left, .fade-right, .scale-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => observer.observe(el));

  // ---- Leadership Fly-in on Scroll ----
  const flyEls = document.querySelectorAll('.leader-fly-in');
  const flyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('flew-in');
        }, delay);
        flyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  flyEls.forEach(el => flyObserver.observe(el));
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ---- Give form submit ----
  const giveForm = document.getElementById('giveForm');
  if (giveForm) {
    giveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your generosity! Your giving information has been received. Our team will be in touch.');
    });
  }

  // ---- Contact form submit ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! We will get back to you within 2 business days. God bless you!');
      contactForm.reset();
    });
  }

  // ---- Prayer form submit ----
  const prayerForm = document.getElementById('prayerForm');
  if (prayerForm) {
    prayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Your prayer request has been received. Our prayer team will be praying for you!');
      prayerForm.reset();
    });
  }

});

// =============================================
// CINEMATIC HERO SLIDESHOW — MULTI-ANGLE
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('#heroDots .dot');
  const prevBtn     = document.getElementById('heroPrev');
  const nextBtn     = document.getElementById('heroNext');
  const progressBar = document.getElementById('heroProgressBar');
  const captionText = document.getElementById('heroCaptionText');

  if (!slides.length) return;

  const DURATION = 6000; // ms per slide
  let current = 0;
  let timer, progressTimer, progressStart;
  let isTransitioning = false;

  /* ---- Core: activate a slide ---- */
  function goTo(index, dir) {
    if (isTransitioning || index === current) return;
    isTransitioning = true;

    const prev = current;
    current = (index + slides.length) % slides.length;

    // Fade out old
    slides[prev].classList.remove('active');

    // Slight delay so the cross-fade feels intentional
    requestAnimationFrame(() => {
      slides[current].classList.add('active');
      updateDots();
      updateCaption();

      // Handle videos if any exist
      slides.forEach((s, i) => {
        const vid = s.querySelector('video');
        if (vid) {
          if (i === current) {
            vid.currentTime = 0;
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        }
      });

      setTimeout(() => { isTransitioning = false; }, 1400);
    });

    resetProgress();
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function updateCaption() {
    if (!captionText) return;
    const caption = slides[current].dataset.caption || '';
    captionText.style.opacity = '0';
    setTimeout(() => {
      captionText.textContent = caption;
      captionText.style.opacity = '1';
    }, 300);
  }

  /* ---- Progress bar animation ---- */
  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // Force reflow
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  /* ---- Auto-advance ---- */
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DURATION);
    resetProgress();
  }

  function stopTimer() {
    clearInterval(timer);
    if (progressBar) {
      const computed = getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = computed;
    }
  }

  /* ---- Controls ---- */
  if (prevBtn) prevBtn.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
  });

  /* ---- Pause on hover ---- */
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopTimer);
    heroSection.addEventListener('mouseleave', startTimer);
  }

  /* ---- Keyboard ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopTimer(); goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { stopTimer(); goTo(current + 1); startTimer(); }
  });

  /* ---- Touch swipe ---- */
  let touchX = 0;
  if (heroSection) {
    heroSection.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    heroSection.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { stopTimer(); goTo(current + (diff > 0 ? 1 : -1)); startTimer(); }
    }, { passive: true });
  }

  /* ---- Boot ---- */
  slides[0].classList.add('active');
  updateDots();
  updateCaption();

  // Small delay so page paints before animation starts
  setTimeout(startTimer, 500);

});

// =============================================
// YOUTUBE VIDEO MODAL FUNCTIONALITY
// =============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Get elements
  const modal = document.getElementById('videoModal');
  const closeModal = document.querySelector('.close-modal');
  const youtubePlayer = document.getElementById('youtubePlayer');
  const playButton = document.getElementById('playButton');
  const sermonThumbnail = document.getElementById('sermonThumbnail');
  const sermonItems = document.querySelectorAll('.sermon-item');
  
  // Default video ID (you can change this to any YouTube video ID)
  const defaultVideoId = '_sehCnWAeQ4';
  
  // Check if elements exist
  if (!modal) {
    console.log('Modal element not found - skipping video modal setup');
    return;
  }
  
  // Function to open modal and play video
  function openVideo(videoId) {
    console.log('Opening video:', videoId);
    
    // Set the video source with autoplay
    if (youtubePlayer) {
      youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  // Function to close modal and stop video
  function closeVideo() {
    console.log('Closing video');
    
    // Hide modal
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    
    // Reset the iframe src to stop the video
    if (youtubePlayer) {
      youtubePlayer.src = '';
      setTimeout(() => {
        youtubePlayer.src = `https://www.youtube.com/embed/${defaultVideoId}?enablejsapi=1&rel=0`;
      }, 100);
    }
  }
  
  // Play button click handler (on sermon thumbnail)
  if (playButton) {
    playButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Play button clicked');
      const videoId = sermonThumbnail ? sermonThumbnail.getAttribute('data-video-id') : defaultVideoId;
      openVideo(videoId || defaultVideoId);
    });
  }
  
  // Make the whole thumbnail clickable
  if (sermonThumbnail) {
    sermonThumbnail.addEventListener('click', function(e) {
      // Don't trigger if the play button was clicked (already handled)
      if (e.target.closest('.sermon-play-btn')) return;
      console.log('Thumbnail clicked');
      const videoId = sermonThumbnail.getAttribute('data-video-id') || defaultVideoId;
      openVideo(videoId);
    });
  }
  
  // Sermon items click handler
  if (sermonItems.length > 0) {
    sermonItems.forEach(item => {
      item.addEventListener('click', function() {
        console.log('Sermon item clicked');
        const videoId = this.getAttribute('data-video-id') || defaultVideoId;
        openVideo(videoId);
      });
    });
  }
  
  // Close modal when clicking the close button
  if (closeModal) {
    closeModal.addEventListener('click', function(e) {
      e.preventDefault();
      closeVideo();
    });
  }
  
  // Close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeVideo();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeVideo();
    }
  });
  
  // Optional: Function to change video for different sermons
  window.changeSermonVideo = function(videoId, title, speaker, scripture) {
    // Update thumbnail image
    const sermonThumbBg = document.querySelector('.sermon-thumb-bg');
    if (sermonThumbBg) {
      sermonThumbBg.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;
    }
    
    // Update data attribute
    if (sermonThumbnail) {
      sermonThumbnail.setAttribute('data-video-id', videoId);
    }
    
    // Update sermon title in caption
    const sermonThumbTitle = document.querySelector('.sermon-thumb-title');
    if (sermonThumbTitle && title) {
      sermonThumbTitle.textContent = `"${title}"`;
    }
    
    // Update sermon details in text section
    const sermonMeta = document.querySelector('.sermon-meta');
    if (sermonMeta && speaker && scripture) {
      const metaSpans = sermonMeta.querySelectorAll('span');
      if (metaSpans.length >= 3) {
        if (speaker) metaSpans[1].innerHTML = `🎙️ ${speaker}`;
        if (scripture) metaSpans[2].innerHTML = `📖 ${scripture}`;
      }
    }
    
    const sermonTitle = document.querySelector('.sermon-feature h3');
    if (sermonTitle && title) {
      sermonTitle.textContent = `"${title}"`;
    }
    
    console.log(`Video changed to: ${videoId}`);
  };
  
  console.log('Video modal functionality initialized');
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Utility: shared navbar HTML
function getNavbar() {
  return `
  <div class="topbar">
    <div class="container">
      <div class="topbar-left">
        <span>📍 Kampala, Uganda</span>
        <a href="mailto:info@aemi.org">✉ info@aemi.org</a>
        <a href="tel:+256700000000">📞 +256 700 000 000</a>
      </div>
      <div class="topbar-right">
        <a href="https://facebook.com" target="_blank">Facebook</a>
        <a href="https://youtube.com" target="_blank">YouTube</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
      </div>
    </div>
  </div>
  <nav class="navbar">
    <div class="container">
      <a href="../index.html" class="navbar-logo">
        <img src="../images/logo.png" alt="AEMI Logo">
        <div class="navbar-brand-text">
          <strong>Ambassadors of Encouragement</strong>
          <span>International Ministries</span>
        </div>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html">Home</a></li>
        <li>
          <a href="#">About ▾</a>
          <div class="nav-dropdown">
            <a href="about.html">Who We Are</a>
            <a href="about.html#history">Our History</a>
            <a href="about.html#mission">Mission & Vision</a>
            <a href="about.html#leadership">Leadership</a>
          </div>
        </li>
        <li>
          <a href="#">Connect ▾</a>
          <div class="nav-dropdown">
            <a href="events.html">Events</a>
            <a href="contact.html">Cell Groups</a>
            <a href="contact.html">Membership</a>
            <a href="contact.html">Volunteer</a>
          </div>
        </li>
        <li>
          <a href="#">Resources ▾</a>
          <div class="nav-dropdown">
            <a href="sermons.html">Sermons</a>
            <a href="sermons.html">Devotionals</a>
          </div>
        </li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="give.html" class="nav-give">Give</a></li>
      </ul>
      <div class="hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>`;
}

function getFooter() {
  return `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="../images/logo.png" alt="AEMI Logo">
          <strong>Ambassadors of Encouragement International Ministries</strong>
          <p>Touching lives with the love of Jesus Christ through proclamation, discipleship, and compassionate service in Uganda and beyond.</p>
          <div class="footer-social">
            <a href="https://facebook.com" class="social-btn" target="_blank">f</a>
            <a href="https://youtube.com" class="social-btn" target="_blank">▶</a>
            <a href="https://instagram.com" class="social-btn" target="_blank">📷</a>
            <a href="https://twitter.com" class="social-btn" target="_blank">𝕏</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Ministry</h4>
          <ul>
            <li><a href="about.html">Who We Are</a></li>
            <li><a href="about.html#history">Our History</a></li>
            <li><a href="about.html#mission">Mission & Vision</a></li>
            <li><a href="about.html#leadership">Leadership</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get Connected</h4>
          <ul>
            <li><a href="events.html">Events</a></li>
            <li><a href="sermons.html">Sermons</a></li>
            <li><a href="give.html">Give</a></li>
            <li><a href="contact.html">Prayer Requests</a></li>
            <li><a href="contact.html">Volunteer</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Service Times</h4>
          <ul>
            <li><a href="#">Sunday: 7 AM</a></li>
            <li><a href="#">Sunday: 9 AM</a></li>
            <li><a href="#">Sunday: 11:30 AM</a></li>
            <li><a href="#">Wednesday: 6 PM</a></li>
            <li><a href="#">Prayer: Fri 6 PM</a></li>
          </ul>
          <div style="margin-top:20px; font-size:0.85rem; color:rgba(255,255,255,0.55); line-height:1.8;">
            📍 Kampala, Uganda<br>
            📞 +256 700 000 000<br>
            ✉ info@aemi.org
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Ambassadors of Encouragement International Ministries. All rights reserved.</p>
        <p>Built with ❤️ for the Kingdom of God</p>
      </div>
    </div>
  </footer>`;
}