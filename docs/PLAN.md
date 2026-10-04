# Kế hoạch phát triển — Thế giới game của Siu

> Tài liệu sống: cập nhật sau mỗi giai đoạn.

## 1. Tầm nhìn

Xây dựng một **thế giới game RPG 2D pixel-art phong cách kiếm hiệp** hoàn chỉnh,
chơi được trên trình duyệt — bắt đầu từ Tây Tùy Đài, mở rộng ra cả một đại lục
với nhiều vùng đất, nhân vật, nhiệm vụ và câu chuyện.

**Không** làm MMORPG multiplayer. Mục tiêu là single-player giàu khám phá,
cốt truyện và không khí — như những game RPG cổ điển.

## 2. Nguyên tắc làm việc

1. **Mỗi giai đoạn đều chơi được.** Không có giai đoạn "xây xong mới chơi được".
2. **Nhỏ mà chắc:** thêm một vùng đất thì vùng đó phải có NPC, nhiệm vụ, bí mật.
3. **Tài sản tái sử dụng:** sprite, tile, nhạc làm một lần, dùng nhiều nơi.
4. **Anh quyết định, em thực hiện:** mọi asset mới đều cho anh xem trước khi chốt.

## 3. Kiến trúc kỹ thuật hiện tại

| Thành phần | Mô tả |
|---|---|
| `index.html` | Khung game + UI hội thoại |
| `game.js` | Engine tự viết: di chuyển, camera, va chạm, NPC, hội thoại, animation |
| `assets_*.js` | Sprite pixel-art nhúng base64 (nhân vật, môi trường) |
| `build_*.py` | Script xử lý sprite: tách nền trắng, cắt, resize, nén webp |
| `.github/workflows/deploy.yml` | Tự động deploy lên GitHub Pages khi push `main` |

**Hướng phát triển kỹ thuật:**
- Chuyển bản đồ sang **tilemap** (mảng 2D) thay vì vẽ tay từng vật — dễ mở rộng.
- Tách `game.js` thành module: `engine.js`, `dialogue.js`, `quest.js`, `audio.js`.
- Dữ liệu thế giới (map, NPC, quest) đưa vào file JSON riêng, code chỉ đọc.

## 4. Các giai đoạn

### G0 — Prototype Tây Tùy Đài ✅ (hoàn thành)
- [x] Bản đồ đi dạo được: hồ sen, suối, cầu đá, rừng phong, rừng anh đào, đèn đá
- [x] Nhân vật: Nguyên (đồ nhi), Sư Phụ Yixuan
- [x] Animation: đi bộ 4 khung, vẫy tay, cười, nói
- [x] Hội thoại với sư phụ (4 câu)
- [x] Deploy tự động qua GitHub Pages

### G1 — Tây Tùy Đài sống động
Mục tiêu: khu vực đầu tiên **thật sự sống** — có người, có việc để làm.
- Thêm 3 NPC: Đại sư huynh Thiết Ngưu, Tiểu sư muội Linh Nhi, Tiều phu Thạch Đầu
- NPC có lịch trình đơn giản (đứng, đi lại quanh quẩn, ngủ tối)
- **Quest log UI**: nhận/trả nhiệm vụ, theo dõi tiến độ
- 3 nhiệm vụ mở đầu (xem `WORLD.md`)
- Thêm tile: cổng núi, nhà tranh, bàn đá, lu nước
- Âm thanh cơ bản bằng WebAudio (tiếng bước chân, tiếng suối, nhạc nền sáo)

### G2 — Hệ thống lõi
Mục tiêu: nền móng để mở rộng thế giới.
- Tilemap editor bằng tay (định nghĩa map bằng mảng ký tự)
- Chuyển cảnh giữa các bản đồ (cổng dịch chuyển)
- Ngày/đêm + thời tiết nhẹ (mưa, lá rơi)
- Lưu game (localStorage): vị trí, nhiệm vụ, vật phẩm
- Hệ thống hội thoại nhiều nhánh (lựa chọn câu trả lời)

### G3 — Mở rộng thế giới
Mục tiêu: 5 vùng đất mới từ bản đồ thế giới, mỗi vùng có bản sắc riêng.
- Rừng Phong Đỏ (đông) — lá phong, tiều phu, nhiệm vụ hái lá
- Rừng Trúc (tây) — tiếng sáo, Linh Nhi, mê cung trúc
- Sa Mạc Vàng (nam) — thương đội, ốc đảo, bão cát
- Núi Tuyết (bắc) — thí luyện, Tuyết Liên, Bà Bà
- Đảo Núi Lửa (ngoài khơi) — dị biến, chương cuối chương 1
- Mỗi vùng: 2-4 NPC, 2-3 nhiệm vụ, 1 bí mật ẩn

### G4 — Chiều sâu gameplay
Mục tiêu: game có "chơi" thật sự, không chỉ đi dạo.
- Chiến đấu đơn giản theo lượt hoặc real-time nhẹ (đánh thường + 3 chiêu thức)
- Quái vật theo vùng (khỉ đá, sói tuyết, bò cạp cát…)
- Vật phẩm & trang bị: kiếm gỗ → kiếm sắt → bảo kiếm; đan dược hồi máu
- Cửa hàng của Hồ Lão (mua/bán)
- Cấp độ & kinh nghiệm cơ bản

### G5 — Cốt truyện & polish
Mục tiêu: ra mắt "Chương 1" hoàn chỉnh.
- Cốt truyện chính 8 nhiệm vụ nối liền (xem `WORLD.md`)
- Intro mở đầu game (đồ nhi lên núi bái sư)
- Nhạc nền từng vùng, hiệu ứng âm thanh đầy đủ
- Hỗ trợ cảm ứng cho mobile
- Màn hình title, credit

## 5. Tiêu chí "xong" của mỗi giai đoạn

- Chơi được từ đầu đến cuối không lỗi blocker
- Anh chơi thử và gật đầu
- Docs cập nhật (giai đoạn xong → đánh dấu trong `CHECKLIST.md`)

## 6. Rủi ro & cách xử lý

| Rủi ro | Cách xử lý |
|---|---|
| Scope phình to | Mỗi giai đoạn chốt phạm vi trước khi làm, không thêm giữa chừng |
| Sprite không đồng bộ | Giữ nguyên style guide: chibi, 16-bit, cùng palette màu |
| Code rối khi lớn dần | Tách module ở G2, dữ liệu hóa (JSON) thay vì hard-code |
| Mất hứng giữa chừng | Luôn có bản chơi được để anh "sờ" thấy tiến độ |
