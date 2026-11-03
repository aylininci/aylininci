(function () {
  /* Hero tiles: a self-running pixel runner game and a typing code loop. Both pause off screen. */
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function visible(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && !document.hidden; }

  var cv = document.getElementById('dino');
  if (cv) {
    var c = cv.getContext('2d'), W = cv.width, H = cv.height, FLOOR = 42;
    var BODY = ['           xxxxxxxx ', '          xxxxxxxxxx', '          xx xxxxxxx', '          xxxxxxxxxx', '          xxxxxxxxxx', '          xxxxxxxxxx', '          xxxxx     ', '          xxxxxxxx  ', 'x        xxxxx      ', 'x       xxxxxx      ', 'xx     xxxxxxxxxx   ', 'xxx  xxxxxxxxx  x   ', 'xxxxxxxxxxxxxx      ', 'xxxxxxxxxxxxxx      ', ' xxxxxxxxxxxx       ', '  xxxxxxxxxxx       ', '   xxxxxxxxx        ', '    xxxxxxx         '];
    var LEGS = [
      ['     xxx  xx        ', '     xx    x        ', '     x     x        ', '     xx    xx       '],
      ['     xxx  xx        ', '     xx    xxx      ', '     x              ', '     xx             '],
      ['     xxx  xx        ', '    xxx   x         ', '          x         ', '          xx        ']
    ];
    var CACTI = [
      ['  x  ', '  x  ', 'x x  ', 'x x x', 'x x x', 'xxxxx', '  xx ', '  x  ', '  x  ', '  x  ', '  x  '],
      ['   x   ', '   x x ', 'x  x x ', 'x  x x ', 'x  xxx ', 'x  x   ', 'xxxx   ', '   x   ', '   x   ', '   x   ', '   x   ', '   x   ', '   x   '],
      ['  x    x  ', '  x    x  ', 'x x x  x x', 'x x x  x x', 'xxxxx  xxx', '  x    x  ', '  x    x  ', '  x    x  ', '  x    x  ', '  x    x  ']
    ];
    var BIRD = [
      ['    x        ', '    xx       ', '    xxx      ', '  x xxxx     ', ' xxxxxxxxxxx ', 'xxxxxxxxxx   ', '     xxxxxxx ', '     xxx     '],
      ['             ', '             ', '             ', '  x          ', ' xxxxxxxxxxx ', 'xxxxxxxxxx   ', '     xxxxxxx ', '     xxx     ', '     xx      ', '     x       ', '     x       ']
    ];
    var DIGITS = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
    var sprite = function (rows, x, y) {
      for (var r = 0; r < rows.length; r++) for (var i = 0; i < rows[r].length; i++) if (rows[r][i] !== ' ') c.fillRect(Math.round(x) + i, Math.round(y) + r, 1, 1);
    };
    var num = function (n, x, y) {
      var s = String(n); while (s.length < 5) s = '0' + s;
      for (var q = 0; q < 5; q++) { var d = DIGITS[+s[q]]; for (var p = 0; p < 15; p++) if (d[p] === '1') c.fillRect(x + q * 4 + p % 3, y + Math.floor(p / 3), 1, 1); }
    };
    var jumpY = 0, vy = 0, frame = 0, score = 0, best = 1204, speed = 1.5, night = 0, nightGoal = 0, gap = 90, obstacles = [];
    var clouds = [{ x: 60, y: 8 }, { x: 150, y: 14 }], bumps = [];
    for (var b = 0; b < 26; b++) bumps.push({ x: Math.random() * W, y: FLOOR + 2 + Math.floor(Math.random() * 3), w: 1 + Math.floor(Math.random() * 3) });
    var spawn = function () {
      var bird = score > 300 && Math.random() < .22;
      obstacles.push(bird ? { x: W + 8, y: 18, bird: true, w: 13 } : (function () { var s = CACTI[Math.floor(Math.random() * 3)]; return { x: W + 8, y: FLOOR + 1 - s.length, s: s, w: s[0].length }; })());
    };
    var step = function () {
      frame++; score += .1; speed = Math.min(2.4, 1.5 + score / 1600);
      if (Math.floor(score) >= 99999) score = 0;
      best = Math.max(best, Math.floor(score));
      if (Math.floor(score) % 700 === 0 && Math.floor(score) > 0 && Math.floor(score) !== step.at) { step.at = Math.floor(score); nightGoal = nightGoal ? 0 : 1; }
      night += (nightGoal - night) * .03;
      gap -= speed; if (gap <= 0) { spawn(); gap = 70 + Math.random() * 90; }
      for (var i = obstacles.length - 1; i >= 0; i--) {
        var o = obstacles[i]; o.x -= o.bird ? speed * 1.08 : speed;
        if (o.x < -16) obstacles.splice(i, 1);
        else if (!jumpY && !vy && o.x > 22 && o.x - 22 < speed * 13) vy = -2.55;
      }
      if (vy || jumpY) { jumpY += vy; vy += .14; if (jumpY >= 0) { jumpY = 0; vy = 0; } }
      clouds.forEach(function (k) { k.x -= .25; if (k.x < -24) { k.x = W + Math.random() * 60; k.y = 5 + Math.random() * 14; } });
      bumps.forEach(function (k) { k.x -= speed; if (k.x < -4) k.x = W + Math.random() * 20; });
    };
    var paint = function () {
      var v = Math.round(lerp(247, 18, night)), fg = Math.round(lerp(83, 214, night));
      c.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; c.fillRect(0, 0, W, H);
      var cl = Math.round(lerp(218, 90, night)); c.fillStyle = 'rgb(' + cl + ',' + cl + ',' + cl + ')';
      clouds.forEach(function (k) { c.fillRect(k.x + 4, k.y, 10, 1); c.fillRect(k.x + 2, k.y + 1, 3, 1); c.fillRect(k.x + 13, k.y + 1, 3, 1); c.fillRect(k.x, k.y + 2, 20, 1); });
      c.fillStyle = 'rgb(' + fg + ',' + fg + ',' + fg + ')';
      c.fillRect(0, FLOOR, W, 1);
      bumps.forEach(function (k) { c.fillRect(Math.round(k.x), k.y, k.w, 1); });
      obstacles.forEach(function (o) { sprite(o.bird ? BIRD[Math.floor(frame / 12) % 2] : o.s, o.x, o.y); });
      var y = FLOOR - 21 + jumpY, leg = jumpY ? 0 : 1 + Math.floor(frame / 6) % 2;
      sprite(BODY, 8, y); sprite(LEGS[leg], 8, y + 18);
      var hi = Math.round(lerp(150, 140, night)); c.fillStyle = 'rgb(' + hi + ',' + hi + ',' + hi + ')'; num(best, W - 46, 3);
      c.fillStyle = 'rgb(' + fg + ',' + fg + ',' + fg + ')'; num(Math.floor(score), W - 23, 3);
    };
    var lerp = function (a, d, t) { return a + (d - a) * t; };
    if (reduce) { obstacles.push({ x: 110, y: FLOOR + 1 - CACTI[1].length, s: CACTI[1], w: 7 }); paint(); }
    else {
      var last = 0, acc = 0;
      (function loop(t) {
        requestAnimationFrame(loop);
        if (!visible(cv)) { last = t; return; }
        acc += Math.min(100, t - (last || t)); last = t;
        while (acc >= 16.67) { step(); acc -= 16.67; }
        paint();
      })(0);
    }
  }

  var code = document.getElementById('codeLoop'), file = document.getElementById('codeFile');
  if (code) {
    var SNIPPETS = /*CODE*/[];
    var at = 0, typed = 0, show = function () {
      var s = SNIPPETS[at]; file.textContent = s[0];
      var lines = s[1].slice(0, typed).split('\n');
      code.textContent = lines.slice(-3).join('\n');
    };
    if (reduce) { typed = SNIPPETS[0][1].length; show(); }
    else {
      var tick = function () {
        var wait = 26;
        if (visible(code)) {
          var s = SNIPPETS[at];
          if (typed < s[1].length) { typed += 1; if (s[1][typed - 1] === '\n') wait = 170; show(); if (typed === s[1].length) wait = 1900; }
          else { at = (at + 1) % SNIPPETS.length; typed = 0; show(); wait = 240; }
        } else { wait = 400; }
        setTimeout(tick, wait);
      };
      tick();
    }
  }

  var ASK = /*ASK*/{};
  [].forEach.call(document.querySelectorAll('.stage'), function (st) {
    var card = st.querySelector('.ask'), p = card.querySelector('p'), list = ASK[st.getAttribute('data-id')], k = 0, n = 0, on = false, timer = 0;
    if (reduce) p.textContent = list[0];
    var run = function () {
      timer = 0; if (!on) return;
      var s = list[k];
      if (n < s.length) { n++; p.textContent = s.slice(0, n); timer = setTimeout(run, 42); return; }
      card.classList.add('go');
      timer = setTimeout(function () { card.classList.remove('go'); k = (k + 1) % list.length; n = 0; p.textContent = ''; timer = setTimeout(run, 320); }, 2300);
    };
    new IntersectionObserver(function (es) {
      on = es[0].isIntersecting; st.classList.toggle('in', on);
      if (on && !reduce && !timer) timer = setTimeout(run, 500);
    }, { threshold: .3 }).observe(st);
  });

  /* Post cards: each post has its own constellation, tinted by its topic */
  var arts = [].map.call(document.querySelectorAll('.post-art canvas'), function (cv, k) {
    var s = cv.getAttribute('data-slug'), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    var rnd = function () { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
    var bg = cv.getAttribute('data-bg'), col = [parseInt(bg.slice(1, 3), 16), parseInt(bg.slice(3, 5), 16), parseInt(bg.slice(5, 7), 16)];
    var hubs = [], dust = [], nh = 3 + Math.floor(rnd() * 2);
    for (var q = 0; q < nh; q++) {
      var an = q / nh * 6.283 + rnd() * .6, r = .5 + rnd() * .35, hub = { x: Math.cos(an) * r, y: (rnd() - .5) * .7, z: Math.sin(an) * r * .7, s: [] };
      for (var j = 0, n = 5 + Math.floor(rnd() * 5); j < n; j++) { var b2 = rnd() * 6.283, e2 = (rnd() - .5) * 2.2, l = .14 + rnd() * .18; hub.s.push({ x: Math.cos(b2) * Math.cos(e2) * l, y: Math.sin(e2) * l, z: Math.sin(b2) * Math.cos(e2) * l, box: rnd() < .28 }); }
      hubs.push(hub);
    }
    for (var u = 0; u < 60; u++) dust.push({ x: (rnd() - .5) * 2.6, y: (rnd() - .5) * 1.6, z: (rnd() - .5) * 2.6 });
    return { cv: cv, c: cv.getContext('2d'), hubs: hubs, dust: dust, col: col, lead: k === 0, w: 0, hover: 0, card: cv.closest('a') };
  });
  var paintArt = function (A, now) {
    var cv = A.cv, c = A.c, dpr = Math.min(devicePixelRatio || 1, 1.5), r = cv.getBoundingClientRect();
    if (Math.abs(r.width - A.w) > 1) { A.w = r.width; cv.width = r.width * dpr; cv.height = r.height * dpr; }
    var W = r.width, H = r.height, yaw = .5 + (reduce ? 0 : now * .00005 * (A.lead ? 1.4 : 1) + A.hover * .5), pitch = .15;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    var g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(' + A.col + ',' + (.55 + A.hover * .3) + ')'); g.addColorStop(1, 'rgba(1,4,25,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), S = Math.min(W, H) * (A.lead ? .5 : .56);
    var P = function (p) { var x = p.x * cy + p.z * sy, z = -p.x * sy + p.z * cy, y = p.y * cp - z * sp; z = p.y * sp + z * cp; var f = 2.4 / (2.4 + z); return [W / 2 + x * S * f, H / 2 + y * S * f, f]; };
    c.fillStyle = 'rgba(255,255,255,.25)'; A.dust.forEach(function (p) { var q = P(p); c.fillRect(q[0], q[1], 1, 1); });
    var C = P({ x: 0, y: 0, z: 0 });
    A.hubs.forEach(function (h, i) {
      var hp = P(h), lit = A.hover > .5 && i === 0;
      c.strokeStyle = lit ? 'rgba(124,242,198,.9)' : 'rgba(255,255,255,.3)'; c.lineWidth = 1; c.beginPath(); c.moveTo(C[0], C[1]); c.lineTo(hp[0], hp[1]); c.stroke();
      h.s.forEach(function (s) {
        var q = P({ x: h.x + s.x, y: h.y + s.y, z: h.z + s.z });
        c.strokeStyle = lit ? 'rgba(124,242,198,.6)' : 'rgba(150,180,255,.3)'; c.beginPath(); c.moveTo(hp[0], hp[1]); c.lineTo(q[0], q[1]); c.stroke();
        if (s.box) { c.fillStyle = '#010419'; c.fillRect(q[0] - 7, q[1] - 5, 14, 10); c.strokeStyle = 'rgba(255,255,255,.75)'; c.strokeRect(q[0] - 7, q[1] - 5, 14, 10); c.fillStyle = '#fff'; c.fillRect(q[0] - 4, q[1] - 2, 6, 5); c.fillRect(q[0] + 3, q[1] - 2, 2, 2); }
        else { c.fillStyle = 'rgba(190,210,255,.9)'; c.beginPath(); c.arc(q[0], q[1], 1.7 * q[2], 0, 6.283); c.fill(); }
      });
      var hs = 3.6 * hp[2]; c.fillStyle = lit ? '#7CF2C6' : '#6084FF'; c.fillRect(hp[0] - hs, hp[1] - hs, hs * 2, hs * 2);
    });
    c.strokeStyle = '#fff'; c.beginPath(); c.arc(C[0], C[1], 5, 0, 6.283); c.stroke(); c.fillStyle = '#7CF2C6'; c.fillRect(C[0] - 2, C[1] - 2, 4, 4);
  };
  arts.forEach(function (A) {
    A.card.addEventListener('mouseenter', function () { A.on = true; }); A.card.addEventListener('mouseleave', function () { A.on = false; });
  });
  if (arts.length) {
    if (reduce) { var still = function () { arts.forEach(function (A) { paintArt(A, 0); }); }; still(); addEventListener('resize', still); }
    else (function artLoop(now) {
      arts.forEach(function (A) { A.hover += ((A.on ? 1 : 0) - A.hover) * .08; if (visible(A.cv)) paintArt(A, now); });
      requestAnimationFrame(artLoop);
    })(performance.now());
  }

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
