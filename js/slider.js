/* ============================================================
   Golden Hills Restaurant - Hero Slider
   ============================================================ */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  };

  const next = () => goTo(current + 1);

  const start = () => { timer = setInterval(next, 5000); };
  const reset = () => { clearInterval(timer); start(); };

  // Init
  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');
  start();

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); reset(); });
  });
})();
