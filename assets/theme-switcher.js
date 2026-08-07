(() => {
  const THEMES = {
    sakura: { label: '夜樱 Sakura', swatch: '#f3a6bd' },
    aurora: { label: '极光 Aurora', swatch: '#7fd8c8' },
    twilight: { label: '黄昏 Twilight', swatch: '#ffb37e' },
    azure: { label: '苍蓝 Azure', swatch: '#8ab4ff' }
  };
  const saved = localStorage.getItem('mh_theme') || 'sakura';
  document.documentElement.setAttribute('data-theme', saved);

  const container = document.createElement('div');
  container.className = 'theme-switcher';
  container.innerHTML = `<button class="theme-toggle-btn" aria-label="切换主题">🎨 <span>${THEMES[saved].label}</span></button><div class="theme-menu" id="theme-menu"></div>`;
  const menu = container.querySelector('.theme-menu');
  menu.innerHTML = Object.entries(THEMES).map(([key, val]) =>
    `<button class="theme-option${key === saved ? ' active' : ''}" data-theme="${key}"><span class="theme-swatch" style="background:${val.swatch}"></span>${val.label}</button>`
  ).join('');

  menu.addEventListener('click', e => {
    const btn = e.target.closest('.theme-option');
    if (!btn) return;
    const theme = btn.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mh_theme', theme);
    container.querySelector('.theme-toggle-btn span').textContent = THEMES[theme].label;
    menu.querySelectorAll('.theme-option').forEach(o => o.classList.toggle('active', o.dataset.theme === theme));
    menu.classList.remove('open');
  });

  container.querySelector('.theme-toggle-btn').addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) menu.classList.remove('open');
  });

  // Insert into nav
  const insert = () => {
    const nav = document.querySelector('.site-nav-inner') || document.querySelector('.nav');
    if (nav) nav.appendChild(container);
    else setTimeout(insert, 100);
  };
  insert();
})();