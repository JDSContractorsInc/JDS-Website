document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Dropdowns
  document.querySelectorAll('.dropdown > button').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown.open').forEach(d => { if (!d.contains(e.target)) d.classList.remove('open'); });
  });

  // Hero slider
  const slides = document.querySelectorAll('.slide');
  let i = 0;
  function show(n){ slides.forEach(s=>s.classList.remove('active')); slides[n].classList.add('active'); }
  if (slides.length){ show(0); setInterval(()=>{ i=(i+1)%slides.length; show(i); }, 5000); }

  // Lightbox
  const lb = document.getElementById('lightbox');
  if (lb){
    document.querySelectorAll('.lightbox').forEach(img=>{
      img.addEventListener('click', ()=>{
        lb.classList.add('active'); lb.innerHTML = '';
        const big = document.createElement('img'); big.src = img.src; lb.appendChild(big);
      });
    });
    lb.addEventListener('click', e=>{ if(e.target===lb) lb.classList.remove('active'); });
  }

  // Scroll reveal
  const reveal = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  reveal.forEach(el=>io.observe(el));
});
