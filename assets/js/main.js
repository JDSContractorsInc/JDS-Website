/* JDS Contractors Inc. — main.js (UI refresh) */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Sticky header on scroll -------- */
  (function stickyHeader(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
        ticking = false;
      });
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive:true });
  })();

  /* -------- Mobile nav -------- */
  (function mobileNav(){
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    const body = document.body;
    const openNav = () => { nav.classList.add('open'); toggle.setAttribute('aria-expanded','true'); body.classList.add('no-scroll'); };
    const closeNav = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); body.classList.remove('no-scroll'); };

    toggle.setAttribute('aria-controls', 'primary-nav');
    nav.id = 'primary-nav';
    toggle.setAttribute('aria-expanded','false');

    toggle.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    // Close when clicking outside on small screens
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 900) return;
      if (!nav.contains(e.target) && e.target !== toggle) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  })();

  /* -------- Dropdowns (accessible) -------- */
  (function dropdowns(){
    const items = document.querySelectorAll('.dropdown > button');
    items.forEach(btn => {
      btn.setAttribute('aria-haspopup','menu');
      btn.setAttribute('aria-expanded','false');
      const parent = btn.parentElement;

      const open = () => { parent.classList.add('open'); btn.setAttribute('aria-expanded','true'); };
      const close = () => { parent.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        parent.classList.contains('open') ? close() : (closeAll(), open());
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); open(); focusFirstLink(parent); }
        if (e.key === 'Escape') { close(); btn.focus(); }
      });

      parent.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { close(); btn.focus(); }
      });
    });

    function focusFirstLink(drop){
      const link = drop.querySelector('.dropdown-panel a');
      if (link) link.focus();
    }
    function closeAll(){
      document.querySelectorAll('.dropdown.open').forEach(d => {
        const b = d.querySelector('button[aria-expanded="true"]');
        if (b) b.setAttribute('aria-expanded','false');
        d.classList.remove('open');
      });
    }
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.dropdown.open').forEach(d => { if (!d.contains(e.target)) d.classList.remove('open'); });
      document.querySelectorAll('.dropdown > button[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
    });
  })();

  /* -------- Hero slider -------- */
  (function slider(){
    const slides = Array.from(document.querySelectorAll('.slide'));
    if (!slides.length) return;

    let i = 0;
    let timer = null;
    const DURATION = 5000;

    const show = (n) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[n].classList.add('active');
    };
    const next = () => { i = (i + 1) % slides.length; show(i); };
    const prev = () => { i = (i - 1 + slides.length) % slides.length; show(i); };

    const start = () => { if (prefersReduced) return; stop(); timer = setInterval(next, DURATION); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    // Init
    show(0);
    start();

    // Pause on hover
    const sliderEl = document.querySelector('.slider');
    if (sliderEl){
      sliderEl.addEventListener('mouseenter', stop);
      sliderEl.addEventListener('mouseleave', start);
    }

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    // Keyboard
    addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stop(); next(); start(); }
      if (e.key === 'ArrowLeft')  { stop(); prev(); start(); }
    });

    // Touch swipe
    let x0 = null;
    sliderEl?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive:true });
    sliderEl?.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { stop(); (dx < 0 ? next() : prev()); start(); }
      x0 = null;
    });
  })();

  /* -------- Lightbox -------- */
  (function lightbox(){
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    // Style baseline if not present
    if (!lb.hasAttribute('data-initialized')) {
      lb.setAttribute('data-initialized','true');
      lb.style.position = 'fixed';
      lb.style.inset = '0';
      lb.style.display = 'none';
      lb.style.alignItems = 'center';
      lb.style.justifyContent = 'center';
      lb.style.background = 'rgba(0,0,0,.8)';
      lb.style.zIndex = '100';
    }

    const open = (src, alt='') => {
      lb.innerHTML = '';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt || '';
      img.style.maxWidth = '90vw';
      img.style.maxHeight = '90vh';
      img.style.borderRadius = '12px';
      img.style.boxShadow = '0 20px 60px rgba(0,0,0,.35)';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label','Close');
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '16px';
      closeBtn.style.right = '16px';
      closeBtn.style.fontSize = '28px';
      closeBtn.style.lineHeight = '1';
      closeBtn.style.border = '0';
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = '#fff';
      closeBtn.style.cursor = 'pointer';

      lb.appendChild(img);
      lb.appendChild(closeBtn);
      lb.style.display = 'flex';
      closeBtn.focus();

      const onKey = (e) => { if (e.key === 'Escape') close(); };
      const onClick = (e) => { if (e.target === lb || e.target === closeBtn) close(); };
      function close(){
        lb.style.display = 'none';
        lb.innerHTML = '';
        document.removeEventListener('keydown', onKey);
        lb.removeEventListener('click', onClick);
      }
      document.addEventListener('keydown', onKey);
      lb.addEventListener('click', onClick);
    };

    document.querySelectorAll('img.lightbox, .gallery img, .gallery-3 img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(img.getAttribute('data-large') || img.src, img.alt));
    });
  })();

  /* -------- Scroll reveal -------- */
  (function reveal(){
    const nodes = document.querySelectorAll('[data-animate]');
    if (!nodes.length) return;
    if (prefersReduced) {
      nodes.forEach(n => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },{threshold:.12});
    nodes.forEach(el=>io.observe(el));
  })();

});
