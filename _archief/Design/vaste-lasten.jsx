/* Webfinance — Vaste Lasten page.
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
  redText:   '#B91C1C',
  amber:     '#B45309',
  amberSoft: '#FFFBEB',
  violet:    '#7C3AED',
  violetSoft:'#F5F3FF',
  teal:      '#0D9488',
  tealSoft:  '#F0FDFA',

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
};
const TAB = { fontVariantNumeric: 'tabular-nums' };
const FONT = "'Inter', system-ui, sans-serif";
const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  edit:      <Ico size={14} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/></>} />,
  trash:     <Ico size={14} d={<><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>} />,
  home:      <Ico size={15} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  wifi:      <Ico size={15} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></>} />,
  coin:      <Ico size={15} d={<><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M9 11h6"/></>} />,
  arrUp:     <Ico size={12} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  arrDown:   <Ico size={12} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  trending:  <Ico size={15} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed, active: true },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true },
    { k: 'set',   label: 'Instellingen', icon: ICONS.settings },
  ];
  return (
    <aside style={{
      width: 240, flex: '0 0 240px',
      background: T.card, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', padding: '20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 18px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600 }}>€</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>Webfinance</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, padding: '4px 10px', letterSpacing: 0.4, textTransform: 'uppercase' }}>Menu</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
        {nav.map(n => (
          <div key={n.k} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
            background: n.active ? T.bg : 'transparent', color: n.active ? T.ink : T.ink2,
            fontSize: 14, fontWeight: n.active ? 500 : 400, position: 'relative', cursor: 'pointer',
          }}>
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
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, ...style }}>{children}</div>;
}

/* ───── Stat card ───── */
function StatCard({ label, value, color, sub }) {
  return (
    <Card style={{ flex: 1, padding: 20 }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.ink, ...TAB, letterSpacing: -0.5 }}>{fmt(value)}</div>
      {sub && <div style={{ fontSize: 12, color: T.ink4, marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

/* ───── Grouped table for a category ───── */
function CategoryGroup({ icon, title, color, colorSoft, items, subtotal }) {
  const cols = '1.4fr 120px 110px 1fr 100px 70px';
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* Group header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px',
        borderBottom: `1px solid ${T.border}`,
        background: T.cardAlt,
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: colorSoft, display: 'grid', placeItems: 'center', color: color }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{title}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>
          {fmt(subtotal)} <span style={{ fontSize: 11, fontWeight: 400, color: T.ink3 }}>/ maand</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols,
        padding: '10px 18px', borderBottom: `1px solid ${T.rule}`,
        fontSize: 11, fontWeight: 500, color: T.ink4, letterSpacing: 0.3, textTransform: 'uppercase',
      }}>
        <div>Omschrijving</div>
        <div style={{ textAlign: 'right' }}>Bedrag</div>
        <div>Herhaling</div>
        <div>Subcategorie</div>
        <div>Winkel / Bron</div>
        <div />
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: cols,
          padding: '12px 18px', alignItems: 'center',
          background: i % 2 === 1 ? T.cardAlt : T.card,
          borderBottom: i === items.length - 1 ? 'none' : `1px solid ${T.rule}`,
          fontSize: 13.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: item.type === 'Inkomst' ? T.green : T.ink4, display: 'inline-flex' }}>
              {item.type === 'Inkomst' ? ICONS.arrUp : ICONS.arrDown}
            </span>
            <span style={{ fontWeight: 500, color: T.ink }}>{item.name}</span>
          </div>
          <div style={{ textAlign: 'right', fontWeight: 500, color: T.ink, ...TAB }}>
            {item.type === 'Inkomst' ? '+' : '−'} {fmt(item.amount)}
          </div>
          <div style={{ color: T.ink3, fontSize: 12.5 }}>{item.freq}</div>
          <div style={{ color: T.ink3, fontSize: 12.5 }}>{item.sub}</div>
          <div style={{ color: T.ink4, fontSize: 12.5 }}>{item.shop}</div>
          <div style={{ display: 'inline-flex', gap: 4, justifyContent: 'flex-end', color: T.ink4 }}>
            <button style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}>{ICONS.edit}</button>
            <button style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}>{ICONS.trash}</button>
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ───── Donut chart ───── */
function MiniDonut({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.rule} strokeWidth="10" />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            strokeLinecap="round"
          />
        );
        offset += dash;
        return el;
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: T.ink, fontFamily: FONT, fontVariantNumeric: 'tabular-nums' }}>{fmt(total)}</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" style={{ fontSize: 10, fill: T.ink4, fontFamily: FONT }}>/ maand</text>
    </svg>
  );
}

/* ───── Loan section ───── */
function LoanSection() {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ color: T.violet, display: 'inline-flex' }}>{ICONS.trending}</span>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Leningen</div>
      </div>
      <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 16 }}>Houd je aflossingen en restschuld bij</div>

      <div style={{
        border: `1px dashed ${T.borderHi}`, borderRadius: 10,
        padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: T.cardAlt,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: T.violetSoft, display: 'grid', placeItems: 'center', color: T.violet, marginBottom: 12 }}>
          {ICONS.coin}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 4 }}>Nog geen leningen toegevoegd</div>
        <div style={{ fontSize: 12, color: T.ink4, marginBottom: 14, textAlign: 'center', maxWidth: 320 }}>
          Voeg een lening toe om je aflossingen, rentepercentage en restschuld bij te houden
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card,
          fontSize: 13, fontWeight: 500, color: T.ink2, cursor: 'pointer',
        }}>{ICONS.plus} Lening toevoegen</button>
      </div>

      {/* Example of what a loan looks like (placeholder / grey) */}
      <div style={{ marginTop: 20, padding: 16, border: `1px solid ${T.rule}`, borderRadius: 10, background: T.cardAlt, opacity: 0.5 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>Voorbeeld</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink4 }}>Totaalbedrag</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink3, ...TAB }}>€25.000,00</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.ink4 }}>Rente</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink3, ...TAB }}>4,5%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.ink4 }}>Maandaflossing</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink3, ...TAB }}>€466,08</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.ink4 }}>Restschuld</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink3, ...TAB }}>€18.420,00</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, background: T.rule, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '26%', background: T.violet, borderRadius: 3, opacity: 0.6 }} />
          </div>
          <div style={{ fontSize: 11, color: T.ink4, marginTop: 4, ...TAB }}>26% afgelost</div>
        </div>
      </div>
    </Card>
  );
}

/* ───── Data ───── */
const wonenItems = [
  { name: 'Hypotheek', amount: 2318.83, freq: 'Maandelijks', sub: 'Huur / Hypotheek', shop: 'WH Holding', type: 'Uitgave' },
  { name: 'Essent Gas/Energie', amount: 331, freq: 'Maandelijks', sub: 'Gas / Water / Licht', shop: 'Essent', type: 'Uitgave' },
  { name: 'Water', amount: 20, freq: 'Maandelijks', sub: 'Gas / Water / Licht', shop: 'Vitens NV', type: 'Uitgave' },
];

const abonItems = [
  { name: 'TV en internet', amount: 38.50, freq: 'Maandelijks', sub: 'Internet & TV', shop: 'Odido', type: 'Uitgave' },
  { name: 'Netflix', amount: 3.99, freq: 'Maandelijks', sub: 'Streaming', shop: 'Netflix', type: 'Uitgave' },
  { name: 'Bankkosten', amount: 3.45, freq: 'Maandelijks', sub: 'Bankkosten', shop: 'Rabobank', type: 'Uitgave' },
  { name: 'Bankkosten extra pas', amount: 1.20, freq: 'Maandelijks', sub: 'Bankkosten', shop: 'Rabobank', type: 'Uitgave' },
];

const inkomstItems = [
  { name: 'Bijdrage Anne', amount: 1600, freq: 'Maandelijks', sub: 'Salaris / Inkomsten', shop: '—', type: 'Inkomst' },
  { name: 'Bijdrage Ronald', amount: 1600, freq: 'Maandelijks', sub: 'Salaris / Inkomsten', shop: '—', type: 'Inkomst' },
];

const wonenTotal = wonenItems.reduce((s, i) => s + i.amount, 0);
const abonTotal = abonItems.reduce((s, i) => s + i.amount, 0);
const inkomstTotal = inkomstItems.reduce((s, i) => s + i.amount, 0);
const uitgavenTotal = wonenTotal + abonTotal;

const donutSegments = [
  { value: wonenTotal, color: T.blue, label: 'Wonen' },
  { value: abonTotal, color: T.violet, label: 'Abonnementen' },
];

/* ───── Page ───── */
function VasteLasten() {
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
            <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Vaste lasten</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Overzicht van al je terugkerende kosten en inkomsten</div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}>{ICONS.plus} Vaste last toevoegen</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Stat cards + donut */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <StatCard label="Vaste lasten / maand" value={uitgavenTotal} color={T.red} />
                <StatCard label="Vaste inkomsten / maand" value={inkomstTotal} color={T.green} />
                <StatCard label="Restant / maand" value={inkomstTotal - uitgavenTotal} color={T.blue} />
              </div>
            </div>
          </div>

          {/* Donut + legend */}
          <div style={{ display: 'flex', gap: 20 }}>
            <Card style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 14 }}>Verdeling vaste lasten</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {donutSegments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: T.ink2 }}>{seg.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB, marginLeft: 'auto' }}>{fmt(seg.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <MiniDonut segments={donutSegments} size={130} />
            </Card>
          </div>

          {/* Grouped tables */}
          <CategoryGroup
            icon={ICONS.home} title="Wonen" color={T.blue} colorSoft={T.blueSoft}
            items={wonenItems} subtotal={wonenTotal}
          />

          <CategoryGroup
            icon={ICONS.wifi} title="Abonnementen & Telecom" color={T.violet} colorSoft={T.violetSoft}
            items={abonItems} subtotal={abonTotal}
          />

          <CategoryGroup
            icon={ICONS.coin} title="Inkomsten" color={T.green} colorSoft={T.greenSoft}
            items={inkomstItems} subtotal={inkomstTotal}
          />

          {/* Leningen */}
          <LoanSection />

        </div>
      </div>
    </div>
  );
}

export default VasteLasten;
