// Tây Tùy Đài — playable prototype. Sprite assets come from assets.js (ASSETS).
(function () {
  'use strict';

  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  var W = 1280, H = 800;         // viewport — bigger view of the world
  var WORLD_W = 1920, WORLD_H = 1280;
  var CHAR_SCALE = 0.62, TREE_SCALE = 0.75, TILE_SCALE = 0.75; // smaller sprites, bigger map feel

  // ---------- sprites ----------
  var spriteNames = ['do_nhi', 'do_nhi_w1', 'do_nhi_w2', 'do_nhi_wave', 'do_nhi_laugh',
                     'do_nhi_talk', 'su_phu', 'su_phu_talk',
                     'thiet_nguu', 'linh_nhi', 'thach_dau', 'ho_lao', 'ba_ba',
                     'thiet_nguu_w1', 'thiet_nguu_w2', 'thiet_nguu_w3',
                     'linh_nhi_w1', 'linh_nhi_w2', 'linh_nhi_w3',
                     'thach_dau_w1', 'thach_dau_w2', 'thach_dau_w3',
                     'ho_lao_w1', 'ho_lao_w2', 'ho_lao_w3',
                     'ba_ba_w1', 'ba_ba_w2', 'ba_ba_w3',
                     'do_nhi_idle', 'do_nhi_atk1', 'do_nhi_atk2', 'do_nhi_atk3',
                     'tile_cong_nui', 'tile_nha_tranh', 'tile_ban_da', 'tile_lu_nuoc', 'tile_hang_rao',
                     'tile_truc', 'tile_dun_cat', 'tile_tan_tich', 'tile_tung_tuyet',
                     'tile_am_tuyet', 'tile_tuyet_lien', 'tile_nui_lua', 'tile_dung_nham',
                     'cay_phong', 'cau_da', 'den_da', 'anh_dao',
                     't3d_cay_tron', 't3d_thong', 't3d_bach_duong', 't3d_thong_con', 't3d_la_vang', 't3d_lieu',
                     't3d_da_tang', 't3d_da_reu', 't3d_phien_da', 't3d_soi', 't3d_da_dung', 't3d_da_nut',
                     't3d_bui_tron', 't3d_bui_qua', 't3d_bui_hoa_hong', 't3d_co', 't3d_duong_xi', 't3d_bui_hoa_xanh',
                     't3d_hoa_vang', 't3d_hoa_trang', 't3d_hoa_xanh', 't3d_hoa_hong',
                     't3d_hoa_lam', 't3d_hoa_cam', 't3d_hoa_tim', 't3d_hoa_do',
                     't3d_goc_cay', 't3d_thung_rong', 't3d_dong_go', 't3d_canh_cay',
                     't3d_nam_do', 't3d_nam_tim', 't3d_thung_go', 't3d_hang_rao', 't3d_thung_phuy', 't3d_den_long'];
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
  var player = { x: 960, y: 1080, speed: 290, face: 1, moving: false };
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
        { x: 1620, y: 300, s: 'anh_dao' },
        { x: 250, y: 800, s: 't3d_lieu' },
        { x: 1700, y: 800, s: 't3d_cay_tron' },
        { x: 960, y: 180, s: 't3d_cay_tron' },
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
          blocks: [{ dx: -170, r: 30 }, { dx: 0, r: 30 }, { dx: 170, r: 30 }] },
        { s: 't3d_den_long', x: 700, y: 620, w: 90, blocks: [{ dx: 0, r: 20 }] },
        { s: 't3d_den_long', x: 1220, y: 620, w: 90, blocks: [{ dx: 0, r: 20 }] },
        { s: 't3d_hoa_vang', x: 500, y: 600, w: 60, blocks: [] },
        { s: 't3d_hoa_hong', x: 560, y: 650, w: 60, blocks: [] },
        { s: 't3d_hoa_trang', x: 1400, y: 620, w: 60, blocks: [] },
        { s: 't3d_bui_tron', x: 300, y: 1000, w: 90, blocks: [{ dx: 0, r: 25 }] },
        { s: 't3d_nam_do', x: 700, y: 1050, w: 70, blocks: [] },
        { s: 't3d_thung_go', x: 560, y: 1180, w: 90, blocks: [{ dx: 0, r: 30 }] },
        { s: 't3d_thung_phuy', x: 1360, y: 1150, w: 80, blocks: [{ dx: 0, r: 28 }] },
        { s: 't3d_hang_rao', x: 1050, y: 1180, w: 200, blocks: [{ dx: -60, r: 25 }, { dx: 60, r: 25 }] },
      ],
      npcs: ['thiet_nguu', 'thach_dau'],
      items: [['khoai', 5, 1500, 700, 260], ['cui', 8, 480, 720, 280]],
      monsters: [],
      portals: [
        { x: 1870, y: 800, r: 70, to: 'rungphong', sx: 110, sy: 640, label: 'Rừng Phong Đỏ' },
        { x: 50, y: 900, r: 70, to: 'rungtruc', sx: 140, sy: 640, label: 'Rừng Trúc' },
        { x: 1400, y: 1230, r: 70, to: 'samac', sx: 960, sy: 140, label: 'Sa Mạc Vàng' },
        { x: 960, y: 60, r: 70, to: 'nuttuyet', sx: 960, sy: 1140, label: 'Núi Tuyết' }
      ],
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
        { x: 160, y: 800, s: 'cay_phong' },
        { x: 960, y: 900, s: 't3d_la_vang' },
        { x: 500, y: 700, s: 't3d_la_vang' },
        { x: 1500, y: 500, s: 't3d_cay_tron' },
      ],
      lanterns: [
        { x: 860, y: 560 }, { x: 1060, y: 560 },
        { x: 860, y: 720 }, { x: 1060, y: 720 }
      ],
      tiles: [
        { s: 'tile_ban_da', x: 960, y: 640, w: 170,
          blocks: [{ dx: 0, r: 46 }] },
        { s: 'tile_hang_rao', x: 960, y: 300, w: 520,
          blocks: [{ dx: -170, r: 30 }, { dx: 0, r: 30 }, { dx: 170, r: 30 }] },
        { s: 't3d_goc_cay', x: 800, y: 800, w: 110, blocks: [{ dx: 0, r: 30 }] },
        { s: 't3d_dong_go', x: 1300, y: 750, w: 110, blocks: [{ dx: 0, r: 30 }] },
        { s: 't3d_nam_do', x: 400, y: 900, w: 70, blocks: [] },
        { s: 't3d_nam_tim', x: 455, y: 935, w: 60, blocks: [] },
        { s: 't3d_bui_qua', x: 1100, y: 400, w: 90, blocks: [{ dx: 0, r: 25 }] },
        { s: 't3d_hoa_do', x: 1000, y: 1000, w: 60, blocks: [] },
        { s: 't3d_hoa_vang', x: 1055, y: 1030, w: 60, blocks: [] },
      ],
      npcs: ['thach_dau'],
      items: [['khoai', 4, 960, 640, 420], ['cui', 4, 960, 640, 420]],
      monsters: [
        { spr: 'khi_da', x: 700, y: 500, hp: 35, dmg: 7, speed: 75, xp: 18, coins: 6 },
        { spr: 'khi_da', x: 1200, y: 900, hp: 35, dmg: 7, speed: 75, xp: 18, coins: 6 },
        { spr: 'khi_da', x: 1600, y: 400, hp: 35, dmg: 7, speed: 75, xp: 18, coins: 6 }
      ],
      portals: [{ x: 50, y: 640, r: 70, to: 'taytuydai', sx: 1800, sy: 800, label: 'Tây Tùy Đài' }],
      spawn: { x: 140, y: 640 }
    },
    rungtruc: {
      label: 'Rừng Trúc', W: 1920, H: 1280, ground: '#4f9e58', weather: null,
      pond: null, stream: null, dais: null, bridgeX0: 0, bridgeX1: 0, master: null,
      trees: [
        { x: 850, y: 200, s: 't3d_bach_duong' },
        { x: 1750, y: 1050, s: 't3d_thong_con' },
      ],
      lanterns: [{ x: 200, y: 580 }, { x: 420, y: 580 }],
      tiles: [
        { s: 'tile_truc', x: 600, y: 100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 600, y: 300, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 600, y: 500, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 600, y: 900, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 600, y: 1100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1100, y: 100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1100, y: 500, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1100, y: 700, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1100, y: 900, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1100, y: 1100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 300, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 500, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 700, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 900, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_truc', x: 1600, y: 1100, w: 130, blocks: [{ dx: 0, r: 42 }] },
        { s: 'tile_ban_da', x: 420, y: 780, w: 150, blocks: [{ dx: 0, r: 42 }] },
        { s: 't3d_duong_xi', x: 300, y: 900, w: 90, blocks: [] },
        { s: 't3d_co', x: 750, y: 1000, w: 80, blocks: [] },
        { s: 't3d_co', x: 1400, y: 200, w: 80, blocks: [] },
        { s: 't3d_bui_hoa_xanh', x: 1750, y: 800, w: 90, blocks: [{ dx: 0, r: 25 }] },
        { s: 't3d_da_reu', x: 950, y: 1150, w: 110, blocks: [{ dx: 0, r: 30 }] },
        { s: 't3d_nam_tim', x: 1350, y: 600, w: 60, blocks: [] },
      ],
      npcs: ['linh_nhi'],
      items: [['cui', 3, 1750, 640, 180]],
      monsters: [
        { spr: 'ran_truc', x: 800, y: 400, hp: 30, dmg: 8, speed: 95, xp: 18, coins: 6 },
        { spr: 'ran_truc', x: 1300, y: 900, hp: 30, dmg: 8, speed: 95, xp: 18, coins: 6 },
        { spr: 'ran_truc', x: 1700, y: 300, hp: 30, dmg: 8, speed: 95, xp: 18, coins: 6 }
      ],
      portals: [{ x: 50, y: 640, r: 70, to: 'taytuydai', sx: 120, sy: 900, label: 'Tây Tùy Đài' }],
      spawn: { x: 140, y: 640 }
    },
    samac: {
      label: 'Sa Mạc Vàng', W: 1920, H: 1280, ground: '#e3c172', weather: 'sand',
      pond: { x: 1400, y: 400, rx: 130, ry: 75 },
      stream: null, dais: null, bridgeX0: 0, bridgeX1: 0, master: null,
      trees: [],
      lanterns: [{ x: 1300, y: 320 }, { x: 1500, y: 320 }],
      tiles: [
        { s: 'tile_dun_cat', x: 300, y: 300, w: 260, blocks: [] },
        { s: 'tile_dun_cat', x: 700, y: 950, w: 260, blocks: [] },
        { s: 'tile_dun_cat', x: 1150, y: 550, w: 260, blocks: [] },
        { s: 'tile_dun_cat', x: 1650, y: 1050, w: 260, blocks: [] },
        { s: 'tile_dun_cat', x: 450, y: 1150, w: 260, blocks: [] },
        { s: 'tile_tan_tich', x: 300, y: 900, w: 300, blocks: [{ dx: 0, r: 90 }] },
        { s: 't3d_da_tang', x: 800, y: 400, w: 110, blocks: [{ dx: 0, r: 35 }] },
        { s: 't3d_da_dung', x: 1500, y: 800, w: 70, blocks: [{ dx: 0, r: 25 }] },
        { s: 't3d_canh_cay', x: 200, y: 600, w: 120, blocks: [] },
        { s: 't3d_soi', x: 1100, y: 1150, w: 120, blocks: [] },
        { s: 't3d_phien_da', x: 600, y: 200, w: 140, blocks: [] },
      ],
      npcs: ['ho_lao'],
      items: [],
      monsters: [
        { spr: 'bo_cap', x: 500, y: 600, hp: 45, dmg: 10, speed: 65, xp: 25, coins: 9 },
        { spr: 'bo_cap', x: 1100, y: 900, hp: 45, dmg: 10, speed: 65, xp: 25, coins: 9 },
        { spr: 'bo_cap', x: 1600, y: 500, hp: 45, dmg: 10, speed: 65, xp: 25, coins: 9 }
      ],
      portals: [
        { x: 960, y: 50, r: 70, to: 'taytuydai', sx: 1400, sy: 1160, label: 'Tây Tùy Đài' },
        { x: 1870, y: 640, r: 70, to: 'daolua', sx: 110, sy: 640, label: 'Đảo Núi Lửa' }
      ],
      spawn: { x: 960, y: 140 }
    },
    nuttuyet: {
      label: 'Núi Tuyết', W: 1920, H: 1280, ground: '#dfe8f2', weather: 'snow',
      pond: null, stream: null, dais: null, bridgeX0: 0, bridgeX1: 0, master: null,
      trees: [
        { x: 200, y: 300, s: 'tile_tung_tuyet' }, { x: 500, y: 200, s: 'tile_tung_tuyet' },
        { x: 900, y: 250, s: 'tile_tung_tuyet' }, { x: 1300, y: 200, s: 'tile_tung_tuyet' },
        { x: 1650, y: 300, s: 'tile_tung_tuyet' }, { x: 1750, y: 700, s: 'tile_tung_tuyet' },
        { x: 1400, y: 1000, s: 'tile_tung_tuyet' }, { x: 900, y: 1100, s: 'tile_tung_tuyet' },
        { x: 500, y: 1050, s: 'tile_tung_tuyet' }, { x: 200, y: 800, s: 'tile_tung_tuyet' },
        { x: 700, y: 500, s: 't3d_thong' },
        { x: 1200, y: 500, s: 't3d_thong' },
        { x: 1600, y: 900, s: 't3d_thong_con' },
        { x: 350, y: 500, s: 't3d_thong_con' },
      ],
      lanterns: [{ x: 860, y: 420 }, { x: 1060, y: 420 }],
      tiles: [
        { s: 'tile_am_tuyet', x: 960, y: 350, w: 280, blocks: [{ dx: 0, r: 80 }] },
        { s: 't3d_da_tang', x: 1150, y: 300, w: 110, blocks: [{ dx: 0, r: 35 }] },
        { s: 't3d_soi', x: 700, y: 900, w: 120, blocks: [] },
      ],
      npcs: ['ba_ba'],
      items: [['tuyet_lien', 1, 960, 120, 10]],
      monsters: [
        { spr: 'soi_tuyet', x: 400, y: 700, hp: 55, dmg: 12, speed: 105, xp: 30, coins: 11 },
        { spr: 'soi_tuyet', x: 1100, y: 800, hp: 55, dmg: 12, speed: 105, xp: 30, coins: 11 },
        { spr: 'soi_tuyet', x: 1500, y: 600, hp: 55, dmg: 12, speed: 105, xp: 30, coins: 11 }
      ],
      portals: [{ x: 960, y: 1230, r: 70, to: 'taytuydai', sx: 960, sy: 140, label: 'Tây Tùy Đài' }],
      spawn: { x: 960, y: 1140 }
    },
    daolua: {
      label: 'Đảo Núi Lửa', W: 1920, H: 1280, ground: '#6b5a4e', weather: 'ember',
      pond: null, stream: null, dais: null, bridgeX0: 0, bridgeX1: 0, master: null,
      trees: [],
      lanterns: [],
      tiles: [
        { s: 'tile_nui_lua', x: 1500, y: 400, w: 420, blocks: [{ dx: 0, r: 140 }] },
        { s: 'tile_dung_nham', x: 900, y: 800, w: 300, blocks: [{ dx: 0, r: 80 }] },
        { s: 'tile_dung_nham', x: 1300, y: 1050, w: 240, blocks: [{ dx: 0, r: 60 }] },
        { s: 'tile_dung_nham', x: 500, y: 900, w: 200, blocks: [{ dx: 0, r: 50 }] },
        { s: 't3d_da_nut', x: 700, y: 1100, w: 110, blocks: [{ dx: 0, r: 35 }] },
        { s: 't3d_da_nut', x: 1100, y: 400, w: 110, blocks: [{ dx: 0, r: 35 }] },
        { s: 't3d_da_dung', x: 300, y: 400, w: 70, blocks: [{ dx: 0, r: 25 }] },
        { s: 't3d_phien_da', x: 1600, y: 1100, w: 140, blocks: [] },
      ],
      npcs: [],
      items: [],
      monsters: [
        { spr: 'quai_nham', x: 700, y: 500, hp: 80, dmg: 14, speed: 60, xp: 40, coins: 15 },
        { spr: 'quai_nham', x: 1100, y: 900, hp: 80, dmg: 14, speed: 60, xp: 40, coins: 15 },
        { spr: 'quai_nham', x: 400, y: 1100, hp: 80, dmg: 14, speed: 60, xp: 40, coins: 15 },
        { spr: 'hoa_ma', x: 1500, y: 750, hp: 320, dmg: 20, speed: 70, xp: 200, coins: 120, scale: 1.7 }
      ],
      portals: [{ x: 50, y: 640, r: 70, to: 'samac', sx: 1780, sy: 640, label: 'Sa Mạc Vàng' }],
      spawn: { x: 140, y: 640 }
    }
  };

  // ---------- NPC definitions (G2: data-driven) ----------
  var NPC_DEFS = {
    thiet_nguu: { id: 'thiet_nguu', name: 'Thiết Ngưu', spr: 'thiet_nguu', color: '#b45309',
      home: { x: 760, y: 1000 }, range: 130, questId: 'khoai',
      walk: ['thiet_nguu_w1', 'thiet_nguu_w2', 'thiet_nguu_w3'],
      dlg: 'thiet_nguu_idle', thanks: 'thiet_nguu_thanks', idleDone: 'thiet_nguu_done' },
    linh_nhi: { id: 'linh_nhi', name: 'Linh Nhi', spr: 'linh_nhi', color: '#d63384',
      home: { x: 300, y: 700 }, range: 110, questId: 'sao_truc',
      walk: ['linh_nhi_w1', 'linh_nhi_w2', 'linh_nhi_w3'],
      dlg: 'linh_nhi_idle', thanks: 'linh_nhi_thanks', idleDone: 'linh_nhi_done' },
    thach_dau: { id: 'thach_dau', name: 'Thạch Đầu', spr: 'thach_dau', color: '#6b7280',
      home: { x: 480, y: 720 }, range: 120, questId: 'cui',
      walk: ['thach_dau_w1', 'thach_dau_w2', 'thach_dau_w3'],
      dlg: 'thach_dau_idle', thanks: 'thach_dau_thanks', idleDone: 'thach_dau_done' },
    ho_lao: { id: 'ho_lao', name: 'Hồ Lão', spr: 'ho_lao', color: '#92400e',
      home: { x: 960, y: 700 }, range: 100, questId: 'ho_tong',
      walk: ['ho_lao_w1', 'ho_lao_w2', 'ho_lao_w3'],
      dlg: 'ho_lao_idle', thanks: 'ho_lao_thanks', idleDone: 'ho_lao_done' },
    ba_ba: { id: 'ba_ba', name: 'Tuyết Sơn Bà Bà', spr: 'ba_ba', color: '#64748b',
      home: { x: 960, y: 480 }, range: 80, questId: 'tuyet_lien',
      walk: ['ba_ba_w1', 'ba_ba_w2', 'ba_ba_w3'],
      dlg: 'ba_ba_idle', thanks: 'ba_ba_thanks', idleDone: 'ba_ba_done' }
  };
  var NPCS = [];

  // ---------- quests & items (G2: from DATA) ----------
  var QUESTS = DATA.quests.map(function (q) {
    return { id: q.id, name: q.name, desc: q.desc, need: q.need,
             type: q.type || 'collect', target: q.target || null,
             have: 0, state: 'active', thanked: false };
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
      if (q.state === 'done' && !q.thanked) {
        q.thanked = true;
        return n.thanks ? DATA.dialogues[n.thanks] : DATA.dialogues[n.dlg];
      }
      if (q.state === 'done') return n.idleDone ? DATA.dialogues[n.idleDone] : DATA.dialogues[n.dlg];
    }
    return DATA.dialogues[n.dlg];
  }
  function questKill(spr) {
    for (var i = 0; i < QUESTS.length; i++) {
      var q = QUESTS[i];
      if (q.type === 'kill' && q.target === spr && q.state === 'active') {
        q.state = 'done';
        sfxQuest();
        saveGame();
        toast('★ Hoàn thành: ' + q.name + ' — về gặp sư phụ!', 3500);
        if (qlOpen) renderQuestLog();
      }
    }
  }
  function masterLines() {
    var q = questById('dai_hoi');
    if (q && q.state === 'done') return DATA.dialogues.master_finale;
    if (q && q.state === 'active') return DATA.dialogues.master_daihoi;
    return DATA.dialogues.master;
  }
  function questTalk(npcId) {
    for (var i = 0; i < QUESTS.length; i++) {
      var q = QUESTS[i];
      if (q.type === 'talk' && q.target === npcId && q.state === 'active') {
        q.state = 'done';
        sfxQuest();
        saveGame();
        toast('★ Hoàn thành: ' + q.name, 3000);
        if (npcId === 'master') pendingEnding = true;
        if (qlOpen) renderQuestLog();
      }
    }
  }

  // ---------- combat (G4) ----------
  var WEAPONS = {
    kiem_go: { name: 'Kiếm gỗ', dmg: 10 },
    kiem_sat: { name: 'Kiếm sắt', dmg: 16, price: 60 },
    kiem_han_thiet: { name: 'Hàn Thiết Kiếm', dmg: 24, price: 150 },
    kiem_tuyet_lien: { name: 'Bảo kiếm Tuyết Liên', dmg: 34 }
  };
  var stats = { hp: 100, maxHp: 100, mp: 50, maxMp: 50,
                level: 1, xp: 0, xpNext: 100, coins: 20,
                weapon: 'kiem_go', banh_bao: 2 };
  var MONSTERS = [];
  var projectiles = [];
  var floaters = [];
  var slashT = 0, atkCd = 0, hurtFlash = 0, atkAnimT = 0;
  var skillCd = [0, 0, 0];

  function addFloater(x, y, txt, color) {
    floaters.push({ x: x, y: y, txt: txt, color: color || '#fff', t: 1.1 });
  }
  function sfxSwing() { tone(300, 0.08, 'sawtooth', 0.03); tone(180, 0.1, 'sawtooth', 0.025, 0.04); }
  function sfxSkill() { tone(500, 0.12, 'square', 0.04); tone(900, 0.16, 'square', 0.035, 0.08); }
  function sfxHeal() { tone(440, 0.15, 'sine', 0.05); tone(660, 0.2, 'sine', 0.05, 0.1); }
  function sfxHurt() { tone(140, 0.18, 'sawtooth', 0.05); }
  function sfxKill() { tone(700, 0.1, 'square', 0.04); tone(350, 0.18, 'square', 0.04, 0.07); }

  function gainXp(n) {
    stats.xp += n;
    while (stats.xp >= stats.xpNext) {
      stats.xp -= stats.xpNext; stats.level++;
      stats.xpNext = Math.round(stats.xpNext * 1.5);
      stats.maxHp += 20; stats.hp = stats.maxHp;
      stats.maxMp += 10; stats.mp = stats.maxMp;
      sfxQuest();
      toast('⬆ Lên cấp ' + stats.level + '! Máu và nội lực hồi đầy.', 3000);
    }
  }
  function hurtMonster(m, dmg) {
    if (m.dead) return;
    m.hp -= dmg; m.hurtT = 0.25;
    addFloater(m.x, m.y - 140 * m.scale, '-' + dmg, '#fca5a5');
    if (m.hp <= 0) {
      m.dead = true; m.deadT = 0.6;
      stats.coins += m.coins;
      addFloater(m.x, m.y - 165 * m.scale, '+' + m.coins + ' xu', '#fbbf24');
      gainXp(m.xp);
      questKill(m.spr);
      sfxKill();
    }
  }
  function hurtPlayer(dmg) {
    if (stats.hp <= 0) return;
    stats.hp -= dmg; hurtFlash = 0.35;
    addFloater(player.x, player.y - 165, '-' + dmg, '#f87171');
    sfxHurt();
    if (stats.hp <= 0) {
      stats.hp = 0;
      stats.coins = Math.max(0, stats.coins - Math.floor(stats.coins * 0.1));
      var s = MAPS[curMap].spawn;
      player.x = s.x; player.y = s.y;
      stats.hp = stats.maxHp; stats.mp = stats.maxMp;
      toast('Ngươi gục ngã… tỉnh lại ở ' + MAPS[curMap].label + ' (mất 10% xu)', 3000);
    }
  }
  function playerAttack() {
    if (atkCd > 0 || dialogueOpen || shopOpen || invOpen) return;
    atkCd = 0.45; slashT = 0.18; atkAnimT = 0.38;
    sfxSwing();
    var dmg = WEAPONS[stats.weapon].dmg + Math.floor(Math.random() * 4);
    MONSTERS.forEach(function (m) {
      if (m.dead) return;
      var dx = m.x - player.x, dy = m.y - player.y;
      if (dx * dx + dy * dy < 100 * 100) hurtMonster(m, dmg);
    });
  }
  function castSkill(i) {
    if (dialogueOpen || shopOpen || invOpen || skillCd[i] > 0) return;
    if (i === 0) {
      if (stats.mp < 15) { toast('Không đủ nội lực!'); return; }
      stats.mp -= 15; skillCd[0] = 1.2;
      projectiles.push({ x: player.x, y: player.y - 72,
        vx: (player.face < 0 ? -1 : 1) * 520, vy: 0, dmg: 22, t: 1.2 });
      sfxSkill();
    } else if (i === 1) {
      if (stats.mp < 20) { toast('Không đủ nội lực!'); return; }
      if (stats.hp >= stats.maxHp) { toast('Máu đã đầy!'); return; }
      stats.mp -= 20; skillCd[1] = 6;
      var heal = Math.min(35, stats.maxHp - stats.hp);
      stats.hp += heal;
      addFloater(player.x, player.y - 165, '+' + heal, '#7ddf8e');
      sfxHeal();
    } else {
      if (stats.mp < 30) { toast('Không đủ nội lực!'); return; }
      stats.mp -= 30; skillCd[2] = 9; slashT = 0.3;
      sfxSkill();
      MONSTERS.forEach(function (m) {
        if (m.dead) return;
        var dx = m.x - player.x, dy = m.y - player.y;
        if (dx * dx + dy * dy < 175 * 175) hurtMonster(m, 38);
      });
    }
  }
  function eatBanhBao() {
    if (invOpen) return;
    if (stats.banh_bao <= 0) { toast('Hết bánh bao! Mua ở tiệm Hồ Lão (Sa Mạc Vàng).'); return; }
    if (stats.hp >= stats.maxHp) { toast('Máu đã đầy!'); return; }
    stats.banh_bao--;
    stats.hp = Math.min(stats.maxHp, stats.hp + 40);
    sfxPickup(); toast('Ăn bánh bao: +40 máu');
  }

  // ---------- shop & inventory (G4) ----------
  var SHOP = [
    { id: 'banh_bao', name: 'Bánh bao', desc: 'Hồi 40 máu', price: 10 },
    { id: 'kiem_sat', name: 'Kiếm sắt', desc: 'Sát thương 16', price: 60 },
    { id: 'kiem_han_thiet', name: 'Hàn Thiết Kiếm', desc: 'Sát thương 24', price: 150 }
  ];
  var shopOpen = false, invOpen = false;
  var shopEl = document.getElementById('shop'), shopList = document.getElementById('shop-list'),
      shopCoins = document.getElementById('shop-coins');
  var invEl = document.getElementById('inv'), invList = document.getElementById('inv-list');
  function weaponRank(w) { return ['kiem_go', 'kiem_sat', 'kiem_han_thiet', 'kiem_tuyet_lien'].indexOf(w); }
  function buyItem(id) {
    var it = null;
    SHOP.forEach(function (s) { if (s.id === id) it = s; });
    if (!it) return;
    if (id !== 'banh_bao' && weaponRank(id) <= weaponRank(stats.weapon)) { toast('Đã có kiếm tốt hơn rồi!'); return; }
    if (stats.coins < it.price) { toast('Không đủ xu!'); sfxBlip(); return; }
    stats.coins -= it.price;
    if (id === 'banh_bao') stats.banh_bao++;
    else stats.weapon = id;
    sfxQuest(); toast('Đã mua: ' + it.name);
    saveGame(); renderShop(); renderInv();
  }
  function renderShop() {
    shopCoins.textContent = 'Xu của ngươi: 🪙 ' + stats.coins;
    shopList.innerHTML = '';
    SHOP.forEach(function (it) {
      var owned = it.id !== 'banh_bao' && weaponRank(it.id) <= weaponRank(stats.weapon);
      var row = document.createElement('div');
      row.className = 'shop-row';
      row.innerHTML = '<b>' + it.name + '</b><span>' + it.desc + '</span>';
      var b = document.createElement('button');
      b.textContent = owned ? 'Đã có' : 'Mua 🪙' + it.price;
      b.disabled = owned;
      b.addEventListener('click', function () { buyItem(it.id); });
      row.appendChild(b);
      shopList.appendChild(row);
    });
  }
  function openShop() { shopOpen = true; renderShop(); shopEl.classList.add('show'); }
  function closeShop() { shopOpen = false; shopEl.classList.remove('show'); }
  function renderInv() {
    invList.innerHTML = '';
    var w = WEAPONS[stats.weapon];
    invList.innerHTML =
      '<div class="inv-row"><b>🗡️ ' + w.name + '</b><span>Sát thương ' + w.dmg + '</span></div>' +
      '<div class="inv-row"><b>🥟 Bánh bao × ' + stats.banh_bao + '</b><span>Hồi 40 máu</span>' +
      '<button id="inv-eat">Dùng (4)</button></div>' +
      '<div class="inv-row"><b>🪙 Xu: ' + stats.coins + '</b><span>Cấp ' + stats.level + ' — ' + stats.xp + '/' + stats.xpNext + ' XP</span></div>';
    document.getElementById('inv-eat').addEventListener('click', eatBanhBao);
  }
  function toggleInv() {
    invOpen = !invOpen;
    if (invOpen) renderInv();
    invEl.classList.toggle('show', invOpen);
  }
  document.getElementById('shop-close').addEventListener('click', closeShop);
  document.getElementById('inv-close').addEventListener('click', function () { if (invOpen) toggleInv(); });

  function loadMap(name, sx, sy, quiet) {
    var M = MAPS[name];
    curMap = name;
    WORLD_W = M.W; WORLD_H = M.H;
    pond = M.pond; stream = M.stream; dais = M.dais;
    bridgeX0 = M.bridgeX0 || 0; bridgeX1 = M.bridgeX1 || 0;
    master = M.master ? { x: M.master.x, y: M.master.y } : null;
    trees = M.trees; lanterns = M.lanterns; tiles = M.tiles;
    blockers = [];
    trees.forEach(function (t) { blockers.push({ x: t.x, y: t.y, r: 40 }); });
    lanterns.forEach(function (l) { blockers.push({ x: l.x, y: l.y, r: 14 }); });
    if (master) blockers.push({ x: master.x, y: master.y, r: 30 });
    tiles.forEach(function (tl) {
      (tl.blocks || []).forEach(function (b) { blockers.push({ x: tl.x + b.dx * TILE_SCALE, y: tl.y, r: b.r * TILE_SCALE }); });
    });
    NPCS = M.npcs.map(function (id) {
      var d = NPC_DEFS[id];
      return { id: d.id, name: d.name, spr: d.spr, color: d.color,
               x: d.home.x, y: d.home.y, home: { x: d.home.x, y: d.home.y },
               range: d.range, wt: Math.random() * 2, tx: undefined, ty: undefined,
               moving: false, face: 1, walk: d.walk,
               questId: d.questId, dlg: d.dlg, thanks: d.thanks, idleDone: d.idleDone };
    });
    ITEMS = [];
    M.items.forEach(function (sp) { scatterItems(sp[0], sp[1], sp[2], sp[3], sp[4]); });
    MONSTERS = (M.monsters || []).map(function (md) {
      return { spr: md.spr, x: md.x, y: md.y, home: { x: md.x, y: md.y },
               hp: md.hp, maxHp: md.hp, dmg: md.dmg, speed: md.speed,
               xp: md.xp, coins: md.coins, scale: md.scale || 1,
               atkCd: 0, wt: Math.random() * 2, tx: undefined, ty: undefined,
               moving: false, dead: false, deadT: 0, hurtT: 0 };
    });
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
    for (var mi = 0; mi < MONSTERS.length; mi++) {
      var mm = MONSTERS[mi];
      if (mm === self || mm.dead) continue;
      var mdx = x - mm.x, mdy = y - mm.y;
      if (mdx * mdx + mdy * mdy < 36 * 36) return true;
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
    if (titleOpen) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismissTitle(); }
      return;
    }
    if (introOpen()) {
      if (e.key === 'Enter' || e.key === ' ') document.getElementById('intro-next').click();
      return;
    }
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(e.key.toLowerCase()) >= 0) e.preventDefault();
    if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && !dialogueOpen && !shopOpen && !invOpen) {
      var tgt = nearestTarget();
      if (tgt) openDialogueFor(tgt);
      else if (e.key === ' ') playerAttack();
    }
    if ((e.key === 'j' || e.key === 'J') && !dialogueOpen) toggleQuestLog();
    if ((e.key === 'i' || e.key === 'I') && !dialogueOpen && !shopOpen) toggleInv();
    if (!dialogueOpen && !shopOpen && !invOpen) {
      if (e.key === '1') castSkill(0);
      if (e.key === '2') castSkill(1);
      if (e.key === '3') castSkill(2);
      if (e.key === '4') eatBanhBao();
    }
    if (e.key === 'Escape') { closeShop(); if (invOpen) toggleInv(); }
    if (e.key === 'm' || e.key === 'M') { musicOn = !musicOn; toast(musicOn ? '🔊 Nhạc: bật' : '🔇 Nhạc: tắt'); }
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
          if (c.shop) { closeDialogue(); openShop(); return; }
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
    if (tgt.isMaster) {
      dlgLines = masterLines();
      questTalk('master');
    } else {
      dlgLines = npcLines(tgt);
      questTalk(tgt.id);
    }
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
    if (pendingEnding) { pendingEnding = false; showEnding(); }
  }
  var pendingEnding = false;
  function showEnding() {
    document.getElementById('ending').classList.add('show');
    sfxQuest();
  }
  document.getElementById('ending-close').addEventListener('click', function () {
    document.getElementById('ending').classList.remove('show');
  });

  // ---------- title / intro (G5) ----------
  var titleOpen = true, hadSave = false, introIdx = 0;
  var INTRO = [
    'Xưa kia, tại Cửu Châu, võ lâm phân tranh không ngớt…',
    'Ngươi — một thiếu niên mồ côi — nghe danh Sư Phụ Yixuan ở Tây Tùy Đài, lặn lội lên núi bái sư.',
    'Từ đây, hành trình khám phá Cửu Châu bắt đầu: rừng trúc, sa mạc, tuyết sơn, đảo lửa…',
    'Hãy mạnh lên, kết giao bằng hữu, và viết nên truyền kỳ của riêng mình!'
  ];
  var titleEl = document.getElementById('title'),
      introEl = document.getElementById('intro'),
      introCard = document.getElementById('intro-card');
  function showIntroCard() { introCard.textContent = INTRO[introIdx]; }
  function dismissTitle() {
    if (!titleOpen) return;
    titleOpen = false;
    titleEl.classList.remove('show');
    if (!hadSave) { introIdx = 0; showIntroCard(); introEl.classList.add('show'); }
  }
  document.getElementById('btn-start').addEventListener('click', function () { ac(); dismissTitle(); });
  document.getElementById('intro-next').addEventListener('click', function () {
    sfxBlip();
    introIdx++;
    if (introIdx >= INTRO.length) introEl.classList.remove('show');
    else showIntroCard();
  });
  function introOpen() { return introEl.classList.contains('show'); }

  // ---------- music (G5: generative, subtle) ----------
  var MUSIC_SCALES = {
    taytuydai: [523, 587, 659, 784, 880],
    rungphong: [440, 523, 587, 659, 784],
    rungtruc: [587, 659, 784, 880, 1047],
    samac: [392, 440, 523, 587, 659],
    nuttuyet: [659, 784, 880, 1047, 1175],
    daolua: [330, 392, 440, 523, 587]
  };
  var musicT = 1.5, musicOn = true;

  // ---------- mobile touch (G5) ----------
  var joy = { active: false, x: 0, y: 0 };
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
        quests: QUESTS.map(function (q) { return { id: q.id, have: q.have, state: q.state, thanked: q.thanked }; }),
        stats: { hp: Math.round(stats.hp), maxHp: stats.maxHp, mp: Math.round(stats.mp), maxMp: stats.maxMp,
                 level: stats.level, xp: stats.xp, xpNext: stats.xpNext,
                 coins: stats.coins, weapon: stats.weapon, banh_bao: stats.banh_bao }
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
  var ITEM_NAMES = { khoai: 'củ khoai', cui: 'khúc củi', la_phong: 'lá phong', tuyet_lien: 'Tuyết Liên' };
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
      if (id === 'tuyet_lien' && weaponRank(stats.weapon) < weaponRank('kiem_tuyet_lien')) {
        stats.weapon = 'kiem_tuyet_lien';
        setTimeout(function () { toast('🗡️ Nhận được Bảo kiếm Tuyết Liên!', 3000); }, 3200);
      }
    } else {
      toast('+1 ' + (ITEM_NAMES[id] || id) + ' (' + q.have + '/' + q.need + ')');
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
  // weather particles (G3)
  var weatherP = [];
  for (var wi = 0; wi < 80; wi++) {
    weatherP.push({ x: Math.random() * 1920, y: Math.random() * 1280, ph: Math.random() * 6.28 });
  }
  var pathStones = [];
  for (var sy = 470; sy <= 1260; sy += 46) {
    pathStones.push({ x: 960 + Math.sin(sy * 0.01) * 26 + (rnd() - 0.5) * 14, y: sy, r: 30 + rnd() * 10 });
  }

  function drawSprite(name, x, y, flip, scale) {
    var im = img[name], s = scale || 1, w = im.width * s, h = im.height * s;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(im, -w / 2, -h + 14 * s, w, h);
    ctx.restore();
    return h;
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
    } else if (it.kind === 'la_phong') {
      ctx.fillStyle = '#dc2626';
      ctx.save();
      ctx.translate(0, -8); ctx.rotate(0.5 + Math.sin(t * 2 + it.ph) * 0.3);
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, 6.29); ctx.fill();
      ctx.restore();
    } else if (it.kind === 'tuyet_lien') {
      var tim = img['tile_tuyet_lien'], tw = 54, th = tim.height * (54 / tim.width);
      var tglow = 0.3 + Math.sin(t * 4) * 0.15;
      ctx.fillStyle = 'rgba(165,243,252,' + tglow.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(0, -th / 2, 34, 0, 6.29); ctx.fill();
      ctx.drawImage(tim, -tw / 2, -th, tw, th);
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

  // ---------- mobile touch controls (G5) ----------
  if ('ontouchstart' in window) {
    document.getElementById('touch').classList.add('show');
    (function () {
      var joyEl = document.getElementById('joy'), knob = document.getElementById('joy-knob');
      var joyId = null, joyCX = 0, joyCY = 0;
      function joyMove(tc) {
        var dx = tc.clientX - joyCX, dy = tc.clientY - joyCY;
        var d = Math.hypot(dx, dy), max = 46;
        if (d > max) { dx *= max / d; dy *= max / d; }
        joy.x = dx / max; joy.y = dy / max;
        knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      }
      joyEl.addEventListener('touchstart', function (e) {
        e.preventDefault(); ac();
        var tc = e.changedTouches[0]; joyId = tc.identifier;
        var r = joyEl.getBoundingClientRect();
        joyCX = r.left + r.width / 2; joyCY = r.top + r.height / 2;
        joy.active = true; joyMove(tc);
      }, { passive: false });
      joyEl.addEventListener('touchmove', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joyId) joyMove(e.changedTouches[i]);
        }
      }, { passive: false });
      joyEl.addEventListener('touchend', function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joyId) {
            joyId = null; joy.active = false; joy.x = joy.y = 0;
            knob.style.transform = 'translate(0px,0px)';
          }
        }
      });
      var acts = document.querySelectorAll('#touch-btns button');
      for (var bi = 0; bi < acts.length; bi++) {
        (function (b) {
          b.addEventListener('touchstart', function (e) {
            e.preventDefault(); ac();
            if (titleOpen) { dismissTitle(); return; }
            if (introOpen()) { document.getElementById('intro-next').click(); return; }
            var a = b.getAttribute('data-act');
            if (a === 'e') { var tgt = nearestTarget(); if (tgt) openDialogueFor(tgt); }
            else if (a === 'atk') playerAttack();
            else if (a === '1') castSkill(0);
            else if (a === '2') castSkill(1);
            else if (a === '3') castSkill(2);
          }, { passive: false });
        })(acts[bi]);
      }
    })();
  }

  var cam = { x: 0, y: 0 };
  var last = 0, t = 0;

  // boot (G2): restore save or start fresh
  (function boot() {
    var s = loadSave();
    hadSave = !!s;
    if (s) {
      dayT = (typeof s.dayT === 'number') ? s.dayT : 0.3;
      loadMap(s.map, s.x, s.y, true);
      (s.quests || []).forEach(function (sq) {
        var q = questById(sq.id);
        if (q) { q.have = sq.have; q.state = sq.state; q.thanked = sq.thanked; }
      });
      if (s.stats) {
        var st = s.stats;
        stats.hp = st.hp; stats.maxHp = st.maxHp; stats.mp = st.mp; stats.maxMp = st.maxMp;
        stats.level = st.level; stats.xp = st.xp; stats.xpNext = st.xpNext;
        stats.coins = st.coins; stats.weapon = st.weapon || 'kiem_go'; stats.banh_bao = st.banh_bao || 0;
      }
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
    if (!dialogueOpen && !emote && !shopOpen && !invOpen && !titleOpen && !introOpen()) {
      var mx = 0, my = 0;
      if (keys['a'] || keys['arrowleft']) mx -= 1;
      if (keys['d'] || keys['arrowright']) mx += 1;
      if (keys['w'] || keys['arrowup']) my -= 1;
      if (keys['s'] || keys['arrowdown']) my += 1;
      if (joy.active) { mx += joy.x; my += joy.y; }
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
        if (dx < 0) n.face = -1; else if (dx > 0) n.face = 1;
        if (!collides(n.x + dx / d * sp, n.y, n)) n.x += dx / d * sp;
        if (!collides(n.x, n.y + dy / d * sp, n)) n.y += dy / d * sp;
      }
    });
    // combat update (G4)
    atkCd -= dt; slashT -= dt; hurtFlash -= dt; atkAnimT -= dt;
    for (var csi = 0; csi < 3; csi++) skillCd[csi] -= dt;
    stats.mp = Math.min(stats.maxMp, stats.mp + 6 * dt);
    MONSTERS.forEach(function (m) {
      if (m.dead) { m.deadT -= dt; return; }
      if (m.hurtT > 0) m.hurtT -= dt;
      m.atkCd -= dt;
      var mdx = player.x - m.x, mdy = player.y - m.y, md = Math.hypot(mdx, mdy);
      m.moving = false;
      if (isNight()) { /* monsters rest at night */ }
      else if (md < 240 && md > 54) {
        var msp = m.speed * dt;
        m.moving = true;
        if (!collides(m.x + mdx / md * msp, m.y, m)) m.x += mdx / md * msp;
        if (!collides(m.x, m.y + mdy / md * msp, m)) m.y += mdy / md * msp;
      } else if (md <= 54) {
        if (m.atkCd <= 0) { m.atkCd = 1.3; hurtPlayer(m.dmg); }
      } else {
        m.wt -= dt;
        var wdx = (m.tx === undefined ? m.x : m.tx) - m.x,
            wdy = (m.ty === undefined ? m.y : m.ty) - m.y,
            wd = Math.hypot(wdx, wdy);
        if (wd < 8 || m.wt <= 0) {
          if (m.wt <= 0) {
            if (Math.random() < 0.5) {
              var wa = Math.random() * 6.283, wr = 30 + Math.random() * 90;
              m.tx = m.home.x + Math.cos(wa) * wr;
              m.ty = m.home.y + Math.sin(wa) * wr * 0.7;
            }
            m.wt = 1.6 + Math.random() * 2.6;
          }
        } else {
          var wsp = 45 * dt;
          m.moving = true;
          if (!collides(m.x + wdx / wd * wsp, m.y, m)) m.x += wdx / wd * wsp;
          if (!collides(m.x, m.y + wdy / wd * wsp, m)) m.y += wdy / wd * wsp;
        }
      }
    });
    projectiles.forEach(function (p) {
      p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
      MONSTERS.forEach(function (m) {
        if (m.dead || p.t <= 0) return;
        var pdx = m.x - p.x, pdy = (m.y - 100 * m.scale) - p.y;
        if (pdx * pdx + pdy * pdy < 58 * 58) { p.t = 0; hurtMonster(m, p.dmg); }
      });
    });
    projectiles = projectiles.filter(function (p) { return p.t > 0; });
    floaters.forEach(function (f) { f.t -= dt; f.y -= 34 * dt; });
    floaters = floaters.filter(function (f) { return f.t > 0; });
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

    // music (G5)
    if (musicOn && !titleOpen && !introOpen()) {
      musicT -= dt;
      if (musicT <= 0) {
        musicT = 2.4 + Math.random() * 1.8;
        var msc = MUSIC_SCALES[curMap] || MUSIC_SCALES.taytuydai;
        tone(msc[Math.floor(Math.random() * msc.length)], 1.4, 'triangle', 0.016);
        if (Math.random() < 0.3) tone(msc[Math.floor(Math.random() * msc.length)] / 2, 1.8, 'sine', 0.012, 0.4);
      }
    }

    // weather (G3)
    var wth = MAPS[curMap].weather;
    if (wth) weatherP.forEach(function (p) {
      if (wth === 'snow') {
        p.y += 70 * dt; p.x += Math.sin(t * 2 + p.ph) * 24 * dt;
        if (p.y > WORLD_H) { p.y = -10; p.x = Math.random() * WORLD_W; }
      } else {
        p.x += (wth === 'sand' ? 260 : 60) * dt;
        p.y += (wth === 'sand' ? 50 : -40) * dt;
        if (p.x > WORLD_W) { p.x = -10; p.y = Math.random() * WORLD_W; }
        if (p.y > WORLD_H) p.y = -10; else if (p.y < -10) p.y = WORLD_H + 10;
      }
    });

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
      var im = img['cau_da'], bw = 520, bh = im.height * (520 / im.width);
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
        var im = img[tl.s], tw = tl.w * TILE_SCALE, h = im.height * (tw / im.width);
        ctx.drawImage(im, tl.x - tw / 2, tl.y - h + 14 * TILE_SCALE, tw, h);
      } });
    });
    trees.forEach(function (tr) { ents.push({ y: tr.y, f: function () { drawSprite(tr.s, tr.x, tr.y, false, TREE_SCALE); } }); });
    lanterns.forEach(function (l) {
      ents.push({ y: l.y, f: function () {
        drawSprite('den_da', l.x, l.y, false, TILE_SCALE);
        var la = 0.3 + (1 - daylight()) * 0.45; // brighter at night
        var ly = l.y - 105 * TILE_SCALE, lr = 46 * TILE_SCALE;
        var gl = ctx.createRadialGradient(l.x, ly, 4, l.x, ly, lr);
        gl.addColorStop(0, 'rgba(255,200,90,' + la.toFixed(2) + ')');
        gl.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = gl;
        ctx.beginPath(); ctx.arc(l.x, ly, lr, 0, 6.29); ctx.fill();
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
      var mh = drawSprite(mspr, master.x, master.y + bob, false, CHAR_SCALE);
      ctx.fillStyle = '#2f9e44'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sư Phụ Yixuan', master.x, master.y + bob - mh - 4);
    } });
    }
    ents.push({ y: player.y, f: function () {
      var bob = player.moving ? Math.abs(Math.sin(t * 10)) * 4 : Math.sin(t * 2) * 2;
      var spr = 'do_nhi';
      if (emote) spr = emote.spr;
      else if (atkAnimT > 0) {
        spr = atkAnimT > 0.26 ? 'do_nhi_atk1' : atkAnimT > 0.12 ? 'do_nhi_atk2' : 'do_nhi_atk3';
      }
      else if (dialogueOpen && dlgLines[lineIdx].who === 'player') spr = 'do_nhi_talk';
      else if (player.moving) {
        var frames = ['do_nhi_w1', 'do_nhi', 'do_nhi_w2', 'do_nhi'];
        spr = frames[Math.floor(t * 8) % 4];
      }
      else spr = (Math.floor(t * 1.4) % 4 === 3) ? 'do_nhi_idle' : 'do_nhi';
      var ph = drawSprite(spr, player.x, player.y - bob, player.face < 0, CHAR_SCALE);
      ctx.fillStyle = '#e8f4ff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Nguyên', player.x, player.y - bob - ph - 4);
    } });
    ITEMS.forEach(function (it) {
      if (it.taken) return;
      ents.push({ y: it.y, f: function () { drawItem(it); } });
    });
    NPCS.forEach(function (n) {
      ents.push({ y: n.y, f: function () {
        var bob = n.moving ? 0 : Math.sin(t * 1.8 + n.x) * 2;
        var wspr = n.spr;
        if (n.moving && n.walk) {
          var seq = [0, 1, 2, 1];
          wspr = n.walk[seq[Math.floor(t * 7) % 4]];
          bob = Math.abs(Math.sin(t * 7)) * 3;
        }
        var nh = drawSprite(wspr, n.x, n.y - bob, n.face < 0, CHAR_SCALE);
        ctx.fillStyle = n.color; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y - bob - nh - 4);
        if (isNight()) {
          ctx.fillStyle = '#a5b4fc'; ctx.font = 'bold 16px sans-serif';
          ctx.fillText('z z', n.x + 30, n.y - bob - nh - 16 + Math.sin(t * 2) * 3);
        } else if (n.questId && questById(n.questId).state === 'active') {
          var qb = Math.sin(t * 4) * 4;
          ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 20px sans-serif';
          ctx.fillText('!', n.x + 40, n.y - bob - nh + 2 + qb);
        }
      } });
    });
    MONSTERS.forEach(function (m) {
      if (m.dead && m.deadT <= 0) return;
      ents.push({ y: m.y, f: function () {
        ctx.save();
        if (m.dead) ctx.globalAlpha = Math.max(0, m.deadT / 0.6);
        if (m.hurtT > 0) ctx.translate((Math.random() - 0.5) * 8, 0);
        var bob = m.moving ? Math.abs(Math.sin(t * 8)) * 3 : Math.sin(t * 2 + m.x) * 2;
        var im = img[m.spr], mw = im.width * m.scale * CHAR_SCALE, mh = im.height * m.scale * CHAR_SCALE;
        ctx.drawImage(im, m.x - mw / 2, m.y - mh + 14 * CHAR_SCALE - bob, mw, mh);
        ctx.restore();
        if (!m.dead && m.hp < m.maxHp) {
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.fillRect(m.x - 24, m.y - 140 * m.scale, 48, 6);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(m.x - 24, m.y - 140 * m.scale, 48 * Math.max(0, m.hp / m.maxHp), 6);
        }
      } });
    });
    ents.sort(function (a, b) { return a.y - b.y; });
    ents.forEach(function (e) { e.f(); });

    // slash arc + projectiles + floaters (G4)
    if (slashT > 0) {
      ctx.save();
      ctx.translate(player.x, player.y - 72);
      ctx.scale(player.face, 1);
      ctx.strokeStyle = 'rgba(255,255,255,' + Math.max(0, slashT / 0.3).toFixed(2) + ')';
      ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(32, 0, 44, -1.1, 1.1); ctx.stroke();
      ctx.strokeStyle = 'rgba(253,224,71,0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(32, 0, 44, -1.1, 1.1); ctx.stroke();
      ctx.restore();
    }
    projectiles.forEach(function (p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(125,211,252,0.35)';
      ctx.beginPath(); ctx.ellipse(0, 0, 26, 12, 0, 0, 6.29); ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath(); ctx.ellipse(0, 0, 14, 6, 0, 0, 6.29); ctx.fill();
      ctx.restore();
    });
    floaters.forEach(function (f) {
      ctx.fillStyle = f.color; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(f.txt, f.x, f.y);
    });

    // petals
    ctx.fillStyle = 'rgba(247,168,196,0.85)';
    petals.forEach(function (pt) {
      if (pt.x < cam.x - 10 || pt.x > cam.x + W + 10 || pt.y < cam.y - 10 || pt.y > cam.y + H + 10) return;
      ctx.save();
      ctx.translate(pt.x, pt.y); ctx.rotate(pt.ph + t);
      ctx.fillRect(-pt.s / 2, -pt.s / 4, pt.s, pt.s / 2);
      ctx.restore();
    });

    // weather (G3)
    if (wth === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      weatherP.forEach(function (p) {
        if (p.x < cam.x - 10 || p.x > cam.x + W + 10 || p.y < cam.y - 10 || p.y > cam.y + H + 10) return;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.29); ctx.fill();
      });
    } else if (wth === 'sand' || wth === 'ember') {
      ctx.fillStyle = wth === 'sand' ? 'rgba(230,200,130,0.55)' : 'rgba(255,120,40,0.65)';
      weatherP.forEach(function (p) {
        if (p.x < cam.x - 10 || p.x > cam.x + W + 10 || p.y < cam.y - 10 || p.y > cam.y + H + 10) return;
        ctx.fillRect(p.x, p.y, 5, 2);
      });
    }

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

    // HUD (G4)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, 36, 224, 66);
    ctx.fillStyle = '#3f6212'; ctx.fillRect(16, 44, 200, 12);
    ctx.fillStyle = '#84cc16'; ctx.fillRect(16, 44, 200 * Math.max(0, stats.hp / stats.maxHp), 12);
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(16, 60, 200, 10);
    ctx.fillStyle = '#60a5fa'; ctx.fillRect(16, 60, 200 * Math.max(0, stats.mp / stats.maxMp), 10);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Lv.' + stats.level + '  🪙' + stats.coins + '  🗡️' + WEAPONS[stats.weapon].name, 16, 94);
    if (hurtFlash > 0) {
      ctx.fillStyle = 'rgba(220,38,38,' + (hurtFlash * 0.5).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }

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
