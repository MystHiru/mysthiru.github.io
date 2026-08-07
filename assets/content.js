(() => {
  const DATA_URL = './data/content.json';
  const escapeHtml = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'"').replace(/'/g,'&#39;');
  function markdown(source){let text=escapeHtml(source||''),blocks=[];text=text.replace(/```([\w-]*)\n([\s\S]*?)```/g,(_,lang,code)=>{const key=`@@CODE_${blocks.length}@@`;blocks.push(`<pre><code data-lang="${escapeHtml(lang)}">${code.trim()}</code></pre>`);return key});text=text.replace(/^### (.+)$/gm,'<h4>$1</h4>').replace(/^## (.+)$/gm,'<h3>$1</h3>').replace(/^# (.+)$/gm,'<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>').replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g,(_,list)=>`\n<ul>${list.trim().split('\n').map(line=>`<li>${line.slice(2)}</li>`).join('')}</ul>\n`);text=text.split(/\n{2,}/).map(block=>{const value=block.trim();if(!value)return'';if(/^<(h[2-4]|pre|ul|blockquote)/.test(value)||/^@@CODE_\d+@@$/.test(value))return value;return`<p>${value.replace(/\n/g,'<br>')}</p>`}).join('\n');blocks.forEach((block,index)=>text=text.replace(`@@CODE_${index}@@`,block));return text}
  async function loadData(){const response=await fetch(`${DATA_URL}?v=${Date.now()}`,{cache:'no-store'});if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json()}
  const typeLabel={image:'图片',link:'链接',text:'文字',music:'音乐',video:'视频'};
  function renderCollectionCard(item,index){const tags=(item.tags||[]).map(tag=>`<button class="collection-tag" data-filter-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join('');let media='';if(item.type==='image'&&item.file)media=`<div class="collection-media"><img loading="lazy" src="./img/archive/${encodeURIComponent(item.file)}" alt="${escapeHtml(item.title)}"></div>`;else if(item.type==='music'&&item.url)media=`<div class="collection-symbol">♫</div>`;else if(item.type==='video'&&item.url)media=`<div class="collection-symbol">▶</div>`;else if(item.type==='link')media=`<div class="collection-symbol">↗</div>`;else media=`<div class="collection-symbol">✦</div>`;const title=item.url?`<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title||'未命名收藏')}</a>`:escapeHtml(item.title||'未命名收藏');return `<article class="collection-card" data-category="${escapeHtml(item.category||'其他')}" data-type="${escapeHtml(item.type||'text')}" data-tags="${escapeHtml((item.tags||[]).join('|'))}">${media}<div class="collection-content"><div class="collection-meta"><span>${escapeHtml(item.category||'其他')}</span><span>${typeLabel[item.type]||'收藏'}</span></div><h3>${title}</h3>${item.description?`<p>${escapeHtml(item.description)}</p>`:''}<div class="collection-tags">${tags}</div></div></article>`}
  function renderCollections(data){
    const root=document.getElementById('collection-list'); if(!root)return;
    const items=Array.isArray(data.collections)?data.collections:[];
    if(!items.length){root.innerHTML='<div class="archive-empty"><span class="empty-mark">✦</span><h2>收藏库还没有内容</h2><p>这里会逐渐留下图片、链接、音乐、视频和文字片段。第一条收藏可以从首页底部的 Archive 入口添加。</p></div>';return;}
    const groups=[...new Map(items.map(item=>[item.group||item.category||'其他',item])).values()];
    root.innerHTML=groups.map(group=>{
      const name=group.group||group.category||'其他';
      const children=items.filter(item=>(item.group||item.category||'其他')===name);
      return `<section class="collection-group"><div class="group-head"><div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(group.groupDescription||'按主题整理的一组收藏。')}</p></div><span class="group-count">${children.length} 项</span></div><div class="collection-grid">${children.map((item,index)=>renderCollectionCard(item,index)).join('')}</div></section>`;
    }).join('');
  }
  function renderProjects(data){const root=document.getElementById('project-grid');if(!root)return;const projects=(data.projects||[]).filter(x=>x.published!==false);root.innerHTML=projects.map(p=>`<article class="project-card"><h3>${p.url?`<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.name)}</a>`:escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'')}</p><div class="project-tags">${(p.tags||[]).map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></article>`).join('')||'<p class="empty-state">项目正在整理。</p>'}
  function renderNotes(data){const root=document.getElementById('note-list');if(!root)return;const notes=(data.notes||[]).filter(x=>x.published!==false);root.innerHTML=notes.map(n=>`<article class="note-card" id="${escapeHtml(n.id||'')}"><h3>${escapeHtml(n.title)}</h3><div class="note-date">${escapeHtml(n.date||'')}</div><div class="note-body">${markdown(n.body||'')}</div></article>`).join('')||'<p class="empty-state">这里暂时没有公开随笔。</p>';highlightCode(root);}
  function highlightCode(root){
    if(!root)return;
    const KEYWORDS=new Set(['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','new','class','extends','import','export','from','async','await','try','catch','finally','throw','typeof','instanceof','in','of','this','true','false','null','undefined','def','elif','lambda','print','raise','except','with','as','pass','yield','public','private','static','void','int','string','bool','package','sub','require','end']);
    root.querySelectorAll('pre code').forEach(block=>{
      const text=block.textContent;
      if(!text.trim())return;
      block.innerHTML=text.replace(/(\/\/[^\n]*|#[^\n]*|---[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d[\d._]*)\b|\b([A-Za-z_$][\w$]*)\b|(\/\/[^\n]*)/g,(m,comment,str,num,word)=>{
        if(comment)return `<span class="hl-comment">${comment}</span>`;
        if(str)return `<span class="hl-string">${str}</span>`;
        if(num)return `<span class="hl-number">${num}</span>`;
        if(word)return KEYWORDS.has(word)?`<span class="hl-keyword">${word}</span>`:word;
        return m;
      });
    });
  }
  document.addEventListener('DOMContentLoaded',async()=>{try{const data=await loadData();renderCollections(data);renderProjects(data);renderNotes(data)}catch(error){console.error(error);document.querySelectorAll('[data-content-root]').forEach(root=>root.innerHTML='<p class="empty-state">内容加载遇到问题，请稍后刷新。</p>')}});window.MystContent={markdown,escapeHtml};
})();