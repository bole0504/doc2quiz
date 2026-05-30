# Manual Test Cases — docx2quiz

> Phiên bản: Phase 2 hoàn thành  
> Cập nhật: 2026-05-26

Chạy test sau mỗi deploy hoặc khi merge code mới. Đánh dấu ✅/❌ và ghi note nếu fail.

---

## 1. Auth — Web

### 1.1 Đăng ký (Web `/register`)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Mở `/register` | Hiện form: Họ và tên / Số điện thoại / Mật khẩu |
| 2 | Submit form rỗng | Không submit (HTML5 required) |
| 3 | Nhập SĐT sai định dạng (`123`) → Submit | Báo lỗi "Số điện thoại không hợp lệ (10 số, bắt đầu 0)" |
| 4 | Nhập đúng (tên: "Test User", SĐT: `0912345678`, pass: `test123`) → Submit | Redirect về `/quiz` (hoặc home) |
| 5 | Đăng ký lại SĐT `0912345678` | Báo lỗi "Số điện thoại đã được đăng ký" |

### 1.2 Đăng nhập (Web `/login`)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Mở `/login` | Hiện field SĐT + mật khẩu |
| 2 | Nhập SĐT `0912345678` + đúng pass → Submit | Redirect thành công |
| 3 | Nhập SĐT đúng + sai pass | Báo lỗi "Số điện thoại hoặc mật khẩu không đúng" |
| 4 | Admin login bằng email `admin@docx2quiz.com` + pass | Redirect vào `/admin/dashboard` |
| 5 | Truy cập `/admin` khi chưa login | Redirect về `/login` |

### 1.3 Đăng xuất

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Click "Đăng xuất" trong admin sidebar | Session xoá, redirect về `/login` |

---

## 2. Auth — Mobile (Expo)

### 2.1 Đăng ký (Mobile)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Mở app → tab "Chưa có tài khoản? Đăng ký" | Màn hình register hiện |
| 2 | Submit rỗng | Alert "Vui lòng nhập đủ thông tin" |
| 3 | SĐT sai định dạng (`abc`) → Submit | Alert "Số điện thoại không hợp lệ" |
| 4 | Đúng thông tin → Submit | Đăng nhập luôn, vào `/(tabs)` |
| 5 | Đăng ký SĐT đã tồn tại | Alert từ server |

### 2.2 Đăng nhập (Mobile)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Mở app khi chưa login | Màn hình login |
| 2 | SĐT + đúng pass → Đăng nhập | Vào tab Trang chủ |
| 3 | Sai pass | Alert lỗi |
| 4 | Tắt app → mở lại khi đã login | Tự động vào `/(tabs)`, không cần login lại |

---

## 3. Mobile — Tab Bar

| # | Tab | Kiểm tra |
|---|-----|---------|
| 1 | **Trang chủ** | Hiện greeting đúng (Buổi sáng/chiều/tối theo giờ), tên user |
| 2 | **Bộ đề** | Hiện danh sách exam với status (Bắt đầu/Đang thi/Đậu/Rớt) |
| 3 | **Lịch sử** | Hiện các lần thi đã qua, empty state nếu chưa thi |
| 4 | **Tài khoản** | Hiện tên, SĐT, role |
| 5 | Tab active | Icon + label đổi màu theo primary palette |

---

## 4. Mobile — Trang chủ (Home)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Chưa có lần thi nào | CTA "Bắt đầu ôn thi" màu primary |
| 2 | Đang có attempt chưa xong | CTA "Tiếp tục học" với tên exam |
| 3 | Click CTA "Tiếp tục học" | Vào màn hình thi đúng variant |
| 4 | Danh sách banks | Hiện tên bank + chips exam (Bắt đầu/Đang thi/…) |
| 5 | Click chip exam | Vào màn hình thi |

---

## 5. Mobile — Làm bài thi

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào exam mới | Câu 1/N, 4 lựa chọn, nút "Tiếp theo" disabled |
| 2 | Chọn một đáp án | Nút "Tiếp theo" enable, option highlight màu primary |
| 3 | Click "Tiếp theo" | Lưu đáp án, sang câu tiếp theo |
| 4 | Câu cuối cùng | Nút đổi thành "Nộp bài" màu đỏ |
| 5 | Có timer (nếu exam có time limit) | Đồng hồ đếm ngược, chuyển vàng <5 phút, đỏ <1 phút |
| 6 | Câu > 1 → "← Trước" xuất hiện | Click quay lại câu trước (router.back) |
| 7 | Click "Nộp bài" khi còn câu chưa làm | Alert: hiện số câu đã làm / tổng + cảnh báo |
| 8 | Click "Nộp bài" khi đã làm hết | Alert: xác nhận nộp |
| 9 | Confirm nộp | Redirect kết quả (score, status Đậu/Rớt) |
| 10 | Hết giờ tự động | Submit tự động, redirect kết quả |

---

## 6. Mobile — Lịch sử thi

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào tab Lịch sử sau khi thi | Hiện entry mới nhất lên đầu |
| 2 | Badge status | "Đậu" xanh / "Rớt" đỏ / "Đang thi" vàng |
| 3 | Chưa có lần thi nào | Empty state với icon + text |

---

## 7. Mobile — Tài khoản & Theme

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào tab Tài khoản | Hiện tên, SĐT (hoặc email nếu admin), role badge |
| 2 | Toggle Dark Mode | App chuyển dark/light ngay lập tức |
| 3 | Tắt app → mở lại | Dark mode giữ nguyên trạng thái |
| 4 | Chọn palette khác (vd: "rose") | Tất cả màu primary/accent đổi ngay |
| 5 | Tắt app → mở lại | Palette giữ nguyên |
| 6 | Click "Đăng xuất" | Về màn hình login, token xóa |

---

## 8. Admin Web — Dashboard

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào `/admin/dashboard` với tài khoản ADMIN | Hiện 4 KPI cards |
| 2 | Vào với tài khoản USER | Redirect hoặc "Không có quyền" |

---

## 9. Admin Web — Convert (Tạo ngân hàng đề)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào `/admin/convert` | Bước 1: form upload DOCX |
| 2 | Upload file `.docx` hợp lệ | Preview 5 câu đầu, có thể chọn rule |
| 3 | Nhấn "Tạo ngân hàng" | Redirect `/admin/banks/{id}` |
| 4 | Upload file không phải docx | Lỗi hoặc parse rỗng |

---

## 10. Admin Web — Quản lý ngân hàng đề (`/admin/banks`)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | List tất cả banks | Hiện tên, số câu, ngày tạo |
| 2 | Click vào bank | Vào `/admin/banks/{id}` — list câu hỏi |
| 3 | Edit câu hỏi: đổi đáp án đúng | Lưu ngay, không reload toàn trang |
| 4 | Xóa câu hỏi | Biến khỏi list |
| 5 | Xóa bank | Redirect về `/admin/banks` |

---

## 11. Admin Web — Quản lý người dùng (`/admin/users`)

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Vào `/admin/users` | Hiện list user với avatar, tên, SĐT/email, role, số lần thi |
| 2 | User đang login | Badge "Bạn", không có nút thao tác |
| 3 | Click "↑" nâng user lên Admin | Role đổi thành "Admin" badge xanh |
| 4 | Click "↓" hạ admin xuống user | Role đổi thành "User" |
| 5 | Click "×" xóa user | User biến khỏi list |
| 6 | Xóa chính mình | Không hiện nút xóa (self-protection) |

---

## 12. Admin Web — Responsive

| # | Viewport | Kết quả mong đợi |
|---|----------|-----------------|
| 1 | ≥1280px | Sidebar đầy đủ (232px): logo + text + nav label + user card |
| 2 | 768–1279px | Sidebar icon-only (64px): chỉ icon, tooltip on hover |
| 3 | <768px | Sidebar ẩn, hiện hamburger ☰ ở topbar |
| 4 | <768px → click ☰ | Drawer slide-in từ trái, overlay đen mờ |
| 5 | Click overlay hoặc ✕ | Drawer đóng |

---

## 13. Admin Web — Dark Mode

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Click icon 🌙 trên topbar | Toàn bộ UI đổi sang dark |
| 2 | Reload trang | Vẫn giữ dark (lưu localStorage) |
| 3 | Click icon ☀️ | Trở về light mode |

---

## 14. API v1 — Smoke Test (curl/Postman)

```bash
BASE=http://localhost:3000

# Register
curl -X POST $BASE/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"0911222333","name":"API Test","password":"test123"}'
# → { token, user, expiresAt }

# Login
TOKEN=$(curl -s -X POST $BASE/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0911222333","password":"test123"}' | jq -r .token)

# Me
curl $BASE/api/v1/me -H "Authorization: Bearer $TOKEN"
# → { id, name, phone, email, role }

# History
curl $BASE/api/v1/history -H "Authorization: Bearer $TOKEN"
# → [ ...attempts ]

# Catalog
curl $BASE/api/v1/catalog -H "Authorization: Bearer $TOKEN"
# → [ { category, exams: [...] } ]
```

---

## 15. Regression — Phone + Email dual login

| # | Bước | Kết quả mong đợi |
|---|------|-----------------|
| 1 | Login web với email `admin@docx2quiz.com` | Thành công |
| 2 | Login web với SĐT `0900000001` (user demo) | Thành công |
| 3 | Login mobile với SĐT `0900000001` | Thành công |
| 4 | Mobile không có field email | Không yêu cầu email |

---

## ✅ Phase 2 Sign-off Checklist

- [ ] Tất cả test cases Section 1–14 chạy pass
- [ ] TypeScript `tsc --noEmit` = 0 errors (web + mobile)
- [ ] Không có `console.error` khi dùng bình thường
- [ ] Dark mode hoạt động trên cả web admin và mobile
- [ ] Responsive admin sidebar hoạt động ở 3 breakpoint
- [ ] User management: không thể xóa/sửa chính mình
