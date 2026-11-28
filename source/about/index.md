---
title: 自述
date: 2022-08-10 16:05:11
---

<div class="about-container">
  <div class="about-header">
    <img src="/assets/avatar.webp" alt="头像" class="about-avatar">
    <h1 class="about-title">关于我</h1>
    <p class="about-subtitle">总是学习，总在进步</p>
  </div>

  <div class="about-content">
<section class="about-section">
      <h2>个人介绍</h2>
      <p>你好，欢迎来到我的个人博客！我是一个热爱技术和生活的人，喜欢分享自己的学习心得和生活感悟。</p>
      <p>这个博客是我记录成长、分享知识的地方，希望能够为你带来一些有价值的内容。</p>
</section>

<section class="about-section about-journey">
  <h2>学习足迹</h2>
  <p>展开一个阶段，看看我走过的路。</p>
  <details open>
    <summary>大一 · 从编程与算法开始</summary>
    <p>开始接触编程，学习算法。</p>
  </details>
  <details>
    <summary>大二上 · 走进 Java</summary>
    <p>决定开始学 Java，然后一直学技术栈。学得全，忘得也快，还是应该先看基础知识，再直接开始做项目，这样知识更牢。寒假学习做两个经典项目。</p>
  </details>
  <details>
    <summary>大二下 · Java + AI</summary>
    <p>了解到大模型，并准备 Java + AI 一起学习。</p>
  </details>
</section>

  </div>
</div>

<style>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.about-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.about-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.about-subtitle {
  font-size: 16px;
  color: #666;
}

.about-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #00d1ff;
}

.about-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 10px;
}

.about-interests {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.about-interests li {
  background-color: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
  transition: background-color 0.3s ease;
}

.about-interests li:hover {
  background-color: #00d1ff;
  color: white;
}

.about-contact p {
  margin-bottom: 10px;
}

.about-contact a {
  color: #00d1ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.about-contact a:hover {
  color: #00ffa3;
  text-decoration: underline;
}

.about-video {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 10px;
}

.about-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .about-container {
    padding: 10px;
  }

  .about-header {
    padding: 20px 0;
  }

  .about-avatar {
    width: 100px;
    height: 100px;
  }

  .about-title {
    font-size: 24px;
  }

  .about-section {
    padding: 15px;
  }
}
</style>

<style>
.about-container { --about-ink: #252645; --about-muted: #666b7c; --about-surface: #fff; --about-line: #e3e5ef; }
.about-header { background: linear-gradient(135deg, #f0f1fb, #e6f2f3); box-shadow: none; border: 1px solid var(--about-line); }
.about-section { background: var(--about-surface); border: 1px solid var(--about-line); box-shadow: none; }
.about-section:hover { transform: none; box-shadow: none; }
.about-section h2 { border-bottom-color: var(--about-line); color: var(--about-ink); }
.about-section p { color: var(--about-muted); }
.about-container details { margin: 12px 0; border: 1px solid var(--about-line); border-radius: 12px; overflow: hidden; transition: border-color .2s; }
.about-container summary { cursor: pointer; padding: 16px 20px; font-weight: 600; color: var(--about-ink); }
.about-container summary:hover { background: rgba(104, 111, 192, .08); }
.about-container summary:focus-visible, .about-container a:focus-visible { outline: 3px solid #727bd1; outline-offset: -3px; }
.about-container details[open] { border-color: #858bc5; }
.about-container details[open] summary { background: rgba(104, 111, 192, .08); }
.about-container details p { padding: 0 20px; margin-top: 16px; }
.about-container details a { display: inline-block; margin: 0 20px 18px; color: #505ab0; font-weight: 600; }
.about-avatar { transition: transform .25s; }
.about-avatar:hover { transform: rotate(-6deg) scale(1.05); }
[data-theme="dark"] .about-container { --about-ink: #e8e9f2; --about-muted: #b7bbcb; --about-surface: #20222e; --about-line: #393d50; }
[data-theme="dark"] .about-header { background: linear-gradient(135deg, #25283f, #20363a); }
[data-theme="dark"] .about-title { color: #e8e9f2; }
[data-theme="dark"] .about-subtitle { color: #b7bbcb; }
[data-theme="dark"] .about-container details a { color: #adb6ff; }
@media (prefers-reduced-motion: reduce) { .about-container * { transition: none !important; } }
@media (max-width: 600px) { .about-container summary { padding: 16px; } .about-section { padding: 16px; } }
</style>
