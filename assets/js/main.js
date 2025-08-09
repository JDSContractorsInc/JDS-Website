// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Simple lightbox
  const lb = document.getElementById('lightbox');
  document.querySelectorAll('.lightbox').forEach(img => {
    img.addEventListener('click', () => {
      if (!lb) return;
      lb.classList.add('active');
      lb.innerHTML = '';
      const big = document.createElement('img');
      big.src = img.src;
      lb.appendChild(big);
    });
  });
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('active'); });
});
