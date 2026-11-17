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

/* Cut the rendered ink and drop only disconnected pieces. */
(() => {
  let entranceObserver;

  function bindSignature(root) {
    const svg = root.querySelector('svg');
    const canvas = root.querySelector('canvas');
    const scissors = root.querySelector('.home-signature__scissors');
    const replay = root.querySelector('button');
    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    const image = new Image();
    const svgCopy = svg.cloneNode(true);
    svgCopy.setAttribute('width', width);
    svgCopy.setAttribute('height', height);
    image.src = 'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(svgCopy));

    let ink;
    let supports;
    let pointer;
    let previous;
    let frame;
    let falling = [];

    // Flood-fill opaque pixels using four-way connectivity.
    function components() {
      const pixels = ink.data;
      const visited = new Uint8Array(width * height);
      const groups = [];
      for (let index = 0; index < visited.length; index++) {
        if (visited[index] || !pixels[index * 4 + 3]) continue;
        const group = [index];
        visited[index] = 1;
        for (let cursor = 0; cursor < group.length; cursor++) {
          const pixel = group[cursor];
          const x = pixel % width;
          const neighbors = [
            x > 0 ? pixel - 1 : -1,
            x < width - 1 ? pixel + 1 : -1,
            pixel - width,
            pixel + width
          ];
          for (const neighbor of neighbors) {
            if (neighbor < 0 || neighbor >= visited.length ||
                visited[neighbor] || !pixels[neighbor * 4 + 3]) continue;
            visited[neighbor] = 1;
            group.push(neighbor);
          }
        }
        groups.push(group);
      }
      return groups;
    }

    function play() {
      root.classList.remove('is-playing');
      void svg.getBoundingClientRect();
      root.classList.add('is-playing');
    }

    function reset() {
      endGesture();
      cancelAnimationFrame(frame);
      frame = undefined;
      falling = [];
      ink = undefined;
      root.classList.remove('has-cuts');
      context.clearRect(0, 0, width, height);
      play();
    }

    function render(now) {
      frame = undefined;
      if (!root.isConnected) return;
      context.putImageData(ink, 0, 0);
      falling = falling.filter(piece => {
        const seconds = (now - piece.start) / 1000;
        const drop = 1000 * seconds * seconds;
        if (piece.y + drop >= height) return false;
        context.drawImage(piece.image, piece.x, piece.y + drop);
        return true;
      });
      if (falling.length) frame = requestAnimationFrame(render);
    }

    function detach(group) {
      const xs = group.map(pixel => pixel % width);
      const ys = group.map(pixel => Math.floor(pixel / width));
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const piece = document.createElement('canvas');
      piece.width = Math.max(...xs) - x + 1;
      piece.height = Math.max(...ys) - y + 1;
      const pieceContext = piece.getContext('2d');
      const bitmap = pieceContext.createImageData(piece.width, piece.height);
      group.forEach((pixel, index) => {
        const offset = pixel * 4;
        const target = ((ys[index] - y) * piece.width + xs[index] - x) * 4;
        bitmap.data.set(ink.data.subarray(offset, offset + 4), target);
        ink.data[offset + 3] = 0;
      });
      pieceContext.putImageData(bitmap, 0, 0);
      falling.push({ image: piece, x, y, start: performance.now() });
    }

    function position(event) {
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(bounds.width / width, bounds.height / height);
      const box = root.getBoundingClientRect();
      scissors.style.left = event.clientX - box.left - root.clientLeft + 'px';
      scissors.style.top = event.clientY - box.top - root.clientTop + 'px';
      return {
        x: (event.clientX - bounds.left - (bounds.width - width * scale) / 2) / scale,
        y: (event.clientY - bounds.top - (bounds.height - height * scale) / 2) / scale
      };
    }

    function cut(to) {
      const dx = to.x - previous.x;
      const dy = to.y - previous.y;
      const lengthSquared = dx * dx + dy * dy;
      if (!lengthSquared || !image.naturalWidth) return;
      if (!ink) {
        context.drawImage(image, 0, 0);
        ink = context.getImageData(0, 0, width, height);
        supports = new Uint16Array(width * height);
        components().forEach((group, index) => {
          for (const pixel of group) supports[pixel] = index + 1;
        });
        root.classList.add('has-cuts');
      }

      const radius = 2;
      let changed = false;
      for (let y = Math.max(0, Math.floor(Math.min(previous.y, to.y) - radius));
           y <= Math.min(height - 1, Math.ceil(Math.max(previous.y, to.y) + radius)); y++) {
        for (let x = Math.max(0, Math.floor(Math.min(previous.x, to.x) - radius));
             x <= Math.min(width - 1, Math.ceil(Math.max(previous.x, to.x) + radius)); x++) {
          const alpha = (y * width + x) * 4 + 3;
          if (!ink.data[alpha]) continue;
          const t = Math.max(0, Math.min(1, ((x - previous.x) * dx + (y - previous.y) * dy) / lengthSquared));
          if (Math.hypot(x - previous.x - t * dx, y - previous.y - t * dy) > radius) continue;
          ink.data[alpha] = 0;
          changed = true;
        }
      }
      if (!changed) return;

      // Each originally separate stroke keeps its largest connected remainder.
      const attached = new Set();
      const groups = components().sort((a, b) => b.length - a.length);
      for (const group of groups) {
        const support = supports[group[0]];
        if (attached.has(support)) detach(group);
        else attached.add(support);
      }
      if (frame === undefined) frame = requestAnimationFrame(render);
    }

    function endGesture(event) {
      if (pointer === undefined || (event && event.pointerId !== pointer)) return;
      const id = pointer;
      pointer = undefined;
      scissors.hidden = true;
      root.classList.remove('is-cutting');
      if (root.hasPointerCapture(id)) root.releasePointerCapture(id);
    }

    root.addEventListener('pointerdown', event => {
      if (event.button !== 0 || pointer !== undefined || replay.contains(event.target)) return;
      pointer = event.pointerId;
      root.setPointerCapture(pointer);
      previous = position(event);
      scissors.hidden = false;
      root.classList.add('is-cutting');
    });
    root.addEventListener('pointermove', event => {
      if (event.pointerId !== pointer) return;
      const next = position(event);
      cut(next);
      previous = next;
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      root.addEventListener(type, endGesture);
    }
    replay.addEventListener('click', reset);
    if (!('IntersectionObserver' in window)) {
      play();
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (!root.classList.contains('is-playing')) play();
    }, { threshold: 0.35 });
    entranceObserver = observer;
    observer.observe(root);
  }

  const initialized = new WeakSet();
  function initializeSignature() {
    const root = document.querySelector('[data-signature]');
    if (!root || initialized.has(root)) return;
    initialized.add(root);
    bindSignature(root);
  }
  document.addEventListener('pjax:send', () => entranceObserver?.disconnect());
  document.addEventListener('pjax:complete', initializeSignature);
  document.addEventListener('DOMContentLoaded', initializeSignature, { once: true });
  if (document.readyState !== 'loading') initializeSignature();
})();
