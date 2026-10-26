/* Homepage-only console and simulated telemetry. */
(() => {
  let timer;
  const started = Date.now();
  function initialize() {
    clearInterval(timer);
    const root = document.querySelector('[data-home-dashboard]');
    if (!root) return;
    const output = root.querySelector('#home-command-output');
    const input = root.querySelector('#home-command-input');
    const form = root.querySelector('#home-command-form');
    function line(text, href) {
      const item = document.createElement(href ? 'a' : 'div');
      item.textContent = text;
      if (href) item.href = href;
      output.appendChild(item);
      while (output.childElementCount > 100) output.firstElementChild.remove();
      output.scrollTop = output.scrollHeight;
    }
    if (!form.dataset.bound) {
      form.dataset.bound = 'true';
      const history = [];
      let position = 0;
      line('欢迎来到博客终端。输入 help，或用 ↑ ↓ 查看历史命令。');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const raw = input.value.trim();
        if (!raw) return;
        history.push(raw);
        position = history.length;
        input.value = '';
        line('$ ' + raw);
        switch (raw.toLowerCase().split(/\s+/)[0]) {
          case 'help':
            line('help · about · skills · blog · contact · neofetch · date · joke · clear · sudo');
            line('输入命令回车执行；导航命令会显示可点击链接。');
            break;
          case 'about': line('chagumu 的技术学习与生活记录。总是学习，总在进步。'); line('关于我 →', '/about/'); break;
          case 'skills': line('学习方向：Java、集合框架、LLM、RAG、Agent 与模型优化。'); line('按分类阅读 →', '/categories/'); break;
          case 'blog': line('共 ' + root.dataset.posts + ' 篇文章，首页每页 5 篇。'); line('查看文章归档 →', '/archives/'); break;
          case 'contact': line('GitHub →', 'https://github.com/chagumu01'); line('邮箱：3835385985@qq.com'); line('留言板 →', '/comments/'); break;
          case 'neofetch': line('chagumu@blog / Hexo + Butterfly'); line('Theme: White · Gray · Indigo'); line('Posts: ' + root.dataset.posts); line('SYS_MONITOR：时钟与会话时长实时更新；CPU / MEM / NET 为模拟数据。'); break;
          case 'date': line(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) + ' / 上海'); break;
          case 'joke': line(['世界上有 10 种人：懂二进制的和不懂的。', '一个 SQL 语句走进酒吧，问两张桌子：可以 JOIN 吗？', 'Oct 31 == Dec 25。'][Math.floor(Math.random() * 3)]); break;
          case 'clear': output.replaceChildren(); break;
          case 'sudo': line('这是博客终端。试试 help。'); break;
          default: line('未找到命令：' + raw + '。输入 help 查看命令。');
        }
      });
      input.addEventListener('keydown', event => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        position = Math.max(0, Math.min(history.length, position + (event.key === 'ArrowUp' ? -1 : 1)));
        input.value = history[position] || '';
      });
    }
    const duration = seconds => [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
    function update() {
      if (!root.isConnected || document.hidden) return;
      const seconds = Math.floor((Date.now() - started) / 1000);
      root.querySelector('#home-monitor-clock').textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' });
      root.querySelector('#home-monitor-uptime').textContent = duration(seconds);
      ['CPU', 'MEM', 'NET'].forEach((metric, index) => {
        const value = Math.round([28, 46, 72][index] + Math.sin(seconds / 4 + index) * 9);
        root.querySelector('[data-monitor-value="' + metric + '"]').textContent = value + '%';
        root.querySelector('[data-monitor-bar="' + metric + '"]').style.width = value + '%';
      });
      root.querySelector('#home-monitor-wave').setAttribute('d', Array.from({ length: 31 }, (_, i) => (i ? 'L' : 'M') + i * 10 + ',' + (16 + Math.sin(i * .65 + seconds * .3) * 8).toFixed(1)).join(' '));
    }
    update();
    timer = setInterval(update, 1000);
  }
  document.addEventListener('pjax:send', () => clearInterval(timer));
  document.addEventListener('pjax:complete', initialize);
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
  if (document.readyState !== 'loading') initialize();
})();

/* Draw the signature once in view, or replay with pointer/keyboard. */
(() => {
  let observer;
  function initializeSignature() {
    if (observer) observer.disconnect();
    const root = document.querySelector('[data-signature]');
    if (!root) return;
    const play = () => {
      root.classList.remove('is-playing');
      void root.offsetWidth;
      root.classList.add('is-playing');
    };
    if (!root.dataset.bound) {
      root.dataset.bound = 'true';
      root.addEventListener('click', play);
    }
    if (!('IntersectionObserver' in window)) { play(); return; }
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    }, { threshold: .35 });
    observer.observe(root);
  }
  document.addEventListener('pjax:send', () => { if (observer) observer.disconnect(); });
  document.addEventListener('pjax:complete', initializeSignature);
  document.addEventListener('DOMContentLoaded', initializeSignature, { once: true });
  if (document.readyState !== 'loading') initializeSignature();
})();
