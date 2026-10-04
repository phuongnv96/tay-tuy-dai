# Tây Tùy Đài

Thế giới game 2D pixel-art phong cách kiếm hiệp của Siu — bắt đầu từ Tây Tùy Đài,
nơi đồ nhi bái sư.

## Chơi thử

Bản prototype chạy hoàn toàn bằng HTML5 Canvas, không cần cài đặt:

- Mở `index.html` trên trình duyệt, hoặc chạy `python3 -m http.server` rồi vào `http://localhost:8000`
- **WASD / phím mũi tên**: di chuyển đồ nhi
- **E**: nói chuyện với Sư Phụ Yixuan khi đứng gần

## Triển khai

Repo này tự động deploy lên GitHub Pages mỗi khi push lên nhánh `main`
(workflow `.github/workflows/deploy.yml`). Lần đầu cần bật Pages trong
**Settings → Pages → Source: GitHub Actions**.

## Cấu trúc

- `index.html` — khung game + hộp thoại
- `game.js` — logic game (di chuyển, va chạm, NPC, hội thoại)
- `assets.js` — sprite pixel-art nhúng base64 (tự sinh từ `build_assets.py`)
- `build_assets.py` — xử lý sprite gốc: tách nền trắng, cắt, resize
