(() => {
  const DATA_URL = './data/content.json';

  const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '"')
    .replace(/'/g, '&#39;');

  function markdown(source) {
    let text = escapeHtml(source || '');
    const blocks = [];
    text = text.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const key = `@@CODE_${blocks.length}@@`;
      blocks.push(`<pre><code data-lang="${escapeHtml(lang)}">${code.trim()}</code></pre>`);
      return key;
    });
    text = text
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h3>$1</h3>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (_, list) => {
        const items = list.trim().split('\n').map(line => `<li>${line.slice(2)}</li>`).join('');
        return `\n<ul>${items}</ul>\n`;
      });
    text = text.split(/\n{2,}/).map(block => {
      const value = block.trim();
      if (!value) return '';
      if (/^<(h[2-4]|pre|ul|blockquote)/.test(value) || /^@@CODE_\d+@@$/.test(value)) return value;
      return `<p>${value.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
    blocks.forEach((block, index) => { text = text.replace(`@@CODE_${index}@@`, block); });
    return text;
  }

  async function loadData() {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function renderGallery(data) {
    const root = document.getElementById('gallery-list');
    if (!root) return;
    const items = Array.isArray(data.gallery) ? data.gallery : [];
    root.innerHTML = items.map((item, index) => `
      <figure>
        <img loading="lazy" src="./img/archive/${encodeURIComponent(item.file)}" alt="${escapeHtml(item.title || `收藏 ${index + 1}`)}">
        <figcaption>${escapeHtml(item.title || String(index + 1).padStart(2, '0'))}</figcaption>
      </figure>`).join('');
    if (!items.length) root.innerHTML = '<p class="empty-state">这里暂时是空的。</p>';
  }

  function renderProjects(data) {
    const root = document.getElementById('project-grid');
    if (!root) return;
    const projects = (Array.isArray(data.projects) ? data.projects : []).filter(item => item.published !== false);
    root.innerHTML = projects.map(project => {
      const name = escapeHtml(project.name || '未命名项目');
      const title = project.url
        ? `<a href="${escapeHtml(project.url)}" target="_blank" rel="noopener">${name}</a>`
        : name;
      const tags = (project.tags || []).filter(Boolean).map(tag => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('');
      return `<article class="project-card">
        <h3>${title}</h3>
        <p>${escapeHtml(project.description || '')}</p>
        <div class="project-meta">${tags}</div>
      </article>`;
    }).join('');
    if (!projects.length) root.innerHTML = '<p class="empty-state">项目正在整理。</p>';
  }

  function renderNotes(data) {
    const root = document.getElementById('note-list');
    if (!root) return;
    const notes = (Array.isArray(data.notes) ? data.notes : []).filter(item => item.published !== false);
    root.innerHTML = notes.map(note => `
      <article class="note-card" id="${escapeHtml(note.id || '')}">
        <h3>${escapeHtml(note.title || '未命名随笔')}</h3>
        <div class="note-date">${escapeHtml(note.date || '')}</div>
        <div class="note-body">${markdown(note.body || '')}</div>
      </article>`).join('');
    if (!notes.length) root.innerHTML = '<p class="empty-state">这里暂时没有公开随笔。</p>';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const data = await loadData();
      renderGallery(data);
      renderProjects(data);
      renderNotes(data);
    } catch (error) {
      console.error('Content load failed:', error);
      document.querySelectorAll('[data-content-root]').forEach(root => {
        root.innerHTML = '<p class="empty-state">内容加载遇到了一点问题，请稍后刷新。</p>';
      });
    }
  });

  window.MystContent = { markdown, escapeHtml };
})();