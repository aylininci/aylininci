(function () {
  /* A true 3D graph around one centre ring: every section has a hub, every satellite is a real work item. */
  var HUBS = /*HUBS*/[];
  /* a reload always starts at the hero, even if the host restores the position late; opening a section link still works */
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  var navEntry = performance.getEntriesByType('navigation')[0], reloaded = !!navEntry && navEntry.type === 'reload';
  if (reloaded && location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  if (!location.hash) {
    var held = true, release = function () { held = false; };
    ['wheel', 'touchstart', 'keydown', 'mousedown', 'click', 'hashchange'].forEach(function (t) { addEventListener(t, release, { passive: true, once: true }); });
    (function hold() {
      if (!held) return;
      if (scrollY) scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (performance.now() < 1800) requestAnimationFrame(hold);
    })();
  }
  var root = document.documentElement, body = document.body;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('map'), c = cv.getContext('2d');
  var links = document.getElementById('links'), lc = links.getContext('2d');
  var scene = document.getElementById('ust'), hero = document.querySelector('.hero'), box = document.querySelector('.mapbox');
  var bands = [].slice.call(document.querySelectorAll('.band'));
  var titles = bands.map(function (b) { return b.querySelector('h2'); });
  var cards = [].slice.call(document.querySelectorAll('.card-wide'));
  titles.forEach(function (t, i) {
    if (i % 5 !== 1 || reduce) return;
    var text = t.textContent; t.setAttribute('aria-label', text); t.textContent = ''; t._ch = [];
    text.split(' ').forEach(function (word, w) {
      if (w) t.appendChild(document.createTextNode(' '));
      var box = document.createElement('span'); box.setAttribute('aria-hidden', 'true'); box.style.display = 'inline-block';
      word.split('').forEach(function (l) { var s = document.createElement('span'); s.textContent = l; s.style.display = 'inline-block'; box.appendChild(s); t._ch.push(s); });
      t.appendChild(box);
    });
  });
  if (!reduce) {
    root.classList.add('fx');
    var seen = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); seen.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    [].forEach.call(document.querySelectorAll('.points,.grid2,.grid3'), function (e) { seen.observe(e); });
  }
  var railLinks = [].slice.call(document.querySelectorAll('#rail a'));
  var note = document.getElementById('noteText');
  var W = 0, H = 0, dpr = 1, mobile = false, hover = -1, start = performance.now(), active = null;
  var REACH = .19, FOCAL = 2.4, INK = [1, 4, 25], MINT = [124, 242, 198], BLUE = [64, 124, 255], GREEN = [52, 214, 160];
  var tiltX = 0, tiltY = 0, lagX = -9999, lagY = -9999, mx = -9999, my = -9999, hoverSat = null, hoverLay = null, hoverP = 0, hoverLayer = document.getElementById('mapHover');
  var sel = null, selP = 0, selGoal = 0, layP = 0, layout = null, chipLayer = document.getElementById('mapChips'), repaint = function () {};
  var yaw = 0, pitch = 0, labelIn = 1, slide = 1;

  function seeded(s) { return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { v = clamp(v); return v * v * (3 - 2 * v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function rgb(a, o) { return 'rgba(' + (a[0] | 0) + ',' + (a[1] | 0) + ',' + (a[2] | 0) + ',' + o + ')'; }

  /* World: centre at the origin, hubs around it at different depths, satellites on a shell around each hub */
  var nodes = HUBS.map(function (h, i) {
    var r = seeded(i * 97 + 11), sats = [];
    for (var k = 0; k < h.n; k++) {
      var th = k / h.n * 6.283 + r() * .6, ph = (r() - .5) * 1.5, d = .62 + r() * .8;
      sats.push({ x: Math.cos(th) * Math.cos(ph) * d * REACH, y: Math.sin(th) * Math.cos(ph) * d * REACH, z: Math.sin(ph) * d * REACH, p: r(), card: k % 4 === 0 });
    }
    return { x: h.x - .7, y: h.y - .5, z: i ? (r() - .5) * .7 : 0, sats: sats, tint: h.n >= 10 ? .75 : .12, delay: i ? .12 + (i - 1) * .07 + r() * .12 : 0, sx: 0, sy: 0, scale: 1, cx: 0, cy: 0, pts: [] };
  });
  var r0 = seeded(7), dots = [];
  for (var i = 0; i < 120; i++) dots.push({ x: r0(), y: r0(), s: 1 + r0() * 1.4, v: .2 + r0() * .8 });
  var hubIndex = {}; HUBS.forEach(function (h, i) { hubIndex[h.id] = i; });
  /* screen x, screen y, closeness, how far the flight pulls back, sideways swing */
  var ROUTE = [[.62, .42, 1, .5, 0], [.72, .3, 1.15, .32, 1], [.34, .62, .85, .62, -1], [.78, .7, 1.3, .25, 1], [.5, .36, .95, .56, -.6], [.26, .3, 1.2, .3, 1], [.68, .56, .8, .64, -1], [.4, .74, 1.25, .28, .7], [.8, .42, 1, .5, -1], [.3, .56, 1.1, .36, 1], [.6, .7, .85, .6, -.7], [.5, .46, 1, .45, 0]];
  var stops = bands.map(function (b, i) { return { el: b, hub: hubIndex[b.id] === undefined ? -1 : hubIndex[b.id], bg: hex(b.dataset.bg), r: ROUTE[i % ROUTE.length] }; });

  var STOP = { 'veri': 1, 'yapil': 1, 'kontr': 1, 'analiz': 1, 'analı': 1, 'calis': 1, 'çalış': 1, 'düzen': 1, 'geliş': 1, 'optim': 1, 'sorun': 1, 'içeri': 0, 'uygul': 1, 'sayfa': 0, 'yapıl': 1, 'yapıs': 1, 'yapıl': 1, 'yönel': 1 };
  var tokens = HUBS.map(function (h) { return h.items.map(function (it) {
    return it.t.toLocaleLowerCase('tr').split(/[^a-zçğıöşü0-9]+/).filter(function (w) { return w.length >= 3 && !/^(ve|için|and|the|for|with|via|not)$/.test(w); }).map(function (w) { return w.slice(0, 5); }).filter(function (w) { return !STOP[w]; });
  }); });
  function related(i, j) {
    var mine = tokens[i][j], list = [];
    HUBS.forEach(function (h, a) { h.items.forEach(function (it, b) {
      if (a === i && b === j) return;
      var s = 0; tokens[a][b].forEach(function (w) { if (mine.indexOf(w) >= 0) s += 3; });
      if (a === i) s += 1;
      if (s) list.push({ i: a, j: b, s: s + (a !== i ? 1 : 0) });
    }); });
    list.sort(function (x, y) { return y.s - x.s || x.i - y.i || x.j - y.j; });
    return list.slice(0, 8);
  }

  function spin(x, y, z) {
    var ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch);
    var x1 = x * ca + z * sa, z1 = -x * sa + z * ca, y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb, p = FOCAL / (FOCAL - z2);
    return { x: x1 * p, y: y1 * p, z: z2, p: p };
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; mobile = W <= 860;
    cv.width = W * dpr; cv.height = H * dpr; links.width = W; links.height = H;
  }

  /* Where the camera is for this scroll position */
  function camera(y) {
    var sceneEnd = scene.offsetHeight - H, q = mobile ? clamp(y / 900) : (sceneEnd > 0 ? clamp(y / sceneEnd) : 0);
    if (reduce) q = 0;
    var bb = box.getBoundingClientRect();
    var b = { left: lerp(10, bb.left, slide), top: bb.top, width: lerp(W - 20, bb.width, slide), height: bb.height };
    var e1 = smooth(q / .24), e2 = smooth((q - .16) / .62), e3 = smooth((q - .7) / .3);
    var R = { x: lerp(b.left, 0, e1), y: lerp(b.top, 0, e1), w: lerp(b.width, W, e1), h: lerp(b.height, H, e1) };
    var z0 = Math.min(R.w / 1.62, R.h / 1.2), zF = Math.min(W, H) * 1.75;
    var ax = R.x + R.w / 2, ay = R.y + R.h / 2, fx = W / 2, fy = H * .46;
    var cur = 0, next = 0, e = 0, H0 = H * .55;
    var tops = stops.map(function (s) { return s.el.getBoundingClientRect().top + y - H0; });
    for (var i = 0; i < stops.length; i++) if (y >= tops[i]) cur = i;
    next = Math.min(cur + 1, stops.length - 1);
    if (next !== cur) e = smooth((y - (tops[next] - H * 1.15)) / (H * 1.15));
    function view(s) {
      if (s.hub < 0) return { x: 0, y: 0, z: Math.min(W / 1.62, H / 1.2), a: 1, sx: W / 2, sy: H / 2 };
      var n = nodes[s.hub]; return { x: n.cx, y: n.cy, z: zF * (mobile ? 1 : s.r[2]), a: 0, sx: mobile ? fx : W * s.r[0], sy: mobile ? fy : H * s.r[1] };
    }
    var A = view(stops[cur]), B = view(stops[next]);
    var arc = Math.sin(e * Math.PI), to = stops[next].r;
    var fly = { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), z: lerp(A.z, B.z, e) * (1 - to[3] * arc), sx: lerp(A.sx, B.sx, e) + (mobile ? 0 : to[4] * W * .1 * arc), sy: lerp(A.sy, B.sy, e), a: lerp(A.a, B.a, e) };
    var page = mix(stops[cur].bg, stops[next].bg, smooth((e - .45) / .4));
    if (reduce) {
      var inHero = y < scene.offsetHeight;
      return { x: 0, y: 0, z: z0, sx: ax, sy: ay, ink: inHero ? 1 : 0, mint: 0, focus: -1, next: -1, e: 0, labels: inHero ? 1 : 0, others: inHero ? 1 : .25, R: R, q: inHero ? 0 : 1, page: page };
    }
    var lz = Math.log(z0), lf = Math.log(fly.z);
    return {
      x: lerp(0, fly.x, e2), y: lerp(0, fly.y, e2), z: Math.exp(lerp(lz, lf, e2)), sx: lerp(ax, fly.sx, e2), sy: lerp(ay, fly.sy, e2),
      ink: 1 - smooth(q / .12), mint: e3 * (1 - Math.sin(e * Math.PI) * .75), focus: stops[cur].hub, next: stops[next].hub, e: e, wave: { x: B.sx, y: B.sy, c: stops[next].bg },
      labels: Math.max(1 - smooth((q - .1) / .3), fly.a), others: Math.max(lerp(1, .1, e2), lerp(.1, .85, Math.sin(e * Math.PI)), fly.a), R: R, q: q, page: page
    };
  }

  /* Opening: a tight cluster springs out into place while the hubs shrink */
  function spring(t) { return t <= 0 ? 0 : 1 - Math.exp(-3 * t) * Math.cos(5 * t); }
  function placeNodes(now, y) {
    var t = reduce ? 9 : (now - start - 700) / 1000;
    yaw = reduce ? 0 : Math.sin(now * .00011) * .3 + Math.sin(y * .00035) * .5;
    pitch = reduce ? .06 : .06 + Math.sin(now * .00017) * .1;
    if (!reduce && !mobile) {
      var bb = box.getBoundingClientRect(), inside = mx > -9000;
      var gx = inside ? clamp((mx - bb.left) / bb.width) * 2 - 1 : 0, gy = inside ? clamp((my - bb.top) / bb.height) * 2 - 1 : 0;
      tiltX += (gx - tiltX) * .035; tiltY += (gy - tiltY) * .035;
      yaw += tiltX * .17; pitch += tiltY * .13;
      if (inside) { if (lagX < -9000) { lagX = mx; lagY = my; } lagX += (mx - lagX) * .1; lagY += (my - lagY) * .1; }
      else { lagX = lagY = -9999; }
    }
    labelIn = smooth((t - 1.6) / .6); slide = (mobile || reduce) ? 1 : smooth((t - 1.75) / .75);
    nodes.forEach(function (n) {
      var tn = t - n.delay, g = spring(tn), x = n.x * g, yy = n.y * g, z = n.z * g, s = spin(x, yy, z);
      n.wx = x; n.wy = yy; n.wz = z; n.cx = s.x; n.cy = s.y; n.depth = s.z; n.scale = s.p;
      n.grow = spring(tn - .6); n.hIn = smooth(tn / .25); n.sIn = smooth((tn - .6) / .6);
      n.size = lerp(22, 8, smooth((tn - .9) / 1.1)) * smooth(tn / .3);
    });
  }

  function draw(now) {
    var y = window.scrollY; placeNodes(now, y);
    var k = camera(y);
    selP += (selGoal - selP) * (reduce ? 1 : .1); layP += (selGoal - layP) * (reduce ? 1 : .085);
    if (!selGoal && selP < .004) { selP = 0; layP = 0; if (layout) clearLayout(); }
    if (sel && y > 80) closeSel();
    var fade = 1 - selP;
    hoverP += ((hoverSat ? 1 : 0) - hoverP) * .18;
    if (!hoverSat && hoverP < .01 && hoverLay) { hoverLay = null; hoverP = 0; hoverLayer.textContent = ''; }
    var hd = lerp(1, .36, hoverP);
    var out = (mobile || reduce) ? 0 : smooth(k.q / .22);
    hero.style.setProperty('--out', out.toFixed(4));
    root.style.setProperty('--page', 'rgb(' + (k.page[0] | 0) + ',' + (k.page[1] | 0) + ',' + (k.page[2] | 0) + ')');
    body.classList.toggle('at-top', y < scene.offsetHeight - H * 1.05);

    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    if (k.ink > .002) { c.fillStyle = rgb(INK, k.ink); c.fillRect(k.R.x, k.R.y, k.R.w, k.R.h); }
    if (k.wave && k.e > .004 && k.e < .996) {
      var wr = Math.max(1, Math.sqrt(W * W + H * H) * 1.25 * smooth(k.e / .82)), wg = c.createRadialGradient(k.wave.x, k.wave.y, 0, k.wave.x, k.wave.y, wr);
      wg.addColorStop(0, rgb(k.wave.c, 1)); wg.addColorStop(.62, rgb(k.wave.c, 1)); wg.addColorStop(1, rgb(k.wave.c, 0));
      c.fillStyle = wg; c.fillRect(0, 0, W, H);
    }

    c.fillStyle = 'rgba(255,255,255,.3)';
    var drift = reduce ? 0 : now / 90000;
    dots.forEach(function (d) { var py = (d.y + drift * d.v - y / 60000 * d.v) % 1; if (py < 0) py += 1; c.fillRect(d.x * W, py * H, d.s, d.s); });

    function sx(v) { return (v - k.x) * k.z + k.sx; }
    function sy(v) { return (v - k.y) * k.z + k.sy; }
    function alphaOf(i) {
      if (i === k.focus) return Math.max(k.others, 1 - k.e) * fade;
      if (i === k.next) return Math.max(k.others, k.e) * fade;
      return k.others * fade;
    }
    var rings = clamp((k.z - 720) / 420), hoverFade = hover >= 0 ? .4 : 1;
    nodes.forEach(function (n) { n.sx = sx(n.cx); n.sy = sy(n.cy); });
    var centre = nodes[0];

    /* spokes from the centre ring, drawn first so they sit behind everything */
    c.lineWidth = .8;
    nodes.forEach(function (n, i) { if (!i) return; c.strokeStyle = rgb(BLUE, .24 * alphaOf(i) * n.hIn * hoverFade * hd); c.beginPath(); c.moveTo(centre.sx, centre.sy); c.lineTo(n.sx, n.sy); c.stroke(); });

    /* far hubs first so nearer ones paint over them */
    var order = nodes.map(function (n, i) { return i; }).sort(function (a, b) { return nodes[a].depth - nodes[b].depth; });
    order.forEach(function (i) {
      var n = nodes[i], h = HUBS[i], on = hover === i;
      var a0 = alphaOf(i) * (on || hover < 0 ? 1 : .45), a = a0 * hd, m = i === k.focus ? k.mint * (1 - k.e) : i === k.next ? k.mint * k.e : 0;
      var reach = REACH * 1.6 * k.z * n.scale, hx = n.sx, hy = n.sy;
      if (a < .01 || hx < -reach || hx > W + reach || hy < -reach || hy > H + reach) return;
      var edge = mix(mix(BLUE, GREEN, n.tint), MINT, m), far = nodes[(i + 1) % nodes.length];
      n.sats.forEach(function (s, j) {
        var wob = reduce ? 0 : Math.sin(now * .0006 + s.p * 6) * .006;
        var g = Math.max(0, n.grow), p = spin(n.wx + s.x * g + wob, n.wy + s.y * g, n.wz + s.z * g);
        var px = sx(p.x), py = sy(p.y), near = clamp((p.z + .5));
        var sa = a * n.sIn * (.45 + near * .55);
        n.pts[j] = { x: px, y: py };
        if (sa < .01) return;
        if (j % 4 === 1 && far) { c.strokeStyle = rgb(BLUE, .07 * sa); c.lineWidth = .7; c.beginPath(); c.moveTo(px, py); c.lineTo(far.sx, far.sy); c.stroke(); }
        var grad = c.createLinearGradient(hx, hy, px, py);
        grad.addColorStop(0, rgb(edge, Math.min(1, (.95 + m) * sa)));
        grad.addColorStop(1, rgb(edge, (.14 + .7 * m) * sa));
        c.strokeStyle = grad; c.lineWidth = .9 + m * .5; c.beginPath(); c.moveTo(hx, hy); c.lineTo(px, py); c.stroke();
        if (rings > .05) { c.strokeStyle = rgb([255, 255, 255], sa * rings * .9); c.beginPath(); c.arc(px, py, 4, 0, 6.283); c.stroke(); }
        if (s.card) {
          var cw = (mobile ? 6 : 8) * p.p * (1 + rings * .6), ch = cw * .72;
          c.fillStyle = rgb(INK, sa); c.fillRect(px - cw - 1, py - ch - 1, cw * 2 + 2, ch * 2 + 2);
          c.strokeStyle = 'rgba(255,255,255,' + sa * .55 + ')'; c.lineWidth = .7; c.strokeRect(px - cw - 1, py - ch - 1, cw * 2 + 2, ch * 2 + 2);
          c.fillStyle = 'rgba(255,255,255,' + sa + ')'; c.fillRect(px - cw * .7, py - ch * .55, cw * .85, ch * 1.1);
          c.fillRect(px + cw * .25, py - ch * .55, cw * .45, ch * .45);
        } else if (rings <= .05) {
          var dm = (mobile || sel || hoverSat || lagX < -9000) ? 9999 : Math.sqrt((px - lagX) * (px - lagX) + (py - lagY) * (py - lagY));
          var lit = clamp(1.25 - dm / 190);
          s.w = Math.max(lit, (s.w || 0) * .978);
          var gl = s.w > .08 ? s.w : 0, size = (1.7 + near * 2.2) * p.p + gl * .8;
          if (dm < 62) { c.strokeStyle = 'rgba(255,255,255,' + Math.max(sa, .9) + ')'; c.lineWidth = 1; c.beginPath(); c.arc(px, py, size + 1.5, 0, 6.283); c.stroke(); }
          else {
            c.fillStyle = on || gl > .12 ? 'rgba(255,255,255,' + Math.max(sa, Math.min(1, gl * 1.6) * n.sIn) + ')' : rgb(mix(BLUE, [150, 180, 255], .4), sa);
            c.beginPath(); c.arc(px, py, size, 0, 6.283); c.fill();
          }
        }
      });
      if (i === 0) {
        c.strokeStyle = rgb(mix(BLUE, MINT, m), a * n.hIn); c.lineWidth = 1; c.beginPath(); c.arc(hx, hy, (5 + 6 * (1 - slide)) * n.scale + m * 2, 0, 6.283); c.stroke();
      } else {
        var hs = n.size * n.scale * .5;
        c.fillStyle = rgb(mix([96, 132, 255], MINT, on ? 1 : m), a * n.hIn); c.fillRect(hx - hs, hy - hs, hs * 2, hs * 2);
      }
      var la = Math.min(a0, k.labels) * labelIn;
      if (la > .02) {
        c.font = '300 ' + (mobile ? 11 : 13) + 'px "Geist Mono", monospace';
        var w = c.measureText(h.name).width, lx = hx + 11 + w + 16 > k.R.x + k.R.w ? hx - 9 - w : hx + 11;
        c.fillStyle = 'rgba(255,255,255,' + la + ')'; c.fillText(h.name, lx, hy - 7);
        if (!mobile) { c.font = '300 10px "Geist Mono", monospace'; c.fillStyle = 'rgba(255,255,255,' + la * .65 + ')'; c.fillText(h.n, lx + w + 4, hy - 13); }
      }
    });

    if (layout) drawSelection(now);
    if (hoverLay) drawHover();

    /* Section titles and cards do not all arrive the same way */
    if (!reduce) titles.forEach(function (t, i) {
      var top = t.getBoundingClientRect().top; if (top > H * 1.1 || top < -200) return;
      var f = clamp((H * .92 - top) / (H * .3)), v = i % 5, g = 1 - f;
      if (v === 0) {
        t.style.color = 'rgba(255,255,255,' + f.toFixed(3) + ')';
        t.style.webkitTextStroke = g > .01 ? '1px rgba(255,255,255,' + (g * .8).toFixed(3) + ')' : '0';
      } else if (v === 1) {
        t._ch.forEach(function (ch, q) {
          var p = clamp(f * (1 + t._ch.length * .09) - q * .09);
          ch.style.opacity = p.toFixed(3); ch.style.transform = p < 1 ? 'translate3d(0,' + ((1 - p) * .7).toFixed(3) + 'em,0)' : 'none';
        });
      } else if (v === 2) {
        t.style.clipPath = g > .002 ? 'inset(-20% ' + (g * 100).toFixed(2) + '% -25% -2%)' : 'none';
      } else if (v === 3) {
        t.style.transformOrigin = '0 100%'; t.style.opacity = f.toFixed(3); t.style.transform = g > .002 ? 'scale(' + (1 + g * .34).toFixed(4) + ')' : 'none';
      } else {
        t.style.opacity = f.toFixed(3); t.style.transform = g > .002 ? 'translate3d(' + (-g * 14).toFixed(2) + 'vw,0,0)' : 'none';
      }
    });
    if (!reduce && !mobile) cards.forEach(function (e, i) {
      var r = e.getBoundingClientRect(); if (r.top > H * 1.15 || r.bottom < -H * .4) return;
      var p = smooth((H * 1.02 - r.top) / (H * .62)), g = 1 - p, v = i % 4;
      e.style.opacity = v === 3 ? '' : Math.min(1, p * 1.6).toFixed(3);
      e.style.transform = g < .002 ? 'none' : v === 0 ? 'translate3d(0,' + (g * 90).toFixed(1) + 'px,0)' : v === 1 ? 'translate3d(' + (g * 110).toFixed(1) + 'px,0,0)' : v === 2 ? 'scale(' + (1 - g * .08).toFixed(4) + ')' : 'none';
      if (v === 3) e.style.clipPath = g > .002 ? 'inset(0 0 ' + (g * 72).toFixed(2) + '% 0)' : 'none';
      var fl = e.querySelector('.float'); if (!fl) return;
      var mid = clamp((r.top + r.height / 2) / H);
      fl.style.transform = i % 2 ? 'scale(' + (1 + g * .16).toFixed(4) + ')' : 'translate3d(0,' + ((mid - .5) * -30).toFixed(1) + 'px,0) scale(1.07)';
    });
    drawLinks();
  }

  /* Selecting a hub or an item: it flies to the centre and its related items open around it with labels */
  function frac(v) { return v - Math.floor(v); }
  function clearLayout() { layout = null; chipLayer.textContent = ''; chipLayer.classList.remove('live'); box.style.height = ''; box.style.aspectRatio = ''; }
  function closeSel() { sel = null; selGoal = 0; chipLayer.classList.remove('live'); repaint(); }
  function chip(cls, text, sup) {
    var e = document.createElement(cls === 'go' ? 'a' : 'button');
    if (cls !== 'go') e.type = 'button';
    e.className = 'chip ' + cls; e.textContent = text;
    if (sup) { var s = document.createElement('sup'); s.textContent = sup; e.appendChild(s); }
    chipLayer.appendChild(e); return e;
  }
  function goTo(hub) { return function () { closeSel(); document.getElementById(HUBS[hub].id).scrollIntoView(); }; }
  function select(s, from) {
    var h = HUBS[s.i], n = nodes[s.i], isSat = s.j !== undefined;
    var relList = isSat ? related(s.i, s.j) : h.items.map(function (it, idx) { return { i: s.i, j: idx }; });
    var rows = Math.ceil(relList.length / 2);
    if (mobile) { box.style.aspectRatio = 'auto'; box.style.height = (170 + rows * 46) + 'px'; }
    var b = box.getBoundingClientRect();
    var rx = b.width * (mobile ? .34 : .36), ry = b.height * (mobile ? .4 : .39), gap = mobile ? 25 : 30;
    chipLayer.textContent = ''; sel = s; selGoal = 1; layP = 0;
    var first = !layout, pts = [];
    relList.forEach(function (r) { pts.push({ idx: r.j, hub: r.i, it: HUBS[r.i].items[r.j] }); });
    pts.forEach(function (p, q) {
      var th = (q + .5) / pts.length * 6.283 - 1.2, r = .7 + .3 * frac(q * .618);
      p.dx = Math.cos(th) * rx * r; p.dy = Math.sin(th) * ry * r; p.z = (frac(q * .37 + .13) * 2 - 1) * ry * .95; p.a = 0; p.v = 0; p.f = .6 + frac(q * .61 + .2) * .8;
    });
    [pts.filter(function (p) { return p.dx < 0; }), pts.filter(function (p) { return p.dx >= 0; })].forEach(function (side) {
      side.sort(function (a, c) { return a.dy - c.dy; });
      for (var q = 1; q < side.length; q++) if (side[q].dy < side[q - 1].dy + gap) side[q].dy = side[q - 1].dy + gap;
      var over = side.length ? side[side.length - 1].dy - ry : 0;
      if (over > 0) side.forEach(function (p) { p.dy -= over; });
    });
    if (mobile) pts.forEach(function (p, q) {
      p.dx = (q % 2 ? .03 : -.46) * b.width; p.dy = 74 + Math.floor(q / 2) * 46;
    });
    pts.forEach(function (p) {
      var o = first && nodes[p.hub].pts[p.idx] ? nodes[p.hub].pts[p.idx] : null;
      p.ox = o ? o.x : null; p.oy = o ? o.y : null; p.card = nodes[p.hub].sats[p.idx].card;
      p.el = chip('sat', p.it.t);
      p.el.addEventListener('click', function (e) { e.stopPropagation(); select({ i: p.hub, j: p.idx }); });
      p.el.addEventListener('mouseenter', function () { if (layout) layout.over = p; });
      p.el.addEventListener('mouseleave', function () { if (layout && layout.over === p) layout.over = null; });
    });
    var main = chip('main', isSat ? h.items[s.j].t : h.name, isSat ? '' : String(h.n));
    var target = isSat ? h.items[s.j] : null, go = document.createElement('a');
    go.className = 'chip-center'; go.setAttribute('aria-label', target && target.u ? 'Yazıyı oku' : 'Bölüme git');
    if (target && target.u) {
      /* draft post pages sit next to this page, so they open in the same frame */
      go.href = target.u;
      if (/^https?:/.test(target.u)) { go.target = '_blank'; go.rel = 'noopener'; }
      main.style.cursor = 'pointer';
      main.addEventListener('click', function (e) { e.stopPropagation(); go.click(); });
    }
    else { go.href = '#' + h.id; go.addEventListener('click', function (e) { e.preventDefault(); goTo(s.i)(); }); }
    chipLayer.appendChild(go);
    var parent = null;
    if (isSat) { parent = chip('main', h.name, String(h.n)); parent.addEventListener('click', function (e) { e.stopPropagation(); select({ i: s.i }); }); }
    layout = { items: pts, tint: n.tint, main: main, go: go, parent: parent, ox: from ? from.x : null, oy: from ? from.y : null, over: null, ring: 0, onCentre: false, hub: s.i };
    go.addEventListener('mouseenter', function () { if (layout) layout.onCentre = true; });
    go.addEventListener('mouseleave', function () { if (layout) layout.onCentre = false; });
    go.addEventListener('focus', function () { if (layout) layout.onCentre = true; });
    go.addEventListener('blur', function () { if (layout) layout.onCentre = false; });
    chipLayer.classList.add('live'); repaint();
  }
  function setHover(h) {
    if (hoverSat && h && hoverSat.i === h.i && hoverSat.j === h.j) return;
    hoverSat = h; if (!h) return;
    hoverLayer.textContent = '';
    var rel = related(h.i, h.j).map(function (r) {
      var e = document.createElement('span'); e.className = 'tip'; e.textContent = HUBS[r.i].items[r.j].t; hoverLayer.appendChild(e);
      return { i: r.i, j: r.j, el: e };
    });
    var me = document.createElement('span'); me.className = 'tip me'; me.textContent = HUBS[h.i].items[h.j].t; hoverLayer.appendChild(me);
    hoverLay = { i: h.i, j: h.j, rel: rel, me: me };
  }
  function drawHover() {
    var b = box.getBoundingClientRect(), a = nodes[hoverLay.i].pts[hoverLay.j]; if (!a) return;
    c.lineWidth = .9;
    hoverLay.rel.forEach(function (r) {
      var p = nodes[r.i].pts[r.j]; if (!p) { r.el.style.opacity = 0; return; }
      c.strokeStyle = 'rgba(255,255,255,' + .6 * hoverP + ')'; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(p.x, p.y); c.stroke();
      c.strokeStyle = rgb(MINT, hoverP); c.strokeRect(p.x - 7, p.y - 6, 14, 12);
      c.fillStyle = 'rgba(255,255,255,' + hoverP + ')'; c.fillRect(p.x - 3, p.y - 2, 6, 4);
      var w = r.w || (r.w = r.el.offsetWidth), lx = p.x - b.left + 11;
      if (lx + w > b.width - 4) lx = p.x - b.left - 11 - w;
      place(r.el, lx, p.y - b.top - 8, hoverP);
    });
    c.strokeStyle = rgb(MINT, hoverP); c.lineWidth = 1.2; c.beginPath(); c.arc(a.x, a.y, 5, 0, 6.283); c.stroke();
    var mw = hoverLay.mw || (hoverLay.mw = hoverLay.me.offsetWidth), mh = hoverLay.mh || (hoverLay.mh = hoverLay.me.offsetHeight), left = a.x - b.left + 9;
    if (left + mw > b.width - 4) left = a.x - b.left - 9 - mw;
    var top = a.y - b.top - mh - 8; if (top < 4) top = a.y - b.top + 9;
    place(hoverLay.me, left, top, hoverP);
  }

  function place(el, x, y, o) { el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; el.style.opacity = o; }
  function drawSelection(now) {
    var b = box.getBoundingClientRect(), t = smooth(layP), cx = b.left + b.width / 2, cy = mobile ? b.top + 92 : b.top + b.height * .54;
    var ox = layout.ox === null ? cx : lerp(layout.ox, cx, t), oy = layout.oy === null ? cy : lerp(layout.oy, cy, t);
    layout.ring += ((layout.onCentre || mobile ? 1 : 0) - layout.ring) * (reduce ? 1 : .16);
    var edge = mix(BLUE, GREEN, layout.tint), show = smooth((layP - .45) * 2), dim = lerp(1, .32, mobile ? 0 : layout.ring), a = smooth(layP * 1.6) * dim;
    var ta = tiltX * .16, tb = tiltY * .13, ca1 = Math.cos(ta), sa1 = Math.sin(ta), cb1 = Math.cos(tb), sb1 = Math.sin(tb);
    var on = !reduce && !mobile && lagX > -9000, rc = on ? Math.sqrt((lagX - cx) * (lagX - cx) + (lagY - cy) * (lagY - cy)) : 0;
    var ang = on ? Math.atan2(lagY - cy, lagX - cx) : 0, dA = 0;
    if (on && rc > 30) {
      if (layout.ang !== undefined) { dA = ang - layout.ang; if (dA > Math.PI) dA -= 6.283; if (dA < -Math.PI) dA += 6.283; dA = Math.max(-.14, Math.min(.14, dA)); }
      layout.ang = ang;
    } else { layout.ang = undefined; }
    var reach = clamp(rc / 90);
    layout.items.forEach(function (p, q) {
      var w = reduce ? 0 : Math.sin(now * .00045 + q * 1.7) * 7, h0 = reduce ? 0 : Math.cos(now * .00038 + q) * 5;
      if (!reduce && !mobile) {
        var R = Math.sqrt(p.dx * p.dx + p.dy * p.dy), ad = Math.atan2(p.dy, p.dx) + p.a - ang;
        ad = Math.atan2(Math.sin(ad), Math.cos(ad));
        var wt = (.12 + .6 * Math.exp(-ad * ad) * Math.exp(-(R - rc) * (R - rc) / 48000)) * p.f * reach;
        p.v = (p.v + dA * wt * .075 - p.a * .0026) * .95;
        p.a = Math.max(-.62, Math.min(.62, p.a + p.v));
      }
      var sn = Math.sin(p.a), cs = Math.cos(p.a), rx0 = p.dx * cs - p.dy * sn, ry0 = p.dx * sn + p.dy * cs;
      var x0 = rx0 + w, y0 = ry0 + h0, z0 = mobile ? 0 : p.z;
      var x1 = x0 * ca1 + z0 * sa1, z1 = -x0 * sa1 + z0 * ca1, y1 = y0 * cb1 - z1 * sb1;
      var tx = cx + x1, ty = cy + y1;
      var px = lerp(p.ox === null ? cx : p.ox, tx, t), py = lerp(p.oy === null ? cy : p.oy, ty, t);
      var grad = c.createLinearGradient(ox, oy, px, py);
      var lit = layout.over === p; p.sx = px; p.sy = py;
      grad.addColorStop(0, rgb(lit ? mix(edge, MINT, .6) : edge, a)); grad.addColorStop(1, rgb(lit ? mix(edge, MINT, .6) : edge, (lit ? .95 : .3) * a));
      c.strokeStyle = grad; c.lineWidth = lit ? 1.4 : 1; c.beginPath(); c.moveTo(ox, oy); c.lineTo(px, py); c.stroke();
      if (p.card) {
        c.fillStyle = rgb(INK, a); c.fillRect(px - 8, py - 6, 16, 12);
        c.strokeStyle = 'rgba(255,255,255,' + a * .55 + ')'; c.lineWidth = .7; c.strokeRect(px - 8, py - 6, 16, 12);
        c.fillStyle = 'rgba(255,255,255,' + a + ')'; c.fillRect(px - 5, py - 3, 7, 6); c.fillRect(px + 3, py - 3, 3, 3);
      } else {
        var dm = (mobile || lagX < -9000) ? 9999 : Math.sqrt((px - lagX) * (px - lagX) + (py - lagY) * (py - lagY));
        p.gl = Math.max(clamp(1.2 - dm / 170), (p.gl || 0) * .978);
        var white = lit || p.gl > .14;
        c.fillStyle = white ? 'rgba(255,255,255,' + (lit ? a : Math.min(1, p.gl * 1.6) * a) + ')' : rgb(mix(BLUE, [150, 180, 255], .4), a);
        c.beginPath(); c.arc(px, py, lit ? 3.6 : 2.6 + p.gl * .8, 0, 6.283); c.fill();
      }
      var ew = p.w || (p.w = p.el.offsetWidth), eh = p.h || (p.h = p.el.offsetHeight), lx = px - b.left, ly = py - b.top;
      var left = mobile ? lx + 9 : p.dx >= 0 ? lx + 12 : lx - 12 - ew;
      if (!mobile && left + ew > b.width - 4) left = lx - 12 - ew;
      if (!mobile && left < 4) left = lx + 12;
      place(p.el, left, ly - eh / 2, show * lerp(1, .55, mobile ? 0 : layout.ring));
    });
    var cr = lerp(5, 14, layout.ring), ca = smooth(layP * 1.6);
    c.fillStyle = rgb(INK, ca); c.beginPath(); c.arc(ox, oy, cr, 0, 6.283); c.fill();
    c.strokeStyle = rgb(mix(mix(BLUE, MINT, .3), MINT, layout.ring), ca); c.lineWidth = 1.2; c.beginPath(); c.arc(ox, oy, cr, 0, 6.283); c.stroke();
    if (layout.ring > .05) {
      c.strokeStyle = rgb(MINT, ca * layout.ring); c.lineWidth = 1.4; c.lineCap = 'round'; c.beginPath();
      c.moveTo(ox, oy - 6); c.lineTo(ox, oy + 6); c.moveTo(ox - 4, oy + 2); c.lineTo(ox, oy + 6); c.lineTo(ox + 4, oy + 2); c.stroke(); c.lineCap = 'butt';
    }
    place(layout.go, ox - b.left - 18, oy - b.top - 18, 1);
    var mw = layout.mw || (layout.mw = layout.main.offsetWidth), mh = layout.mh || (layout.mh = layout.main.offsetHeight);
    place(layout.main, ox - b.left - mw / 2, oy - b.top - mh - cr - 4, show);
    if (layout.parent) {
      var tx = cx + b.width * .03, ty = mobile ? b.top + 26 : b.top + b.height * .09, ppx = lerp(ox, tx, t), ppy = lerp(oy, ty, t);
      c.strokeStyle = rgb(GREEN, .7 * a); c.lineWidth = 1; c.beginPath(); c.moveTo(ox, oy); c.lineTo(ppx, ppy); c.stroke();
      c.fillStyle = rgb(MINT, a); c.fillRect(ppx - 4, ppy - 4, 8, 8);
      var pw = layout.pw || (layout.pw = layout.parent.offsetWidth), ph = layout.ph || (layout.ph = layout.parent.offsetHeight);
      place(layout.parent, ppx - b.left + 10, ppy - b.top - ph - 2, show);
    }
  }

  function setActive(b) {
    active = b;
    railLinks.forEach(function (a) { var on = b && a.getAttribute('href') === '#' + b.id; if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    if (b) note.textContent = b.dataset.note;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) setActive(e.target); else if (e.target === active && window.scrollY < bands[0].offsetTop) setActive(null); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  bands.forEach(function (b) { io.observe(b); });

  function drawLinks() {
    lc.clearRect(0, 0, W, H);
    if (!active || W <= 1120 || body.classList.contains('at-top')) return;
    var card = active.querySelector('.card'), dot = document.querySelector('#rail a[aria-current]'), n = document.getElementById('notes');
    if (!card || !dot) return;
    var a = card.getBoundingClientRect(), d = dot.getBoundingClientRect();
    if (a.bottom < 0 || a.top > H) return;
    var wires = [[d.right, d.top + d.height / 2, a.left, a.top + 18]];
    if (getComputedStyle(n).display !== 'none') { var s = n.getBoundingClientRect(); wires.push([a.right, a.top + 18, s.left, s.top + 14]); }
    lc.strokeStyle = 'rgba(255,255,255,.4)'; lc.lineWidth = 1; lc.beginPath();
    wires.forEach(function (w) { lc.moveTo(w[0], w[1]); lc.lineTo(w[2], w[3]); });
    lc.stroke();
    if (!reduce) {
      var run = (performance.now() % 4000) / 4000 * 1.5 - .15;
      lc.strokeStyle = '#fff'; lc.lineWidth = 1.5; lc.beginPath();
      wires.forEach(function (w) {
        var p0 = clamp(run), p1 = clamp(run + .15);
        if (p1 > p0) { lc.moveTo(lerp(w[0], w[2], p0), lerp(w[1], w[3], p0)); lc.lineTo(lerp(w[0], w[2], p1), lerp(w[1], w[3], p1)); }
      });
      lc.stroke();
    }
    lc.fillStyle = '#fff'; lc.fillRect(a.left - 2, a.top + 16, 4, 4); lc.fillRect(a.right - 2, a.top + 16, 4, 4);
  }

  function hit(e) {
    var best = null, lim = 900;
    nodes.forEach(function (n, i) { var x = n.sx - e.clientX, y = n.sy - e.clientY, d = x * x + y * y; if (d < lim) { lim = d; best = { i: i }; } });
    if (best) return best;
    lim = mobile ? 400 : 256;
    nodes.forEach(function (n, i) { n.pts.forEach(function (p, j) { if (!p) return; var x = p.x - e.clientX, y = p.y - e.clientY, d = x * x + y * y; if (d < lim) { lim = d; best = { i: i, j: j }; } }); });
    return best;
  }
  box.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (sel) {
      setHover(null);
      hover = -1; if (!layout) return;
      if (!e.target.closest('.chip')) {
        var best = null, lim = 400;
        layout.items.forEach(function (p) { if (p.sx === undefined) return; var dx = p.sx - e.clientX, dy = p.sy - e.clientY, d = dx * dx + dy * dy; if (d < lim) { lim = d; best = p; } });
        layout.over = best; box.style.cursor = best ? 'pointer' : '';
      }
      return;
    }
    var h = window.scrollY > 40 ? null : hit(e);
    hover = h && h.j === undefined ? h.i : -1; box.style.cursor = h ? 'pointer' : '';
    setHover(h && h.j !== undefined ? h : null);
  });
  box.addEventListener('mouseleave', function () { hover = -1; mx = my = -9999; setHover(null); });
  box.addEventListener('click', function (e) {
    if (e.target.closest('.chip, .chip-center')) return;
    if (sel) {
      if (layout && layout.over) { select({ i: layout.over.hub, j: layout.over.idx }); return; }
      closeSel(); return;
    }
    var h = hit(e); if (!h) return;
    hover = -1; box.style.cursor = ''; setHover(null);
    select(h, h.j === undefined ? { x: nodes[h.i].sx, y: nodes[h.i].sy } : nodes[h.i].pts[h.j]);
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && sel) closeSel(); });

  addEventListener('resize', resize);
  resize();
  if (reduce) {
    var paint = function () { draw(performance.now()); };
    repaint = paint;
    addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paint);
    paint();
  } else {
    /* phones and small CPUs draw the map at 30 fps, which still reads as smooth */
    var slow = mobile || (navigator.hardwareConcurrency || 8) <= 4, odd = false;
    (function loop(t) { odd = !odd; if (!slow || odd) draw(t); requestAnimationFrame(loop); })(performance.now());
  }
})();
