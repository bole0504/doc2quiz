// mobile.jsx — Mobile user screens for doc2quiz
// Designed to live inside an IOSDevice or AndroidDevice frame.
// Each screen handles its own header (we pass title={undefined} on the
// device frame so it doesn't render its built-in nav bar).

// iOS top inset (status bar) ≈ 56px; bottom (home indicator) ≈ 28px.
const IOS_TOP = 56;
const IOS_BOT = 28;
// Android: status bar already rendered above content, so just leave room
// for the nav bar which is below content. No insets needed at top.

// ───────────────────────────────────────────────────────────────
// Shared mobile primitives
// ───────────────────────────────────────────────────────────────
function MobileHeader({ title, subtitle, back = true, right, dark, topInset = IOS_TOP }) {
  return (
    <div style={{
      paddingTop: topInset, paddingLeft: 20, paddingRight: 20, paddingBottom: 14,
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        {back ? (
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text)',
          }}><Icon name="chevronLeft" size={18} strokeWidth={2} /></div>
        ) : <div style={{ width: 36 }} />}
        {right || <div style={{ width: 36 }} />}
      </div>
      {title && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 14, color: 'var(--textMuted)', marginTop: 6, lineHeight: 1.4 }}>{subtitle}</div>}
        </div>
      )}
    </div>
  );
}

function PillBtn({ children, kind = 'primary', icon, iconRight, fullWidth, size = 'lg', style }) {
  const sz = size === 'lg' ? { h: 52, fs: 15.5, px: 20 } : { h: 40, fs: 14, px: 16 };
  const variants = {
    primary: { background: 'var(--p)', color: '#fff', border: 'none' },
    secondary: { background: 'var(--bgSubtle)', color: 'var(--text)', border: 'none' },
    outline: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' },
    soft: { background: 'var(--pSoft)', color: 'var(--pSoftText)', border: 'none' },
  };
  return (
    <div style={{
      height: sz.h, padding: `0 ${sz.px}px`, fontSize: sz.fs, fontWeight: 600,
      borderRadius: sz.h / 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      letterSpacing: '-0.01em', width: fullWidth ? '100%' : undefined,
      ...variants[kind], ...style,
    }}>
      {icon && <Icon name={icon} size={sz.fs + 2} strokeWidth={2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.fs + 2} strokeWidth={2} />}
    </div>
  );
}

function MobileField({ label, value, placeholder, suffix, icon, focused }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--textMuted)' }}>{label}</div>}
      <div style={{
        height: 52, padding: '0 16px', borderRadius: 12,
        background: 'var(--bgSubtle)',
        border: '1.5px solid ' + (focused ? 'var(--p)' : 'transparent'),
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {icon && <Icon name={icon} size={18} style={{ color: 'var(--textSubtle)' }} />}
        <div style={{ flex: 1, fontSize: 15, color: value ? 'var(--text)' : 'var(--textSubtle)' }}>
          {value || placeholder}
        </div>
        {suffix}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 1. Login
// ───────────────────────────────────────────────────────────────
function MobLogin() {
  return (
    <MobileScreen>
      <div style={{ paddingTop: IOS_TOP + 40, padding: `${IOS_TOP + 40}px 24px 0`, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--p)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          marginBottom: 24,
        }}>
          <Icon name="sparkles" size={26} strokeWidth={2} />
        </div>

        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          Đăng nhập
        </div>
        <div style={{ fontSize: 15, color: 'var(--textMuted)', marginTop: 8, lineHeight: 1.45 }}>
          Tiếp tục với hành trình ôn thi của bạn
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
          <MobileField label="Email" value="minh.nh@gmail.com" icon="users" />
          <MobileField label="Mật khẩu" value="••••••••" icon="settings" suffix={<Icon name="eye" size={18} style={{ color: 'var(--textSubtle)' }} />} />
          <div style={{ alignSelf: 'flex-end', fontSize: 13.5, color: 'var(--p)', fontWeight: 500, marginTop: -4 }}>
            Quên mật khẩu?
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <PillBtn fullWidth>Đăng nhập</PillBtn>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: 'var(--textSubtle)', fontSize: 12 }}>
          <Divider style={{ flex: 1 }} />HOẶC<Divider style={{ flex: 1 }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <PillBtn kind="outline" fullWidth>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6 0-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2.1-1.8 2.8v2.3h2.9c1.7-1.6 2.7-3.9 2.7-6.7z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.4C2.4 15.9 5.5 18 9 18z"/><path fill="#FBBC05" d="M3.9 10.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7V4.9H.9C.3 6.1 0 7.5 0 9s.3 2.9.9 4.1l3-2.4z"/><path fill="#EA4335" d="M9 3.6c1.4 0 2.6.5 3.5 1.4l2.6-2.6C13.5.8 11.4 0 9 0 5.5 0 2.4 2.1.9 4.9l3 2.4C4.6 5.2 6.6 3.6 9 3.6z"/></svg>
            Google
          </PillBtn>
          <PillBtn kind="outline" fullWidth>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M12.7 9.6c0-2.1 1.7-3.1 1.8-3.1-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.4 2.1C.5 9.6 1.7 13.4 3 15.4c.6 1 1.4 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.5.6 2.6.6 1.1 0 1.8-1 2.4-2 .8-1.2 1.1-2.3 1.1-2.3-.1 0-2.2-.8-2.2-3.2.2-2-1.7-3-1.7-3M10.7 3.5c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.2-1.1z"/></svg>
            Apple
          </PillBtn>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--textMuted)', paddingBottom: IOS_BOT + 16 }}>
          Chưa có tài khoản? <span style={{ color: 'var(--p)', fontWeight: 600 }}>Đăng ký</span>
        </div>
      </div>
    </MobileScreen>
  );
}

// ───────────────────────────────────────────────────────────────
// 2. Register
// ───────────────────────────────────────────────────────────────
function MobRegister() {
  return (
    <MobileScreen>
      <div style={{ padding: `${IOS_TOP + 16}px 24px 0`, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}><Icon name="chevronLeft" size={18} strokeWidth={2} /></div>

        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          Tạo tài khoản
        </div>
        <div style={{ fontSize: 15, color: 'var(--textMuted)', marginTop: 8, lineHeight: 1.45 }}>
          Tham gia cùng 10.000+ học viên đang ôn thi
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
          <MobileField label="Họ và tên" value="Nguyễn Hoàng Minh" icon="users" />
          <MobileField label="Email" value="minh.nh@gmail.com" icon="bell" />
          <MobileField label="Mật khẩu" placeholder="Ít nhất 8 ký tự" icon="settings" focused />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 18 }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, background: 'var(--p)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
          }}><Icon name="check" size={13} strokeWidth={3} /></div>
          <div style={{ fontSize: 13, color: 'var(--textMuted)', lineHeight: 1.5 }}>
            Tôi đồng ý với <span style={{ color: 'var(--p)', fontWeight: 500 }}>Điều khoản</span> và <span style={{ color: 'var(--p)', fontWeight: 500 }}>Chính sách bảo mật</span> của doc2quiz
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <PillBtn fullWidth iconRight="arrowRight">Tạo tài khoản</PillBtn>
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--textMuted)', paddingBottom: IOS_BOT + 16 }}>
          Đã có tài khoản? <span style={{ color: 'var(--p)', fontWeight: 600 }}>Đăng nhập</span>
        </div>
      </div>
    </MobileScreen>
  );
}

// ───────────────────────────────────────────────────────────────
// 3. Home — pick a quiz bank
// ───────────────────────────────────────────────────────────────
function MobHome() {
  const banks = [
    { name: 'Thi lái xe hạng B1', tag: 'Giao thông', count: 600, sets: 12, color: '#5B5BD6', icon: 'car' },
    { name: 'Luật đấu thầu 2024', tag: 'Pháp luật', count: 412, sets: 8, color: '#10B981', icon: 'scale' },
    { name: 'An toàn lao động (xây dựng)', tag: 'An toàn', count: 280, sets: 5, color: '#F59E0B', icon: 'helmet' },
    { name: 'Chứng chỉ kế toán', tag: 'Tài chính', count: 358, sets: 6, color: '#8B5CF6', icon: 'chart' },
  ];
  return (
    <MobileScreen>
      <div style={{ padding: `${IOS_TOP + 8}px 20px 0`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name="Hoàng Minh" size={36} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--textSubtle)' }}>Xin chào,</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Hoàng Minh</div>
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="bell" size={18} /></div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
          Bạn muốn ôn thi<br />môn nào hôm nay?
        </div>
      </div>

      <div style={{ padding: '18px 20px 0' }}>
        <div style={{
          height: 48, padding: '0 16px', borderRadius: 12, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="search" size={18} style={{ color: 'var(--textSubtle)' }} />
          <div style={{ flex: 1, fontSize: 14.5, color: 'var(--textSubtle)' }}>Tìm môn thi, chứng chỉ…</div>
        </div>
      </div>

      {/* Continue card */}
      <div style={{ padding: '22px 20px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--textSubtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          Tiếp tục
        </div>
        <div style={{
          padding: 16, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--p), color-mix(in srgb, var(--p) 70%, #000))',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20, width: 120, height: 120,
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Thi lái xe B1 · Bộ đề 03</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, letterSpacing: '-0.015em' }}>Bạn còn 18 câu nữa</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: '#fff', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>12/30</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>Ngân hàng câu hỏi</div>
        <div style={{ fontSize: 13, color: 'var(--p)', fontWeight: 500 }}>Xem tất cả</div>
      </div>

      <div style={{ padding: '12px 20px ' + (IOS_BOT + 20) + 'px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {banks.map(b => (
          <div key={b.name} style={{
            padding: 14, borderRadius: 14, background: 'var(--bg)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: 'color-mix(in srgb, ' + b.color + ' 12%, transparent)',
              color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><Icon name={b.icon} size={22} strokeWidth={1.8} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{b.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--textMuted)', marginTop: 3 }}>
                {b.count} câu · {b.sets} bộ đề
              </div>
            </div>
            <Icon name="chevronRight" size={18} style={{ color: 'var(--textSubtle)' }} />
          </div>
        ))}
      </div>
    </MobileScreen>
  );
}

// ───────────────────────────────────────────────────────────────
// 4. Exam set list (after picking a bank)
// ───────────────────────────────────────────────────────────────
function MobExamList() {
  const sets = [
    { n: '01', status: 'passed',  score: '28/30', time: '18:42' },
    { n: '02', status: 'passed',  score: '30/30', time: '15:11' },
    { n: '03', status: 'inProg',  score: '12/30', time: null },
    { n: '04', status: 'failed',  score: '20/30', time: '22:00' },
    { n: '05', status: 'pending', score: null,    time: null },
    { n: '06', status: 'pending', score: null,    time: null },
    { n: '07', status: 'pending', score: null,    time: null },
  ];
  return (
    <MobileScreen>
      <MobileHeader
        title="Thi lái xe hạng B1"
        subtitle="12 bộ đề · 30 câu mỗi bộ · 22 phút"
        right={<div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="bookmark" size={17} /></div>}
      />

      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
        {[
          { l: 'Đã đậu', v: '2', tone: 'success' },
          { l: 'Đang thi', v: '1', tone: 'warning' },
          { l: 'Chưa thi', v: '8', tone: 'default' },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--bgSubtle)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--textMuted)', fontWeight: 500 }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Bộ đề</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 6, padding: 2, background: 'var(--bgSubtle)', borderRadius: 8 }}>
          {['Tất cả', 'Chưa thi'].map((t, i) => (
            <div key={t} style={{
              padding: '5px 10px', fontSize: 12.5, fontWeight: 500, borderRadius: 6,
              background: i === 0 ? 'var(--bg)' : 'transparent',
              color: i === 0 ? 'var(--text)' : 'var(--textMuted)',
              boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 20px ' + (IOS_BOT + 12) + 'px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sets.map(s => <ExamSetRow key={s.n} {...s} />)}
      </div>
    </MobileScreen>
  );
}

function ExamSetRow({ n, status, score, time }) {
  const meta = {
    pending: { badge: <Badge>Chưa thi</Badge>, accent: 'var(--bgSubtle)', accentText: 'var(--textMuted)' },
    inProg:  { badge: <Badge tone="warning" dot>Đang thi {score}</Badge>, accent: 'var(--warningSoft)', accentText: 'var(--warning)' },
    passed:  { badge: <Badge tone="success" dot>Đậu {score}</Badge>, accent: 'var(--successSoft)', accentText: 'var(--success)' },
    failed:  { badge: <Badge tone="danger" dot>Rớt {score}</Badge>, accent: 'var(--dangerSoft)', accentText: 'var(--danger)' },
  }[status];

  return (
    <div style={{
      padding: 14, borderRadius: 14, background: 'var(--bg)',
      border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 11,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: meta.accent, color: meta.accentText,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0,
        }}>{n}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Bộ đề {n}</div>
          <div style={{ fontSize: 12.5, color: 'var(--textMuted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="timer" size={12} />22 phút · 30 câu
            {time && <><span>·</span><span>Lần trước {time}</span></>}
          </div>
        </div>
        {meta.badge}
      </div>

      {status === 'inProg' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <PillBtn kind="primary" size="sm" fullWidth>Thi tiếp</PillBtn>
          <PillBtn kind="outline" size="sm" fullWidth>Thi lại từ đầu</PillBtn>
        </div>
      )}
      {(status === 'passed' || status === 'failed') && (
        <div style={{ display: 'flex', gap: 8 }}>
          <PillBtn kind="secondary" size="sm" fullWidth>Xem lại đáp án</PillBtn>
          <PillBtn kind="primary" size="sm" fullWidth>Thi lại</PillBtn>
        </div>
      )}
      {status === 'pending' && (
        <PillBtn kind="primary" size="sm" fullWidth icon="play">Bắt đầu thi</PillBtn>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 5. Taking exam — single choice
// ───────────────────────────────────────────────────────────────
function MobTakingExam({ variant = 'single' }) {
  const q = SAMPLE_Q[0];
  const isMulti = variant === 'multi';
  const isLast = variant === 'last';
  const num = isLast ? 30 : 12;

  // For multi: pretend question has multi-select
  const opts = isMulti ? [
    { t: 'Phải có giấy phép lái xe phù hợp với hạng xe.', selected: true },
    { t: 'Phải tuân thủ tốc độ tối đa theo biển báo.', selected: true },
    { t: 'Được phép vượt xe trên cầu hẹp.', selected: false },
    { t: 'Phải đội mũ bảo hiểm khi điều khiển xe máy.', selected: false },
  ] : q.options.map((o, i) => ({ t: o.t, selected: i === 1 }));

  return (
    <MobileScreen>
      {/* Header with timer */}
      <div style={{ padding: `${IOS_TOP}px 20px 14px`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="x" size={16} strokeWidth={2} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--textMuted)', fontWeight: 500 }}>
            <span>Câu <span style={{ color: 'var(--text)', fontWeight: 600 }}>{num}</span><span style={{ color: 'var(--textSubtle)' }}>/30</span></span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text)', fontWeight: 600 }}>{isLast ? '02:14' : '18:42'}</span>
          </div>
          <div style={{ height: 5, background: 'var(--bgSubtle)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(num / 30) * 100}%`, height: '100%', background: 'var(--p)', borderRadius: 3 }} />
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="bookmark" size={16} strokeWidth={2} /></div>
      </div>

      {/* Question */}
      <div style={{ padding: '12px 20px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isMulti && (
          <Badge tone="primary" style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
            Chọn tất cả đáp án đúng
          </Badge>
        )}
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.4, marginBottom: 20 }}>
          {isMulti
            ? 'Khi điều khiển xe ô tô trên đường bộ, người lái xe có những nghĩa vụ nào sau đây?'
            : q.q}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map((o, i) => {
            const letter = String.fromCharCode(65 + i);
            const sel = o.selected;
            return (
              <div key={i} style={{
                padding: '14px 16px', borderRadius: 14,
                background: sel ? 'var(--pSoft)' : 'var(--bg)',
                border: '1.5px solid ' + (sel ? 'var(--p)' : 'var(--border)'),
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: isMulti ? 7 : '50%', flexShrink: 0,
                  background: sel ? 'var(--p)' : 'var(--bg)',
                  border: sel ? 'none' : '1.5px solid var(--borderStrong)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>
                  {sel ? <Icon name="check" size={15} strokeWidth={3} /> : <span style={{ color: 'var(--textMuted)' }}>{letter}</span>}
                </div>
                <div style={{
                  flex: 1, fontSize: 14.5, lineHeight: 1.5, paddingTop: 4,
                  color: sel ? 'var(--pSoftText)' : 'var(--text)',
                  fontWeight: sel ? 500 : 400,
                }}>{o.t}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav bar */}
      <div style={{
        padding: `14px 20px ${IOS_BOT + 12}px`,
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10,
      }}>
        <PillBtn kind="secondary" size="lg" icon="chevronLeft">Câu trước</PillBtn>
        <div style={{ flex: 1 }}>
          {isLast
            ? <PillBtn kind="primary" size="lg" fullWidth icon="check">Nộp bài</PillBtn>
            : <PillBtn kind="primary" size="lg" fullWidth iconRight="chevronRight">Câu tiếp theo</PillBtn>}
        </div>
      </div>
    </MobileScreen>
  );
}

// ───────────────────────────────────────────────────────────────
// 6. Result — passed
// ───────────────────────────────────────────────────────────────
function MobResult({ tone = 'success' }) {
  const passed = tone === 'success';
  return (
    <MobileScreen>
      <div style={{ padding: `${IOS_TOP + 16}px 20px 14px`, display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--bgSubtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="x" size={16} strokeWidth={2} /></div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Kết quả</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 104, height: 104, borderRadius: '50%',
          background: passed ? 'var(--successSoft)' : 'var(--dangerSoft)',
          color: passed ? 'var(--success)' : 'var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Icon name={passed ? 'medal' : 'flag'} size={52} strokeWidth={1.6} />
        </div>
        <div style={{
          fontSize: 13.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: passed ? 'var(--success)' : 'var(--danger)',
        }}>{passed ? 'Chúc mừng — bạn đã đậu' : 'Chưa đạt — cố lên'}</div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
          {passed ? '28' : '20'}<span style={{ color: 'var(--textSubtle)', fontWeight: 600 }}>/30</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--textMuted)', marginTop: 8 }}>Bộ đề 03 · Thi lái xe B1</div>
      </div>

      <div style={{ padding: '28px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { l: 'Thời gian', v: passed ? '18:42' : '21:55', icon: 'timer' },
          { l: 'Đúng', v: passed ? '28' : '20', icon: 'check', c: 'var(--success)' },
          { l: 'Sai', v: passed ? '2' : '10', icon: 'x', c: 'var(--danger)' },
        ].map(s => (
          <div key={s.l} style={{ padding: 14, borderRadius: 12, background: 'var(--bgSubtle)' }}>
            <Icon name={s.icon} size={16} style={{ color: s.c || 'var(--textMuted)', marginBottom: 6 }} />
            <div style={{ fontSize: 11.5, color: 'var(--textMuted)', fontWeight: 500 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: passed ? 'var(--successSoft)' : 'var(--warningSoft)',
          color: passed ? 'var(--success)' : 'var(--warning)',
          fontSize: 13, lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <Icon name="info" size={15} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            {passed
              ? 'Bạn đã vượt qua điều kiện (tối đa 6 câu sai). Tiếp tục với Bộ đề 04 để duy trì phong độ.'
              : 'Bạn sai 10 câu, vượt ngưỡng tối đa 6. Hãy xem lại các câu sai trước khi thi lại.'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        padding: `14px 20px ${IOS_BOT + 12}px`, display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <PillBtn kind="primary" size="lg" fullWidth iconRight="arrowRight">
          {passed ? 'Tiếp tục với bộ đề 04' : 'Xem các câu sai'}
        </PillBtn>
        <PillBtn kind="secondary" size="lg" fullWidth>Thi lại bộ này</PillBtn>
      </div>
    </MobileScreen>
  );
}

Object.assign(window, {
  MobileHeader, PillBtn, MobileField, ExamSetRow,
  MobLogin, MobRegister, MobHome, MobExamList, MobTakingExam, MobResult,
  IOS_TOP, IOS_BOT,
});
