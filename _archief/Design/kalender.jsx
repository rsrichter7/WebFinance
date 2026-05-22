/* Webfinance — Kalender page (Premium).
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
const fmtShort = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

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
  chevL:     <Ico size={16} d={<path d="M15 18l-6-6 6-6"/>} />,
  chevR:     <Ico size={16} d={<path d="M9 18l6-6-6-6"/>} />,
  arrDown:   <Ico size={11} d={<><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></>} />,
  arrUp:     <Ico size={11} d={<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>} />,
  clock:     <Ico size={12} d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />,
  check:     <Ico size={12} d={<path d="M5 12l5 5 9-12"/>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true, active: true },
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

/* ───── Calendar data for May 2026 ───── */
const MAY_DATA = {
  1:  { expected: [{ name: 'Hypotheek', amount: 2318.83 }], actual: [{ name: 'Hypotheek', amount: 2318.83 }] },
  3:  { expected: [], actual: [{ name: 'Boodschappen', amount: 150.06 }] },
  5:  { expected: [], actual: [{ name: 'Klussen Hornbach', amount: 52.82 }] },
  6:  { expected: [], actual: [{ name: 'Verzekering NH1816', amount: 50.53 }] },
  7:  { expected: [{ name: 'Essent Gas/Energie', amount: 331 }], actual: [{ name: 'Huishouden Kruidvat', amount: 17.70 }] },
  8:  { expected: [], actual: [{ name: 'Lunch station', amount: 9.19 }] },
  13: { expected: [{ name: 'Bijdrage Anne', amount: 1600, income: true }, { name: 'Bijdrage Ronald', amount: 1600, income: true }], actual: [] },
  15: { expected: [{ name: 'Odido TV/Internet', amount: 38.50 }], actual: [] },
  18: { expected: [{ name: 'Vitens Water', amount: 20 }], actual: [] },
  20: { expected: [{ name: 'Rabobank', amount: 4.65 }], actual: [] },
  22: { expected: [{ name: 'Netflix', amount: 3.99 }], actual: [] },
};

const WEEKDAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

/* May 2026 starts on Friday (index 4 in ma-zo) */
const MAY_START_DOW = 4;
const MAY_DAYS = 31;

/* ───── Calendar day cell ───── */
function DayCell({ day, data, today, selected, onClick }) {
  if (!day) {
    return <div style={{ padding: 6, minHeight: 90 }} />;
  }

  const hasExpected = data && data.expected && data.expected.length > 0;
  const hasActual = data && data.actual && data.actual.length > 0;
  const hasIncome = data && data.expected && data.expected.some(e => e.income);
  const totalExpected = data ? (data.expected || []).filter(e => !e.income).reduce((s, e) => s + e.amount, 0) : 0;
  const totalActual = data ? (data.actual || []).reduce((s, a) => s + a.amount, 0) : 0;
  const totalIncome = data ? (data.expected || []).filter(e => e.income).reduce((s, e) => s + e.amount, 0) : 0;
  const isPast = day <= 12;
  const isFuture = day > 12;

  let bgColor = T.card;
  if (isPast && hasActual && totalActual > 500) bgColor = T.redSoft;
  else if (isPast && hasActual) bgColor = T.card;
  if (hasIncome) bgColor = T.greenSoft;

  return (
    <div onClick={onClick} style={{
      padding: 8, minHeight: 90,
      border: `1px solid ${selected ? T.blue : T.border}`,
      borderRadius: 8, background: bgColor,
      cursor: 'pointer',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      boxShadow: selected ? `0 0 0 2px ${T.blueSoft}` : 'none',
      opacity: isFuture ? 0.75 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{
          fontSize: 13, fontWeight: today ? 700 : 500,
          color: today ? T.card : T.ink,
          background: today ? T.blue : 'transparent',
          width: today ? 24 : 'auto', height: today ? 24 : 'auto',
          borderRadius: '50%', display: 'grid', placeItems: 'center',
        }}>{day}</span>
        {isPast && hasExpected && hasActual && (
          <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.check}</span>
        )}
      </div>

      {hasExpected && !hasIncome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
          <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.clock}</span>
          <span style={{ fontSize: 10.5, color: T.blueText, fontWeight: 500, ...TAB }}>{fmtShort(totalExpected)}</span>
        </div>
      )}

      {hasIncome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
          <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.arrUp}</span>
          <span style={{ fontSize: 10.5, color: T.greenText, fontWeight: 500, ...TAB }}>+{fmtShort(totalIncome)}</span>
        </div>
      )}

      {hasActual && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.arrDown}</span>
          <span style={{ fontSize: 10.5, color: T.ink2, fontWeight: 500, ...TAB }}>{fmtShort(totalActual)}</span>
        </div>
      )}
    </div>
  );
}

/* ───── Day detail panel ───── */
function DayDetail({ day, data }) {
  if (!day || !data) return null;
  const hasExpected = data.expected && data.expected.length > 0;
  const hasActual = data.actual && data.actual.length > 0;

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: 18,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 14 }}>
        {day} mei 2026
      </div>

      {hasExpected && (
        <div style={{ marginBottom: hasActual ? 16 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>Verwacht</div>
          {data.expected.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.expected.length - 1 ? `1px solid ${T.rule}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: e.income ? T.green : T.blue, display: 'inline-flex' }}>{e.income ? ICONS.arrUp : ICONS.clock}</span>
                <span style={{ fontSize: 13, color: T.ink }}>{e.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: e.income ? T.green : T.blueText, ...TAB }}>
                {e.income ? '+' : '−'} {fmt(e.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasActual && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>Werkelijk</div>
          {data.actual.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.actual.length - 1 ? `1px solid ${T.rule}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.arrDown}</span>
                <span style={{ fontSize: 13, color: T.ink }}>{a.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB }}>− {fmt(a.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {!hasExpected && !hasActual && (
        <div style={{ fontSize: 13, color: T.ink4, padding: '12px 0' }}>Geen transacties op deze dag</div>
      )}
    </div>
  );
}

/* ───── Page ───── */
function Kalender() {
  const [selectedDay, setSelectedDay] = React.useState(8);

  const cells = [];
  for (let i = 0; i < MAY_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MAY_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const totalExpectedMonth = Object.values(MAY_DATA).reduce((s, d) => s + (d.expected || []).filter(e => !e.income).reduce((s2, e) => s2 + e.amount, 0), 0);
  const totalActualMonth = Object.values(MAY_DATA).reduce((s, d) => s + (d.actual || []).reduce((s2, a) => s2 + a.amount, 0), 0);
  const diff = totalExpectedMonth - totalActualMonth;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Financiële kalender</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
              </div>
              <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Verwachte en werkelijke uitgaven per dag</div>
            </div>
          </div>

          {/* View toggle */}
          <div style={{ display: 'inline-flex', padding: 3, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
            {['Verwacht', 'Werkelijk', 'Beide'].map(o => {
              const active = o === 'Beide';
              return (
                <span key={o} style={{
                  padding: '6px 14px', fontSize: 12.5, fontWeight: 500, borderRadius: 5,
                  background: active ? T.card : 'transparent', color: active ? T.ink : T.ink3,
                  boxShadow: active ? '0 1px 2px rgba(17,24,39,0.06)' : 'none', cursor: 'pointer',
                }}>{o}</span>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button style={{ border: `1px solid ${T.border}`, background: T.card, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'inline-flex', color: T.ink3 }}>{ICONS.chevL}</button>
            <span style={{ fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>mei 2026</span>
            <button style={{ border: `1px solid ${T.border}`, background: T.card, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'inline-flex', color: T.ink3 }}>{ICONS.chevR}</button>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {/* Calendar grid */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
                boxShadow: T.shadow, overflow: 'hidden',
              }}>
                {/* Weekday headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${T.border}` }}>
                  {WEEKDAYS.map(d => (
                    <div key={d} style={{
                      padding: '10px 8px', textAlign: 'center',
                      fontSize: 11.5, fontWeight: 500, color: T.ink4,
                      textTransform: 'uppercase', letterSpacing: 0.3,
                      background: T.cardAlt,
                    }}>{d}</div>
                  ))}
                </div>

                {/* Weeks */}
                <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                      {week.map((day, di) => (
                        <DayCell
                          key={di}
                          day={day}
                          data={day ? MAY_DATA[day] : null}
                          today={day === 12}
                          selected={day === selectedDay}
                          onClick={() => day && setSelectedDay(day)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Month totals bar */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16,
              }}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', boxShadow: T.shadow }}>
                  <div style={{ fontSize: 11, color: T.ink4, fontWeight: 500, marginBottom: 4 }}>Verwachte uitgaven</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.blueText, ...TAB }}>{fmt(totalExpectedMonth)}</div>
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', boxShadow: T.shadow }}>
                  <div style={{ fontSize: 11, color: T.ink4, fontWeight: 500, marginBottom: 4 }}>Werkelijke uitgaven</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, ...TAB }}>{fmt(totalActualMonth)}</div>
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', boxShadow: T.shadow }}>
                  <div style={{ fontSize: 11, color: T.ink4, fontWeight: 500, marginBottom: 4 }}>Verschil</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: diff >= 0 ? T.green : T.red, ...TAB }}>
                    {diff >= 0 ? '−' : '+'} {fmt(Math.abs(diff))}
                  </div>
                  <div style={{ fontSize: 11, color: T.ink4, marginTop: 2 }}>{diff >= 0 ? 'Onder verwachting' : 'Boven verwachting'}</div>
                </div>
              </div>
            </div>

            {/* Day detail panel */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <DayDetail day={selectedDay} data={MAY_DATA[selectedDay] || { expected: [], actual: [] }} />

              {/* Legend */}
              <div style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
                boxShadow: T.shadow, padding: 16, marginTop: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 12 }}>Legenda</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.clock}</span>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Verwachte uitgave (vaste last)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.arrDown}</span>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Werkelijke uitgave</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.arrUp}</span>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Inkomst</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.check}</span>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Verwacht en betaald</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: T.redSoft, border: `1px solid #FECACA` }} />
                    <span style={{ fontSize: 12, color: T.ink3 }}>Hoge uitgave (&gt;€500)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: T.greenSoft, border: `1px solid #A7F3D0` }} />
                    <span style={{ fontSize: 12, color: T.ink3 }}>Inkomsten verwacht</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Kalender;
