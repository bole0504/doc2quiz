// canvas.jsx — assembles the design canvas. Top-level App with Tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "indigo",
  "dark": false
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  'indigo', 'violet', 'blue', 'sky', 'cyan', 'teal',
  'emerald', 'lime', 'amber', 'orange', 'rose', 'pink', 'slate',
];
const PALETTE_SWATCH = {
  indigo:  ['#5B5BD6', '#EEF0FF', '#FFFFFF'],
  violet:  ['#7C3AED', '#F3EEFF', '#FFFFFF'],
  blue:    ['#2563EB', '#EAF1FF', '#FFFFFF'],
  sky:     ['#0284C7', '#E4F4FD', '#FFFFFF'],
  cyan:    ['#0891B2', '#E0F6FA', '#FFFFFF'],
  teal:    ['#0D9488', '#E0F5F2', '#FFFFFF'],
  emerald: ['#10B981', '#E6FAF3', '#FFFFFF'],
  lime:    ['#65A30D', '#F0F8DD', '#FFFFFF'],
  amber:   ['#F59E0B', '#FEF5E7', '#FFFFFF'],
  orange:  ['#EA580C', '#FFEEDD', '#FFFFFF'],
  rose:    ['#F43F5E', '#FFEEF1', '#FFFFFF'],
  pink:    ['#DB2777', '#FCE8F1', '#FFFFFF'],
  slate:   ['#475569', '#EEF1F5', '#FFFFFF'],
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Helper: standard themed frame applied to every artboard's children
  const W = ({ children, style }) => (
    <ThemedFrame palette={t.palette} dark={t.dark} style={style}>{children}</ThemedFrame>
  );

  // Browser artboard wrapper — keeps chrome dark always but content themed
  const Web = ({ children, tab = 'doc2quiz · Tổng quan', url = 'app.doc2quiz.vn/dashboard' }) => (
    <ChromeWindow
      tabs={[{ title: tab }, { title: 'docs.doc2quiz.vn' }]}
      activeIndex={0}
      url={url}
      width={1280}
      height={800}
    >
      <W style={{ height: '100%' }}>{children}</W>
    </ChromeWindow>
  );

  // iOS device wrapper
  const Phone = ({ children, dark }) => (
    <IOSDevice width={402} height={874} dark={dark ?? t.dark}>
      <W style={{ height: '100%' }}>{children}</W>
    </IOSDevice>
  );

  // Android device wrapper
  const Droid = ({ children, dark }) => (
    <AndroidDevice width={412} height={892} dark={dark ?? t.dark}>
      <W style={{ height: '100%' }}>{children}</W>
    </AndroidDevice>
  );

  return (
    <>
      <DesignCanvas>
        {/* ───────────── ADMIN — AUTH ───────────── */}
        <DCSection id="admin-auth" title="Admin · Xác thực" subtitle="Đăng nhập và đăng ký cho quản trị viên / biên tập">
          <DCArtboard id="admin-login" label="Đăng nhập" width={1280} height={800}>
            <Web tab="doc2quiz · Đăng nhập" url="app.doc2quiz.vn/login">
              <AdminLogin />
            </Web>
          </DCArtboard>
          <DCArtboard id="admin-register" label="Đăng ký" width={1280} height={800}>
            <Web tab="doc2quiz · Đăng ký" url="app.doc2quiz.vn/register">
              <AdminRegister />
            </Web>
          </DCArtboard>
        </DCSection>

        {/* ───────────── ADMIN — CORE ───────────── */}
        <DCSection id="admin-dash" title="Admin · Tổng quan & Ngân hàng" subtitle="Dashboard và danh sách ngân hàng câu hỏi">
          <DCArtboard id="admin-dashboard" label="Tổng quan" width={1280} height={800}>
            <Web tab="doc2quiz · Tổng quan" url="app.doc2quiz.vn/dashboard">
              <AdminDashboard />
            </Web>
          </DCArtboard>
          <DCArtboard id="admin-banks" label="Ngân hàng câu hỏi" width={1280} height={800}>
            <Web tab="doc2quiz · Ngân hàng" url="app.doc2quiz.vn/banks">
              <AdminBanks />
            </Web>
          </DCArtboard>
          <DCArtboard id="admin-users" label="Người dùng" width={1280} height={800}>
            <Web tab="doc2quiz · Người dùng" url="app.doc2quiz.vn/users">
              <AdminUsers />
            </Web>
          </DCArtboard>
        </DCSection>

        {/* ───────────── ADMIN — CONVERT FLOW ───────────── */}
        <DCSection id="admin-convert" title="Admin · Luồng tạo bộ câu hỏi" subtitle="Cấu hình → thử 5 câu → trích xuất toàn bộ → tạo bộ đề">
          <DCArtboard id="convert-form" label="1. Cấu hình quy tắc" width={1280} height={800}>
            <Web tab="doc2quiz · Tạo bộ câu hỏi" url="app.doc2quiz.vn/convert">
              <AdminConvert />
            </Web>
          </DCArtboard>
          <DCArtboard id="convert-test" label="2. Kết quả thử 5 câu" width={1280} height={800}>
            <Web tab="doc2quiz · Thử nghiệm" url="app.doc2quiz.vn/convert?test=1">
              <AdminConvertTest />
            </Web>
          </DCArtboard>
          <DCArtboard id="convert-list" label="3. Trích xuất & tạo bộ đề" width={1280} height={800}>
            <Web tab="doc2quiz · Câu hỏi" url="app.doc2quiz.vn/convert/review">
              <AdminQuestionList />
            </Web>
          </DCArtboard>
        </DCSection>

        {/* ───────────── MOBILE — iOS USER FLOW ───────────── */}
        <DCSection id="mobile-ios" title="Người dùng · iOS" subtitle="Luồng học viên trên iPhone — từ đăng nhập đến kết quả">
          <DCArtboard id="ios-login" label="Đăng nhập" width={402} height={874}>
            <Phone><MobLogin /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-register" label="Đăng ký" width={402} height={874}>
            <Phone><MobRegister /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-home" label="Trang chủ" width={402} height={874}>
            <Phone><MobHome /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-examlist" label="Danh sách bộ đề" width={402} height={874}>
            <Phone><MobExamList /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-single" label="Đang thi · 1 đáp án" width={402} height={874}>
            <Phone><MobTakingExam variant="single" /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-multi" label="Đang thi · nhiều đáp án" width={402} height={874}>
            <Phone><MobTakingExam variant="multi" /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-last" label="Câu cuối · Nộp bài" width={402} height={874}>
            <Phone><MobTakingExam variant="last" /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-passed" label="Kết quả · Đậu" width={402} height={874}>
            <Phone><MobResult tone="success" /></Phone>
          </DCArtboard>
          <DCArtboard id="ios-failed" label="Kết quả · Rớt" width={402} height={874}>
            <Phone><MobResult tone="danger" /></Phone>
          </DCArtboard>
        </DCSection>

        {/* ───────────── MOBILE — ANDROID PARITY ───────────── */}
        <DCSection id="mobile-android" title="Người dùng · Android" subtitle="Cùng layout, đặt trong khung Material 3 để kiểm tra cross-platform">
          <DCArtboard id="and-login" label="Đăng nhập" width={412} height={892}>
            <Droid><MobLogin /></Droid>
          </DCArtboard>
          <DCArtboard id="and-home" label="Trang chủ" width={412} height={892}>
            <Droid><MobHome /></Droid>
          </DCArtboard>
          <DCArtboard id="and-examlist" label="Danh sách bộ đề" width={412} height={892}>
            <Droid><MobExamList /></Droid>
          </DCArtboard>
          <DCArtboard id="and-single" label="Đang thi" width={412} height={892}>
            <Droid><MobTakingExam variant="single" /></Droid>
          </DCArtboard>
          <DCArtboard id="and-passed" label="Kết quả · Đậu" width={412} height={892}>
            <Droid><MobResult tone="success" /></Droid>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Giao diện" />
        <TweakColor label="Bảng màu chính" value={t.palette}
          options={PALETTE_OPTIONS.map(p => PALETTE_SWATCH[p])}
          onChange={(v) => {
            // value comes back as an array — map back to palette name
            const key = PALETTE_OPTIONS.find(p => PALETTE_SWATCH[p][0] === v[0]);
            setTweak('palette', key || 'indigo');
          }} />
        <TweakToggle label="Chế độ tối" value={t.dark}
          onChange={(v) => setTweak('dark', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
