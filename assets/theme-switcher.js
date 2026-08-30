(() => {
  const THEMES = [
    { id: 'sakura', label: '夜樱', dot: '#f3a6bd', bg: '#080812' },
    { id: 'aurora', label: '极光', dot: '#7fd8c8', bg: '#060d12' },
    { id: 'twilight', label: '黄昏', dot: '#ffb37e', bg: '#120b08' },
    { id: 'azure', label: '苍蓝', dot: '#8ab4ff', bg: '#070a14' }
  ];
  const saved = localStorage.getItem('mh_theme') || 'sakura';
  document.documentElement.setAttribute('data-theme', saved);
  const tcMeta = document.querySelector('meta[name="theme-color"]');
  if (tcMeta) {
    const t = THEMES.find(x => x.id === saved);
    tcMeta.setAttribute('content', t ? t.bg : '#080812');
  }

  // Animation state
  const animSaved = localStorage.getItem('mh_animations');
  let animOff = animSaved === 'off';
  if (animSaved === null && window.matchMedia('(prefers-reduced-motion: reduce)').matches) animOff = true;
  if (animOff) document.body.classList.add('no-animations');

  const holder = document.createElement('div');
  holder.className = 'theme-switcher';
  holder.innerHTML = `<button class="theme-btn anim-btn" aria-label="切换动画" title="动画开关">${animOff ? '⏸' : '✨'}</button><button class="theme-btn" aria-label="切换主题">✦</button><div class="theme-pop"></div>`;
  const btn = holder.querySelector('.theme-btn:not(.anim-btn)');
  const animBtn = holder.querySelector('.anim-btn');
  const pop = holder.querySelector('.theme-pop');
  pop.innerHTML = THEMES.map(t =>
    `<button class="theme-opt${t.id === saved ? ' active' : ''}" data-id="${t.id}"><span class="dot" style="background:${t.dot}"></span>${t.label}</button>`
  ).join('');
  btn.onclick = e => { e.stopPropagation(); pop.classList.toggle('open'); };
  document.addEventListener('click', () => pop.classList.remove('open'));
  pop.addEventListener('click', e => {
    const opt = e.target.closest('.theme-opt');
    if (!opt) return;
    document.documentElement.setAttribute('data-theme', opt.dataset.id);
    localStorage.setItem('mh_theme', opt.dataset.id);
    pop.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o === opt));
    pop.classList.remove('open');
    if (tcMeta) {
      const t = THEMES.find(x => x.id === opt.dataset.id);
      tcMeta.setAttribute('content', t ? t.bg : '#080812');
    }
  });
  animBtn.onclick = e => {
    e.stopPropagation();
    animOff = document.body.classList.toggle('no-animations');
    animBtn.textContent = animOff ? '⏸' : '✨';
    localStorage.setItem('mh_animations', animOff ? 'off' : 'on');
  };

  const inject = () => {
    const nav = document.querySelector('.nav-inner');
    if (nav) nav.appendChild(holder);
    else setTimeout(inject, 80);
  };
  inject();
})();