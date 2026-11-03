(function () {
  /* Blog pages: drawn maps replace photos. Each post gets its own constellation from its slug, coloured by topic. */
  var DATA = /*DATA*/{};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement, body = document.body;
  var INK = [1, 4, 25], MINT = [124, 242, 198], BLUE = [96, 132, 255];
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var rgb = function (c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; };
  var hex = function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; };
  var seeded = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; };
  var mobile = innerWidth <= 860, all = [];

  /* A new page starts at its top: the host keeps the last scroll position across pages and restores it late */
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (!location.hash) {
    var held = true, release = function () { held = false; };
    ['wheel', 'touchstart', 'keydown', 'mousedown', 'click', 'hashchange'].forEach(function (t) { addEventListener(t, release, { passive: true, once: true }); });
    (function hold() {
      if (!held) return;
      if (scrollY) { var de = document.documentElement; de.style.scrollBehavior = 'auto'; scrollTo(0, 0); de.style.scrollBehavior = ''; }
      if (performance.now() < 1800) requestAnimationFrame(hold);
    })();
  }

  /* Sky: slow white dots behind everything */
  var sky = document.getElementById('sky'), sc = sky.getContext('2d'), dots = [];
  var r0 = seeded('sky'); for (var d = 0; d < 140; d++) dots.push({ x: r0(), y: r0(), s: r0() < .85 ? 1 : 2, v: .4 + r0() });
  function paintSky(now) {
    sky.width = innerWidth; sky.height = innerHeight; sc.fillStyle = 'rgba(255,255,255,.3)';
    var drift = reduce ? 0 : now / 90000, y = scrollY;
    dots.forEach(function (p) { var py = (p.y + drift * p.v - y / 60000 * p.v) % 1; if (py < 0) py += 1; sc.fillRect(p.x * sky.width, py * sky.height, p.s, p.s); });
  }

  /* One constellation: hubs with satellites on a slowly turning sphere */
  function Map(canvas, opt) {
    var c = canvas.getContext('2d'), rnd = seeded(opt.seed), W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 1.5);
    var hubs = opt.hubs.map(function (h, i) {
      var a = i / opt.hubs.length * 6.283 + rnd() * .4, r = opt.hubs.length > 1 ? .6 + rnd() * .3 : 0;
      var hub = { label: h.label, tag: h.tag, href: h.href, i: i, x: Math.cos(a) * r, y: (rnd() - .5) * .9, z: Math.sin(a) * r * .7, sats: [] };
      for (var s = 0; s < h.n + (opt.deco || 0); s++) { var b = rnd() * 6.283, e = (rnd() - .5) * 2.4, l = .16 + rnd() * .2; hub.sats.push({ label: h.items && s < h.n ? h.items[s] : '', href: h.hrefs && s < h.n ? h.hrefs[s] : null, x: Math.cos(b) * Math.cos(e) * l, y: Math.sin(e) * l, z: Math.sin(b) * Math.cos(e) * l, box: rnd() < .3 }); }
      return hub;
    });
    var extra = []; for (var k = 0; k < (opt.dust || 70); k++) extra.push({ x: (rnd() - .5) * 2.4, y: (rnd() - .5) * 1.6, z: (rnd() - .5) * 2.4 });
    var self = { active: -1, hover: null, mx: -1, my: -1, tilt: 0, pts: [], col: opt.col || BLUE, t0: performance.now() };
    function size() { var r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; }
    function proj(p, yaw, pitch) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy, y = p.y * cp - z * sp; z = p.y * sp + z * cp;
      var f = 2.4 / (2.4 + z), s = Math.min(W, H) * (opt.zoom || .62);
      return { x: W / 2 + x * s * f, y: H / 2 + y * s * f, p: f, z: z };
    }
    self.draw = function (now) {
      if (!W) size();
      var t = reduce ? 0 : (now - self.t0) / 1000, open = reduce ? 1 : clamp(t / 1.4);
      var yaw = (reduce ? .4 : Math.sin(now * .00011) * .35 + now * .00004 * (opt.spin || 1)) + self.tilt * .25, pitch = .12 + (reduce ? 0 : Math.sin(now * .00017) * .08);
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
      c.fillStyle = 'rgba(255,255,255,.22)';
      extra.forEach(function (p) { var q = proj(p, yaw * .6, pitch); if (q.x > 0 && q.x < W && q.y > 0 && q.y < H) c.fillRect(q.x, q.y, 1, 1); });
      var C = opt.center ? proj({ x: 0, y: 0, z: 0 }, yaw, pitch) : null, pts = [];
      hubs.forEach(function (h, i) {
        var e = clamp(open * 1.4 - i * .06), hp = proj({ x: h.x * e, y: h.y * e, z: h.z * e }, yaw, pitch), on = self.active === i || (self.hover && self.hover.hub === h);
        if (C) { c.strokeStyle = on ? rgb(MINT, .9) : 'rgba(255,255,255,.28)'; c.lineWidth = on ? 1.2 : 1; c.beginPath(); c.moveTo(C.x, C.y); c.lineTo(hp.x, hp.y); c.stroke(); }
        h.sats.forEach(function (s, q) {
          var sp = proj({ x: h.x * e + s.x * e, y: h.y * e + s.y * e, z: h.z * e + s.z * e }, yaw, pitch), lit = self.hover === s;
          var near = self.mx < 0 ? 0 : clamp(1.2 - Math.sqrt((sp.x - self.mx) * (sp.x - self.mx) + (sp.y - self.my) * (sp.y - self.my)) / 150);
          c.strokeStyle = on || lit ? rgb(MINT, .75) : rgb(lerp(BLUE[0], 255, near), (.22 + near * .5) * e); c.lineWidth = 1; c.beginPath(); c.moveTo(hp.x, hp.y); c.lineTo(sp.x, sp.y); c.stroke();
          if (s.box) { c.fillStyle = rgb(INK, e); c.fillRect(sp.x - 8, sp.y - 6, 16, 12); c.strokeStyle = 'rgba(255,255,255,' + .7 * e + ')'; c.strokeRect(sp.x - 8, sp.y - 6, 16, 12); c.fillStyle = 'rgba(255,255,255,' + e + ')'; c.fillRect(sp.x - 5, sp.y - 3, 7, 6); c.fillRect(sp.x + 3, sp.y - 3, 3, 3); }
          else { c.fillStyle = lit || near > .25 || on ? 'rgba(255,255,255,' + e + ')' : rgb([150, 180, 255], e * .9); c.beginPath(); c.arc(sp.x, sp.y, (1.6 + near * 1.4) * sp.p + (lit ? 1.5 : 0), 0, 6.283); c.fill(); }
          pts.push({ x: sp.x, y: sp.y, item: s, hub: h });
        });
        var hs = (on ? 5.5 : 4) * hp.p; c.fillStyle = on ? rgb(MINT, 1) : rgb(BLUE, 1); c.fillRect(hp.x - hs, hp.y - hs, hs * 2, hs * 2);
        pts.push({ x: hp.x, y: hp.y, item: h, hub: h, isHub: true });
        var full = on || self.hover === h, text = h.tag && !full ? h.tag : (h.tag ? h.tag + '  ' + h.label : h.label);
        if (text && opt.labels !== false && e > .5) {
          c.font = '400 12px "Geist Mono", monospace'; var lw = c.measureText(text).width;
          var lx = hp.x + 9, ly = hp.y - 7; if (lx + lw > W - 6) lx = hp.x - 9 - lw;
          c.fillStyle = on ? rgb(MINT, 1) : rgb(INK, .85); c.fillRect(lx - 4, ly - 12, lw + 8, 17);
          c.fillStyle = on ? rgb(INK, 1) : 'rgba(255,255,255,.95)'; c.fillText(text, lx, ly);
        }
      });
      if (C) { c.strokeStyle = '#fff'; c.lineWidth = 1; c.beginPath(); c.arc(C.x, C.y, 6, 0, 6.283); c.stroke(); c.fillStyle = rgb(MINT, 1); c.fillRect(C.x - 2, C.y - 2, 4, 4); }
      if (self.hover && self.hover.label && !self.hover.sats) {
        var hv = pts.filter(function (p) { return p.item === self.hover; })[0];
        if (hv) { c.font = '400 12px "Geist Mono", monospace'; var w2 = c.measureText(self.hover.label).width, x2 = Math.min(hv.x + 10, W - w2 - 10); c.fillStyle = '#fff'; c.fillRect(x2 - 5, hv.y - 22, w2 + 10, 18); c.fillStyle = rgb(INK, 1); c.fillText(self.hover.label, x2, hv.y - 9); }
      }
      self.pts = pts;
    };
    self.pick = function (x, y) {
      var best = null, lim = 24 * 24;
      self.pts.forEach(function (p) { var d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y); if (d < lim && (p.item.href || p.isHub)) { lim = d; best = p; } });
      return best;
    };
    self.size = size;
    all.push(self);
    return self;
  }
  function interactive(map, canvas, onPick) {
    canvas.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect(); map.mx = e.clientX - r.left; map.my = e.clientY - r.top; map.tilt = (map.mx / r.width - .5) * 2;
      var p = map.pick(map.mx, map.my); map.hover = p ? p.item : null; canvas.style.cursor = p && (p.item.href || p.isHub) ? 'pointer' : '';
    });
    canvas.addEventListener('mouseleave', function () { map.mx = map.my = -1; map.hover = null; map.tilt = 0; });
    canvas.addEventListener('click', function (e) { var r = canvas.getBoundingClientRect(), p = map.pick(e.clientX - r.left, e.clientY - r.top); if (p) onPick(p); });
  }
  /* Small static art for cards: one frame of a post's map */
  function art(canvas, slug, col, n) {
    var m = Map(canvas, { seed: slug, col: col, hubs: [{ label: '', n: 8 + n % 4 }, { label: '', n: 6 + n % 3 }, { label: '', n: 7 }, { label: '', n: 5 + n % 2 }], center: true, labels: false, zoom: .55, dust: 60 });
    m.t0 = -1e9; return m;
  }

  var loops = [];
  function loop(now) {
    paintSky(now);
    loops.forEach(function (f) { f(now); });
    if (!reduce) requestAnimationFrame(loop);
  }
  var visible = function (el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };

  /* reveal on scroll */
  var seen = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); seen.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  [].forEach.call(document.querySelectorAll('.rise,.checklist li'), function (e) { if (reduce) e.classList.add('seen'); else seen.observe(e); });
  /* titles rise letter by letter */
  [].forEach.call(document.querySelectorAll('[data-split]'), function (t) {
    if (reduce) return; var text = t.textContent, i = 0; t.setAttribute('aria-label', text); t.textContent = '';
    text.split(' ').forEach(function (w, k) {
      if (k) t.appendChild(document.createTextNode(' '));
      var box = document.createElement('span'); box.setAttribute('aria-hidden', 'true'); box.style.display = 'inline-block';
      w.split('').forEach(function (l) { var s = document.createElement('span'); s.className = 'split-ch'; s.style.setProperty('--i', i++); s.textContent = l; box.appendChild(s); });
      t.appendChild(box);
    });
  });

  /* ---------- Archive ---------- */
  if (DATA.page === 'archive') {
    var base = hex(DATA.base), cur = base.slice(), goal = base.slice();
    var cats = DATA.cats, posts = DATA.posts;
    var amap = document.getElementById('amap');
    var M = Map(amap, { seed: 'yazilar', hubs: cats.map(function (k) { var ps = posts.filter(function (p) { return p.cat === k.name; }); return { label: k.name, n: ps.length, items: ps.map(function (p) { return p.title; }), hrefs: ps.map(function (p) { return p.href; }) }; }), center: true, zoom: mobile ? .5 : .48, deco: 7, dust: 110 });
    interactive(M, amap, function (p) { if (p.item.href) location.href = p.item.href; else if (p.isHub) filter(p.item.label); });
    loops.push(function (now) { if (visible(amap)) M.draw(now); });
    var chips = [].slice.call(document.querySelectorAll('.filters .chip')), rows = [].slice.call(document.querySelectorAll('.row'));
    function filter(name) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.cat === name || (!name && !c.dataset.cat))); });
      rows.forEach(function (r) { r.classList.toggle('out', !!name && r.dataset.cat !== name); });
      var k = cats.filter(function (x) { return x.name === name; })[0]; goal = k ? hex(k.bg) : base.slice();
      M.active = k ? cats.indexOf(k) : -1;
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { filter(c.getAttribute('aria-pressed') === 'true' ? '' : c.dataset.cat); }); });
    loops.push(function () {
      for (var i = 0; i < 3; i++) cur[i] += (goal[i] - cur[i]) * (reduce ? 1 : .06);
      root.style.setProperty('--page', 'rgb(' + (cur[0] | 0) + ',' + (cur[1] | 0) + ',' + (cur[2] | 0) + ')');
    });
    /* row hover: the post's own map follows the pointer */
    var peek = document.getElementById('peek'), pc = peek.querySelector('canvas'), pm = null, px = 0, py = 0, tx = 0, ty = 0;
    rows.forEach(function (r) {
      var a = r.querySelector('a');
      a.addEventListener('mouseenter', function () { var p = posts[+r.dataset.i]; pm = art(pc, p.slug, hex(p.bg), +r.dataset.i); pm.size(); peek.classList.add('on'); M.hover = null; M.active = cats.map(function (k) { return k.name; }).indexOf(p.cat); });
      a.addEventListener('mouseleave', function () { peek.classList.remove('on'); M.active = -1; chips.forEach(function (c) { if (c.getAttribute('aria-pressed') === 'true' && c.dataset.cat) M.active = cats.map(function (k) { return k.name; }).indexOf(c.dataset.cat); }); });
      a.addEventListener('mousemove', function (e) { var rb = a.getBoundingClientRect(); tx = Math.max(e.clientX + 40, rb.right - 430); ty = e.clientY - 95; });
    });
    loops.push(function (now) {
      if (!peek.classList.contains('on') || !pm) return;
      px += (tx - px) * .18; py += (ty - py) * .18; peek.style.transform = 'translate3d(' + Math.min(px, innerWidth - 316).toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)';
      pm.draw(now);
    });
    var lead = document.getElementById('leadArt'), LM = art(lead, posts[0].slug, hex(posts[0].bg), 0);
    LM.t0 = performance.now(); loops.push(function (now) { if (visible(lead)) LM.draw(now); });
    if (reduce) { M.draw(0); LM.draw(0); }
  }

  /* ---------- Single post ---------- */
  if (DATA.page === 'post') {
    var heads = [].slice.call(document.querySelectorAll('.body h2[id]')), toc = [].slice.call(document.querySelectorAll('.toc a'));
    var pmap = document.getElementById('pmap');
    var PM = Map(pmap, { seed: DATA.slug, center: true, hubs: DATA.sections.map(function (s, i) { return { label: s.short, tag: (i < 9 ? '0' : '') + (i + 1), n: s.n, href: '#' + s.id }; }), zoom: mobile ? .5 : .46, spin: .6, deco: 2 });
    interactive(PM, pmap, function (p) { var id = p.hub.href; if (id) document.querySelector(id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    loops.push(function (now) { if (visible(pmap)) PM.draw(now); });
    var bar = document.getElementById('bar'), art0 = document.querySelector('.body'), notes = [].slice.call(document.querySelectorAll('.notes li'));
    var wires = document.getElementById('wires'), wc = wires.getContext('2d'), current = -1;
    function setCurrent(i) {
      if (i === current) return; current = i; PM.active = i;
      toc.forEach(function (a, k) { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      notes.forEach(function (n) { n.classList.toggle('on', +n.dataset.s === i); });
    }
    loops.push(function (now) {
      var r = art0.getBoundingClientRect(), p = clamp((innerHeight * .5 - r.top) / r.height);
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var i = -1; heads.forEach(function (h, k) { if (h.getBoundingClientRect().top < innerHeight * .4) i = k; }); setCurrent(i);
      wires.width = innerWidth; wires.height = innerHeight; wc.clearRect(0, 0, innerWidth, innerHeight);
      if (i < 0 || innerWidth <= 1180) return;
      var dot = toc[i].getBoundingClientRect(), h = heads[i].getBoundingClientRect(), nb = document.querySelector('.notes').getBoundingClientRect();
      if (h.bottom < 0 || h.top > innerHeight) return;
      var ws = [[dot.right, dot.top + dot.height / 2, h.left - 10, h.top + 30], [h.right + 10, h.top + 30, nb.left, nb.top + 14]];
      wc.strokeStyle = 'rgba(255,255,255,.4)'; wc.lineWidth = 1; wc.beginPath(); ws.forEach(function (w) { wc.moveTo(w[0], w[1]); wc.lineTo(w[2], w[3]); }); wc.stroke();
      if (!reduce) { var run = (now % 4000) / 4000 * 1.5 - .15; wc.strokeStyle = '#fff'; wc.lineWidth = 1.5; wc.beginPath(); ws.forEach(function (w) { var a = clamp(run), b = clamp(run + .15); if (b > a) { wc.moveTo(lerp(w[0], w[2], a), lerp(w[1], w[3], a)); wc.lineTo(lerp(w[0], w[2], b), lerp(w[1], w[3], b)); } }); wc.stroke(); }
      wc.fillStyle = '#fff'; wc.fillRect(h.left - 12, h.top + 28, 4, 4); wc.fillRect(h.right + 8, h.top + 28, 4, 4);
    });
    [].forEach.call(document.querySelectorAll('.rel .art canvas'), function (cv, k) {
      var m = art(cv, cv.dataset.slug, hex(cv.dataset.bg), k); m.size();
      loops.push(function (now) { if (visible(cv)) m.draw(now); });
      if (reduce) m.draw(0);
    });
    if (reduce) PM.draw(0);
  }

  addEventListener('resize', function () { mobile = innerWidth <= 860; all.forEach(function (m) { m.size(); if (reduce) m.draw(0); }); });
  if (reduce) { paintSky(0); addEventListener('scroll', function () { paintSky(0); }, { passive: true }); }
  requestAnimationFrame(loop);

  /* Phone menu: opens under the header, closes on a link, Escape or a tap outside */
  (function () {
    var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
    if (!btn || !menu) return;
    var set = function (open) { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) set(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  })();
})();
