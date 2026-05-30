// admin-convert.jsx — The core convert/exam-gen flow + users screen

// ───────────────────────────────────────────────────────────────
// 5. Convert (initial form state)
// ───────────────────────────────────────────────────────────────
function AdminConvert() {
  return (
    <AdminShell active="convert">
      <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ConvertHeader step={1} />

        <Card padding={24}>
          <SectionTitle title="Thông tin cơ bản" subtitle="Đặt tên và tải lên file Word chứa câu hỏi" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Tên bộ câu hỏi" value="Thi lái xe hạng B1 — 2026" />
            <Field label="File Word (.docx)" hint="Tối đa 20MB. Hỗ trợ định dạng .docx (không hỗ trợ .doc cũ)">
              <DropZone filename="thi-lai-xe-b1-2026.docx" size="2.4 MB" />
            </Field>
          </div>
        </Card>

        <Card padding={24}>
          <SectionTitle
            title="Quy tắc phát hiện đáp án đúng"
            subtitle="Hệ thống sẽ đánh dấu đáp án nào trùng với định dạng bạn cấu hình bên dưới là đáp án đúng" />
          <RuleConfig />
        </Card>

        <div style={{
          position: 'sticky', bottom: 0, padding: '12px 16px',
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: 'var(--cardShadow)',
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--textMuted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="info" size={14} />Khuyến nghị thử với 5 câu đầu trước khi trích xuất toàn bộ
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="play">Thử với 5 câu đầu</Btn>
            <Btn kind="primary" iconRight="arrowRight" style={{ opacity: 0.5 }}>Lấy tất cả</Btn>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ───────────────────────────────────────────────────────────────
// 6. Convert with test result (5 detected questions inline)
// ───────────────────────────────────────────────────────────────
function AdminConvertTest() {
  return (
    <AdminShell active="convert">
      <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ConvertHeader step={1} />

        {/* Collapsed config bar */}
        <Card padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 7, background: 'var(--pSoft)', color: 'var(--p)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="docx" size={16} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>thi-lai-xe-b1-2026.docx</div>
              <div style={{ fontSize: 12, color: 'var(--textMuted)', marginTop: 2 }}>
                Quy tắc: <b style={{ color: 'var(--text)', fontWeight: 500 }}>Times New Roman · 13pt · In đậm · #C00000</b>
              </div>
            </div>
            <Btn kind="ghost" size="sm" icon="pen">Sửa cấu hình</Btn>
          </div>
        </Card>

        {/* Success banner */}
        <div style={{
          padding: '12px 16px', background: 'var(--successSoft)', borderRadius: 9,
          display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--success)',
          borderColor: 'color-mix(in srgb, var(--success) 25%, transparent)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: 'var(--success)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}><Icon name="check" size={14} strokeWidth={2.5} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--success)' }}>
              Phát hiện thành công 5/5 câu hỏi
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--textMuted)', marginTop: 2 }}>
              Đáp án đúng được tô màu vàng nhạt. Kiểm tra rồi bấm "Lấy tất cả" để trích xuất 142 câu còn lại.
            </div>
          </div>
        </div>

        {/* Detected Q&A list */}
        <Card padding={0}>
          <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Kết quả thử nghiệm</div>
            <Badge tone="primary">5 câu đầu tiên</Badge>
          </div>
          {SAMPLE_Q.map((q, i) => (
            <DetectedQuestion key={i} num={i + 1} q={q} last={i === SAMPLE_Q.length - 1} />
          ))}
        </Card>

        {/* Action bar */}
        <div style={{
          position: 'sticky', bottom: 0, padding: '12px 16px',
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: 'var(--cardShadow)',
        }}>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="info" size={14} style={{ color: 'var(--textMuted)' }} />
            <span style={{ color: 'var(--textMuted)' }}>Ước tính sẽ trích xuất <b style={{ color: 'var(--text)', fontWeight: 600 }}>~142 câu</b> còn lại từ file</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary">Thử lại</Btn>
            <Btn kind="primary" icon="sparkles" iconRight="arrowRight">Lấy tất cả câu hỏi</Btn>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function ConvertHeader({ step = 1 }) {
  const steps = [
    { id: 1, label: 'Cấu hình & trích xuất' },
    { id: 2, label: 'Xem lại câu hỏi' },
    { id: 3, label: 'Tạo bộ đề' },
  ];
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Tạo bộ câu hỏi từ Word</div>
      <div style={{ fontSize: 13.5, color: 'var(--textMuted)', marginTop: 4 }}>
        Tự động trích xuất câu hỏi và đáp án đúng từ file .docx của bạn
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.id <= step ? 'var(--p)' : 'var(--bgSubtle)',
                color: s.id <= step ? '#fff' : 'var(--textMuted)',
              }}>{s.id < step ? <Icon name="check" size={12} strokeWidth={2.5} /> : s.id}</div>
              <div style={{
                fontSize: 13, fontWeight: s.id === step ? 600 : 400,
                color: s.id <= step ? 'var(--text)' : 'var(--textMuted)',
              }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: '0 0 32px', height: 1, background: 'var(--border)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12.5, color: 'var(--textMuted)', marginTop: 3 }}>{subtitle}</div>}
    </div>
  );
}

function DropZone({ filename, size }) {
  if (filename) {
    return (
      <div style={{
        padding: 16, border: '1px solid var(--border)', borderRadius: 9,
        background: 'var(--bgMuted)', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, background: 'var(--pSoft)', color: 'var(--p)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="docx" size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{filename}</div>
          <div style={{ fontSize: 12, color: 'var(--textMuted)', marginTop: 2 }}>{size} · Tải lên thành công</div>
        </div>
        <Btn kind="ghost" size="sm" icon="x">Đổi file</Btn>
      </div>
    );
  }
  return (
    <div style={{
      padding: '28px 16px', border: '1.5px dashed var(--borderStrong)', borderRadius: 9,
      background: 'var(--bgMuted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      <Icon name="upload" size={20} style={{ color: 'var(--textMuted)' }} />
      <div style={{ fontSize: 13.5 }}><b style={{ color: 'var(--p)', fontWeight: 500 }}>Kéo thả</b> hoặc bấm để chọn file</div>
    </div>
  );
}

function RuleConfig() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12 }}>
        <Field label="Font chữ">
          <Input value="Times New Roman" suffix={<Icon name="chevronDown" size={14} style={{ color: 'var(--textSubtle)' }} />} />
        </Field>
        <Field label="Cỡ chữ">
          <Input value="13" suffix={<span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>pt</span>} />
        </Field>
        <Field label="Màu chữ">
          <div style={{
            height: 36, display: 'flex', alignItems: 'center',
            background: 'var(--inputBg)', border: '1px solid var(--border)',
            borderRadius: 7, padding: '0 11px', gap: 8,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: '#C00000', border: '1px solid rgba(0,0,0,0.08)' }} />
            <div style={{ flex: 1, fontSize: 13.5 }}>#C00000</div>
            <span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>Đỏ đậm</span>
          </div>
        </Field>
      </div>

      <Field label="Định dạng chữ">
        <div style={{ display: 'flex', gap: 8 }}>
          <FormatToggle label="In đậm" icon="bold" active />
          <FormatToggle label="In nghiêng" icon="italic" />
          <FormatToggle label="Gạch chân" icon="bold" />
        </div>
      </Field>

      <div style={{
        padding: '11px 14px', background: 'var(--bgMuted)', borderRadius: 8,
        display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: 'var(--textMuted)',
      }}>
        <Icon name="info" size={14} style={{ color: 'var(--p)', marginTop: 1, flexShrink: 0 }} />
        <div>
          Hệ thống sẽ quét toàn bộ file và đánh dấu đáp án nào có
          <b style={{ color: 'var(--text)' }}> Times New Roman 13pt in đậm màu đỏ đậm </b>
          là đáp án đúng. Câu hỏi cùng đoạn văn được nhóm tự động.
        </div>
      </div>
    </div>
  );
}

function FormatToggle({ label, icon, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 12px', borderRadius: 7,
      border: '1px solid ' + (active ? 'var(--p)' : 'var(--border)'),
      background: active ? 'var(--pSoft)' : 'var(--bg)',
      color: active ? 'var(--pSoftText)' : 'var(--textMuted)',
      fontSize: 13, fontWeight: 500, cursor: 'pointer',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: 3,
        background: active ? 'var(--p)' : 'var(--inputBg)',
        border: active ? 'none' : '1.5px solid var(--borderStrong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>{active && <Icon name="check" size={10} strokeWidth={3} />}</div>
      <Icon name={icon} size={14} />{label}
    </div>
  );
}

const SAMPLE_Q = [
  {
    q: 'Khi điều khiển xe trên đường bộ, người lái xe phải có giấy phép lái xe phù hợp với loại xe nào sau đây?',
    options: [
      { t: 'Loại xe đã đăng ký với cơ quan công an.', correct: false },
      { t: 'Loại xe được phép điều khiển theo giấy phép lái xe.', correct: true },
      { t: 'Loại xe có dung tích xi lanh dưới 50 cm³.', correct: false },
      { t: 'Tất cả các loại xe có mặt trên đường.', correct: false },
    ],
  },
  {
    q: 'Khi xe ô tô đang chạy, có người chạy theo xin đi nhờ thì người lái xe nên xử lý như thế nào?',
    options: [
      { t: 'Cho xe chạy chậm lại để người đó lên xe.', correct: false },
      { t: 'Tăng tốc cho xe chạy nhanh hơn để không phải cho đi nhờ.', correct: false },
      { t: 'Không cho đi nhờ và giữ tốc độ ổn định, đảm bảo an toàn.', correct: true },
    ],
  },
  {
    q: 'Trong các trường hợp dưới đây, trường hợp nào không được phép vượt xe?',
    options: [
      { t: 'Trên cầu hẹp có một làn xe, đường vòng, đầu dốc và các vị trí có tầm nhìn hạn chế.', correct: true },
      { t: 'Nơi đường giao nhau có tổ chức điều khiển giao thông bằng tín hiệu đèn.', correct: false },
      { t: 'Trên đường thẳng, đường rộng, tầm nhìn xa.', correct: false },
    ],
    multi: false,
  },
];

function DetectedQuestion({ num, q, last }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: 'var(--bgSubtle)',
          fontSize: 11.5, fontWeight: 600, color: 'var(--textMuted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{num}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, fontWeight: 500 }}>{q.q}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 32 }}>
        {q.options.map((o, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            padding: '8px 11px', borderRadius: 7,
            background: o.correct ? 'var(--successSoft)' : 'transparent',
            border: '1px solid ' + (o.correct ? 'color-mix(in srgb, var(--success) 30%, transparent)' : 'transparent'),
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: o.correct ? 'var(--success)' : 'transparent',
              border: o.correct ? 'none' : '1.5px solid var(--borderStrong)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
            }}>{o.correct && <Icon name="check" size={12} strokeWidth={2.5} />}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5, flex: 1,
              color: o.correct ? 'var(--text)' : 'var(--textMuted)',
              fontWeight: o.correct ? 500 : 400 }}>
              {o.t}
              {o.correct && <Badge tone="success" style={{ marginLeft: 8 }}>Đáp án đúng</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 7. Question list (after Get All) + Exam set generator side-panel
// ───────────────────────────────────────────────────────────────
function AdminQuestionList() {
  return (
    <AdminShell active="convert">
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ConvertHeader step={2} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge tone="success" dot>Đã trích xuất 147 câu hỏi</Badge>
            <span style={{ fontSize: 13, color: 'var(--textMuted)' }}>147 đáp án đúng được phát hiện · 0 cảnh báo</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="download">Xuất Excel</Btn>
            <Btn kind="primary" icon="sparkles">Tạo bộ đề</Btn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'flex-start' }}>
          <Card padding={0}>
            <div style={{ padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <Checkbox checked={false} label="" />
              <Input value="" placeholder="Tìm trong 147 câu hỏi…" icon="search" style={{ flex: 1, gap: 0 }} />
              <Btn kind="ghost" size="sm" icon="settings">Lọc</Btn>
            </div>
            {SAMPLE_Q.concat(SAMPLE_Q).slice(0, 4).map((q, i) => (
              <CompactQuestion key={i} num={i + 1} q={q} last={i === 3} />
            ))}
            <div style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--textMuted)',
            }}>
              <span>Hiển thị 1–4 trong 147 câu</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Btn kind="ghost" size="sm" icon="chevronLeft" />
                <span>Trang 1 / 37</span>
                <Btn kind="ghost" size="sm" icon="chevronRight" />
              </div>
            </div>
          </Card>

          <ExamGeneratorPanel />
        </div>
      </div>
    </AdminShell>
  );
}

function CompactQuestion({ num, q, last }) {
  const correct = q.options.find(o => o.correct);
  return (
    <div style={{ padding: '14px 16px', borderBottom: last ? 'none' : '1px solid var(--border)', display: 'flex', gap: 12 }}>
      <Checkbox checked={false} label="" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--textSubtle)', letterSpacing: '0.04em' }}>CÂU {String(num).padStart(3, '0')}</span>
          <Badge>{q.options.length} đáp án</Badge>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>{q.q}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--textMuted)' }}>
          <Icon name="check" size={13} strokeWidth={2.5} style={{ color: 'var(--success)' }} />
          <span style={{ color: 'var(--text)' }}>{correct.t}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2, color: 'var(--textSubtle)' }}>
        <div style={{ padding: 6, borderRadius: 5, cursor: 'pointer' }}><Icon name="pen" size={14} /></div>
        <div style={{ padding: 6, borderRadius: 5, cursor: 'pointer' }}><Icon name="trash" size={14} /></div>
      </div>
    </div>
  );
}

function ExamGeneratorPanel() {
  return (
    <Card padding={0} style={{ position: 'sticky', top: 0 }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: 'var(--pSoft)', color: 'var(--p)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="sparkles" size={14} /></div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Tạo bộ đề</div>
          <div style={{ fontSize: 12, color: 'var(--textMuted)', marginTop: 1 }}>Cấu hình bộ đề thi từ ngân hàng câu hỏi</div>
        </div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Số câu hỏi mỗi bộ" hint="Tối đa 147 câu trong ngân hàng">
          <Input value="30" suffix={<span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>câu</span>} />
        </Field>
        <Field label="Số câu sai tối đa cho phép" hint="Vượt quá ngưỡng này sẽ tính là Trượt">
          <Input value="6" suffix={<span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>câu</span>} />
        </Field>
        <Field label="Thời gian làm bài">
          <Input value="22" suffix={<span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>phút</span>} />
        </Field>
        <Field label="Số bộ đề sẽ tạo" hint="Mỗi bộ chọn ngẫu nhiên khác nhau">
          <Input value="10" suffix={<span style={{ fontSize: 12, color: 'var(--textSubtle)' }}>bộ</span>} />
        </Field>

        <div style={{
          padding: 12, background: 'var(--pSoft)', borderRadius: 8,
          color: 'var(--pSoftText)', fontSize: 12.5, lineHeight: 1.55,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Tóm tắt</div>
          Sẽ tạo <b>10 bộ đề</b>, mỗi bộ <b>30 câu</b> chọn ngẫu nhiên từ 147 câu. Người thi có <b>22 phút</b> và được sai tối đa <b>6 câu</b>.
        </div>

        <Btn kind="primary" size="lg" fullWidth iconRight="arrowRight">Tạo 10 bộ đề</Btn>
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────
// 8. User management
// ───────────────────────────────────────────────────────────────
function AdminUsers() {
  const users = [
    { name: 'Trần Văn An', email: 'an.tv@gmail.com', role: 'Học viên', exams: 24, pass: 87, joined: '12/01/2026', status: 'active' },
    { name: 'Lê Thị Bình', email: 'binh.lt@yahoo.com', role: 'Học viên', exams: 18, pass: 72, joined: '08/02/2026', status: 'active' },
    { name: 'Phạm Quốc Cường', email: 'cuong.pq@outlook.com', role: 'Học viên', exams: 9, pass: 44, joined: '03/03/2026', status: 'active' },
    { name: 'Hoàng Minh', email: 'minh.hg@doc2quiz.vn', role: 'Quản trị viên', exams: 0, pass: 0, joined: '01/01/2026', status: 'active' },
    { name: 'Lê Thu', email: 'thu.le@doc2quiz.vn', role: 'Biên tập', exams: 2, pass: 100, joined: '05/01/2026', status: 'active' },
    { name: 'Đỗ Thị Hoa', email: 'hoa.dt@gmail.com', role: 'Học viên', exams: 0, pass: 0, joined: '20/05/2026', status: 'invited' },
    { name: 'Nguyễn Văn Khôi', email: 'khoi.nv@hotmail.com', role: 'Học viên', exams: 31, pass: 65, joined: '15/12/2025', status: 'suspended' },
  ];
  return (
    <AdminShell active="users">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>Người dùng</div>
            <div style={{ fontSize: 13.5, color: 'var(--textMuted)', marginTop: 4 }}>
              482 người dùng đang hoạt động · 12 lời mời chờ phản hồi
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="upload">Nhập danh sách</Btn>
            <Btn kind="primary" icon="plus">Mời người dùng</Btn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Đang hoạt động', value: '482', tone: 'success' },
            { label: 'Tỷ lệ đậu trung bình', value: '76%', tone: 'primary' },
            { label: 'Người dùng mới (tuần)', value: '18', tone: 'default' },
          ].map(s => (
            <Card key={s.label} padding={16}>
              <div style={{ fontSize: 12.5, color: 'var(--textMuted)', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{s.value}</div>
            </Card>
          ))}
        </div>

        <Card padding={0}>
          <div style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <Input value="" placeholder="Tìm theo tên hoặc email…" icon="search" style={{ flex: 1, gap: 0 }} />
            <Btn kind="secondary" size="md" iconRight="chevronDown">Vai trò: Tất cả</Btn>
            <Btn kind="secondary" size="md" iconRight="chevronDown">Trạng thái</Btn>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bgMuted)', textAlign: 'left' }}>
                {['Người dùng', 'Vai trò', 'Lượt thi', 'Tỷ lệ đậu', 'Tham gia', 'Trạng thái', ''].map(h => (
                  <th key={h} style={{
                    padding: '9px 16px', fontSize: 11.5, fontWeight: 500,
                    color: 'var(--textMuted)', textTransform: 'uppercase', letterSpacing: '0.04em',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.name} size={30} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--textSubtle)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <Badge tone={u.role === 'Quản trị viên' ? 'primary' : u.role === 'Biên tập' ? 'warning' : 'default'}>{u.role}</Badge>
                  </td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums' }}>{u.exams}</td>
                  <td style={{ padding: '11px 16px' }}>
                    {u.exams > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 50, height: 4, background: 'var(--bgSubtle)', borderRadius: 2 }}>
                          <div style={{ width: `${u.pass}%`, height: '100%', background: u.pass >= 70 ? 'var(--success)' : u.pass >= 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--textMuted)' }}>{u.pass}%</span>
                      </div>
                    ) : <span style={{ color: 'var(--textSubtle)' }}>—</span>}
                  </td>
                  <td style={{ padding: '11px 16px', color: 'var(--textMuted)' }}>{u.joined}</td>
                  <td style={{ padding: '11px 16px' }}>
                    {u.status === 'active' && <Badge tone="success" dot>Hoạt động</Badge>}
                    {u.status === 'invited' && <Badge tone="warning" dot>Chờ phản hồi</Badge>}
                    {u.status === 'suspended' && <Badge tone="danger" dot>Tạm khóa</Badge>}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                    <div style={{ padding: 5, borderRadius: 5, color: 'var(--textMuted)', display: 'inline-block' }}><Icon name="moreH" size={15} /></div>
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
  AdminConvert, AdminConvertTest, AdminQuestionList, AdminUsers,
  ConvertHeader, SectionTitle, DropZone, RuleConfig, DetectedQuestion,
  SAMPLE_Q, ExamGeneratorPanel,
});
