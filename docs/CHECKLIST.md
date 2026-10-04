# Checklist phát triển

> Đánh dấu `[x]` khi xong. Mỗi giai đoạn xong → chơi thử → anh gật đầu → sang giai đoạn tiếp.

## G0 — Prototype Tây Tùy Đài ✅

- [x] Bản đồ Tây Tùy Đài đi dạo được
- [x] Nhân vật Nguyên + Sư Phụ Yixuan
- [x] Animation: đi bộ, vẫy tay, cười, nói
- [x] Hội thoại 4 câu với sư phụ
- [x] Deploy tự động GitHub Pages

## G1 — Tây Tùy Đài sống động

### NPC mới
- [ ] Sprite Thiết Ngưu (đại sư huynh)
- [ ] Sprite Linh Nhi (tiểu sư muội)
- [ ] Sprite Thạch Đầu (tiều phu)
- [ ] NPC đi lại đơn giản (waypoint quanh quẩn)
- [ ] NPC có 2-3 câu thoại riêng khi bắt chuyện

### Nhiệm vụ & UI
- [ ] Quest log UI (phím J: xem nhiệm vụ đang làm)
- [ ] NV phụ 1: *Bữa trưa của sư huynh* (tìm 3 củ khoai)
- [ ] NV phụ 2: *Củi cho Thạch Đầu* (nhặt 5 khúc củi ở rừng phong)
- [ ] Hội thoại nhiều lựa chọn (đồng ý / từ chối / hỏi thêm)

### Cảnh vật & âm thanh
- [ ] Tile: cổng núi, nhà tranh, bàn đá, lu nước, hàng rào trúc
- [ ] Tiếng bước chân, tiếng suối (WebAudio, không cần file nhạc)
- [ ] Nhạc nền sáo đơn giản lặp lại

## G2 — Hệ thống lõi

### Tilemap & chuyển cảnh
- [ ] Định nghĩa map bằng mảng ký tự (thay vẽ tay)
- [ ] Cổng chuyển cảnh giữa các bản đồ (hiệu ứng fade)
- [ ] Tách `game.js` thành module: engine / dialogue / quest / audio

### Thế giới sống
- [ ] Ngày/đêm (màn hình tối dần, đèn đá sáng lên)
- [ ] Thời tiết nhẹ: mưa, lá phong rơi theo vùng
- [ ] Lưu game localStorage (vị trí, quest, vật phẩm) + nút Lưu/Tải

### Dữ liệu hóa
- [ ] NPC, hội thoại, nhiệm vụ đưa vào file JSON riêng
- [ ] Thêm NPC mới không cần sửa code

## G3 — Mở rộng thế giới (5 vùng)

### Rừng Phong Đỏ
- [ ] Map rừng phong + Cây Phong Cổ Thụ
- [ ] NV chính 2: *Lá phong đỏ* (hái 5 lá)
- [ ] NV phụ: *Linh hồn thủ rừng* (chỉ xuất hiện đêm trăng)
- [ ] Quái: khỉ đá (G4 mới đánh được, giờ chỉ hiện ra)

### Rừng Trúc
- [ ] Map rừng trúc + mê cung trúc
- [ ] NV chính 3: *Tiếng sáo trong trúc* (gặp Linh Nhi)
- [ ] NV phụ: *Sáo gãy* (tìm trúc tía)

### Sa Mạc Vàng
- [ ] Map sa mạc + ốc đảo + tàn tích
- [ ] NV chính 5: *Thương đội gặp nạn* (hộ tống Hồ Lão)
- [ ] Hiệu ứng bão cát giảm tầm nhìn
- [ ] Vật phẩm: xẻng (đào tàn tích)

### Núi Tuyết
- [ ] Map núi tuyết + am tranh Bà Bà
- [ ] NV chính 6: *Thí luyện Tuyết Sơn* (hái Tuyết Liên)
- [ ] Đường trơn: nhân vật trượt nhẹ khi đi trên băng

### Đảo Núi Lửa
- [ ] Map đảo + dung nham (chạm vào mất máu)
- [ ] NV chính 7: *Dị biến đảo lửa*
- [ ] Thuyền của Hồ Lão (đi lại giữa đảo và đất liền)

## G4 — Chiều sâu gameplay

### Chiến đấu
- [ ] Đánh thường (phím Space) + 3 chiêu thức (1/2/3)
- [ ] Quái theo vùng: khỉ đá, rắn trúc, bò cạp cát, sói tuyết, quái nham thạch
- [ ] Boss chương 1: **Hỏa Ma** ở đảo núi lửa
- [ ] Máu, năng lượng, cấp độ, kinh nghiệm

### Vật phẩm & kinh tế
- [ ] Túi đồ UI (phím I)
- [ ] Chuỗi kiếm: gỗ → sắt → hàn thiết → tuyết liên
- [ ] Cửa hàng Hồ Lão (mua/bán)
- [ ] Tiền: đồng xu rơi từ quái và nhiệm vụ

## G5 — Cốt truyện & polish (Chương 1 hoàn chỉnh)

### Cốt truyện
- [ ] NV chính 4: *Cầu đá gãy* (nối giữa NV3 và NV5)
- [ ] NV chính 8: *Đại hội võ lâm* ở Hoàng Cung
- [ ] Intro mở đầu: đồ nhi lên núi bái sư (cảnh phim ngắn)
- [ ] Ending chương 1 + teaser chương 2

### Hoàn thiện
- [ ] Nhạc nền riêng từng vùng
- [ ] Hiệu ứng âm thanh đầy đủ
- [ ] Hỗ trợ cảm ứng (mobile): joystick ảo + nút bấm
- [ ] Màn hình title + credit
- [ ] Chơi thử toàn bộ từ đầu đến cuối, sửa lỗi

---

## Ghi chú tiến độ

| Ngày | Việc xong |
|---|---|
| 2026-10-05 | G0 hoàn thành: prototype + repo + Pages + full bộ hành động |
| | |
