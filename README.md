# 🍅 Pomodoro — Focus Timer

Ứng dụng **Pomodoro** đầy đủ chức năng, thiết kế ưu tiên cho điện thoại (mobile-first PWA). Cài được vào màn hình chính, chạy offline, không cần internet sau lần tải đầu.

![icon](icons/icon-192.png)

## ✨ Tính năng

- ⏱ **3 chế độ**: Pomodoro (25p), Nghỉ ngắn (5p), Nghỉ dài (15p) — tự đổi màu giao diện theo chế độ.
- 🔄 **Tự động chuyển phiên**: tự bắt đầu giờ nghỉ / giờ tập trung (bật trong Cài đặt).
- 🎯 **Vòng tròn đếm ngược** mượt mà, đồng hồ chính xác cả khi app chạy nền.
- 🏁 **Mục tiêu hằng ngày** với thanh tiến độ và chúc mừng khi đạt mục tiêu.
- ✅ **Quản lý công việc**: thêm, **sửa, đổi ước lượng, sắp xếp lại, xoá**; chọn việc đang làm, tự tăng tiến độ, ước tính giờ hoàn thành.
- 📊 **Thống kê nâng cao**: pomodoro hôm nay, thời gian tập trung, chuỗi ngày, **chuỗi dài nhất, tổng tuần**, tổng cộng và biểu đồ 7 ngày.
- 🔊 **Âm thanh nền** tạo bằng WebAudio: ồn trắng / nâu / hồng / tiếng mưa.
- 🔔 **Chuông báo** 4 kiểu (bíp / chuông gió / chuông / kỹ thuật số), **tiếng tích tắc**, rung, thông báo hệ thống.
- 📱 **Giữ màn hình sáng** khi đồng hồ chạy (Screen Wake Lock).
- 🎉 **Hiệu ứng pháo giấy** khi hoàn thành mỗi pomodoro.
- 🌐 **Đa ngôn ngữ** (Tiếng Việt / English) chuyển ngay tức thì.
- 🎨 **7 bảng màu** + chế độ **Sáng / Tối / Tự động** theo hệ thống.
- 💾 **Sao lưu / khôi phục** toàn bộ dữ liệu dưới dạng JSON.
- 💬 **Câu trích dẫn động** truyền cảm hứng.
- 📲 **PWA**: cài vào màn hình chính, chạy offline (Service Worker), có **lối tắt** (tập trung / thống kê).
- ⌨️ **Phím tắt** (desktop): `Space` chạy/dừng, `S` bỏ qua, `R` đặt lại.

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
