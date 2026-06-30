/* ============================================================
   Golden Hills Restaurant — Main Script
   ============================================================ */

/* ── Loading Screen ───────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) setTimeout(() => loader.classList.add('hide'), 1800);
});

/* ── Scroll Progress Bar ──────────────────────────────────── */
(function initProgressBar() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── Sticky Navbar ────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Hamburger ─────────────────────────────────────── */
(function initHamburger() {
  const burger = document.getElementById('hamburger');
  const links  = document.getElementById('nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
    burger.setAttribute('aria-expanded', burger.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ── Active Nav Link ──────────────────────────────────────── */
(function highlightActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

/* ── Scroll Reveal ────────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .stagger-children');
  if (!targets.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => observer.observe(t));
})();

/* ── Back to Top ──────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () =>
    btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Counter Animation ────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toString();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const end    = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.ceil(end / 80);
      const t = setInterval(() => {
        cur += step;
        if (cur >= end) { cur = end; clearInterval(t); }
        el.textContent = fmt(cur) + suffix;
      }, 18);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
})();

/* ── Menu Filter ──────────────────────────────────────────── */
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.menu-card');
  if (!filterBtns.length || !cards.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeSlideUp .4s ease both';
        }
      });
    });
  });
})();

/* ── Gallery Lightbox ─────────────────────────────────────── */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  const items   = Array.from(document.querySelectorAll('.gallery-item'));
  let current   = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    const img = items[current].querySelector('img');
    if (img && lbImg) {
      lbImg.src = img.src.replace(/w=\d+/, 'w=1200');
      lbImg.alt = img.alt;
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      show(i);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (lbClose) lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  if (lbPrev) lbPrev.addEventListener('click', () => show(current - 1));
  if (lbNext) lbNext.addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(current - 1);
    if (e.key === 'ArrowRight')  show(current + 1);
  });
})();

/* ── Gallery Filter ───────────────────────────────────────── */
(function initGalleryFilter() {
  const btns  = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
})();

/* ── Testimonial Slider ───────────────────────────────────── */
(function initTestiSlider() {
  const track = document.getElementById('testi-track');
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  let current = 0;
  let autoTimer;
  const perView = () => window.innerWidth <= 768 ? 1 : 3;
  const maxIdx  = () => Math.max(0, total - perView());

  const go = idx => {
    current = Math.max(0, Math.min(idx, maxIdx()));
    track.style.transform = `translateX(-${(100 / perView()) * current}%)`;
  };

  const prev = document.getElementById('testi-prev');
  const next = document.getElementById('testi-next');
  if (prev) prev.addEventListener('click', () => { go(current - 1); reset(); });
  if (next) next.addEventListener('click', () => { go(current + 1); reset(); });

  const auto  = () => { current = current >= maxIdx() ? 0 : current + 1; go(current); };
  const reset = () => { clearInterval(autoTimer); autoTimer = setInterval(auto, 4500); };
  reset();
  window.addEventListener('resize', () => go(0));
})();

/* ── Newsletter ───────────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const msg  = document.getElementById('newsletter-success');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input.value || !input.value.includes('@')) {
      input.style.borderColor = '#c0392b';
      return;
    }
    input.style.borderColor = '';
    form.style.display = 'none';
    if (msg) msg.style.display = 'block';
  });
})();

/* ── Smooth anchor scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── Typing Effect ────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = ['Made With Love', 'Crafted for You', 'Truly Unforgettable', 'Worth Every Bite'];
  let pi = 0, ci = 0, deleting = false;
  const type = () => {
    const phrase = phrases[pi];
    if (deleting) {
      ci--;
      el.textContent = phrase.substring(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 55);
    } else {
      ci++;
      el.textContent = phrase.substring(0, ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2400); return; }
      setTimeout(type, 95);
    }
  };
  setTimeout(type, 1200);
})();

/* ── Form Validation (shared) ─────────────────────────────── */
window.validateForm = function(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const err   = group && group.querySelector('.error-msg');
    const empty = !field.value.trim();
    const badEmail = field.type === 'email' && field.value && !field.value.includes('@');
    if (empty || badEmail) {
      valid = false;
      field.classList.add('error');
      if (group) group.classList.add('has-error');
      if (err) err.textContent = empty ? 'This field is required.' : 'Enter a valid email.';
    } else {
      field.classList.remove('error');
      if (group) group.classList.remove('has-error');
    }
    field.addEventListener('input', () => {
      field.classList.remove('error');
      if (group) group.classList.remove('has-error');
    }, { once: true });
  });
  return valid;
};
