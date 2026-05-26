# Roadmap — docx2quiz

> Mục tiêu: Biến tài liệu học khô khan thành quiz tương tác, publish lên Android & iOS Store, monetize qua bán bộ đề và khóa học theo yêu cầu.

---

## ✅ Phase 1 — MVP (ĐÃ HOÀN THÀNH)

### Admin Web
- [x] Admin shell: sidebar 232px, topbar, nav (Tổng quan / Ngân hàng / Convert / Bộ đề / Người dùng)
- [x] Dashboard: 4 KPI cards (Bộ đề, Câu hỏi, Lượt thi, Bộ đề thi), recent banks, CTA card
- [x] Convert wizard 3 bước: upload DOCX → rule config → preview 5 câu → tạo ngân hàng
- [x] **Smart DOCX parser** (`parseQuizDocxStyled.ts`): đọc XML style — bold, italic, màu chữ, font, cỡ chữ → tự nhận diện đáp án đúng
- [x] Rule config UI: font, cỡ chữ, màu hex, checkbox bold/italic
- [x] Review & tạo bộ đề (bước 3): xem câu hỏi đã parse, tạo `ExamVariant` với shuffle
- [x] Quản lý ngân hàng câu hỏi (`/admin/banks`)
- [x] Design system: CSS custom properties tokens (13 palettes × light/dark), primitives (Btn, Card, Badge, Input, Avatar…)
- [x] Auth: cookie session (web) + Bearer token (API)

### Mobile (Expo)
- [x] Login screen — themed, error handling
- [x] Exam list — catalog với status (Bắt đầu / Đang thi / Đậu / Rớt), pull-to-refresh
- [x] Taking exam (single-answer): timer đổi màu (warning < 5min, danger < 1min), next/prev, auto-submit khi hết giờ
- [x] Result screen: pass/fail với màu success/danger, retry

### Backend API
- [x] REST API v1 đầy đủ: auth, catalog, variants, attempts (create/patch/submit/retry)
- [x] CORS middleware cho `/api/v1/*`
- [x] Prisma schema: User, Session, Category, QuestionBank, Question, Exam, ExamVariant, Attempt

---

## ✅ Vừa hoàn thành — Phone Register

- [x] Schema: thêm `phone String? @unique` + `name String @default("")`, `email` thành optional
- [x] `authService`: `loginWithCredentials(identifier)` — thử phone trước, email fallback (admin)
- [x] `authService`: `registerUser(phone, name, password)` mới
- [x] API `POST /api/v1/auth/login` — accept `phone`, `email`, hoặc `identifier`
- [x] API `POST /api/v1/auth/register` — phone + name + password → tạo user + trả token
- [x] Web `/login` — đổi field sang SĐT, thêm link → `/register`
- [x] Web `/register` — form Họ tên / SĐT / Mật khẩu, validate, error display
- [x] Mobile `login.tsx` — đổi field sang SĐT, thêm link → register
- [x] Mobile `register.tsx` — màn hình đăng ký mới, client-side validate, gọi API register
- [x] Logo SVG `LogoMark` + `LogoFull` — document + check badge, dùng CSS vars
- [x] Logo thay thế Sparkles placeholder trên web login, register, admin sidebar
- [x] Seed: admin dùng email, user demo dùng phone (`0900000001`)

---

## 🔧 Phase 2 — UX Hoàn Chỉnh (ƯU TIÊN CAO)

> Mục tiêu: App đủ điều kiện submit lên Store, UX hoàn chỉnh theo design prototype.

### Mobile
- [ ] **Register screen** (`MobRegister`) — tên, email, password, confirm password
- [ ] **Home screen** (`MobHome`) — greeting + avatar, CTA "Tiếp tục học", danh sách categories/recommended, bottom tab bar
- [ ] **Bottom tab bar** — Trang chủ / Bộ đề / Lịch sử / Tài khoản (4 tabs)
- [ ] **History screen** — danh sách các lần thi đã qua, filter theo trạng thái
- [ ] **Account/Profile screen** — đổi theme palette, toggle dark mode, đăng xuất
- [ ] **Multi-answer questions** — checkbox multi-select variant (design: `MobTakingExam variant="multi"`)
- [ ] **Local resume** — lưu tiến độ local nếu mất mạng giữa chừng
- [ ] **Confirmation sheet** trước khi nộp bài — list câu chưa trả lời

### Admin Web
- [ ] **Register admin** (`/register`) — tạo tài khoản biên tập viên mới (hiện chỉ có seed)
- [ ] **User management** (`/admin/users`) — CRUD: list, invite, phân quyền (ADMIN/USER), deactivate
- [ ] **Admin responsive** — sidebar collapse thành icon-only < 960px, hamburger < 768px
- [ ] **Dark mode** — toggle trên topbar, lưu vào user preferences
- [ ] **Full KPI dashboard** — biểu đồ lượt thi theo ngày, tỷ lệ đậu/rớt, top bộ đề

### Schema Updates cần cho Phase 2
```prisma
model User {
  themePalette String  @default("indigo")
  themeDark    Boolean @default(false)
  // ...
}
```

### Assets
- [ ] Illustrations kết quả (pass/fail) thay thế emoji hiện tại
- [ ] Logo thật thay placeholder Sparkles
- [ ] App icon + splash screen cho Expo

---

## 💰 Phase 3 — Monetization (BUSINESS CORE)

> Mục tiêu: Thu được tiền. User phải mua gói mới vào được đề thi.

### Data Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String                        // "Gói đấu thầu cơ bản"
  price       Int                           // VND, e.g. 50000
  description String?
  examIds     String[]                      // danh sách Exam được truy cập
  createdAt   DateTime @default(now())
}

model Purchase {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(...)
  productId   String
  product     Product  @relation(...)
  paidAt      DateTime @default(now())
  expiresAt   DateTime?                     // null = vĩnh viễn
  note        String?                       // "Chuyển khoản 50k - admin confirm"
}
```

### Features
- [ ] **Gating**: check `Purchase` trước khi cho vào `ExamVariant` (API + web)
- [ ] **Admin: quản lý Products** — tạo gói, set giá, gắn exam vào gói
- [ ] **Admin: confirm purchase thủ công** — user chuyển khoản → admin mark paid
- [ ] **Mobile: Paywall screen** — "Gói này tốn 50.000đ — Mua ngay / Liên hệ admin"
- [ ] **Donate flow** — link/button donate tự do (Ko-fi, MoMo, bank QR)

### Payment Integration (sau khi manual flow ổn định)
- [ ] MoMo hoặc ZaloPay SDK (phù hợp thị trường VN)
- [ ] Webhook tự động confirm purchase

---

## 📄 Phase 4 — Smart Converter Mở Rộng

> Mục tiêu: Hỗ trợ thêm định dạng, tăng độ chính xác nhận diện đáp án.

### PDF Support
- [ ] Tích hợp `pdfjs-dist` hoặc `pdf-parse` vào pipeline converter
- [ ] Detect đáp án đúng qua font-weight/color trong PDF content stream
- [ ] Admin UI: upload `.pdf` song song `.docx` ở bước 1 convert wizard

### DOCX Parser Nâng Cao
- [ ] Detect đáp án đúng qua **highlight màu nền** (shading `<w:shd>`) — hiện chưa xử lý
- [ ] Detect đáp án qua **ký tự marker** đầu option (✓, *, •)
- [ ] Support câu hỏi nhiều đáp án đúng trong DOCX (multi-answer)
- [ ] Tự động suggest rule dựa vào thống kê style của file (rule auto-detect)

---

## 🚀 Phase 5 — Store Publishing & Growth

> Mục tiêu: App có mặt trên Google Play và App Store.

### EAS Build Setup
- [ ] `eas.json` với 3 profile: `development`, `preview`, `production`
- [ ] `app.json`: bundle ID (`com.docx2quiz.app`), version, permissions
- [ ] Android: keystore quản lý qua EAS
- [ ] iOS: provisioning profile + certificates qua EAS

### Store Checklist
- [ ] Privacy policy page (bắt buộc cho cả 2 store)
- [ ] Screenshots 3 device sizes cho mỗi platform
- [ ] Store listing text (VI + EN)
- [ ] Content rating questionnaire

### Engagement
- [ ] Push notifications — nhắc ôn bài, thông báo bộ đề mới (Expo Notifications)
- [ ] **Custom course request flow** — user submit form (tên khóa, file tài liệu, contact) → admin nhận email → quote giá → confirm → admin convert

---

## 📋 Priority Matrix

| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Mobile Register + Home + Tabs | 🔴 Store blocker | M | **P0** |
| EAS Build config | 🔴 Store blocker | S | **P0** |
| Paywall + Purchase model | 🟠 Revenue | M | **P1** |
| Admin User management | 🟠 Ops | M | **P1** |
| PDF converter | 🟡 Converter value | L | **P2** |
| Dark mode | 🟡 Polish | S | **P2** |
| Multi-answer questions | 🟡 Feature | M | **P2** |
| MoMo/ZaloPay integration | 🟢 Auto payment | L | **P3** |
| Push notifications | 🟢 Growth | M | **P3** |
| DOCX highlight/marker detect | 🟢 Accuracy | M | **P3** |
