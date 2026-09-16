
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;
const header = document.querySelector('[data-header]');
const menuBtn = document.querySelector('[data-menu-btn]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuBtn && mobileNav) {
  const close = () => { menuBtn.setAttribute('aria-expanded','false'); mobileNav.hidden = true; };
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  addEventListener('resize', () => { if (innerWidth > 900) close(); });
}

addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 12), {passive:true});

const reveals = document.querySelectorAll('.reveal');
const drawings = document.querySelectorAll('.draw-on-view');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, {threshold:.13, rootMargin:'0px 0px -6% 0px'});
  reveals.forEach(el => revealObserver.observe(el));

  const drawObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); obs.unobserve(e.target); } });
  }, {threshold:.3});
  drawings.forEach(el => drawObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
  drawings.forEach(el => el.classList.add('drawn'));
}

if (!reduceMotion && finePointer && innerWidth > 900) {
  const layers = [...document.querySelectorAll('.parallax')];
  let busy = false;
  const update = () => {
    const vh = innerHeight;
    layers.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const y = (r.top + r.height/2 - vh/2) * Number(el.dataset.speed || 0);
      const rot = el.classList.contains('hero-photo') ? '.7deg' : el.classList.contains('collage-a') ? '-2deg' : '3deg';
      el.style.transform = `translate3d(0,${y}px,0) rotate(${rot})`;
    });
    busy = false;
  };
  addEventListener('scroll', () => { if (!busy) { requestAnimationFrame(update); busy = true; } }, {passive:true});
  update();
}
