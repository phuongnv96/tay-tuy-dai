// Tây Tùy Đài — playable prototype. Sprite assets come from assets.js (ASSETS).
(function () {
  'use strict';

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  var W = 960, H = 600;          // viewport
  var WORLD_W = 1920, WORLD_H = 1280;

  // ---------- sprites ----------
  var spriteNames = ['do_nhi', 'do_nhi_w1', 'do_nhi_w2', 'do_nhi_wave', 'do_nhi_laugh',
                     'do_nhi_talk', 'su_phu', 'su_phu_talk',
                     'thiet_nguu', 'linh_nhi', 'thach_dau',
                     'tile_cong_nui', 'tile_nha_tranh', 'tile_ban_da', 'tile_lu_nuoc', 'tile_hang_rao',
                     'cay_phong', 'cau_da', 'den_da', 'anh_dao'];
  var img = {}, loaded = 0;
  spriteNames.forEach(function (n) {
    var im = new Image();
    im.onload = function () { loaded++; if (loaded === spriteNames.length) start(); };
    im.src = ASSETS[n];
    img[n] = im;
  });

  // ---------- world layout (G2: multi-map) ----------
  var WORLD_W = 1920, WORLD_H = 1280; // set by loadMap
  var pond = null, stream = null, dais = null, bridgeX0 = 0, bridgeX1 = 0;
  var master = null;
  var trees = [], lanterns = [], tiles = [], blockers = [];
  var player = { x: 960, y: 1080, speed: 265, face: 1, moving: false };
  var curMap = 'taytuydai';

  var MAPS = {
    taytuydai: {
      label: 'Tây Tùy Đài', W: 1920, H: 1280, ground: '#69b34c',
      pond: { x: 960, y: 800, rx: 230, ry: 135 },
      stream: { x0: 1170, y0: 772, x1: 1920, y1: 828 },
      bridgeX0: 1200, bridgeX1: 1700,
      dais: { x0: 830, y0: 280, x1: 1090, y1: 440 },
      master: { x: 960, y: 360 },
      trees: [
        { x: 420, y: 520, s: 'cay_phong' },
        { x: 1500, y: 540, s: 'cay_phong' },
        { x: 620, y: 940, s: 'anh_dao' },
        { x: 1320, y: 1000, s: 'anh_dao' },
        { x: 1620, y: 300, s: 'anh_dao' }
      ],
      lanterns: [
        { x: 872, y: 640 }, { x: 1048, y: 640 },
        { x: 872, y: 940 }, { x: 1048, y: 940 }
      ],
      tiles: [
        { s: 'tile_cong_nui', x: 960, y: 1200, w: 280,
          blocks: [{ dx: -92, r: 26 }, { dx: 92, r: 26 }] },
        { s: 'tile_nha_tranh', x: 660, y: 1160, w: 300,
          blocks: [{ dx: 0, r: 82 }] },
        { s: 'tile_ban_da', x: 1260, y: 950, w: 170,
          blocks: [{ dx: 0, r: 46 }] },
        { s: 'tile_lu_nuoc', x: 800, y: 1170, w: 95,
          blocks: [{ dx: 0, r: 22 }] },
        { s: 'tile_hang_rao', x: 350, y: 1160, w: 520,
          blocks: [{ dx: -170, r: 30 }, { dx: 0, r: 30 }, { dx: 170, r: 30 }] },
        { s: 'tile_hang_rao', x: 1570, y: 1160, w: 520,
          blocks: [{ dx: -170, r: 30 }, { dx: 0, r: 30 }, { dx: 170, r: 30 }] }
      ],
      npcs: ['thiet_nguu', 'linh_nhi', 'thach_dau'],
      items: [['khoai', 5, 1500, 700, 260], ['cui', 8, 480, 720, 280]],
      portals: [{ x: 1870, y: 800, r: 70, to: 'rungphong', sx: 110, sy: 640, label: 'Rừng Phong Đỏ' }],
      spawn: { x: 960, y: 1080 }
    },
    rungphong: {
      label: 'Rừng Phong Đỏ', W: 1920, H: 1280, ground: '#5da24a',
      pond: null, stream: null, dais: null, bridgeX0: 0, bridgeX1: 0, master: null,
      trees: [
        { x: 180, y: 260, s: 'cay_phong' }, { x: 420, y: 180, s: 'cay_phong' },
        { x: 680, y: 220, s: 'cay_phong' }, { x: 940, y: 160, s: 'cay_phong' },
        { x: 1200, y: 200, s: 'cay_phong' }, { x: 1460, y: 180, s: 'cay_phong' },
        { x: 1700, y: 280, s: 'cay_phong' }, { x: 1780, y: 560, s: 'cay_phong' },
        { x: 1700, y: 860, s: 'cay_phong' }, { x: 1450, y: 1080, s: 'cay_phong' },
        { x: 1150, y: 1120, s: 'cay_phong' }, { x: 850, y: 1060, s: 'cay_phong' },
        { x: 600, y: 1150, s: 'cay_phong' }, { x: 300, y: 1050, s: 'cay_phong' },
        { x: 160, y: 800, s: 'cay_phong' }
      ],
      lanterns: [
        { x: 860, y: 560 }, { x: 1060, y: 560 },
        { x: 860, y: 720 }, { x: 1060, y: 720 }
      ],
      tiles: [
        { s: 'tile_ban_da', x: 960, y: 640, w: 170,
          blocks: [{ dx: 0, r: 46 }] },
        { s: 'tile_hang_rao', x: 960, y: 300, w: 520,
          blocks: [{ dx: -170, r: 30 }, { dx: 0, r: 30 }, { dx: 170, r: 30 }] }
      ],
      npcs: ['thach_dau'],
      items: [['khoai', 4, 960, 640, 420], ['cui', 4, 960, 640, 420]],
      portals: [{ x: 50, y: 640, r: 70, to: 'taytuydai', sx: 1800, sy: 800, label: 'Tây Tùy Đài' }],
      spawn: { x: 140, y: 640 }
    }
  };

  // ---------- NPC definitions (G2: data-driven) ----------
  var NPC_DEFS = {
    thiet_nguu: { id: 'thiet_nguu', name: 'Thiết Ngưu', spr: 'thiet_nguu', color: '#b45309',
      home: { x: 760, y: 1000 }, range: 130, questId: 'khoai',
      dlg: 'thiet_nguu_idle', thanks: 'thiet_nguu_thanks', idleDone: 'thiet_nguu_done' },
    linh_nhi: { id: 'linh_nhi', name: 'Linh Nhi', spr: 'linh_nhi', color: '#d63384',
      home: { x: 1330, y: 600 }, range: 110,
      dlg: 'linh_nhi_idle', thanks: null, idleDone: null },
    thach_dau: { id: 'thach_dau', name: 'Thạch Đầu', spr: 'thach_dau', color: '#6b7280',
      home: { x: 480, y: 720 }, range: 120, questId: 'cui',
      dlg: 'thach_dau_idle', thanks: 'thach_dau_thanks', idleDone: 'thach_dau_done' }
  };
  var NPCS = [];

  // ---------- quests & items (G2: from DATA) ----------
  var QUESTS = DATA.quests.map(function (q) {
    return { id: q.id, name: q.name, desc: q.desc, need: q.need, have: 0, state: 'active', thanked: false };
  });
  function questById(id) {
    for (var i = 0; i < QUESTS.length; i++) if (QUESTS[i].id === id) return QUESTS[i];
    return null;
  }
  var ITEMS = [];
  function scatterItems(kind, n, cx, cy, r) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, rr = 40 + Math.random() * r;
      var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.7;
      if (!collides(x, y, null)) ITEMS.push({ kind: kind, x: x, y: y, taken: false, ph: Math.random() * 6.28 });
    }
  }

  function npcLines(n) {
    if (n.questId) {
      var q = questById(n.questId);
      if (q.state === 'done' && !q.thanked) { q.thanked = true; return DATA.dialogues[n.thanks]; }
      if (q.state === 'done') return DATA.dialogues[n.idleDone];
    }
    return DATA.dialogues[n.dlg];
  }

  function loadMap(name, sx, sy, quiet) {
    var M = MAPS[name];
    curMap = name;
    WORLD_W = M.W; WORLD_H = M.H;
    pond = M.pond; stream = M.stream; dais = M.dais;
    bridgeX0 = M.bridgeX0 || 0; bridgeX1 = M.bridgeX1 || 0;
    master = M.master ? { x: M.master.x, y: M.master.y } : null;
    trees = M.trees; lanterns = M.lanterns; tiles = M.tiles;
    blockers = [];
    trees.forEach(function (t) { blockers.push({ x: t.x, y: t.y, r: 48 }); });
    lanterns.forEach(function (l) { blockers.push({ x: l.x, y: l.y, r: 18 }); });
    if (master) blockers.push({ x: master.x, y: master.y, r: 36 });
    tiles.forEach(function (tl) {
      (tl.blocks || []).forEach(function (b) { blockers.push({ x: tl.x + b.dx, y: tl.y, r: b.r }); });
    });
    NPCS = M.npcs.map(function (id) {
      var d = NPC_DEFS[id];
      return { id: d.id, name: d.name, spr: d.spr, color: d.color,
               x: d.home.x, y: d.home.y, home: { x: d.home.x, y: d.home.y },
               range: d.range, wt: Math.random() * 2, tx: undefined, ty: undefined,
               moving: false, questId: d.questId, dlg: d.dlg, thanks: d.thanks, idleDone: d.idleDone };
    });
    ITEMS = [];
    M.items.forEach(function (sp) { scatterItems(sp[0], sp[1], sp[2], sp[3], sp[4]); });
    buildPads();
    player.x = sx; player.y = sy;
    if (typeof cam !== 'undefined') {
      cam.x = Math.max(0, Math.min(WORLD_W - W, player.x - W / 2));
      cam.y = Math.max(0, Math.min(WORLD_H - H, player.y - H / 2));
    }
    if (!quiet) toast('— ' + M.label + ' —', 1800);
  }

  // (NPC runtime instances are built by loadMap from NPC_DEFS)

  // (quests/items built from DATA + MAPS by loadMap)

  function inPond(x, y) {
    if (!pond) return false;
    var dx = (x - pond.x) / pond.rx, dy = (y - pond.y) / pond.ry;
    return dx * dx + dy * dy < 1;
  }
  function inStream(x, y) {
    if (!stream) return false;
    if (y < stream.y0 || y > stream.y1 || x < stream.x0 || x > stream.x1) return false;
    return x < bridgeX0 || x > bridgeX1; // bridge span is walkable
  }
  function inDais(x, y) {
    if (!dais) return false;
    return x > dais.x0 && x < dais.x1 && y > dais.y0 && y < dais.y1;
  }
  function npcBlocked(x, y, self) {
    if (master && self !== master) {
      var dx = x - master.x, dy = y - master.y;
      if (dx * dx + dy * dy < 38 * 38) return true;
    }
    for (var i = 0; i < NPCS.length; i++) {
      var n = NPCS[i];
      if (n === self) continue;
      var ddx = x - n.x, ddy = y - n.y;
      if (ddx * ddx + ddy * ddy < 38 * 38) return true;
    }
    if (self !== player) {
      var pdx = x - player.x, pdy = y - player.y;
      if (pdx * pdx + pdy * pdy < 36 * 36) return true;
    }
    return false;
  }
  function collides(x, y, self) {
    if (x < 30 || x > WORLD_W - 30 || y < 30 || y > WORLD_H - 30) return true;
    if (inPond(x, y) || inStream(x, y) || inDais(x, y)) return true;
    for (var i = 0; i < blockers.length; i++) {
      var b = blockers[i], dx = x - b.x, dy = y - b.y;
      if (dx * dx + dy * dy < b.r * b.r) return true;
    }
    return npcBlocked(x, y, self);
  }

  // ---------- input ----------
  var keys = {};
  var emote = null; // {spr, until}
  window.addEventListener('keydown', function (e) {
    keys[e.key.toLowerCase()] = true;
    ac();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(e.key.toLowerCase()) >= 0) e.preventDefault();
    if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && !dialogueOpen) {
      var tgt = nearestTarget();
      if (tgt) openDialogueFor(tgt);
    }
    if ((e.key === 'j' || e.key === 'J') && !dialogueOpen) toggleQuestLog();
    if (!dialogueOpen && !emote) {
      if (e.key === 'q' || e.key === 'Q') emote = { spr: 'do_nhi_wave', until: t + 1.0 };
      if (e.key === 'f' || e.key === 'F') emote = { spr: 'do_nhi_laugh', until: t + 1.4 };
    }
  });
  window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

  function nearestTarget() {
    var best = null, bestD = 130 * 130;
    var cands = NPCS.slice();
    if (master) cands.unshift({ id: 'master', name: 'Sư Phụ Yixuan', color: '#2f9e44', x: master.x, y: master.y, isMaster: true });
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i], dx = player.x - c.x, dy = player.y - c.y, d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  // ---------- dialogue (G1: per-target + choices) ----------
  var dialogueOpen = false, lineIdx = 0, dlgLines = [];
  var dlg = document.getElementById('dialogue');
  var dlgName = document.getElementById('dlg-name');
  var dlgText = document.getElementById('dlg-text');
  var btnNext = document.getElementById('btn-next');
  var btnClose = document.getElementById('btn-close');
  var dlgChoices = document.getElementById('dlg-choices');
  var hint = document.getElementById('hint');
  var talkTarget = null;

  function showLine() {
    var L = dlgLines[lineIdx];
    dlgName.textContent = L.name;
    dlgName.style.background = L.name === 'Nguyên' ? '#2b6cb0'
      : (talkTarget && talkTarget.color) || '#2f9e44';
    dlgText.textContent = L.text;
    dlgChoices.innerHTML = '';
    if (L.choices) {
      btnNext.style.display = 'none';
      dlgChoices.style.display = '';
      L.choices.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'dlg-choice';
        b.textContent = c.label;
        b.addEventListener('click', function () {
          sfxBlip();
          if (c.goto < 0) { closeDialogue(); return; }
          lineIdx = c.goto;
          showLine();
        });
        dlgChoices.appendChild(b);
      });
    } else {
      btnNext.style.display = '';
      dlgChoices.style.display = 'none';
      if (lineIdx === dlgLines.length - 1) btnNext.style.display = 'none';
    }
  }
  function openDialogueFor(tgt) {
    talkTarget = tgt;
    dlgLines = tgt.isMaster ? DATA.dialogues.master : npcLines(tgt);
    openDialogue();
  }
  function openDialogue() {
    dialogueOpen = true; lineIdx = 0;
    showLine();
    dlg.classList.add('show');
    sfxBlip();
    emote = { spr: 'do_nhi_wave', until: t + 1.0 }; // greet
  }
  function closeDialogue() {
    dialogueOpen = false;
    dlg.classList.remove('show');
    talkTarget = null;
  }
  btnNext.addEventListener('click', function () {
    sfxBlip();
    lineIdx++;
    if (lineIdx >= dlgLines.length) { closeDialogue(); return; }
    showLine();
  });
  btnClose.addEventListener('click', closeDialogue);

  // ---------- audio (G1: WebAudio, no files) ----------
  var AC = null;
  function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (AC && AC.state === 'suspended') AC.resume();
    return AC;
  }
  function tone(f, d, type, v, delay) {
    var a = ac(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    var t1 = a.currentTime + (delay || 0);
    g.gain.setValueAtTime(0.0001, t1);
    g.gain.exponentialRampToValueAtTime(v || 0.06, t1 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t1 + d);
    o.connect(g); g.connect(a.destination);
    o.start(t1); o.stop(t1 + d + 0.05);
  }
  function sfxBlip() { tone(660, 0.07, 'square', 0.025); }
  function sfxPickup() { tone(880, 0.09, 'sine', 0.05); tone(1320, 0.12, 'sine', 0.04, 0.07); }
  function sfxQuest() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.16, 'triangle', 0.06, i * 0.1); }); }
  var stepT = 0;
  function sfxStep(dt) {
    stepT -= dt;
    if (stepT <= 0) { stepT = 0.3; tone(170 + Math.random() * 50, 0.05, 'sine', 0.02); }
  }

  // ---------- toast + quest log (G1) ----------
  var toastEl = document.getElementById('toast'), toastTO = null;
  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTO);
    toastTO = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2200);
  }
  var qlEl = document.getElementById('questlog'), qlList = document.getElementById('ql-list'), qlOpen = false;
  // ---------- save/load + day-night (G2) ----------
  var SAVE_KEY = 'taytuydai_save_v1';
  function saveGame() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        map: curMap, x: Math.round(player.x), y: Math.round(player.y), dayT: dayT,
        quests: QUESTS.map(function (q) { return { id: q.id, have: q.have, state: q.state, thanked: q.thanked }; })
      }));
    } catch (e) {}
  }
  function loadSave() {
    try {
      var s = JSON.parse(localStorage.getItem(SAVE_KEY));
      return (s && s.map && MAPS[s.map]) ? s : null;
    } catch (e) { return null; }
  }
  var dayT = 0.3, DAY_LEN = 300, saveT = 0;
  function daylight() {
    var s = Math.sin(dayT * 6.283);
    return Math.max(0, Math.min(1, (s + 0.3) / 1.3));
  }
  function isNight() { return daylight() < 0.22; }
  function renderQuestLog() {
    qlList.innerHTML = '';
    QUESTS.forEach(function (q) {
      var d = document.createElement('div');
      d.className = 'ql-item' + (q.state === 'done' ? ' done' : '');
      var st = q.state === 'done' ? '✓ Xong' : (q.have + '/' + q.need);
      d.innerHTML = '<b>' + q.name + '</b><span>' + st + '</span><p>' + q.desc + '</p>';
      qlList.appendChild(d);
    });
  }
  function toggleQuestLog() {
    qlOpen = !qlOpen;
    if (qlOpen) renderQuestLog();
    qlEl.classList.toggle('show', qlOpen);
  }
  function questProgress(id) {
    var q = questById(id);
    if (!q || q.state !== 'active') return;
    q.have++;
    sfxPickup();
    if (q.have >= q.need) {
      q.state = 'done';
      sfxQuest();
      saveGame();
      toast('★ Hoàn thành: ' + q.name, 3000);
    } else {
      toast('+1 ' + (id === 'khoai' ? 'củ khoai' : 'khúc củi') + ' (' + q.have + '/' + q.need + ')');
    }
    if (qlOpen) renderQuestLog();
  }

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
  function buildPads() {
    pads = [];
    if (!pond) return;
    for (var p = 0; p < 14; p++) {
      var a = rnd() * Math.PI * 2, rr = 0.25 + rnd() * 0.65;
      pads.push({
        x: pond.x + Math.cos(a) * pond.rx * rr,
        y: pond.y + Math.sin(a) * pond.ry * rr,
        r: 10 + rnd() * 14, lotus: rnd() > 0.72, ph: rnd() * 6.28
      });
    }
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

  function drawItem(it) {
    var bob = Math.sin(t * 3 + it.ph) * 3;
    ctx.save();
    ctx.translate(it.x, it.y + bob);
    ctx.fillStyle = 'rgba(251,191,36,0.25)';
    ctx.beginPath(); ctx.arc(0, -8, 16, 0, 6.29); ctx.fill();
    if (it.kind === 'khoai') {
      ctx.fillStyle = '#a16207';
      ctx.beginPath(); ctx.ellipse(0, -8, 11, 8, 0.3, 0, 6.29); ctx.fill();
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(-2, -20, 4, 8);
    } else {
      ctx.strokeStyle = '#92400e'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-9, -2); ctx.lineTo(9, -14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -14); ctx.lineTo(9, -2); ctx.stroke();
    }
    ctx.restore();
  }

  var fadeA = 0, fadeDir = 0, pendingPortal = null;
  function drawPortal(p) {
    var pulse = 1 + Math.sin(t * 3) * 0.1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.strokeStyle = 'rgba(196,181,253,0.95)'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, -46, 36 * pulse, 0, 6.29); ctx.stroke();
    ctx.fillStyle = 'rgba(139,92,246,0.16)';
    ctx.beginPath(); ctx.arc(0, -46, 36 * pulse, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#ddd6fe'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('→ ' + p.label, 0, 26);
    ctx.restore();
  }

  var cam = { x: 0, y: 0 };
  var last = 0, t = 0;

  // boot (G2): restore save or start fresh
  (function boot() {
    var s = loadSave();
    if (s) {
      dayT = (typeof s.dayT === 'number') ? s.dayT : 0.3;
      loadMap(s.map, s.x, s.y, true);
      (s.quests || []).forEach(function (sq) {
        var q = questById(sq.id);
        if (q) { q.have = sq.have; q.state = sq.state; q.thanked = sq.thanked; }
      });
      toast('Đã tải tiến trình đã lưu — ' + MAPS[curMap].label, 2600);
    } else {
      loadMap('taytuydai', MAPS.taytuydai.spawn.x, MAPS.taytuydai.spawn.y, true);
    }
  })();

  function start() {
    requestAnimationFrame(frame);
  }

  function frame(ts) {
    var dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
    last = ts; t += dt;

    // ----- update -----
    if (emote && t > emote.until) emote = null;
    if (!dialogueOpen && !emote) {
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
        if (!collides(nx, player.y, player)) player.x = nx;
        var ny = player.y + my * player.speed * dt;
        if (!collides(player.x, ny, player)) player.y = ny;
        if (player.moving) sfxStep(dt);
      }
    }
    // NPC wander (G1); sleep at night (G2)
    NPCS.forEach(function (n) {
      if (isNight()) { n.moving = false; return; }
      n.wt -= dt;
      var dx = (n.tx === undefined ? n.x : n.tx) - n.x,
          dy = (n.ty === undefined ? n.y : n.ty) - n.y,
          d = Math.hypot(dx, dy);
      if (d < 8 || n.wt <= 0) {
        n.moving = false;
        if (n.wt <= 0) {
          if (Math.random() < 0.65) {
            var a = Math.random() * 6.283, r = 30 + Math.random() * n.range;
            n.tx = n.home.x + Math.cos(a) * r;
            n.ty = n.home.y + Math.sin(a) * r * 0.7;
          }
          n.wt = 1.6 + Math.random() * 2.6;
        }
      } else {
        var sp = 55 * dt;
        n.moving = true;
        if (!collides(n.x + dx / d * sp, n.y, n)) n.x += dx / d * sp;
        if (!collides(n.x, n.y + dy / d * sp, n)) n.y += dy / d * sp;
      }
    });
    // item pickup (G1)
    ITEMS.forEach(function (it) {
      if (it.taken) return;
      var pdx = player.x - it.x, pdy = player.y - it.y;
      if (pdx * pdx + pdy * pdy < 46 * 46) { it.taken = true; questProgress(it.kind); }
    });
    petals.forEach(function (pt) {
      pt.y += pt.v * dt; pt.x -= pt.v * 0.35 * dt + Math.sin(t * 2 + pt.ph) * 12 * dt;
      if (pt.y > WORLD_H) { pt.y = -10; pt.x = Math.random() * WORLD_W; }
      if (pt.x < -10) pt.x = WORLD_W + 10;
    });

    // day/night + autosave (G2)
    dayT = (dayT + dt / DAY_LEN) % 1;
    saveT += dt;
    if (saveT > 20) { saveT = 0; saveGame(); }

    // portal transition (G2)
    if (fadeDir === 1) {
      fadeA += dt * 2.4;
      if (fadeA >= 1) {
        fadeA = 1;
        var pp = pendingPortal;
        loadMap(pp.to, pp.sx, pp.sy);
        saveGame();
        fadeDir = -1;
      }
    } else if (fadeDir === -1) {
      fadeA -= dt * 2.4;
      if (fadeA <= 0) { fadeA = 0; fadeDir = 0; pendingPortal = null; }
    } else if (!dialogueOpen) {
      var portals = MAPS[curMap].portals;
      for (var pi = 0; pi < portals.length; pi++) {
        var p = portals[pi], pdx = player.x - p.x, pdy = player.y - p.y;
        if (pdx * pdx + pdy * pdy < p.r * p.r) { pendingPortal = p; fadeDir = 1; break; }
      }
    }

    cam.x = Math.max(0, Math.min(WORLD_W - W, player.x - W / 2));
    cam.y = Math.max(0, Math.min(WORLD_H - H, player.y - H / 2));

    // ----- draw -----
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

    // ground
    ctx.fillStyle = MAPS[curMap].ground || '#69b34c';
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
    if (stream) {
    ctx.fillStyle = '#3d9bd6';
    ctx.fillRect(stream.x0, stream.y0, stream.x1 - stream.x0, stream.y1 - stream.y0);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (var wx = stream.x0; wx < stream.x1; wx += 90) {
      var off = Math.sin(t * 2 + wx * 0.02) * 6;
      ctx.fillRect(wx + off, stream.y0 + 12, 46, 3);
      ctx.fillRect(wx - off + 30, stream.y0 + 36, 40, 3);
    }
    }

    // pond
    if (pond) {
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
    }

    // bridge (drawn flat over stream)
    if (stream) {
    (function () {
      var im = img['cau_da'], bw = 560, bh = im.height * (560 / im.width);
      ctx.drawImage(im, 1450 - bw / 2, 800 - bh / 2, bw, bh);
    })();
    }

    // stone dais (platform + steps)
    if (dais) {
    ctx.fillStyle = '#9aa0a8';
    ctx.fillRect(dais.x0, dais.y0, dais.x1 - dais.x0, dais.y1 - dais.y0);
    ctx.fillStyle = '#b9bec6';
    ctx.fillRect(dais.x0 + 10, dais.y0 + 10, dais.x1 - dais.x0 - 20, dais.y1 - dais.y0 - 20);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (var st = 0; st < 3; st++) {
      ctx.fillRect(dais.x0 + 60 + st * 46, dais.y1, 40, 14);
    }
    }

    // entities sorted by y
    var ents = [];
    tiles.forEach(function (tl) {
      ents.push({ y: tl.y, f: function () {
        var im = img[tl.s], h = im.height * (tl.w / im.width);
        ctx.drawImage(im, tl.x - tl.w / 2, tl.y - h + 14, tl.w, h);
      } });
    });
    trees.forEach(function (tr) { ents.push({ y: tr.y, f: function () { drawSprite(tr.s, tr.x, tr.y, false); } }); });
    lanterns.forEach(function (l) {
      ents.push({ y: l.y, f: function () {
        drawSprite('den_da', l.x, l.y, false);
        var la = 0.3 + (1 - daylight()) * 0.45; // brighter at night
        var gl = ctx.createRadialGradient(l.x, l.y - 105, 4, l.x, l.y - 105, 46);
        gl.addColorStop(0, 'rgba(255,200,90,' + la.toFixed(2) + ')');
        gl.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(l.x, l.y - 105, 46, 0, 6.29); ctx.fill();
      } });
    });
    MAPS[curMap].portals.forEach(function (p) {
      ents.push({ y: p.y, f: function () { drawPortal(p); } });
    });
    if (master) {
    ents.push({ y: master.y, f: function () {
      var bob = Math.sin(t * 1.4) * 3;
      var mspr = 'su_phu';
      if (dialogueOpen && talkTarget && talkTarget.isMaster && dlgLines[lineIdx].who === 'master') {
        mspr = (Math.floor(t * 3.5) % 2) ? 'su_phu_talk' : 'su_phu'; // talking
      }
      drawSprite(mspr, master.x, master.y + bob, false);
      ctx.fillStyle = '#2f9e44'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sư Phụ Yixuan', master.x, master.y - 228 + bob);
    } });
    }
    ents.push({ y: player.y, f: function () {
      var bob = player.moving ? Math.abs(Math.sin(t * 10)) * 4 : Math.sin(t * 2) * 2;
      var spr = 'do_nhi';
      if (emote) spr = emote.spr;
      else if (dialogueOpen && dlgLines[lineIdx].who === 'player') spr = 'do_nhi_talk';
      else if (player.moving) {
        var frames = ['do_nhi_w1', 'do_nhi', 'do_nhi_w2', 'do_nhi'];
        spr = frames[Math.floor(t * 8) % 4];
      }
      drawSprite(spr, player.x, player.y - bob, player.face < 0);
      ctx.fillStyle = '#e8f4ff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Nguyên', player.x, player.y - 228 - bob);
    } });
    ITEMS.forEach(function (it) {
      if (it.taken) return;
      ents.push({ y: it.y, f: function () { drawItem(it); } });
    });
    NPCS.forEach(function (n) {
      ents.push({ y: n.y, f: function () {
        var bob = n.moving ? Math.abs(Math.sin(t * 8)) * 3 : Math.sin(t * 1.8 + n.x) * 2;
        drawSprite(n.spr, n.x, n.y - bob, false);
        ctx.fillStyle = n.color; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y - 218 - bob);
        if (isNight()) {
          ctx.fillStyle = '#a5b4fc'; ctx.font = 'bold 16px sans-serif';
          ctx.fillText('z z', n.x + 30, n.y - 230 - bob + Math.sin(t * 2) * 3);
        } else if (n.questId && questById(n.questId).state === 'active') {
          var qb = Math.sin(t * 4) * 4;
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 20px sans-serif';
          ctx.fillText('!', n.x + 46, n.y - 206 + qb - bob);
        }
      } });
    });
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

    // night overlay + clock (G2)
    var dl = daylight();
    if (dl < 1) {
      ctx.fillStyle = 'rgba(10,16,48,' + ((1 - dl) * 0.42).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }
    ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'left';
    var hh = Math.floor(dayT * 24), mm = Math.floor((dayT * 24 % 1) * 60);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    var clockTxt = (isNight() ? '🌙 ' : '☀️ ') + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + '  ' + MAPS[curMap].label;
    ctx.fillText(clockTxt, 12, 26);

    // fade transition (G2)
    if (fadeA > 0) {
      ctx.fillStyle = 'rgba(8,8,18,' + fadeA.toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }

    // hint
    var htgt = !dialogueOpen && nearestTarget();
    if (htgt) {
      hint.innerHTML = 'Nhấn <b>E</b> để nói chuyện với <b>' + htgt.name + '</b>';
      hint.classList.add('show');
    } else hint.classList.remove('show');

    requestAnimationFrame(frame);
  }
})();
