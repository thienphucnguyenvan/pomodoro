# 🍅 Pomodoro — Focus Timer

Ứng dụng **Pomodoro** đầy đủ chức năng, thiết kế ưu tiên cho điện thoại (mobile-first PWA). Cài được vào màn hình chính, chạy offline, không cần internet sau lần tải đầu.

![icon](icons/icon-192.png)

## ✨ Tính năng

- ⏱ **3 chế độ**: Pomodoro (25p), Nghỉ ngắn (5p), Nghỉ dài (15p) — tự đổi màu giao diện theo chế độ.
- 🔄 **Tự động chuyển phiên**: tự bắt đầu giờ nghỉ / giờ tập trung (bật trong Cài đặt).
- 🎯 **Vòng tròn đếm ngược** mượt mà, đồng hồ chính xác cả khi app chạy nền.
- ✅ **Quản lý công việc**: thêm việc, ước lượng số pomodoro, đánh dấu việc đang làm, tự tăng tiến độ khi hoàn thành 1 pomodoro, ước tính thời gian hoàn thành.
- 📊 **Thống kê**: pomodoro hôm nay, thời gian tập trung, chuỗi ngày liên tiếp, tổng cộng và biểu đồ 7 ngày.
- 🔔 **Thông báo & âm thanh**: chuông báo (WebAudio), rung, thông báo hệ thống.
- 🌙 **Chế độ tối** và lưu mọi thiết lập/dữ liệu trên máy (localStorage).
- 📲 **PWA**: cài vào màn hình chính, hoạt động offline qua Service Worker.
- ⌨️ **Phím tắt** (desktop): `Space` chạy/dừng, `S` bỏ qua.

## 🚀 Chạy thử

Vì là web tĩnh, chỉ cần một máy chủ tĩnh bất kỳ:

```bash
# Python
python3 -m http.server 8080

# hoặc Node
npx serve .
```

Mở `http://localhost:8080` trên trình duyệt. Trên điện thoại, mở link và chọn **"Thêm vào màn hình chính"** để cài như một app.

## 📂 Cấu trúc

```
index.html      # Giao diện
styles.css      # Thiết kế mobile-first, dark mode, animation
app.js          # Toàn bộ logic: timer, tasks, stats, settings, PWA
manifest.json   # Cấu hình PWA
sw.js           # Service Worker (offline cache)
icons/          # Bộ icon (SVG + PNG, maskable)
```

## 🛠 Công nghệ

HTML + CSS + JavaScript thuần (không framework, không build step). Dữ liệu lưu cục bộ bằng `localStorage`. Đồng hồ dùng timestamp tuyệt đối nên không bị lệch khi trình duyệt giảm tốc tab nền.

---

Made with 🍅 for focused work.
