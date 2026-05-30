# Handoff: doc2quiz

## Overview

**doc2quiz** is a tool that turns Word (`.docx`) documents containing exam questions into structured question banks and deliverable exams. The product has two surfaces:

1. **Admin / editor web app** (desktop) — for content editors and administrators. Manages question banks, runs the conversion flow (upload `.docx` → configure detection rules → preview 5 sample questions → extract all → build exam sets), and manages users.
2. **Mobile learner app** (iOS + Android) — for students taking exams on phones. Browse exam sets, take exams (single-answer and multiple-answer questions), see pass/fail results.

The UI copy is in **Vietnamese** (the product is targeted at Vietnamese users — e.g. driving-license practice exams).

## About the Design Files

The files in this bundle (`prototype/`) are **design references created in HTML + React + Babel-in-the-browser**. They are prototypes showing intended look and behavior — **not production code to copy directly**.

The task is to **recreate these designs in the target codebase's environment**:

- **Admin web** → use the existing web stack (React/Next.js/Vue/etc.) and its established UI library, routing, and state-management patterns.
- **Mobile** → use the existing mobile stack (React Native / SwiftUI + Jetpack Compose / Flutter / etc.). The iOS and Android mocks are intentionally near-identical in layout; they differ only in chrome (status bar, nav bar, system fonts).
- If no environment exists yet, pick the most appropriate framework and implement there.

Reference the prototype files in `prototype/` to read exact tokens, spacing, copy, and component composition. **Don't ship the HTML.**

## Fidelity

**High-fidelity (hi-fi).** Colors, type scale, spacing, copy, and component shapes are intentional. Recreate pixel-perfectly using the target codebase's existing libraries.

Caveats:
- Icons are simple stroke SVG paths defined inline in `theme.jsx` (the `Icon` component). Treat them as placeholders — swap to your icon library (Lucide, Heroicons, SF Symbols, Material Icons) but keep the same semantic meaning. Stroke weight ~1.75px, 16/20/24 sizes.
- Avatars use letter initials with a deterministic color from a 6-color palette.
- All copy (Vietnamese) is final and should be preserved unless the PM requests changes.

## Theming — the most important contract

The entire app is driven by **CSS custom properties** set on a root element. The theme has two axes:

### Axis 1: Primary palette (13 options)

Defined in `prototype/theme.jsx` (the `PALETTES` object). Each palette is 4 colors:

| Palette  | `--p`     | `--pHover` | `--pSoft` | `--pSoftText` |
| -------- | --------- | ---------- | --------- | ------------- |
| indigo   | `#5B5BD6` | `#4F4FCB`  | `#EEF0FF` | `#3D3DAB`     |
| violet   | `#7C3AED` | `#6D28D9`  | `#F3EEFF` | `#5B21B6`     |
| blue     | `#2563EB` | `#1D4ED8`  | `#EAF1FF` | `#1E40AF`     |
| sky      | `#0284C7` | `#0369A1`  | `#E4F4FD` | `#075985`     |
| cyan     | `#0891B2` | `#0E7490`  | `#E0F6FA` | `#155E75`     |
| teal     | `#0D9488` | `#0F766E`  | `#E0F5F2` | `#115E59`     |
| emerald  | `#10B981` | `#059669`  | `#E6FAF3` | `#047857`     |
| lime     | `#65A30D` | `#4D7C0F`  | `#F0F8DD` | `#3F6212`     |
| amber    | `#F59E0B` | `#D97706`  | `#FEF5E7` | `#B45309`     |
| orange   | `#EA580C` | `#C2410C`  | `#FFEEDD` | `#9A3412`     |
| rose     | `#F43F5E` | `#E11D48`  | `#FFEEF1` | `#BE123C`     |
| pink     | `#DB2777` | `#BE185D`  | `#FCE8F1` | `#9D174D`     |
| slate    | `#475569` | `#334155`  | `#EEF1F5` | `#1E293B`     |

- `--p` = solid primary (buttons, active states, brand accents)
- `--pHover` = hover/active for primary buttons
- `--pSoft` = light tinted background (selected list items, highlighted ranges)
- `--pSoftText` = readable text on `--pSoft`

The default palette is **indigo**. The picker should let users switch between all 13.

### Axis 2: Light/Dark mode

Defined as `LIGHT` and `DARK` objects in `prototype/theme.jsx`. Same token names; different values.

| Token             | Light       | Dark        | Use                                           |
| ----------------- | ----------- | ----------- | --------------------------------------------- |
| `--bg`            | `#FFFFFF`   | `#0A0A0B`   | Main background                               |
| `--bgMuted`       | `#FAFAFA`   | `#111113`   | App shell / canvas background                 |
| `--bgSubtle`      | `#F4F4F5`   | `#18181B`   | Selected nav, segmented control track, chips  |
| `--border`        | `#E4E4E7`   | `#27272A`   | Default border                                |
| `--borderStrong`  | `#D4D4D8`   | `#3F3F46`   | Form control border (checkbox, radio outline) |
| `--text`          | `#09090B`   | `#FAFAFA`   | Primary text                                  |
| `--textMuted`     | `#52525B`   | `#A1A1AA`   | Secondary text                                |
| `--textSubtle`    | `#71717A`   | `#71717A`   | Tertiary text / placeholders                  |
| `--inputBg`       | `#FFFFFF`   | `#18181B`   | Input/textarea backgrounds                    |
| `--success`       | `#10B981`   | `#34D399`   | Success solid                                 |
| `--successSoft`   | `#E6FAF3`   | `#0E2A22`   | Success surface                               |
| `--warning`       | `#F59E0B`   | `#FBBF24`   | Warning solid                                 |
| `--warningSoft`   | `#FEF5E7`   | `#2A1F0A`   | Warning surface                               |
| `--danger`        | `#EF4444`   | `#F87171`   | Danger solid (also "fail" result)             |
| `--dangerSoft`    | `#FEE7E7`   | `#2A1212`   | Danger surface                                |
| `--cardShadow`    | very subtle | very subtle | See `theme.jsx` — `0 1px 2/3px rgba(0,0,0,X)` |

**Implementation guidance:** mirror this token system in your codebase (CSS vars, Tailwind theme, design-token JSON — whatever your stack uses). Components should reference tokens only, never hard-coded hex.

## Typography

- **Font family:** `Geist` (Google Fonts), with system-sans fallback chain: `ui-sans-serif, system-ui, -apple-system, sans-serif`.
- **Font features:** `cv11`, `ss01` enabled (alternate single-story `a`, etc).
- **Letter-spacing:** subtle negative tracking on most surfaces — `-0.005em` on buttons, `-0.015em` to `-0.025em` on headings.
- **Weights used:** 400, 500, 600, 700.

Type scale (approximate; see `prototype/` files for exact per-component values):

| Role             | Size       | Weight |
| ---------------- | ---------- | ------ |
| Display / H1     | 22–28 px   | 600    |
| Section title    | 16–18 px   | 600    |
| Body large       | 14–15 px   | 400    |
| Body / default   | 13.5 px    | 400    |
| Label / button   | 13–13.5 px | 500    |
| Caption / hint   | 12 px      | 400    |
| Badge            | 11.5 px    | 500    |

On **mobile screens**, sizes scale up slightly — question text on the exam screen runs 17–18 px, screen titles 20–22 px.

## Spacing & shape

- **Radii:** buttons `7px`, inputs `7px`, cards `10px`, chips/badges `5–6px`, checkboxes `4px`, mobile pill buttons `12–14px`, avatar `50%`.
- **Card padding:** default `20px`, dense `16px`, form cards `24px`.
- **Sidebar width (admin):** `232px`.
- **Admin content gutter:** `24px 32px 32px`.
- **Mobile gutter:** `20px` left/right, `14px` between header and content.
- **iOS top safe area:** `56px`. iOS bottom (home indicator) `28px`.
- **Shadows:** keep them very subtle — `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)` in light, slightly stronger in dark.

## Screens

### Admin (web, 1280×800 reference viewport)

#### 1. Login (`/login`)
- **Purpose:** sign in to the admin/editor app.
- **Layout:** centered card on `--bgMuted` background. Logo + name top. Email + password fields. "Forgot password" link. Primary "Đăng nhập" button (full width). Link to register at bottom.
- **Component file:** `admin.jsx` → `AdminLogin`.

#### 2. Register (`/register`)
- **Purpose:** new editor onboarding.
- **Layout:** same shell as Login. Fields: full name, email, password, confirm password. Terms checkbox. Primary "Tạo tài khoản". Link to login.
- **Component file:** `admin.jsx` → `AdminRegister`.

#### 3. Dashboard (`/dashboard`)
- **Purpose:** at-a-glance overview after login.
- **Layout:** sidebar (left, `232px`) + topbar + content. Content has 4 KPI cards in a row (Bộ đề / Câu hỏi / Lượt thi / Người dùng), then a 2-column section: recent activity list on the left, "Tạo bộ câu hỏi mới" call-to-action card on the right.
- **Sidebar nav items:** Tổng quan, Ngân hàng câu hỏi, Tạo bộ câu hỏi, Bộ đề thi, Người dùng.
- **Component file:** `admin.jsx` → `AdminDashboard`.

#### 4. Question banks (`/banks`)
- **Purpose:** list of question banks (each bank = a `.docx` that's been converted).
- **Layout:** sidebar + topbar with search. Table-like list of banks with name, question count, last updated, status badge, row actions. Top-right "Tạo bộ câu hỏi" primary button.
- **Component file:** `admin.jsx` → `AdminBanks`.

#### 5. Users (`/users`)
- **Purpose:** manage editor accounts.
- **Layout:** sidebar + topbar. Table of users (avatar + name, email, role badge, last active, actions). Top-right "Mời người dùng".
- **Component file:** `admin-convert.jsx` → `AdminUsers`.

#### 6. Convert · Step 1 — Configure (`/convert`)
- **Purpose:** the **core flow**. Upload `.docx` and tell the system how to detect correct answers.
- **Layout:** centered single column `max-width: 920px`. Top: step indicator (1 of 3). Two cards:
  - **"Thông tin cơ bản":** name field + drop zone for `.docx` (shows filename + size when uploaded).
  - **"Quy tắc phát hiện đáp án đúng":** the `RuleConfig` component — segmented controls and inputs that let the editor describe how the correct answer is marked in their Word file (bolded text, leading marker like `*` or `✓`, color, etc).
- Sticky bottom action bar: secondary "Hủy" left, primary "Thử với 5 câu" right.
- **Component file:** `admin-convert.jsx` → `AdminConvert`.

#### 7. Convert · Step 2 — Test 5 (`/convert?test=1`)
- **Purpose:** show the editor what the rules produced on 5 sample questions before committing.
- **Layout:** same shell as step 1. Card per sample question with the parsed question + options, the detected correct answer highlighted with `--pSoft` background + `--pSoftText` text + small "Đúng" badge. If detection failed, an alert callout with the danger tone. Sticky bottom: "Quay lại" + "Trích xuất toàn bộ".
- **Component file:** `admin-convert.jsx` → `AdminConvertTest`.

#### 8. Convert · Step 3 — Review & create exam set (`/convert/review`)
- **Purpose:** show all extracted questions, let the editor fix mistakes, then assemble an exam set.
- **Layout:** two-pane. Left: scrollable list of all extracted questions with question number, type badge (single/multi), and inline correct-answer indicators. Right: panel for creating exam sets from the bank (name, number of questions to draw, pass threshold, duration).
- **Component file:** `admin-convert.jsx` → `AdminQuestionList`.

### Mobile (learner, iOS 402×874 / Android 412×892)

All mobile screens are framework-agnostic; reuse the same component for iOS and Android. The frame (status bar, nav bar, home indicator) is platform-specific.

#### 9. Login
- **Layout:** logo top, big welcome heading, email + password, "Đăng nhập" primary button (full width, ~52px tall, `var(--p)` background). Secondary "Đăng ký" link.
- **Component file:** `mobile.jsx` → `MobLogin`.

#### 10. Register
- **Layout:** same shell as login + extra fields.
- **Component file:** `mobile.jsx` → `MobRegister`.

#### 11. Home
- **Layout:** header with greeting + avatar right. Big primary CTA card ("Tiếp tục học" / "Bắt đầu"). List of categories or recommended exam sets. Bottom tab bar (Trang chủ, Bộ đề, Lịch sử, Tài khoản).
- **Component file:** `mobile.jsx` → `MobHome`.

#### 12. Exam list
- **Layout:** header "Bộ đề thi" + filter pill. Vertical list of exam cards: title, question count, duration, difficulty/category chip, progress bar if started.
- **Component file:** `mobile.jsx` → `MobExamList`.

#### 13. Taking exam — single-answer variant
- **Layout:** sticky top with timer + progress (e.g. "Câu 3/30") + close X. Question text big (17–18px). Stack of option buttons (radio-style — full width, ~64px tall, rounded `14px`, `--inputBg` background + `--border`). Selected option fills with `--pSoft` + thicker `--p` border. Sticky bottom: "Câu trước" ghost + "Tiếp theo" primary.
- **Component file:** `mobile.jsx` → `MobTakingExam` with `variant="single"`.

#### 14. Taking exam — multi-answer variant
- Same shell as single, but options are checkboxes (square radius, multi-select). Helper line above options: "Chọn tất cả đáp án đúng".
- **Component file:** `mobile.jsx` → `MobTakingExam` with `variant="multi"`.

#### 15. Taking exam — last question / submit
- Same shell as single, but primary CTA becomes "Nộp bài" (danger-styled or primary depending on palette). Confirmation sheet/dialog on tap.
- **Component file:** `mobile.jsx` → `MobTakingExam` with `variant="last"`.

#### 16. Result — passed
- **Layout:** big success illustration block (`--successSoft` background with success-tone icon). Big "Đậu" / score / time taken. Breakdown card: correct/incorrect counts. Two CTAs: "Xem lại đáp án" secondary, "Quay về" primary.
- **Component file:** `mobile.jsx` → `MobResult` with `tone="success"`.

#### 17. Result — failed
- Same layout, `--dangerSoft` background + danger icon. "Chưa đạt" copy. Same CTAs + a "Thi lại" primary instead of "Quay về".
- **Component file:** `mobile.jsx` → `MobResult` with `tone="danger"`.

## Component primitives

All defined in `prototype/theme.jsx`. Re-implement these in your stack first; every screen is built on top of them.

| Primitive    | Variants                                                              | Notes                                           |
| ------------ | --------------------------------------------------------------------- | ----------------------------------------------- |
| `Btn`        | `primary`, `secondary`, `ghost`, `soft`, `danger`, `dangerSolid`      | Sizes `sm` (28px), `md` (34px), `lg` (40px). Icon left or right, optional `fullWidth`. Radius 7. |
| `Input`      | with optional `icon`, `suffix`, `label`, `hint`                       | Height 36, radius 7, padding `0 11px`.          |
| `Field`      | label + children + hint wrapper                                       | Use for any form input.                         |
| `Checkbox`   | label + optional sub copy                                             | 16×16, radius 4. Checked = solid `--p` + white check. |
| `Radio`      | label + optional sub copy                                             | 16×16 circle. Checked = 5px solid border using `--p`. |
| `Badge`      | tones `default`, `primary`, `success`, `warning`, `danger`. Optional dot. | Padding `2px 7px`, radius 5, fontSize 11.5. |
| `Avatar`     | initials, sizes default 28                                            | Deterministic color from a 6-color set.         |
| `Card`       | content + padding (default 20) + shadow                               | Radius 10. Uses `--cardShadow`.                 |
| `Divider`    | 1px line of `--border`                                                |                                                 |
| `Icon`       | inline SVG, ~30 names                                                 | Stroke `currentColor`, `1.75` weight, size 16/20/24. **Replace with your icon library; preserve names/intent.** |

## Interactions & behavior

### Convert flow (admin)
- The 3 steps are sequential. The user cannot skip ahead.
- After upload the file is parsed locally/server-side for preview. The "Thử với 5 câu" button runs the configured rules against the first 5 questions only — fast feedback before committing.
- On step 2, the editor can go back and tweak rules. The rules persist across step transitions.
- On step 3, "Trích xuất toàn bộ" creates the question bank server-side. The editor can then build N exam sets from one bank.

### Mobile exam-taking
- Timer counts down. At 5 minutes left, timer turns warning tone. At 1 minute, danger tone.
- Single-answer: tapping an option selects it; tapping again does not deselect. "Tiếp theo" enabled only when an option is selected.
- Multi-answer: tap toggles. "Tiếp theo" enabled when ≥1 option is selected.
- "Câu trước" navigates to the previous question and restores the prior selection.
- On the last question, the "Tiếp theo" button becomes "Nộp bài". Submission shows a confirmation sheet listing unanswered questions if any.
- After submit → result screen. No way back into the exam.

### Theming
- Palette and dark-mode toggle should live in user/account settings on the real product.
- They're exposed as a floating "Tweaks" panel in the prototype only for design review — not part of the shipping product UI.

### Animations & transitions
- Keep them very restrained. ~150ms `ease-out` on color/opacity changes (button hovers, selection states).
- Mobile screen transitions: standard platform push/pop (do not custom-animate; use your nav library default).
- Step transitions in convert flow: fade content, ~200ms.

### Loading & error states
- Not exhaustively designed in the prototype. Use your codebase's default skeleton / spinner / error patterns, themed with the same tokens.
- Empty-state pattern: centered icon (32–48px) in `--textSubtle` + heading in `--text` + sub copy in `--textMuted` + optional primary CTA.

### Responsiveness
- The admin screens are designed for ≥1280px desktop. Below that, the sidebar should collapse to icons only (~64px), and the content padding should shrink to `16px`. Below ~960px, hide the sidebar behind a hamburger.
- Mobile screens are fixed-width by device, so just match safe-area insets.

## State Management

Per-screen state requirements (the prototype doesn't wire data; design only):

- **Convert flow:** `{ name, fileBlob, rules, sampleResults, allQuestions, examSets[] }`. Persist on the server after step 3.
- **Exam taking:** `{ examId, currentIndex, answers: Record<questionId, optionId|optionId[]>, startedAt, durationMs }`. Persist locally for resume; sync on submit.
- **Theme:** `{ palette, dark }` per user, stored on the user record.

## Design tokens summary

All tokens are listed in the **Theming** section above. To recap in one place:

- **Primary palettes:** 13 (see table)
- **Modes:** light, dark
- **Radii:** 4, 5, 6, 7, 10, 12, 14, 50%
- **Shadows:** `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)` (light), stronger alpha in dark
- **Font:** Geist 400/500/600/700, with `cv11 ss01` features

## Assets

- **Font:** [Geist from Google Fonts](https://fonts.google.com/specimen/Geist). Self-host or use Google Fonts.
- **Icons:** custom inline SVG in `theme.jsx`. **Replace with your codebase's icon library** (Lucide, Heroicons, Material, SF Symbols). The names list in the `Icon` component is the menu of needed icons.
- **No raster images** — the design uses placeholder colored shapes for any imagery. The real product will need illustrations for result screens (success/failure) and an empty-states set.
- **Brand mark:** the small sparkles-in-a-rounded-square in the sidebar is a placeholder. Replace with the real doc2quiz logo when available.

## Files in this bundle

All inside `prototype/`:

- `doc2quiz.html` — entry point. Loads React + Babel + all JSX files.
- `theme.jsx` — **read this first.** Design tokens, theme provider, icons, all UI primitives.
- `admin.jsx` — admin auth + dashboard + banks + users list screens, plus the admin shell (sidebar + topbar).
- `admin-convert.jsx` — convert flow (steps 1–3) + users management screen.
- `mobile.jsx` — every mobile screen (login, register, home, exam list, taking exam, results).
- `canvas.jsx` — composes everything onto a design canvas with browser/iOS/Android frames. **Reference only** — not part of the product.
- `design-canvas.jsx`, `browser-window.jsx`, `ios-frame.jsx`, `android-frame.jsx`, `tweaks-panel.jsx` — design-review scaffolding (canvas grid, device chrome, palette picker). **Not part of the product.**

## How to view the prototype locally

Open `prototype/doc2quiz.html` in a browser. The page assembles all screens onto a pan/zoom canvas. Use the Tweaks panel (bottom-right) to switch palette and toggle dark mode while reviewing.
