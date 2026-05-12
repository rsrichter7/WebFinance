/* Webfinance — Analytics page.
   Mirrors the Transacties tokens / chrome (Inter, bento, soft borders).
   Self-contained so we can iterate on this page without touching other pages. */

const T = {
  bg:        '#F8F9FA',
  card:      '#FFFFFF',
  cardAlt:   '#FAFBFC',
  border:    '#E5E7EB',
  borderHi:  '#D1D5DB',
  ink:       '#111827',
  ink2:      '#374151',
  ink3:      '#6B7280',
  ink4:      '#9CA3AF',
  rule:      '#F3F4F6',

  blue:      '#2563EB',
  blueHi:    '#1D4ED8',
  blueSoft:  '#EFF6FF',
  blueText:  '#1D4ED8',
  green:     '#059669',
  greenSoft: '#ECFDF5',
  greenText: '#047857',
  red:       '#DC2626',
  redSoft:   '#FEF2F2',
  amber:     '#B45309',
  amberSoft: '#FFFBEB',
  violet:    '#7C3AED',
  violetSoft:'#F5F3FF',
  teal:      '#0D9488',
  tealSoft:  '#F0FDFA',

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
};
const TAB = { fontVariantNumeric: 'tabular-nums' };

/* ───── Icons ───── */
const Ico = ({ d, size = 18, stroke = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
    {d}
  </svg>
);
const ICONS = {
  dashboard: <Ico d={<><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>} />,
  tx:        <Ico d={<><path d="M7 7h13"/><path d="M17 4l3 3-3 3"/><path d="M17 17H4"/><path d="M7 14l-3 3 3 3"/></>} />,
  analytics: <Ico d={<><path d="M3 3v18h18"/><path d="M7 16l4-5 4 3 5-7"/></>} />,
  budget:    <Ico d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  fixed:     <Ico d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M8 15h3"/></>} />,
  cal:       <Ico d={<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></>} />,
  settings:  <Ico d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
  collapse:  <Ico size={16} d={<><path d="M15 18l-6-6 6-6"/></>} />,
  lock:      <Ico size={13} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  arrUp:     <Ico size={14} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  arrDown:   <Ico size={14} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  plus:      <Ico size={14} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  lockBig:   <Ico size={20} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics, active: true },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true },
    { k: 'set',   label: 'Instellingen', icon: ICONS.settings },
  ];
  return (
    <aside style={{
      width: 240, flex: '0 0 240px',
      background: T.card,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 18px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.ink, color: '#fff',
          display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600 }}>€</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>Webfinance</div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, padding: '4px 10px', letterSpacing: 0.4, textTransform: 'uppercase' }}>Menu</div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
        {nav.map(n => (
          <div key={n.k} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8,
            background: n.active ? T.bg : 'transparent',
            color: n.active ? T.ink : T.ink2,
            fontSize: 14, fontWeight: n.active ? 500 : 400,
            position: 'relative', cursor: 'pointer',
          }}>
            <span style={{ color: n.active ? T.blue : T.ink3, display: 'inline-flex' }}>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.premium && (
              <span style={{
                fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
                padding: '2px 6px', borderRadius: 4,
                background: T.amberSoft, color: T.amber,
              }}>PREMIUM</span>
            )}
            {n.active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, background: T.blue, borderRadius: 2 }} />}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{
        margin: '12px 4px', padding: 12,
        border: `1px solid ${T.border}`, borderRadius: 10,
        background: T.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ color: T.amber, display: 'inline-flex' }}>{ICONS.lock}</span>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>Upgrade naar Premium</div>
        </div>
        <div style={{ fontSize: 11.5, color: T.ink3, lineHeight: 1.4, marginBottom: 8 }}>Import, kalender en meer.</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.blue, cursor: 'pointer' }}>Bekijk plannen →</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px 8px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E7FF', color: '#3730A3',
          display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>RR</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ronald Richter</div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.bg, color: T.ink3, border: `1px solid ${T.border}`, letterSpacing: 0.3 }}>GRATIS</span>
          </div>
          <div style={{ fontSize: 11, color: T.ink3 }}>ronald@webfin.nl</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        marginTop: 4, padding: '6px 8px', borderRadius: 6,
        fontSize: 11.5, color: T.ink3, cursor: 'pointer',
        border: `1px solid ${T.border}`,
      }}>
        {ICONS.collapse} <span>Inklappen</span>
      </div>
    </aside>
  );
}

/* ───── Top bar ───── */
function TopBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
    }}>
      <div>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Analytics</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Inzicht in je financiën · 2026</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <PeriodSelector />
      </div>
    </div>
  );
}

/* ───── Period selector pills ───── */
function PeriodSelector() {
  const periods = ['Maand', 'Kwartaal', 'Jaar'];
  return (
    <div style={{ display: 'inline-flex', padding: 3, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
      {periods.map(p => {
        const active = p === 'Maand';
        return (
          <span key={p} style={{
            padding: '6px 14px', fontSize: 12.5, fontWeight: 500,
            borderRadius: 5,
            background: active ? T.card : 'transparent',
            color: active ? T.ink : T.ink3,
            boxShadow: active ? '0 1px 2px rgba(17,24,39,0.06)' : 'none',
            cursor: 'pointer',
          }}>{p}</span>
        );
      })}
    </div>
  );
}

/* ───── Month selector pills ───── */
function MonthSelector() {
  const months = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {months.map(m => {
        const active = m === 'mei';
        return (
          <span key={m} style={{
            padding: '6px 12px', fontSize: 12.5, fontWeight: active ? 600 : 400,
            borderRadius: 20,
            background: active ? T.ink : T.card,
            color: active ? '#fff' : T.ink3,
            border: `1px solid ${active ? T.ink : T.border}`,
            cursor: 'pointer',
          }}>{m}</span>
        );
      })}
    </div>
  );
}

/* ───── Card wrapper ───── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      boxShadow: T.shadow,
      padding: 22,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ───── Mini SVG line chart ───── */
function LineChart({ data, color, width = '100%', height = 180 }) {
  const nonZero = data.filter(d => d.v !== 0);
  const src = nonZero.length > 1 ? nonZero : data;
  const max = Math.max(...src.map(d => d.v));
  const min = Math.min(...src.map(d => d.v));
  const range = max - min || 1;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 24;
  const w = 540;
  const h = height;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const points = src.map((d, i) => ({
    x: padL + (i / Math.max(src.length - 1, 1)) * chartW,
    y: padT + (1 - (d.v - min) / range) * chartH,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length - 1].x},${padT + chartH} L${points[0].x},${padT + chartH} Z`;
  const fmt = (n) => n >= 0
    ? '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : '−€' + Math.abs(n).toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const FONT = "'Inter', system-ui, sans-serif";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width, height: 'auto', fontFamily: FONT }}>
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = padT + pct * chartH;
        const val = max - pct * range;
        return (
          <React.Fragment key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke={T.rule} strokeWidth="1" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill={T.ink4} fontFamily={FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(val)}</text>
          </React.Fragment>
        );
      })}
      <path d={areaD} fill={color} opacity="0.06" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={T.card} stroke={color} strokeWidth="2" />
      ))}
      {src.map((d, i) => (
        <text key={i} x={points[i].x} y={h - 4} textAnchor="middle" fontSize="10" fill={T.ink4} fontFamily={FONT}>{d.label}</text>
      ))}
    </svg>
  );
}

/* ───── Horizontal bar chart ───── */
function HBarChart({ data, color }) {
  const max = Math.max(...data.map(d => d.v));
  const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.ink4, width: 18 }}>{i + 1}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{d.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(d.v)}</span>
          </div>
          <div style={{ height: 8, background: T.rule, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${(d.v / max) * 100}%`,
              background: typeof color === 'function' ? color(i) : color,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───── Comparison card ───── */
function CompareCard({ label, current, previous, good }) {
  const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2 });
  const diff = previous !== 0 ? ((current - previous) / previous * 100) : 0;
  const isPositive = good === 'down' ? diff < 0 : diff > 0;
  const arrow = diff > 0 ? ICONS.arrUp : ICONS.arrDown;
  const arrowColor = isPositive ? T.green : T.red;
  const bgColor = isPositive ? T.greenSoft : T.redSoft;

  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, ...TAB, marginBottom: 6 }}>{fmt(current)}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 6,
          background: bgColor, fontSize: 12, fontWeight: 600, color: arrowColor,
        }}>
          <span style={{ display: 'inline-flex' }}>{arrow}</span>
          {Math.abs(diff).toFixed(1)}%
        </span>
        <span style={{ fontSize: 12, color: T.ink4 }}>vs vorige maand ({fmt(previous)})</span>
      </div>
    </Card>
  );
}

/* ───── Premium lock overlay ───── */
function PremiumOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      borderRadius: 12, zIndex: 2,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: T.amberSoft, border: `1px solid #FDE68A`,
        display: 'grid', placeItems: 'center',
        color: T.amber, marginBottom: 14,
      }}>
        {ICONS.lockBig}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Upgrade naar Premium</div>
      <div style={{ fontSize: 13, color: T.ink3, marginBottom: 14, textAlign: 'center', maxWidth: 280 }}>
        Stel je eigen dashboard samen met aanpasbare widgets en analyses
      </div>
      <button style={{
        padding: '8px 20px', borderRadius: 8,
        border: 'none', background: T.blue, color: '#fff',
        fontSize: 13, fontWeight: 500, cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
      }}>Bekijk Premium</button>
    </div>
  );
}

/* ───── Ghost widget for premium section ───── */
function GhostWidget({ title, type }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      padding: 18, opacity: 0.5,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 14 }}>{title}</div>
      {type === 'donut' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: `8px solid ${T.rule}`, borderTopColor: T.blue, borderRightColor: T.violet }} />
        </div>
      )}
      {type === 'bars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[70, 50, 30].map((w, i) => (
            <div key={i} style={{ height: 8, background: T.rule, borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${w}%`, background: T.blue, borderRadius: 4, opacity: 0.4 }} />
            </div>
          ))}
        </div>
      )}
      {type === 'weekday' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
          {[40, 25, 60, 35, 80, 55, 20].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: T.rule, borderRadius: 3 }} />
          ))}
        </div>
      )}
      {type === 'persons' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 60 }}>
          {[65, 55].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: T.rule, borderRadius: 4 }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───── Data ───── */
const balansData = [
  { label: 'jan', v: 2000 }, { label: 'feb', v: 1850 }, { label: 'mrt', v: -2580 },
  { label: 'apr', v: -2080 }, { label: 'mei', v: -1479 }, { label: 'jun', v: 0 },
  { label: 'jul', v: 0 }, { label: 'aug', v: 0 }, { label: 'sep', v: 0 },
  { label: 'okt', v: 0 }, { label: 'nov', v: 0 }, { label: 'dec', v: 0 },
];

const uitgavenTrend = [
  { label: 'jan', v: 1766 }, { label: 'feb', v: 1649 }, { label: 'mrt', v: 7780 },
  { label: 'apr', v: 2700 }, { label: 'mei', v: 2599 },
];

const topCategories = [
  { label: 'Verbouwing', v: 7163.82 },
  { label: 'Huur / Hypotheek', v: 6956.48 },
  { label: 'Vakantie', v: 954.90 },
  { label: 'Gas / Water / Licht', v: 515.00 },
  { label: 'Gem. belastingen', v: 433.80 },
];

const barColors = [T.red, T.blue, T.amber, T.teal, T.violet];

/* ───── Page ───── */
function Analytics() {
  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: T.bg, color: T.ink,
      display: 'flex',
      fontWeight: 400, letterSpacing: -0.05,
      WebkitFontSmoothing: 'antialiased',
      position: 'relative', overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <MonthSelector />

          {/* Balans verloop — full width */}
          <Card>
            <CardTitle sub="Jouw saldoverloop over de maanden van 2026">Balans verloop</CardTitle>
            <LineChart data={balansData} color={T.blue} height={180} />
          </Card>

          {/* Two charts side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
              <CardTitle sub="Totale uitgaven per maand">Uitgaven trend</CardTitle>
              <LineChart data={uitgavenTrend} color={T.red} height={170} />
            </Card>
            <Card>
              <CardTitle sub="Hoogste uitgaven categorieën in 2026">Top 5 categorieën</CardTitle>
              <HBarChart data={topCategories} color={(i) => barColors[i]} />
            </Card>
          </div>

          {/* Comparison cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <CompareCard label="Uitgaven mei" current={2599.13} previous={2700.36} good="down" />
            <CompareCard label="Inkomsten mei" current={3200} previous={3200} good="up" />
            <CompareCard label="Saldo mei" current={600.87} previous={499.64} good="up" />
          </div>

          {/* Premium section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Mijn overzichten</div>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                background: T.amberSoft, color: T.amber, letterSpacing: 0.3,
              }}>PREMIUM</span>
            </div>
            <div style={{ fontSize: 13, color: T.ink3, marginBottom: 16 }}>
              Stel je eigen dashboard samen met aanpasbare widgets en diepere analyses.
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <GhostWidget title="Noodzaak / Wens / Sparen" type="donut" />
                <GhostWidget title="50/30/20 score" type="bars" />
                <GhostWidget title="Weekdag analyse" type="weekday" />
                <GhostWidget title="Uitgaven per persoon" type="persons" />
              </div>
              <PremiumOverlay />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;
