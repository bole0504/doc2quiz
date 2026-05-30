// theme.jsx — design tokens, theme provider, icons, base UI primitives
// One source of truth for color/type/spacing across admin + mobile screens.

// ───────────────────────────────────────────────────────────────
// Palettes (4 primary options × 2 modes). Built so a single token
// (var(--p)) drives all primary surfaces; mode swap is a class on root.
// ───────────────────────────────────────────────────────────────
const PALETTES = {
  indigo:  { p: '#5B5BD6', pHover: '#4F4FCB', pSoft: '#EEF0FF', pSoftText: '#3D3DAB' },
  violet:  { p: '#7C3AED', pHover: '#6D28D9', pSoft: '#F3EEFF', pSoftText: '#5B21B6' },
  blue:    { p: '#2563EB', pHover: '#1D4ED8', pSoft: '#EAF1FF', pSoftText: '#1E40AF' },
  sky:     { p: '#0284C7', pHover: '#0369A1', pSoft: '#E4F4FD', pSoftText: '#075985' },
  cyan:    { p: '#0891B2', pHover: '#0E7490', pSoft: '#E0F6FA', pSoftText: '#155E75' },
  teal:    { p: '#0D9488', pHover: '#0F766E', pSoft: '#E0F5F2', pSoftText: '#115E59' },
  emerald: { p: '#10B981', pHover: '#059669', pSoft: '#E6FAF3', pSoftText: '#047857' },
  lime:    { p: '#65A30D', pHover: '#4D7C0F', pSoft: '#F0F8DD', pSoftText: '#3F6212' },
  amber:   { p: '#F59E0B', pHover: '#D97706', pSoft: '#FEF5E7', pSoftText: '#B45309' },
  orange:  { p: '#EA580C', pHover: '#C2410C', pSoft: '#FFEEDD', pSoftText: '#9A3412' },
  rose:    { p: '#F43F5E', pHover: '#E11D48', pSoft: '#FFEEF1', pSoftText: '#BE123C' },
  pink:    { p: '#DB2777', pHover: '#BE185D', pSoft: '#FCE8F1', pSoftText: '#9D174D' },
  slate:   { p: '#475569', pHover: '#334155', pSoft: '#EEF1F5', pSoftText: '#1E293B' },
};

const LIGHT = {
  bg: '#FFFFFF',
  bgMuted: '#FAFAFA',
  bgSubtle: '#F4F4F5',
  border: '#E4E4E7',
  borderStrong: '#D4D4D8',
  text: '#09090B',
  textMuted: '#52525B',
  textSubtle: '#71717A',
  inputBg: '#FFFFFF',
  cardShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)',
  success: '#10B981',
  successSoft: '#E6FAF3',
  warning: '#F59E0B',
  warningSoft: '#FEF5E7',
  danger: '#EF4444',
  dangerSoft: '#FEE7E7',
};

const DARK = {
  bg: '#0A0A0B',
  bgMuted: '#111113',
  bgSubtle: '#18181B',
  border: '#27272A',
  borderStrong: '#3F3F46',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  textSubtle: '#71717A',
  inputBg: '#18181B',
  cardShadow: '0 1px 2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
  success: '#34D399',
  successSoft: '#0E2A22',
  warning: '#FBBF24',
  warningSoft: '#2A1F0A',
  danger: '#F87171',
  dangerSoft: '#2A1212',
};

function applyTheme(root, { palette = 'indigo', dark = false } = {}) {
  const p = PALETTES[palette] || PALETTES.indigo;
  const m = dark ? DARK : LIGHT;
  const all = { ...m, ...p };
  for (const [k, v] of Object.entries(all)) {
    root.style.setProperty('--' + k, v);
  }
  root.style.setProperty('--colorScheme', dark ? 'dark' : 'light');
}

// ───────────────────────────────────────────────────────────────
// ThemedFrame — wraps each artboard so its CSS vars are scoped locally.
// Lets us use var(--p) etc inside screens without bleeding across canvas.
// ───────────────────────────────────────────────────────────────
function ThemedFrame({ palette = 'indigo', dark = false, children, style }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (ref.current) applyTheme(ref.current, { palette, dark });
  }, [palette, dark]);
  const m = dark ? DARK : LIGHT;
  return (
    <div ref={ref} style={{
      width: '100%', height: '100%',
      background: m.bg, color: m.text,
      fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif',
      fontFeatureSettings: '"cv11", "ss01"',
      ...style,
    }}>{children}</div>
  );
}

// ───────────────────────────────────────────────────────────────
// Icon set — single-color, 16/20/24 sizes, current colour. No emoji.
// ───────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, strokeWidth = 1.75, style }) => {
  const paths = {
    // navigation
    chevronLeft: 'M10 12L6 8l4-4',
    chevronRight: 'M6 12l4-4-4-4',
    chevronDown: 'M4 6l4 4 4-4',
    chevronUp: 'M4 10l4-4 4 4',
    arrowRight: 'M3 8h10M9 4l4 4-4 4',
    arrowLeft: 'M13 8H3M7 4L3 8l4 4',
    // common
    search: 'M11 11l3 3 M12.5 7.25a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z',
    plus: 'M8 3v10M3 8h10',
    x: 'M3 3l10 10M13 3L3 13',
    check: 'M3 8l3.5 3.5L13 4.5',
    upload: 'M8 11V3M5 6l3-3 3 3M3 13h10',
    download: 'M8 3v8M5 8l3 3 3-3M3 13h10',
    file: 'M9 1.5H4a1.5 1.5 0 00-1.5 1.5v10A1.5 1.5 0 004 14.5h8a1.5 1.5 0 001.5-1.5V6L9 1.5z M9 1.5V6h4.5',
    pen: 'M2 14l1-3 8-8 2 2-8 8-3 1z',
    trash: 'M3 4h10M5.5 4V2.5h5V4M4 4l.5 9a1 1 0 001 1h5a1 1 0 001-1L12 4',
    settings: 'M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z M13 8a5 5 0 00-.1-1l1.5-1.2-1-1.7-1.8.6a5 5 0 00-1.7-1L9.5 2h-3l-.4 1.8a5 5 0 00-1.7 1L2.6 4.2l-1 1.7L3.1 7A5 5 0 003 8a5 5 0 00.1 1L1.6 10.2l1 1.7 1.8-.6a5 5 0 001.7 1l.4 1.8h3l.4-1.8a5 5 0 001.7-1l1.8.6 1-1.7L12.9 9A5 5 0 0013 8z',
    // domain
    book: 'M2 3v10a1 1 0 001 1h10V3a1 1 0 00-1-1H4a2 2 0 00-2 1zM2 3a2 2 0 002 2h9',
    grid: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
    users: 'M11 14v-1a3 3 0 00-3-3H4a3 3 0 00-3 3v1M6 7a3 3 0 100-6 3 3 0 000 6zM15 14v-1a3 3 0 00-2.25-2.9 M11 1.1A3 3 0 0111 7',
    chart: 'M2 13V3M2 13h11M5 11V8M8 11V5M11 11V7',
    docx: 'M9 1.5H4a1.5 1.5 0 00-1.5 1.5v10A1.5 1.5 0 004 14.5h8a1.5 1.5 0 001.5-1.5V6L9 1.5z M9 1.5V6h4.5 M5 9.5h6 M5 11.5h4',
    sparkles: 'M8 1.5L9 5l3.5 1L9 7l-1 3.5L7 7 3.5 6 7 5 8 1.5z M12.5 10l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L10.5 12l1.5-.5.5-1.5z',
    bell: 'M5 11V7.5a3 3 0 016 0V11l1.5 1.5h-9L5 11z M7 14h2',
    timer: 'M8 14a5 5 0 100-10 5 5 0 000 10z M8 6.5V9l1.5 1 M6 1.5h4',
    target: 'M8 14A6 6 0 108 2a6 6 0 000 12z M8 11A3 3 0 108 5a3 3 0 000 6z M8 9a1 1 0 100-2 1 1 0 000 2z',
    play: 'M5 3.5L12 8l-7 4.5v-9z',
    car: 'M2 9l1.2-3.2a2 2 0 011.9-1.3h5.8a2 2 0 011.9 1.3L14 9 M2 9v3h1 M14 9v3h-1 M2 9h12 M5 11.5a.5.5 0 100-1 .5.5 0 000 1z M11 11.5a.5.5 0 100-1 .5.5 0 000 1z',
    scale: 'M8 2v12 M3 14h10 M3 6h10 M3 6L1 11h4L3 6z M13 6l-2 5h4l-2-5z',
    helmet: 'M2 11h12 M3 11V8a5 5 0 0110 0v3 M5 11V7 M11 11V7 M7 5h2',
    medal: 'M8 9.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z M5.5 8.5L4 14l4-2 4 2-1.5-5.5',
    flag: 'M3 14V2 M3 2l8 1-1 3 1 3-8-1',
    eye: 'M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    eyeOff: 'M2 2l12 12 M6 4.5C6.6 4.3 7.3 4.2 8 4.2c4.5 0 7 4.5 7 4.5a13 13 0 01-2.4 3 M10 11.8c-.6.2-1.3.3-2 .3C3.5 12 1 7.5 1 7.5a13 13 0 013-3.4 M6.5 6.6a2 2 0 002.8 2.8',
    logout: 'M9.5 13H4a1 1 0 01-1-1V4a1 1 0 011-1h5.5 M11 11l3-3-3-3 M14 8H6',
    home: 'M2 8l6-5 6 5v6a1 1 0 01-1 1h-3v-4H6v4H3a1 1 0 01-1-1V8z',
    bookmark: 'M3 14V3a1 1 0 011-1h8a1 1 0 011 1v11l-5-3-5 3z',
    list: 'M5 4h9 M5 8h9 M5 12h9 M2 4h.5 M2 8h.5 M2 12h.5',
    moreH: 'M3 8h.5 M8 8h.5 M13 8h.5',
    bold: 'M5 2h4a2.5 2.5 0 010 5H5V2z M5 7h5a2.5 2.5 0 010 5H5V7z',
    italic: 'M10 2H6 M10 14H6 M9 2L7 14',
    paint: 'M3 7a5 5 0 0110 0c0 2-1 3-3 3H8a1 1 0 00-1 1 2 2 0 11-4 0V7z M5.5 5.5a.5.5 0 100-1 .5.5 0 000 1z M9 4.5a.5.5 0 100-1 .5.5 0 000 1z M11 6.5a.5.5 0 100-1 .5.5 0 000 1z',
    sun: 'M8 4.5A3.5 3.5 0 108 11.5 3.5 3.5 0 008 4.5z M8 1v2 M8 13v2 M3 8H1 M15 8h-2 M3.5 3.5l1.4 1.4 M11.1 11.1l1.4 1.4 M3.5 12.5l1.4-1.4 M11.1 4.9l1.4-1.4',
    moon: 'M13 9.5A5.5 5.5 0 016.5 3 5.5 5.5 0 1013 9.5z',
    info: 'M8 14A6 6 0 108 2a6 6 0 000 12z M8 11V7 M8 5h.01',
    alert: 'M8 6v3 M8 11h.01 M7 2.5L1.5 12a1 1 0 00.9 1.5h11.2a1 1 0 00.9-1.5L9 2.5a1.2 1.2 0 00-2 0z',
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
};

// ───────────────────────────────────────────────────────────────
// Primitives
// ───────────────────────────────────────────────────────────────
function Btn({ kind = 'primary', size = 'md', children, icon, iconRight, style, fullWidth, ...rest }) {
  const sizes = {
    sm: { h: 28, px: 10, fs: 13, gap: 6 },
    md: { h: 34, px: 12, fs: 13.5, gap: 7 },
    lg: { h: 40, px: 16, fs: 14, gap: 8 },
  };
  const s = sizes[size];
  const variants = {
    primary: { background: 'var(--p)', color: '#fff', border: 'none' },
    secondary: { background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--textMuted)', border: 'none' },
    soft: { background: 'var(--pSoft)', color: 'var(--pSoftText)', border: 'none' },
    danger: { background: 'transparent', color: 'var(--danger)', border: '1px solid var(--border)' },
    dangerSolid: { background: 'var(--danger)', color: '#fff', border: 'none' },
  };
  return (
    <button {...rest} style={{
      height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, gap: s.gap,
      borderRadius: 7, fontWeight: 500, fontFamily: 'inherit',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', whiteSpace: 'nowrap',
      letterSpacing: '-0.005em',
      width: fullWidth ? '100%' : undefined,
      ...variants[kind], ...style,
    }}>
      {icon && <Icon name={icon} size={s.fs + 1} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fs + 1} />}
    </button>
  );
}

function Input({ label, value, placeholder, hint, icon, suffix, type = 'text', style, inputStyle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>}
      <div style={{
        height: 36, display: 'flex', alignItems: 'center',
        background: 'var(--inputBg)', border: '1px solid var(--border)',
        borderRadius: 7, padding: '0 11px', gap: 8,
      }}>
        {icon && <Icon name={icon} size={15} style={{ color: 'var(--textSubtle)' }} />}
        <div style={{
          flex: 1, fontSize: 13.5, color: value ? 'var(--text)' : 'var(--textSubtle)',
          fontFamily: 'inherit',
          ...inputStyle,
        }}>{value || placeholder}</div>
        {suffix}
      </div>
      {hint && <div style={{ fontSize: 12, color: 'var(--textSubtle)' }}>{hint}</div>}
    </div>
  );
}

function Field({ label, children, hint, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{label}</div>}
      {children}
      {hint && <div style={{ fontSize: 12, color: 'var(--textSubtle)' }}>{hint}</div>}
    </div>
  );
}

function Checkbox({ checked, label, sub }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer' }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        background: checked ? 'var(--p)' : 'var(--inputBg)',
        border: checked ? 'none' : '1.5px solid var(--borderStrong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', marginTop: 1,
      }}>
        {checked && <Icon name="check" size={12} strokeWidth={2.5} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--textSubtle)', lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </label>
  );
}

function Radio({ checked, label, sub }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer' }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: 'var(--inputBg)',
        border: checked ? '5px solid var(--p)' : '1.5px solid var(--borderStrong)',
      }} />
      <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{label}</div>
    </label>
  );
}

function Badge({ tone = 'default', children, dot, style }) {
  const tones = {
    default: { bg: 'var(--bgSubtle)', fg: 'var(--textMuted)', dotC: 'var(--textSubtle)' },
    primary: { bg: 'var(--pSoft)', fg: 'var(--pSoftText)', dotC: 'var(--p)' },
    success: { bg: 'var(--successSoft)', fg: 'var(--success)', dotC: 'var(--success)' },
    warning: { bg: 'var(--warningSoft)', fg: 'var(--warning)', dotC: 'var(--warning)' },
    danger:  { bg: 'var(--dangerSoft)',  fg: 'var(--danger)',  dotC: 'var(--danger)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 7px', borderRadius: 5, fontSize: 11.5, fontWeight: 500,
      background: t.bg, color: t.fg, lineHeight: 1.5,
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dotC }} />}
      {children}
    </span>
  );
}

function Avatar({ name, size = 28, color }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = ['#5B5BD6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4'];
  const c = color || colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c, color: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, letterSpacing: '-0.02em',
    }}>{initials}</div>
  );
}

function Card({ children, padding = 20, style }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 10, padding, boxShadow: 'var(--cardShadow)',
      ...style,
    }}>{children}</div>
  );
}

function Divider({ style }) {
  return <div style={{ height: 1, background: 'var(--border)', ...style }} />;
}

// Mobile-specific: a status-bar-aware screen container for iOS/Android.
function MobileScreen({ children, dark, style }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg)', color: 'var(--text)',
      fontFamily: '"Geist", ui-sans-serif, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  PALETTES, applyTheme, ThemedFrame, Icon,
  Btn, Input, Field, Checkbox, Radio, Badge, Avatar, Card, Divider, MobileScreen,
});
