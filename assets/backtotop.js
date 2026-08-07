(() => {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '返回顶部');
  btn.innerHTML = '↑';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  const onScroll = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();