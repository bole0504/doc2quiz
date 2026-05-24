## docx2quiz (MVP)

App Next.js (App Router) để Admin upload file `.docx` (câu hỏi + A/B/C/D), parse thành ngân hàng câu hỏi, tạo “bộ đề” (variants đã trộn), và User đăng nhập để thi thử + lưu tiến độ/kết quả.

## Getting Started

### 1) Cài đặt

```bash
cd web
npm i
```

### 2) DB + seed admin

```bash
cd web
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
```

Tài khoản mặc định (có thể đổi trong `.env`):
- `APP_SEED_ADMIN_EMAIL=admin@example.com`
- `APP_SEED_ADMIN_PASSWORD=admin123`
- `APP_SEED_USER_EMAIL=user@example.com`
- `APP_SEED_USER_PASSWORD=user123`

### 3) Chạy dev server

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Luồng sử dụng

- Admin: vào `/admin` → bấm `+ Cấu hình bộ câu hỏi (DOCX)` để tạo ngân hàng → click vào ngân hàng → chỉnh đáp án/điểm liệt + tạo “bộ đề” ngay trong trang ngân hàng.
- User: vào `/quiz` → chọn ngân hàng → chọn bộ đề/bộ trộn → làm bài → xem trạng thái Đang thi / Rớt / Đậu, có thể thi lại.

### Format DOCX đang hỗ trợ (MVP)

- Mỗi câu bắt đầu bằng: `Câu N: ...`
- 4 dòng đáp án: `A: ...`, `B: ...`, `C: ...`, `D: ...`
- Nếu trong option có `Đáp án: X` thì hệ thống sẽ tự bắt được correct option; còn lại Admin set thủ công.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
