// Tây Tùy Đài — playable prototype. Sprite assets come from assets.js (ASSETS).
(function () {
  'use strict';

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  var W = 960, H = 600;          // viewport
  var WORLD_W = 1920, WORLD_H = 1280;

  // ---------- sprites ----------
  var spriteNames = ['do_nhi', 'do_nhi_w1', 'do_nhi_w2', 'su_phu', 'cay_phong', 'cau_da', 'den_da', 'anh_dao'];
  var img = {}, loaded = 0;
  spriteNames.forEach(function (n) {
    var im = new Image();
    im.onload = function () { loaded++; if (loaded === spriteNames.length) start(); };
    im.src = ASSETS[n];
    img[n] = im;
  });

  // ---------- world layout ----------
  var pond = { x: 960, y: 800, rx: 230, ry: 135 };
  var stream = { x0: 1170, y0: 772, x1: 1920, y1: 828 };   // from pond to east edge
  var bridgeX0 = 1200, bridgeX1 = 1700;                    // walkable span on bridge
  var dais = { x0: 830, y0: 280, x1: 1090, y1: 440 };      // stone platform
  var master = { x: 960, y: 360 };
  var player = { x: 960, y: 1080, speed: 265, face: 1, moving: false };

  var trees = [
    { x: 420, y: 520, s: 'cay_phong' },
    { x: 1500, y: 540, s: 'cay_phong' },
    { x: 620, y: 940, s: 'anh_dao' },
    { x: 1320, y: 1000, s: 'anh_dao' },
    { x: 1620, y: 300, s: 'anh_dao' }
  ];
  var lanterns = [
    { x: 872, y: 640 }, { x: 1048, y: 640 },
    { x: 872, y: 940 }, { x: 1048, y: 940 }
  ];

  var blockers = [];
  trees.forEach(function (t) { blockers.push({ x: t.x, y: t.y, r: 48 }); });
  lanterns.forEach(function (l) { blockers.push({ x: l.x, y: l.y, r: 18 }); });
  blockers.push({ x: master.x, y: master.y, r: 36 });

  function inPond(x, y) {
    var dx = (x - pond.x) / pond.rx, dy = (y - pond.y) / pond.ry;
    return dx * dx + dy * dy < 1;
  }
  function inStream(x, y) {
    if (y < stream.y0 || y > stream.y1 || x < stream.x0 || x > stream.x1) return false;
    return x < bridgeX0 || x > bridgeX1; // bridge span is walkable
  }
  function inDais(x, y) {
    return x > dais.x0 && x < dais.x1 && y > dais.y0 && y < dais.y1;
  }
  function collides(x, y) {
    if (x < 30 || x > WORLD_W - 30 || y < 30 || y > WORLD_H - 30) return true;
    if (inPond(x, y) || inStream(x, y) || inDais(x, y)) return true;
    for (var i = 0; i < blockers.length; i++) {
      var b = blockers[i], dx = x - b.x, dy = y - b.y;
      if (dx * dx + dy * dy < b.r * b.r) return true;
    }
    return false;
  }

  // ---------- input ----------
  var keys = {};
  window.addEventListener('keydown', function (e) {
    keys[e.key.toLowerCase()] = true;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(e.key.toLowerCase()) >= 0) e.preventDefault();
    if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearMaster() && !dialogueOpen) openDialogue();
  });
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

  function nearMaster() {
    var dx = player.x - master.x, dy = player.y - master.y;
    return dx * dx + dy * dy < 120 * 120;
  }

  // ---------- dialogue ----------
  var dialogueOpen = false, lineIdx = 0;
  var lines = [
    'Ừm, ta nghe đây, đồ nhi.',
    'Ngươi đã vượt rừng phong đỏ, qua cầu đá bắc ngang suối, đến được Tây Tùy Đài… quả là có duyên.',
    'Từ hôm nay, ngươi chính thức là đệ tử của ta. Cứ đi dạo quanh đây cho quen đường, rồi quay lại gặp ta.'
  ];
  var dlg = document.getElementById('dialogue');
  var dlgText = document.getElementById('dlg-text');
  var btnNext = document.getElementById('btn-next');
  var btnClose = document.getElementById('btn-close');
  var hint = document.getElementById('hint');

  function openDialogue() {
    dialogueOpen = true; lineIdx = 0;
    dlgText.textContent = lines[0];
    btnNext.style.display = '';
    dlg.classList.add('show');
  }
  function closeDialogue() {
    dialogueOpen = false;
    dlg.classList.remove('show');
  }
  btnNext.addEventListener('click', function () {
    lineIdx++;
    if (lineIdx >= lines.length) { closeDialogue(); return; }
    dlgText.textContent = lines[lineIdx];
    if (lineIdx === lines.length - 1) btnNext.style.display = 'none';
  });
  btnClose.addEventListener('click', closeDialogue);

  // ---------- scenery helpers ----------
  function seededRandom(seed) {
    var s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  var rnd = seededRandom(20261005);
  var grassPatches = [];
  for (var i = 0; i < 260; i++) {
    grassPatches.push({
      x: rnd() * WORLD_W, y: rnd() * WORLD_H,
      r: 14 + rnd() * 42, c: rnd() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,60,0,0.07)'
    });
  }
  var pads = [];
  for (var p = 0; p < 14; p++) {
    var a = rnd() * Math.PI * 2, rr = 0.25 + rnd() * 0.65;
    pads.push({
      x: pond.x + Math.cos(a) * pond.rx * rr,
      y: pond.y + Math.sin(a) * pond.ry * rr,
      r: 10 + rnd() * 14, lotus: rnd() > 0.72, ph: rnd() * 6.28
    });
  }
  var petals = [];
  for (var k = 0; k < 46; k++) {
    petals.push({ x: rnd() * WORLD_W, y: rnd() * WORLD_H, s: 2 + rnd() * 3, v: 18 + rnd() * 30, ph: rnd() * 6.28 });
  }
  var pathStones = [];
  for (var sy = 470; sy <= 1260; sy += 46) {
    pathStones.push({ x: 960 + Math.sin(sy * 0.01) * 26 + (rnd() - 0.5) * 14, y: sy, r: 30 + rnd() * 10 });
  }

  function drawSprite(name, x, y, flip) {
    var im = img[name], w = im.width, h = im.height;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(im, -w / 2, -h + 14, w, h);
    ctx.restore();
  }

  var cam = { x: 0, y: 0 };
  var last = 0, t = 0;

  function start() {
    requestAnimationFrame(frame);
  }

  function frame(ts) {
    var dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
    last = ts; t += dt;

    // ----- update -----
    if (!dialogueOpen) {
      var mx = 0, my = 0;
      if (keys['a'] || keys['arrowleft']) mx -= 1;
      if (keys['d'] || keys['arrowright']) mx += 1;
      if (keys['w'] || keys['arrowup']) my -= 1;
      if (keys['s'] || keys['arrowdown']) my += 1;
      player.moving = (mx !== 0 || my !== 0);
      if (player.moving) {
        var len = Math.hypot(mx, my); mx /= len; my /= len;
        if (mx < 0) player.face = -1; else if (mx > 0) player.face = 1;
        var nx = player.x + mx * player.speed * dt;
        if (!collides(nx, player.y)) player.x = nx;
        var ny = player.y + my * player.speed * dt;
        if (!collides(player.x, ny)) player.y = ny;
      }
    }
    petals.forEach(function (pt) {
      pt.y += pt.v * dt; pt.x -= pt.v * 0.35 * dt + Math.sin(t * 2 + pt.ph) * 12 * dt;
      if (pt.y > WORLD_H) { pt.y = -10; pt.x = Math.random() * WORLD_W; }
      if (pt.x < -10) pt.x = WORLD_W + 10;
    });

    cam.x = Math.max(0, Math.min(WORLD_W - W, player.x - W / 2));
    cam.y = Math.max(0, Math.min(WORLD_H - H, player.y - H / 2));

    // ----- draw -----
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

    // ground
    ctx.fillStyle = '#69b34c';
    ctx.fillRect(cam.x, cam.y, W, H);
    grassPatches.forEach(function (g) {
      if (g.x < cam.x - 60 || g.x > cam.x + W + 60 || g.y < cam.y - 60 || g.y > cam.y + H + 60) return;
      ctx.fillStyle = g.c;
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 6.29); ctx.fill();
    });

    // stone path
    pathStones.forEach(function (s) {
      ctx.fillStyle = '#b8b2a4';
      ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r, s.r * 0.62, 0, 0, 6.29); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.ellipse(s.x, s.y + 4, s.r * 0.9, s.r * 0.5, 0, 0, 6.29); ctx.fill();
    });

    // stream
    ctx.fillStyle = '#3d9bd6';
    ctx.fillRect(stream.x0, stream.y0, stream.x1 - stream.x0, stream.y1 - stream.y0);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (var wx = stream.x0; wx < stream.x1; wx += 90) {
      var off = Math.sin(t * 2 + wx * 0.02) * 6;
      ctx.fillRect(wx + off, stream.y0 + 12, 46, 3);
      ctx.fillRect(wx - off + 30, stream.y0 + 36, 40, 3);
    }

    // pond
    ctx.fillStyle = '#2b7a4b';
    ctx.beginPath(); ctx.ellipse(pond.x, pond.y, pond.rx + 14, pond.ry + 14, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#2f9e8f';
    ctx.beginPath(); ctx.ellipse(pond.x, pond.y, pond.rx, pond.ry, 0, 0, 6.29); ctx.fill();
    pads.forEach(function (pd) {
      var bob = Math.sin(t * 1.6 + pd.ph) * 2;
      ctx.fillStyle = '#3f9e4d';
      ctx.beginPath(); ctx.ellipse(pd.x, pd.y + bob, pd.r, pd.r * 0.55, 0, 0, 6.29); ctx.fill();
      if (pd.lotus) {
        ctx.fillStyle = '#f7a8c4';
        for (var li = 0; li < 6; li++) {
          var la = li / 6 * 6.283 + pd.ph;
          ctx.beginPath();
          ctx.ellipse(pd.x + Math.cos(la) * 9, pd.y + bob + Math.sin(la) * 5, 7, 4, la, 0, 6.29);
          ctx.fill();
        }
        ctx.fillStyle = '#fde68a';
        ctx.beginPath(); ctx.arc(pd.x, pd.y + bob, 4, 0, 6.29); ctx.fill();
      }
    });

    // bridge (drawn flat over stream)
    (function () {
      var im = img['cau_da'], bw = 560, bh = im.height * (560 / im.width);
      ctx.drawImage(im, 1450 - bw / 2, 800 - bh / 2, bw, bh);
    })();

    // stone dais (platform + steps)
    ctx.fillStyle = '#9aa0a8';
    ctx.fillRect(dais.x0, dais.y0, dais.x1 - dais.x0, dais.y1 - dais.y0);
    ctx.fillStyle = '#b9bec6';
    ctx.fillRect(dais.x0 + 10, dais.y0 + 10, dais.x1 - dais.x0 - 20, dais.y1 - dais.y0 - 20);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (var st = 0; st < 3; st++) {
      ctx.fillRect(dais.x0 + 60 + st * 46, dais.y1, 40, 14);
    }

    // entities sorted by y
    var ents = [];
    trees.forEach(function (tr) { ents.push({ y: tr.y, f: function () { drawSprite(tr.s, tr.x, tr.y, false); } }); });
    lanterns.forEach(function (l) {
      ents.push({ y: l.y, f: function () {
        drawSprite('den_da', l.x, l.y, false);
        var gl = ctx.createRadialGradient(l.x, l.y - 105, 4, l.x, l.y - 105, 46);
        gl.addColorStop(0, 'rgba(255,200,90,0.35)');
        gl.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(l.x, l.y - 105, 46, 0, 6.29); ctx.fill();
      } });
    });
    ents.push({ y: master.y, f: function () {
      var bob = Math.sin(t * 1.4) * 3;
      drawSprite('su_phu', master.x, master.y + bob, false);
      ctx.fillStyle = '#2f9e44'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sư Phụ Yixuan', master.x, master.y - 228 + bob);
    } });
    ents.push({ y: player.y, f: function () {
      var bob = player.moving ? Math.abs(Math.sin(t * 10)) * 4 : Math.sin(t * 2) * 2;
      var spr = 'do_nhi';
      if (player.moving) {
        var frames = ['do_nhi_w1', 'do_nhi', 'do_nhi_w2', 'do_nhi'];
        spr = frames[Math.floor(t * 8) % 4];
      }
      drawSprite(spr, player.x, player.y - bob, player.face < 0);
      ctx.fillStyle = '#e8f4ff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Nguyên', player.x, player.y - 228 - bob);
    } });
    ents.sort(function (a, b) { return a.y - b.y; });
    ents.forEach(function (e) { e.f(); });

    // petals
    ctx.fillStyle = 'rgba(247,168,196,0.85)';
    petals.forEach(function (pt) {
      if (pt.x < cam.x - 10 || pt.x > cam.x + W + 10 || pt.y < cam.y - 10 || pt.y > cam.y + H + 10) return;
      ctx.save();
      ctx.translate(pt.x, pt.y); ctx.rotate(pt.ph + t);
      ctx.fillRect(-pt.s / 2, -pt.s / 4, pt.s, pt.s / 2);
      ctx.restore();
    });

    ctx.restore();

    // hint
    if (nearMaster() && !dialogueOpen) hint.classList.add('show');
    else hint.classList.remove('show');

    requestAnimationFrame(frame);
  }
})();
