(() => {
  const THEMES = [
    { id: 'sakura', label: '夜樱', dot: '#f3a6bd' },
    { id: 'aurora', label: '极光', dot: '#7fd8c8' },
    { id: 'twilight', label: '黄昏', dot: '#ffb37e' },
    { id: 'azure', label: '苍蓝', dot: '#8ab4ff' }
  ];
  const saved = localStorage.getItem('mh_theme') || 'sakura';
  document.documentElement.setAttribute('data-theme', saved);

  const holder = document.createElement('div');
  holder.className = 'theme-switcher';
  holder.innerHTML = `<button class="theme-btn" aria-label="切换主题">✦</button><div class="theme-pop"></div>`;
  const btn = holder.querySelector('.theme-btn');
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
  });

  const inject = () => {
    const nav = document.querySelector('.nav-inner');
    if (nav) nav.appendChild(holder);
    else setTimeout(inject, 80);
  };
  inject();
})();