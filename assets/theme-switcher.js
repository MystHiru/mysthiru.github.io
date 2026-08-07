(() => {
  const THEMES = [
    { id: 'sakura', label: '夜樱', accent: '#e8b4c8', bg: '#0f0b12' },
    { id: 'aurora', label: '极光', accent: '#7fd8c8', bg: '#0a1216' },
    { id: 'twilight', label: '黄昏', accent: '#ffb37e', bg: '#140d08' },
    { id: 'azure', label: '苍蓝', accent: '#8ab4ff', bg: '#0a0f1a' }
  ];
  const saved = localStorage.getItem('mh_theme') || 'sakura';
  const apply = (id) => {
    const t = THEMES.find(x => x.id === id) || THEMES[0];
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--bg', t.bg);
    document.body.style.background = t.bg;
    localStorage.setItem('mh_theme', id);
  };
  apply(saved);

  // Build a minimal theme switcher button
  const holder = document.createElement('div');
  holder.className = 'theme-switcher';
  holder.innerHTML = `<button class="theme-btn" aria-label="切换主题">✦</button><div class="theme-pop"></div>`;
  const btn = holder.querySelector('.theme-btn');
  const pop = holder.querySelector('.theme-pop');
  pop.innerHTML = THEMES.map(t =>
    `<button class="theme-opt${t.id === saved ? ' active' : ''}" data-id="${t.id}"><span class="dot" style="background:${t.accent}"></span>${t.label}</button>`
  ).join('');
  btn.onclick = () => pop.classList.toggle('open');
  document.addEventListener('click', e => {
    if (!holder.contains(e.target)) pop.classList.remove('open');
  });
  pop.addEventListener('click', e => {
    const opt = e.target.closest('.theme-opt');
    if (!opt) return;
    apply(opt.dataset.id);
    pop.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o === opt));
    pop.classList.remove('open');
  });

  const inject = () => {
    const nav = document.querySelector('.nav-inner');
    if (nav) { nav.appendChild(holder); }
    else setTimeout(inject, 80);
  };
  inject();
})();