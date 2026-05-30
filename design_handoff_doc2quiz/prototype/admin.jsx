// admin.jsx — Admin web screens for doc2quiz
// All screens render inside a fake browser window. Each screen is a pure
// function of theme tokens defined in theme.jsx.

// ───────────────────────────────────────────────────────────────
// Shared admin chrome
// ───────────────────────────────────────────────────────────────
function AdminShell({ children, active = 'dashboard', search = true }) {
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bgMuted)' }}>
      <AdminSidebar active={active} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTopbar search={search} />
        <div style={{ flex: 1, overflow: 'hidden', padding: '24px 32px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

function AdminSidebar({ active }) {
  const nav = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'grid' },
    { id: 'banks',     label: 'Ngân hàng câu hỏi', icon: 'book' },
    { id: 'convert',   label: 'Tạo bộ câu hỏi', icon: 'sparkles' },
    { id: 'exams',     label: 'Bộ đề thi', icon: 'list' },
    { id: 'users',     label: 'Người dùng', icon: 'users' },
  ];
  return (
    <aside style={{
      width: 232, background: 'var(--bg)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '14px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 8px 14px' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: 'var(--p)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>
          <Icon name="sparkles" size={14} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.015em' }}>doc2quiz</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 4 }}>
        {nav.map(n => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '6.5px 9px', borderRadius: 6, fontSize: 13.5,
            color: active === n.id ? 'var(--text)' : 'var(--textMuted)',
            background: active === n.id ? 'var(--bgSubtle)' : 'transparent',
            fontWeight: active === n.id ? 500 : 400,
            cursor: 'pointer',
          }}>
            <Icon name={n.icon} size={15} />{n.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '0 9px 6px', fontSize: 11, fontWeight: 500,
        color: 'var(--textSubtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Ngân hàng gần đây
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {['Thi lái xe B1', 'Luật đấu thầu 2024', 'An toàn lao động'].map(b => (
          <div key={b} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5.5px 9px', borderRadius: 6, fontSize: 13,
            color: 'var(--textMuted)', cursor: 'pointer',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--borderStrong)' }} />
            {b}
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '8px',
        borderRadius: 7, background: 'var(--bgSubtle)',
      }}>
        <Avatar name="Hoàng Minh" size={24} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hoàng Minh</div>
          <div style={{ fontSize: 11, color: 'var(--textSubtle)' }}>Quản trị viên</div>
        </div>
        <Icon name="logout" size={14} style={{ color: 'var(--textSubtle)' }} />
      </div>
    </aside>
  );
}

function AdminTopbar({ search }) {
  return (
    <div style={{
      height: 52, borderBottom: '1px solid var(--border)', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--textMuted)' }}>
        <Icon name="home" size={14} /><Icon name="chevronRight" size={12} style={{ opacity: 0.5 }} />
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>Tổng quan</span>
      </div>
      <div style={{ flex: 1 }} />
      {search && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 30,
          padding: '0 11px', borderRadius: 7, background: 'var(--bgSubtle)',
          fontSize: 13, color: 'var(--textSubtle)', width: 260,
        }}>
          <Icon name="search" size={14} />Tìm bộ câu hỏi, người dùng…
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
            <kbd style={{
              fontSize: 10.5, padding: '1px 5px', borderRadius: 3, background: 'var(--bg)',
              border: '1px solid var(--border)', color: 'var(--textMuted)', fontFamily: 'inherit',
            }}>⌘K</kbd>
          </div>
        </div>
      )}
      <Icon name="bell" size={16} style={{ color: 'var(--textMuted)' }} />
      <Avatar name="Hoàng Minh" size={28} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 1. Login
// ───────────────────────────────────────────────────────────────
function AdminLogin() {
  return (
    <div style={{
      height: '100%', background: 'var(--bgMuted)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 380, padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'var(--p)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 14,
          }}>
            <Icon name="sparkles" size={20} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Chào mừng trở lại</div>
          <div style={{ fontSize: 13.5, color: 'var(--textMuted)' }}>Đăng nhập vào bảng quản trị doc2quiz</div>
        </div>

        <Card padding={24} style={{ background: 'var(--bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Email" value="admin@doc2quiz.vn" />
            <Field label={<span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Mật khẩu</span>
              <a style={{ fontSize: 12.5, color: 'var(--p)', fontWeight: 500 }}>Quên mật khẩu?</a>
            </span>}>
              <Input value="••••••••••••" suffix={<Icon name="eye" size={14} style={{ color: 'var(--textSubtle)' }} />} style={{ gap: 0 }} />
            </Field>
            <Checkbox checked={true} label="Giữ tôi đăng nhập trong 30 ngày" />
            <Btn kind="primary" size="lg" fullWidth>Đăng nhập</Btn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--textSubtle)', fontSize: 12 }}>
              <Divider style={{ flex: 1 }} /> HOẶC <Divider style={{ flex: 1 }} />
            </div>
            <Btn kind="secondary" size="lg" fullWidth>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ marginRight: 8 }}>
                <path fill="#4285F4" d="M13.7 7.1c0-.5 0-.9-.1-1.4H7v2.7h3.8c-.2 1-.7 1.8-1.5 2.3v1.9h2.4c1.4-1.3 2-3.1 2-5.5z"/>
                <path fill="#34A853" d="M7 14c2 0 3.7-.7 4.9-1.8l-2.4-1.9c-.7.5-1.5.7-2.5.7-1.9 0-3.6-1.3-4.2-3H.4v1.9C1.6 12.4 4.1 14 7 14z"/>
                <path fill="#FBBC05" d="M2.8 8c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5V3.1H.4C-.1 4-.4 5 .4 7s.1 2.9.4 3.9l2.4-1.9z"/>
                <path fill="#EA4335" d="M7 2.8c1.1 0 2 .4 2.8 1.1l2.1-2.1C10.7.6 9 0 7 0 4.1 0 1.6 1.6.4 4l2.4 1.9C3.4 4 5.1 2.8 7 2.8z"/>
              </svg>
              Tiếp tục với Google
            </Btn>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--textMuted)' }}>
          Chưa có tài khoản? <a style={{ color: 'var(--p)', fontWeight: 500 }}>Đăng ký miễn phí</a>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 2. Register
// ───────────────────────────────────────────────────────────────
function AdminRegister() {
  return (
    <div style={{
      height: '100%', background: 'var(--bgMuted)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 380, padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: 'var(--p)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 14,
          }}>
            <Icon name="sparkles" size={20} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 4 }}>Tạo tài khoản</div>
          <div style={{ fontSize: 13.5, color: 'var(--textMuted)', textAlign: 'center' }}>
            Bắt đầu chuyển Word sang đề thi miễn phí
          </div>
        </div>

        <Card padding={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Họ và tên" value="Nguyễn Hoàng Minh" />
            <Input label="Email công việc" value="minh.nh@congty.vn" />
            <Input label="Mật khẩu" value="••••••••" hint="Ít nhất 8 ký tự, có chữ và số" suffix={<Icon name="eye" size={14} style={{ color: 'var(--textSubtle)' }} />} />
            <Checkbox checked={true}
              label={<span>Tôi đồng ý với <a style={{ color: 'var(--p)' }}>Điều khoản</a> và <a style={{ color: 'var(--p)' }}>Chính sách bảo mật</a></span>} />
            <Btn kind="primary" size="lg" fullWidth iconRight="arrowRight">Tạo tài khoản</Btn>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--textMuted)' }}>
          Đã có tài khoản? <a style={{ color: 'var(--p)', fontWeight: 500 }}>Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 3. Dashboard
// ───────────────────────────────────────────────────────────────
function AdminDashboard() {
  const stats = [
    { label: 'Ngân hàng câu hỏi', value: '12', delta: '+2 tháng này', tone: 'success', icon: 'book' },
    { label: 'Tổng số câu hỏi', value: '4.218', delta: '+184 tuần này', tone: 'success', icon: 'list' },
    { label: 'Lượt thi', value: '2.847', delta: '+12% so với tuần trước', tone: 'success', icon: 'play' },
    { label: 'Tỷ lệ đậu trung bình', value: '78%', delta: '+3.2 điểm', tone: 'success', icon: 'target' },
  ];
  return (
    <AdminShell active="dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Chào buổi sáng, Minh</div>
            <div style={{ fontSize: 13.5, color: 'var(--textMuted)', marginTop: 4 }}>
              Đây là tổng quan hệ thống tuần này — Thứ Hai, 25/05/2026
            </div>
          </div>
          <Btn kind="primary" icon="plus">Tạo bộ câu hỏi mới</Btn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {stats.map(s => (
            <Card key={s.label} padding={16}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12.5, color: 'var(--textMuted)', fontWeight: 500 }}>{s.label}</div>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'var(--bgSubtle)', color: 'var(--textMuted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon name={s.icon} size={14} /></div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12, color: 'var(--success)' }}>
                <Icon name="chevronUp" size={12} strokeWidth={2.5} />{s.delta}
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Lượt thi theo ngày</div>
                <div style={{ fontSize: 12, color: 'var(--textMuted)', marginTop: 2 }}>30 ngày gần nhất</div>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'var(--bgSubtle)', borderRadius: 6, padding: 2 }}>
                {['7N', '30N', '90N'].map((p, i) => (
                  <div key={p} style={{
                    padding: '3px 10px', fontSize: 12, fontWeight: 500, borderRadius: 4,
                    background: i === 1 ? 'var(--bg)' : 'transparent',
                    color: i === 1 ? 'var(--text)' : 'var(--textMuted)',
                    boxShadow: i === 1 ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
                  }}>{p}</div>
                ))}
              </div>
            </div>
            <BarChart />
          </Card>

          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Ngân hàng phổ biến</div>
              <a style={{ fontSize: 12, color: 'var(--p)', fontWeight: 500 }}>Xem tất cả</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Thi lái xe hạng B1', tag: 'Giao thông', count: 600, pct: 86 },
                { name: 'Luật đấu thầu 2024', tag: 'Pháp luật', count: 412, pct: 71 },
                { name: 'An toàn lao động', tag: 'An toàn', count: 280, pct: 64 },
                { name: 'Chứng chỉ kế toán', tag: 'Tài chính', count: 358, pct: 58 },
              ].map(b => (
                <div key={b.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500 }}>{b.name}</span>
                      <Badge>{b.tag}</Badge>
                    </div>
                    <span style={{ color: 'var(--textMuted)', fontVariantNumeric: 'tabular-nums' }}>{b.count} lượt</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bgSubtle)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${b.pct}%`, height: '100%', background: 'var(--p)', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card padding={0}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Hoạt động gần đây</div>
              <div style={{ fontSize: 12, color: 'var(--textMuted)', marginTop: 2 }}>5 hoạt động mới nhất từ người dùng</div>
            </div>
            <Btn kind="ghost" size="sm">Xem tất cả</Btn>
          </div>
          {[
            { who: 'Trần Văn An', act: 'hoàn thành', sub: 'Bộ đề 03 — Thi lái xe B1', result: 'Đậu 29/30', time: '5 phút trước', tone: 'success' },
            { who: 'Lê Thị Bình', act: 'bắt đầu', sub: 'Bộ đề 07 — Luật đấu thầu 2024', result: 'Đang thi 12/40', time: '12 phút trước', tone: 'warning' },
            { who: 'Phạm Quốc Cường', act: 'hoàn thành', sub: 'Bộ đề 01 — An toàn lao động', result: 'Rớt 14/25', time: '34 phút trước', tone: 'danger' },
          ].map((a, i) => (
            <div key={i} style={{
              padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <Avatar name={a.who} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>
                  <span style={{ fontWeight: 500 }}>{a.who}</span>
                  <span style={{ color: 'var(--textMuted)' }}> {a.act} </span>
                  <span style={{ fontWeight: 500 }}>{a.sub}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--textSubtle)', marginTop: 2 }}>{a.time}</div>
              </div>
              <Badge tone={a.tone} dot>{a.result}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </AdminShell>
  );
}

// minimal bar chart (no library)
function BarChart() {
  const data = [22, 28, 32, 26, 34, 41, 38, 36, 44, 52, 48, 56, 62, 58, 70, 64, 72, 80, 76, 88, 94, 86, 92, 102, 98, 110, 104, 118, 122, 116];
  const max = 130;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? 'var(--p)' : 'var(--pSoft)',
            borderRadius: 2,
          }} />
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 4. Quiz bank list (Ngân hàng câu hỏi)
// ───────────────────────────────────────────────────────────────
function AdminBanks() {
  const rows = [
    { name: 'Thi lái xe hạng B1', tag: 'Giao thông', q: 600, sets: 12, owner: 'Hoàng Minh', date: '15/04/2026', status: 'published' },
    { name: 'Luật đấu thầu 2024 — Phần I', tag: 'Pháp luật', q: 412, sets: 8, owner: 'Hoàng Minh', date: '02/04/2026', status: 'published' },
    { name: 'An toàn lao động (xây dựng)', tag: 'An toàn', q: 280, sets: 5, owner: 'Lê Thu', date: '28/03/2026', status: 'published' },
    { name: 'Chứng chỉ kế toán hành nghề', tag: 'Tài chính', q: 358, sets: 6, owner: 'Lê Thu', date: '20/03/2026', status: 'published' },
    { name: 'Luật giao thông đường bộ', tag: 'Giao thông', q: 178, sets: 3, owner: 'Hoàng Minh', date: '12/03/2026', status: 'draft' },
    { name: 'Thi lái xe hạng C', tag: 'Giao thông', q: 0, sets: 0, owner: 'Hoàng Minh', date: '10/03/2026', status: 'draft' },
  ];
  return (
    <AdminShell active="banks">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Ngân hàng câu hỏi</div>
            <div style={{ fontSize: 13.5, color: 'var(--textMuted)', marginTop: 4 }}>
              Quản lý tất cả bộ câu hỏi đã trích xuất từ Word
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="download">Xuất CSV</Btn>
            <Btn kind="primary" icon="plus">Tạo bộ câu hỏi</Btn>
          </div>
        </div>

        <Card padding={0}>
          <div style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <Input value="" placeholder="Tìm theo tên hoặc nội dung…" icon="search" style={{ flex: 1, gap: 0 }} />
            <Btn kind="secondary" size="md" iconRight="chevronDown">Phân loại: Tất cả</Btn>
            <Btn kind="secondary" size="md" iconRight="chevronDown">Trạng thái: Tất cả</Btn>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bgMuted)', textAlign: 'left' }}>
                {['Tên bộ câu hỏi', 'Phân loại', 'Số câu', 'Bộ đề', 'Người tạo', 'Cập nhật', 'Trạng thái', ''].map(h => (
                  <th key={h} style={{
                    padding: '9px 16px', fontSize: 11.5, fontWeight: 500,
                    color: 'var(--textMuted)', textTransform: 'uppercase', letterSpacing: '0.04em',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6, background: 'var(--pSoft)',
                        color: 'var(--p)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Icon name="book" size={14} /></div>
                      <span style={{ fontWeight: 500 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px' }}><Badge>{r.tag}</Badge></td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums' }}>{r.q.toLocaleString('vi')}</td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums' }}>{r.sets}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Avatar name={r.owner} size={20} />
                      <span style={{ color: 'var(--textMuted)' }}>{r.owner}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px', color: 'var(--textMuted)' }}>{r.date}</td>
                  <td style={{ padding: '11px 16px' }}>
                    {r.status === 'published'
                      ? <Badge tone="success" dot>Đã xuất bản</Badge>
                      : <Badge tone="warning" dot>Bản nháp</Badge>}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 2, color: 'var(--textMuted)' }}>
                      <div style={{ padding: 5, borderRadius: 5, cursor: 'pointer' }}><Icon name="eye" size={15} /></div>
                      <div style={{ padding: 5, borderRadius: 5, cursor: 'pointer' }}><Icon name="pen" size={15} /></div>
                      <div style={{ padding: 5, borderRadius: 5, cursor: 'pointer' }}><Icon name="moreH" size={15} /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminShell>
  );
}

Object.assign(window, {
  AdminShell, AdminLogin, AdminRegister, AdminDashboard, AdminBanks, BarChart,
});
