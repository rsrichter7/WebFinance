/* Webfinance — Dashboard page.
   Mirrors the Transacties tokens / chrome (Inter, bento, soft borders).
   Self-contained — pulls together summary data from all sections. */

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
  redText:   '#B91C1C',
  amber:     '#B45309',
  amberSoft: '#FFFBEB',
  amberText: '#92400E',
  violet:    '#7C3AED',
  violetSoft:'#F5F3FF',
  teal:      '#0D9488',
  tealSoft:  '#F0FDFA',

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
};
const TAB = { fontVariantNumeric: 'tabular-nums' };
const FONT = "'Inter', system-ui, sans-serif";
const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtShort = (n) => '€' + Math.round(n).toLocaleString('nl-NL');

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
  plus:      <Ico size={14} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  arrDown:   <Ico size={12} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  arrUp:     <Ico size={12} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  trendUp:   <Ico size={14} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
  trendDown: <Ico size={14} d={<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></>} />,
  target:    <Ico size={15} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
  chevR:     <Ico size={14} d={<path d="M9 18l6-6-6-6"/>} />,
  home:      <Ico size={14} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  coffee:    <Ico size={14} d={<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></>} />,
  piggy:     <Ico size={14} d={<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-12 6 0 0 .5 3 7 3 1 2 2 3 5 3 .5 0 1 0 1.5-.5L19 19l0-3c1.5-1 2-3.5 2-5 0-2-1-4-2-6z"/><path d="M2 9.5a2 2 0 1 0 0-3"/></>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard, active: true },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true },
    { k: 'set',   label: 'Instellingen', icon: ICONS.settings },
  ];
  return (
    <aside style={{ width: 240, flex: '0 0 240px', background: T.card, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 18px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600 }}>€</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>Webfinance</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, padding: '4px 10px', letterSpacing: 0.4, textTransform: 'uppercase' }}>Menu</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
        {nav.map(n => (
          <div key={n.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: n.active ? T.bg : 'transparent', color: n.active ? T.ink : T.ink2, fontSize: 14, fontWeight: n.active ? 500 : 400, position: 'relative', cursor: 'pointer' }}>
            <span style={{ color: n.active ? T.blue : T.ink3, display: 'inline-flex' }}>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.premium && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>}
            {n.active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, background: T.blue, borderRadius: 2 }} />}
          </div>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ margin: '12px 4px', padding: 12, border: `1px solid ${T.border}`, borderRadius: 10, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ color: T.amber, display: 'inline-flex' }}>{ICONS.lock}</span>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>Upgrade naar Premium</div>
        </div>
        <div style={{ fontSize: 11.5, color: T.ink3, lineHeight: 1.4, marginBottom: 8 }}>Import, kalender en meer.</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.blue, cursor: 'pointer' }}>Bekijk plannen →</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px 8px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E7FF', color: '#3730A3', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>RR</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ronald Richter</div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.bg, color: T.ink3, border: `1px solid ${T.border}`, letterSpacing: 0.3 }}>GRATIS</span>
          </div>
          <div style={{ fontSize: 11, color: T.ink3 }}>ronald@webfin.nl</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4, padding: '6px 8px', borderRadius: 6, fontSize: 11.5, color: T.ink3, cursor: 'pointer', border: `1px solid ${T.border}` }}>
        {ICONS.collapse} <span>Inklappen</span>
      </div>
    </aside>
  );
}

/* ───── Card ───── */
function Card({ children, style = {} }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, padding: 22, ...style }}>{children}</div>;
}

/* ───── Stat card with trend ───── */
function StatCard({ label, value, trend, trendGood, color, accent }) {
  const trendPositive = trend > 0;
  const trendColor = (trendGood === 'up' && trendPositive) || (trendGood === 'down' && !trendPositive) ? T.green : T.red;
  const trendBg = trendColor === T.green ? T.greenSoft : T.redSoft;
  return (
    <Card style={{ flex: 1, padding: '18px 20px', borderTop: `3px solid ${accent || T.border}` }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.ink, ...TAB, letterSpacing: -0.5 }}>{fmt(value)}</div>
      {trend !== undefined && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 8px', borderRadius: 6, background: trendBg, fontSize: 12, fontWeight: 600, color: trendColor }}>
          <span style={{ display: 'inline-flex' }}>{trendPositive ? ICONS.arrUp : ICONS.arrDown}</span>
          {Math.abs(trend).toFixed(1)}%
          <span style={{ fontWeight: 400, color: T.ink4, marginLeft: 4 }}>vs apr</span>
        </div>
      )}
    </Card>
  );
}

/* ───── Donut chart ───── */
function DonutChart({ segments, size = 160 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size / 2) - 12;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.rule} strokeWidth="14" />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />;
        offset += dash;
        return el;
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: T.ink, fontFamily: FONT, ...TAB }}>{fmt(total)}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" style={{ fontSize: 11, fill: T.ink4, fontFamily: FONT }}>totaal</text>
    </svg>
  );
}

/* ───── Bar chart ───── */
function BarChart() {
  const data = [
    { m: 'jan', ink: 2000, uit: 1766 }, { m: 'feb', ink: 3200, uit: 1649 },
    { m: 'mrt', ink: 3200, uit: 7780 }, { m: 'apr', ink: 3200, uit: 2700 },
    { m: 'mei', ink: 3200, uit: 2599 }, { m: 'jun', ink: 0, uit: 0 },
    { m: 'jul', ink: 0, uit: 0 }, { m: 'aug', ink: 0, uit: 0 },
    { m: 'sep', ink: 0, uit: 0 }, { m: 'okt', ink: 0, uit: 0 },
    { m: 'nov', ink: 0, uit: 0 }, { m: 'dec', ink: 0, uit: 0 },
  ];
  const max = Math.max(...data.map(d => Math.max(d.ink, d.uit)), 1);
  const barH = 140;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: barH, marginBottom: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
            <div style={{ flex: 1, height: `${(d.ink / max) * 100}%`, background: T.teal, borderRadius: '3px 3px 0 0', minHeight: d.ink > 0 ? 3 : 0 }} />
            <div style={{ flex: 1, height: `${(d.uit / max) * 100}%`, background: T.red, borderRadius: '3px 3px 0 0', opacity: 0.7, minHeight: d.uit > 0 ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: T.ink4, fontFamily: FONT }}>{d.m}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.ink3 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: T.teal }} />Inkomsten
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.ink3 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: T.red, opacity: 0.7 }} />Uitgaven
        </div>
      </div>
    </div>
  );
}

/* ───── 50/30/20 mini bars ───── */
function RuleBars() {
  const income = 6138.98;
  const rules = [
    { label: 'Noodzaak', pct: 50, spent: 2369.36, color: T.blue, icon: ICONS.home },
    { label: 'Wens', pct: 30, spent: 229.77, color: T.violet, icon: ICONS.coffee },
    { label: 'Sparen', pct: 20, spent: 0, color: T.teal, icon: ICONS.piggy },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rules.map(r => {
        const budget = income * (r.pct / 100);
        const usedPct = budget > 0 ? (r.spent / budget) * 100 : 0;
        const barColor = usedPct < 60 ? T.green : usedPct < 80 ? T.amber : T.red;
        return (
          <div key={r.label}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: r.color, display: 'inline-flex' }}>{r.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{r.label}</span>
                <span style={{ fontSize: 11, color: T.ink4 }}>({r.pct}%)</span>
              </div>
              <span style={{ fontSize: 12, color: T.ink3, ...TAB }}>{fmt(r.spent)} / {fmtShort(budget)}</span>
            </div>
            <div style={{ height: 8, background: T.rule, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(usedPct, 100)}%`, background: barColor, borderRadius: 4, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───── Recent transactions ───── */
function RecentTransactions() {
  const rows = [
    { date: '8 mei', desc: 'Lunch station', amount: 9.19, cat: 'Horeca & Afhaal', who: 'RR', type: 'Uitgave' },
    { date: '7 mei', desc: 'Huishouden', amount: 17.70, cat: 'Verzorging', who: 'AM', type: 'Uitgave' },
    { date: '6 mei', desc: 'Verzekering', amount: 50.53, cat: 'Verzekeringen', who: 'RR', type: 'Uitgave' },
    { date: '5 mei', desc: 'Klussen', amount: 52.82, cat: 'Verbouwing', who: 'RR', type: 'Uitgave' },
    { date: '3 mei', desc: 'Boodschappen', amount: 150.06, cat: 'Boodschappen', who: 'AM', type: 'Uitgave' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.map((r, i) => {
        const palette = r.who === 'RR' ? { bg: '#E0E7FF', fg: '#3730A3' } : { bg: '#FCE7F3', fg: '#9D174D' };
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 0',
            borderBottom: i < rows.length - 1 ? `1px solid ${T.rule}` : 'none',
          }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: palette.bg, color: palette.fg, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>{r.who}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{r.desc}</div>
              <div style={{ fontSize: 11.5, color: T.ink4 }}>{r.cat}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>−{fmt(r.amount)}</div>
              <div style={{ fontSize: 11, color: T.ink4 }}>{r.date}</div>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 500, color: T.blue, cursor: 'pointer' }}>
        Bekijk alle transacties <span style={{ display: 'inline-flex' }}>{ICONS.chevR}</span>
      </div>
    </div>
  );
}

/* ───── Savings goals ───── */
function SavingsGoals() {
  const goals = [
    { name: 'Vakantie 2026', target: 3000, current: 0, deadline: 'aug 2026' },
    { name: 'Keuken', target: 15000, current: 0, deadline: null },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {goals.map((g, i) => {
        const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
        return (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.target}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{g.name}</span>
                {g.deadline && <span style={{ fontSize: 10.5, color: T.ink4, background: T.bg, padding: '1px 6px', borderRadius: 4, border: `1px solid ${T.border}` }}>{g.deadline}</span>}
              </div>
              <span style={{ fontSize: 12, color: T.ink3, ...TAB }}>{fmt(g.current)} / {fmt(g.target)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ height: 8, background: T.rule, borderRadius: 4, overflow: 'hidden', flex: 1 }}>
                <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: T.blue, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.ink4, ...TAB, minWidth: 32, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───── Cost split bar ───── */
function CostSplit() {
  const ronald = 3138.98;
  const anne = 3000;
  const total = ronald + anne;
  const pctR = (ronald / total * 100).toFixed(1);
  const pctA = (anne / total * 100).toFixed(1);
  const gemUit = 2599.13;
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, padding: '10px 14px', background: T.blueSoft, borderRadius: 8, border: '1px solid #DBEAFE' }}>
          <div style={{ fontSize: 11, color: T.blueText, marginBottom: 2 }}>Ronald ({pctR}%)</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(ronald)}</div>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#FCE7F3', borderRadius: 8, border: '1px solid #FBCFE8' }}>
          <div style={{ fontSize: 11, color: '#9D174D', marginBottom: 2 }}>Anne ({pctA}%)</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(anne)}</div>
        </div>
      </div>
      <div style={{ height: 10, display: 'flex', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pctR}%`, background: T.blue, borderRadius: '5px 0 0 5px' }} />
        <div style={{ width: `${pctA}%`, background: '#EC4899', borderRadius: '0 5px 5px 0' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: T.ink3 }}>Gem. uitgaven / mnd: <span style={{ fontWeight: 500, color: T.ink, ...TAB }}>{fmt(gemUit)}</span></div>
        <div style={{ fontSize: 12, color: T.ink3 }}>Methode: <span style={{ fontWeight: 500, color: T.ink }}>Naar ratio</span></div>
      </div>
    </div>
  );
}

/* ───── Donut data ───── */
const donutSegments = [
  { value: 2318.83, color: T.blue, label: 'Huur / Hypotheek' },
  { value: 331, color: T.teal, label: 'Gas / Water / Licht' },
  { value: 150.06, color: T.green, label: 'Boodschappen' },
  { value: 52.82, color: T.amber, label: 'Verbouwing' },
  { value: 50.53, color: T.violet, label: 'Verzekeringen' },
  { value: 9.19, color: T.red, label: 'Horeca & Afhaal' },
];

/* ───── Page ───── */
function Dashboard() {
  const hour = 14;
  const greeting = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';

  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: FONT, background: T.bg, color: T.ink,
      display: 'flex', fontWeight: 400, letterSpacing: -0.05,
      WebkitFontSmoothing: 'antialiased',
      position: 'relative', overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
        }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>{greeting}, Ronald</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Hier is je financieel overzicht voor mei 2026</div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}>{ICONS.plus} Transactie</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <StatCard label="Totaal saldo" value={600.87} trend={20.3} trendGood="up" accent={T.blue} />
            <StatCard label="Inkomsten mei" value={3200} color={T.green} accent={T.green} />
            <StatCard label="Uitgaven mei" value={2599.13} trend={-3.7} trendGood="down" color={T.red} accent={T.red} />
            <StatCard label="Budget resterend" value={400.87} accent={T.amber} />
          </div>

          {/* Charts row — equal height */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Uitgaven per categorie</div>
              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 16 }}>Verdeling van je uitgaven in mei</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <DonutChart segments={donutSegments} size={150} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {donutSegments.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: T.ink2, flex: 1 }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: T.ink, ...TAB }}>{fmt(s.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Maandoverzicht 2026</div>
              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 16 }}>Inkomsten vs uitgaven per maand</div>
              <BarChart />
            </Card>
          </div>

          {/* Second row — savings + transactions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Spaardoelen</div>
                  <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Voortgang van je doelen</div>
                </div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, fontSize: 12, fontWeight: 500, color: T.ink3, cursor: 'pointer' }}>{ICONS.plus} Doel</button>
              </div>
              <SavingsGoals />
            </Card>

            <Card>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Recente transacties</div>
              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Laatste 5 uitgaven</div>
              <RecentTransactions />
            </Card>
          </div>

          {/* Third row — cost split + 50/30/20 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Kostenverdeling</div>
              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 16 }}>Verdeling op basis van netto salaris</div>
              <CostSplit />
            </Card>

            <Card>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>50/30/20 score</div>
              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 16 }}>Hoe scoor je deze maand?</div>
              <RuleBars />
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
