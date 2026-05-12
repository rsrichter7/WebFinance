/* Webfinance — Transacties page.
   Mirrors the Dashboard tokens / chrome (Inter, bento, soft borders).
   Self-contained so we can iterate on this page without touching dashboard.jsx. */

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

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
  shadowOverlay: '0 20px 40px -8px rgba(17,24,39,0.18), 0 4px 12px rgba(17,24,39,0.06)',
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
  search:    <Ico size={16} d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />,
  bell:      <Ico size={16} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  plus:      <Ico size={14} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  lock:      <Ico size={13} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  chev:      <Ico size={14} d={<path d="M6 9l6 6 6-6"/>} />,
  sortAsc:   <Ico size={12} d={<><path d="M12 4v16"/><path d="M6 10l6-6 6 6"/></>} />,
  sortDef:   <Ico size={12} d={<><path d="M7 9l5-5 5 5"/><path d="M7 15l5 5 5-5"/></>} />,
  edit:      <Ico size={14} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/></>} />,
  trash:     <Ico size={14} d={<><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></>} />,
  arrDown:   <Ico size={12} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  arrUp:     <Ico size={12} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  close:     <Ico size={16} d={<><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>} />,
  cal2:      <Ico size={14} d={<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4"/><path d="M16 2v4"/></>} />,
  filter:    <Ico size={14} d={<path d="M3 4h18l-7 9v6l-4 2v-8z"/>} />,
  upload:    <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></>} />,
  more:      <Ico size={16} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>} />,
  check:     <Ico size={12} d={<path d="M5 12l5 5 9-12"/>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx, active: true },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
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

/* ───── Top bar (page-specific) ───── */
function TopBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
    }}>
      <div>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Transacties</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Alle mutaties · mei 2026</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card,
          color: T.ink2, fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
        }}>
          <span style={{ color: T.ink3, display: 'inline-flex' }}>{ICONS.lock}</span>
          Importeren
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
            background: T.amberSoft, color: T.amber, letterSpacing: 0.3,
          }}>PREMIUM</span>
        </button>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: 'none', background: T.blue, color: '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
        }}>{ICONS.plus} Nieuwe transactie</button>
      </div>
    </div>
  );
}

/* ───── Filter dropdown ───── */
function Dropdown({ label, value, icon }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 10px', borderRadius: 8,
      border: `1px solid ${T.border}`, background: T.card,
      fontSize: 13, color: T.ink2, cursor: 'pointer',
      minWidth: 0,
    }}>
      {icon && <span style={{ color: T.ink3, display: 'inline-flex' }}>{icon}</span>}
      <span style={{ color: T.ink3 }}>{label}:</span>
      <span style={{ color: T.ink, fontWeight: 500 }}>{value}</span>
      <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.chev}</span>
    </div>
  );
}

/* ───── Soort badge ───── */
function SoortBadge({ kind }) {
  const map = {
    Noodzaak: { bg: T.bg, fg: T.ink2, border: T.border },
    Wens:     { bg: T.blueSoft, fg: T.blueText, border: '#DBEAFE' },
    Sparen:   { bg: T.greenSoft, fg: T.greenText, border: '#A7F3D0' },
  };
  const s = map[kind] || map.Noodzaak;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', fontSize: 11.5, fontWeight: 500,
      background: s.bg, color: s.fg,
      border: `1px solid ${s.border}`, borderRadius: 999,
    }}>{kind}</span>
  );
}

/* ───── Person chip ───── */
function PersonChip({ name }) {
  const init = name === 'Ronald' ? 'RR' : 'AM';
  const palette = name === 'Ronald'
    ? { bg: '#E0E7FF', fg: '#3730A3' }
    : { bg: '#FCE7F3', fg: '#9D174D' };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: palette.bg, color: palette.fg,
        display: 'grid', placeItems: 'center',
        fontSize: 10, fontWeight: 600,
      }}>{init}</span>
      <span style={{ fontSize: 13, color: T.ink2 }}>{name}</span>
    </div>
  );
}

/* ───── Data ───── */
const ROWS = [
  { date: '8 mei',  amount:    9.19, type: 'Uitgave', desc: 'Lunch station',            cat: 'Dagelijks leven',      sub: 'Horeca & Afhaal',          shop: 'Kiosk',         kind: 'Wens',     who: 'Ronald' },
  { date: '7 mei',  amount:   17.70, type: 'Uitgave', desc: 'Huishoudelijke producten', cat: 'Dagelijks leven',      sub: 'Verzorging & Huishouden',  shop: 'Kruidvat',      kind: 'Noodzaak', who: 'Anne' },
  { date: '6 mei',  amount:   50.53, type: 'Uitgave', desc: 'Woningverzekering',        cat: 'Wonen',                sub: 'Woningverzekeringen',      shop: 'NH1816',        kind: 'Noodzaak', who: 'Ronald' },
  { date: '5 mei',  amount:   52.82, type: 'Uitgave', desc: 'Gereedschap en materiaal', cat: 'Wonen',                sub: 'Onderhoud / Verbouwing',   shop: 'Hornbach',      kind: 'Wens',     who: 'Ronald' },
  { date: '3 mei',  amount:  150.06, type: 'Uitgave', desc: 'Wekelijkse boodschappen',  cat: 'Dagelijks leven',      sub: 'Boodschappen',             shop: 'Albert Heijn',  kind: 'Noodzaak', who: 'Anne' },
  { date: '1 mei',  amount: 2318.83, type: 'Uitgave', desc: 'Hypotheek mei',            cat: 'Wonen',                sub: 'Huur / Hypotheek',         shop: 'WH Holding',    kind: 'Noodzaak', who: 'Ronald' },
  { date: '5 apr',  amount: 1600.00, type: 'Inkomst', desc: 'Salaris Anne',             cat: 'Financieel',           sub: 'Salaris / Inkomsten',      shop: 'A.M.M. de Reus',kind: 'Noodzaak', who: 'Anne' },
  { date: '5 apr',  amount: 1600.00, type: 'Inkomst', desc: 'Salaris Ronald',           cat: 'Financieel',           sub: 'Salaris / Inkomsten',      shop: 'R.S. Richter',  kind: 'Noodzaak', who: 'Ronald' },
  { date: '10 apr', amount:  331.00, type: 'Uitgave', desc: 'Energie maandfactuur',     cat: 'Wonen',                sub: 'Gas / Water / Licht',      shop: 'Essent',        kind: 'Noodzaak', who: 'Ronald' },
  { date: '12 apr', amount:   14.99, type: 'Uitgave', desc: 'Spotify abonnement',       cat: 'Abonnementen & Telecom', sub: 'Streaming',              shop: 'Spotify',       kind: 'Wens',     who: 'Ronald' },
];

const fmt = (n) => n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ───── Filters card ───── */
function Filters() {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      boxShadow: T.shadow,
      padding: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          flex: '1 1 280px', minWidth: 240,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8,
        }}>
          <span style={{ color: T.ink3, display: 'inline-flex' }}>{ICONS.search}</span>
          <span style={{ fontSize: 13, color: T.ink4 }}>Zoek op omschrijving of winkel…</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, padding: '2px 6px', border: `1px solid ${T.border}`, borderRadius: 4, color: T.ink4 }}>⌘K</span>
        </div>

        <Dropdown label="Type"      value="Alles" />
        <Dropdown label="Categorie" value="Alle" />
        <Dropdown label="Soort"     value="Alles" />
        <Dropdown label="Wie"       value="Iedereen" />
        <Dropdown label="Maand"     value="Mei 2026" icon={ICONS.cal2} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: `1px solid ${T.rule}`, paddingTop: 12,
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            background: T.redSoft, color: T.red,
            fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red }} />
            <span style={{ color: T.ink3, fontWeight: 400 }}>Uitgaven</span>
            <span style={{ color: T.ink, ...TAB }}>€2.599,13</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            background: T.greenSoft, color: T.green,
            fontSize: 13, fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} />
            <span style={{ color: T.ink3, fontWeight: 400 }}>Inkomsten</span>
            <span style={{ color: T.ink, ...TAB }}>€3.200,00</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 8,
            background: T.bg, color: T.ink2,
            fontSize: 13, fontWeight: 500,
            border: `1px solid ${T.border}`,
          }}>
            <span style={{ color: T.ink3, fontWeight: 400 }}>Saldo</span>
            <span style={{ color: T.ink, ...TAB }}>+€600,87</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T.ink3 }}>
          {ICONS.filter}
          <span>Filters aanpassen</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Table ───── */
function TxTable() {
  const cols = '92px 130px 1.4fr 1.1fr 1fr 110px 130px 70px';
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      boxShadow: T.shadow,
      overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols,
        padding: '12px 18px',
        borderBottom: `1px solid ${T.border}`,
        background: T.cardAlt,
        fontSize: 11.5, fontWeight: 500, color: T.ink3,
        letterSpacing: 0.3, textTransform: 'uppercase',
      }}>
        {[
          ['Datum', true], ['Bedrag', true], ['Omschrijving', true],
          ['Categorie', false], ['Winkel / Bron', false],
          ['Soort', false], ['Wie', false], ['', false],
        ].map(([h, sortable], i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            justifyContent: i === 1 ? 'flex-end' : 'flex-start',
            paddingRight: i === 1 ? 18 : 0,
          }}>
            {h}
            {sortable && <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.sortDef}</span>}
          </div>
        ))}
      </div>

      {ROWS.map((r, i) => {
        const isIncome = r.type === 'Inkomst';
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: cols,
            padding: '14px 18px',
            background: i % 2 === 1 ? T.cardAlt : T.card,
            borderBottom: i === ROWS.length - 1 ? 'none' : `1px solid ${T.rule}`,
            fontSize: 13.5, color: T.ink2,
            alignItems: 'center',
          }}>
            <div style={{ color: T.ink3, ...TAB }}>{r.date}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', paddingRight: 18, color: T.ink, fontWeight: 500, ...TAB }}>
              <span style={{ color: isIncome ? T.green : T.ink4, display: 'inline-flex' }}>
                {isIncome ? ICONS.arrUp : ICONS.arrDown}
              </span>
              €{fmt(r.amount)}
            </div>
            <div style={{ color: T.ink, fontWeight: 500 }}>{r.desc}</div>
            <div>
              <div style={{ color: T.ink2 }}>{r.cat}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{r.sub}</div>
            </div>
            <div style={{ color: T.ink3 }}>{r.shop}</div>
            <div><SoortBadge kind={r.kind} /></div>
            <div><PersonChip name={r.who} /></div>
            <div style={{ display: 'inline-flex', gap: 4, justifyContent: 'flex-end', color: T.ink4 }}>
              <button style={{ border: 'none', background: 'transparent', padding: 6, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}>{ICONS.edit}</button>
              <button style={{ border: 'none', background: 'transparent', padding: 6, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}>{ICONS.trash}</button>
            </div>
          </div>
        );
      })}

      {/* footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px',
        borderTop: `1px solid ${T.border}`,
        background: T.cardAlt,
        fontSize: 12.5, color: T.ink3,
      }}>
        <span><span style={{ color: T.ink, fontWeight: 500 }}>28</span> transacties</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Vorige','1','2','3','Volgende'].map((p, i) => {
            const active = p === '1';
            return (
              <span key={i} style={{
                minWidth: 28, padding: '4px 10px',
                fontSize: 12.5, textAlign: 'center', cursor: 'pointer',
                borderRadius: 6,
                background: active ? T.ink : 'transparent',
                color: active ? '#fff' : T.ink2,
                border: `1px solid ${active ? T.ink : T.border}`,
              }}>{p}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───── Slide-in panel: New transaction ───── */
function NewTxPanel() {
  const Field = ({ label, children, sub, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: T.ink2 }}>
        {label}{required && <span style={{ color: T.red, marginLeft: 2 }}>*</span>}
        {sub && <span style={{ color: T.ink4, fontWeight: 400, marginLeft: 6 }}>{sub}</span>}
      </label>
      {children}
    </div>
  );
  const Input = ({ ph, value, suffix, prefix, big }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: big ? '10px 14px' : '8px 12px',
      border: `1px solid ${T.border}`, borderRadius: 8,
      background: T.card,
      fontSize: big ? 18 : 13,
      ...(big ? TAB : {}),
    }}>
      {prefix && <span style={{ color: T.ink3, fontWeight: big ? 500 : 400 }}>{prefix}</span>}
      <span style={{ flex: 1, color: value ? T.ink : T.ink4, fontWeight: big ? 600 : 400 }}>
        {value || ph}
      </span>
      {suffix && <span style={{ color: T.ink4 }}>{suffix}</span>}
    </div>
  );
  const Seg = ({ options, value }) => (
    <div style={{ display: 'inline-flex', padding: 3, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
      {options.map(o => {
        const active = o === value;
        return (
          <span key={o} style={{
            padding: '6px 14px', fontSize: 12.5, fontWeight: 500,
            borderRadius: 5,
            background: active ? T.card : 'transparent',
            color: active ? T.ink : T.ink3,
            boxShadow: active ? '0 1px 2px rgba(17,24,39,0.06)' : 'none',
            cursor: 'pointer',
          }}>{o}</span>
        );
      })}
    </div>
  );

  return (
    <aside style={{
      position: 'absolute', top: 0, right: 0, bottom: 0,
      width: 460,
      background: T.card,
      borderLeft: `1px solid ${T.border}`,
      boxShadow: T.shadowOverlay,
      display: 'flex', flexDirection: 'column',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 22px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Nieuwe transactie</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Voeg een mutatie toe aan mei 2026</div>
        </div>
        <button style={{ border: 'none', background: 'transparent', color: T.ink3, padding: 6, borderRadius: 6, cursor: 'pointer', display: 'inline-flex' }}>{ICONS.close}</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Type toggle */}
        <Field label="Type" required>
          <Seg options={['Uitgave','Inkomst']} value="Uitgave" />
        </Field>

        {/* Amount + date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
          <Field label="Bedrag" required>
            <Input prefix="€" value="0,00" big />
          </Field>
          <Field label="Datum" required>
            <Input ph="Vandaag" value="8 mei 2026" suffix={ICONS.cal2} />
          </Field>
        </div>

        <Field label="Omschrijving" required>
          <Input ph="bv. Lunch station" />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Categorie" required>
            <Input ph="Kies categorie" suffix={ICONS.chev} value="Dagelijks leven" />
          </Field>
          <Field label="Subcategorie">
            <Input ph="Kies subcategorie" suffix={ICONS.chev} value="Horeca & Afhaal" />
          </Field>
        </div>

        <Field label="Winkel / Bron">
          <Input ph="bv. Albert Heijn" />
        </Field>

        <Field label="Soort" required>
          <Seg options={['Noodzaak','Wens','Sparen']} value="Noodzaak" />
        </Field>

        <Field label="Wie" required>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Ronald','Anne'].map((n, i) => {
              const active = i === 0;
              return (
                <div key={n} style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8,
                  border: `1px solid ${active ? T.blue : T.border}`,
                  background: active ? T.blueSoft : T.card,
                  cursor: 'pointer',
                }}>
                  <PersonChip name={n} />
                  {active && <span style={{ marginLeft: 'auto', color: T.blue, display: 'inline-flex' }}>{ICONS.check}</span>}
                </div>
              );
            })}
          </div>
        </Field>

        <Field label="Notitie" sub="optioneel">
          <div style={{
            padding: '8px 12px', minHeight: 64,
            border: `1px solid ${T.border}`, borderRadius: 8,
            background: T.card, fontSize: 13, color: T.ink4,
          }}>Voeg een toelichting toe…</div>
        </Field>
      </div>

      <div style={{
        display: 'flex', gap: 8,
        padding: '14px 22px',
        borderTop: `1px solid ${T.border}`,
        background: T.cardAlt,
      }}>
        <button style={{
          flex: 1, padding: '10px 16px', borderRadius: 8,
          border: 'none', background: T.blue, color: '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>Opslaan</button>
        <button style={{
          flex: 1, padding: '10px 16px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card, color: T.ink,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>Opslaan en volgende</button>
      </div>
    </aside>
  );
}

/* ───── Page ───── */
function Transacties({ panelOpen }) {
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
          <Filters />
          <TxTable />
        </div>
      </div>

      {panelOpen && (
        <React.Fragment>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(17,24,39,0.18)',
            zIndex: 9,
          }} />
          <NewTxPanel />
        </React.Fragment>
      )}
    </div>
  );
}

window.Transacties = Transacties;
