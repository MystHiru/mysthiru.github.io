<div align="center">

# 🌸 MystHiru.github.io

**玄明 · MystHiru 的个人网站**

把灵感拆成代码，再把代码装回日常。

[访问网站](https://mysthiru.github.io)　·　[GitHub 主页](https://github.com/MystHiru)　·　[Telegram](https://t.me/MystHiru)

</div>

---

## ✨ 特性

一个纯静态、由 GitHub Pages 托管、可用网页内容管理面板维护的个人网站。

- **多主题系统** — 四套二次元主题（夜樱 / 极光 / 黄昏 / 苍蓝），一键切换，带专属装饰动画
- **收藏库** — 分类、分组、标签整理图片 / 链接 / 文字 / 音乐 / 视频
- **随笔** — Markdown 支持、全文搜索、侧边目录、滚动高亮、代码高亮
- **项目** — 展示正在维护的开源项目
- **关于页** — 个人自述 + 最近在做的事

## 🛠 技术栈

| 技术 | 用途 |
|---|---|
| HTML + CSS | 页面结构与主题系统 |
| JavaScript | 内容渲染、搜索、交互 |
| GitHub Pages | 静态托管 |
| GitHub Contents API | 内容管理面板读写 |

## 📁 页面结构

```
mysthiru.github.io/
├── index.html       # 首页
├── about.html       # 关于
├── projects.html    # 项目
├── notes.html       # 随笔
├── gallery.html     # 收藏库
├── admin.html       # 管理面板（深层入口）
├── 404.html         # 404 页
└── assets/
    ├── theme.css        # 多主题系统
    ├── theme-switcher.js# 主题切换器
    ├── content.js       # 内容渲染
    ├── backtotop.js     # 返回顶部
    └── favicon.svg
```

## 🎨 多主题

| 主题 | 强调色 | 装饰动画 |
|---|---|---|
| 🌸 夜樱 | 樱花粉 | 飘落花瓣 |
| 🌌 极光 | 青蓝 | 流动光带 + 星光 |
| 🌇 黄昏 | 橙红 | 萤火明灭 |
| 🌧 苍蓝 | 冰蓝 | 雨丝 + 薄雾 |

## 🔒 内容管理

管理面板位于 `admin.html`（从关于页底部 `Control` 进入），可管理：

- **收藏**：上传、搜索、排序、分组、复制、删除、重命名
- **随笔**：增删改排、Markdown 预览、发布状态
- **项目**：增删改排、标签、链接、发布状态
- **页面文字**：编辑首页与关于页文案

> 需要 Fine-grained Token（仅 `mysthiru.github.io` 仓库的 Contents 读写权限）。

## 📄 数据

所有动态内容存放在 `data/content.json`，管理面板通过 GitHub Contents API 读写。

---

<div align="center"><sub>更新得不快，但每一行都算数。</sub></div>