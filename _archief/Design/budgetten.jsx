/* Webfinance — Budgetten page.
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
  amberText: '#92400E',
  violet:    '#7C3AED',
  violetSoft:'#F5F3FF',
  teal:      '#0D9488',
  tealSoft:  '#F0FDFA',

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
};
const TAB = { fontVariantNumeric: 'tabular-nums' };
const FONT = "'Inter', system-ui, sans-serif";

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
  chevDown:  <Ico size={14} d={<path d="M6 9l6 6 6-6"/>} />,
  chevRight: <Ico size={14} d={<path d="M9 18l6-6-6-6"/>} />,
  edit:      <Ico size={14} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4z"/></>} />,
  target:    <Ico size={16} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
  piggy:     <Ico size={16} d={<><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.3-12 6 0 0 .5 3 7 3 1 2 2 3 5 3 .5 0 1 0 1.5-.5L19 19l0-3c1.5-1 2-3.5 2-5 0-2-1-4-2-6z"/><path d="M2 9.5a2 2 0 1 0 0-3"/></>} />,
  home:      <Ico size={15} d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  car:       <Ico size={15} d={<><path d="M5 17h14"/><path d="M6 17V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></>} />,
  cart:      <Ico size={15} d={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>} />,
  coffee:    <Ico size={15} d={<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></>} />,
  wifi:      <Ico size={15} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></>} />,
  sun:       <Ico size={15} d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />,
};

const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget, active: true },
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
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
            )}
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
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, padding: 22, ...style }}>{children}</div>
  );
}

/* ───── Stat card ───── */
function StatCard({ label, value, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.ink, ...TAB, letterSpacing: -0.5 }}>{fmt(value)}</div>
    </Card>
  );
}

/* ───── Progress bar ───── */
function ProgressBar({ pct, size = 8 }) {
  const color = pct < 60 ? T.green : pct < 80 ? T.amber : T.red;
  const bgColor = pct < 60 ? T.greenSoft : pct < 80 ? T.amberSoft : T.redSoft;
  return (
    <div style={{ height: size, background: T.rule, borderRadius: size / 2, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: size / 2, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function PctBadge({ pct }) {
  const color = pct < 60 ? T.greenText : pct < 80 ? T.amberText : T.redText;
  const bg = pct < 60 ? T.greenSoft : pct < 80 ? T.amberSoft : T.redSoft;
  return (
    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: bg, color, ...TAB }}>{pct.toFixed(0)}%</span>
  );
}

/* ───── 50/30/20 Rule section ───── */
function RuleSection() {
  const income = 6138.98;
  const rules = [
    { label: 'Noodzaak', pct: 50, budget: income * 0.5, spent: 2369.36, color: T.blue, bg: T.blueSoft, icon: ICONS.home, desc: 'Vaste lasten en basisbehoeften' },
    { label: 'Wens', pct: 30, budget: income * 0.3, spent: 229.77, color: T.violet, bg: T.violetSoft, icon: ICONS.coffee, desc: 'Leuke dingen en persoonlijke keuzes' },
    { label: 'Sparen', pct: 20, budget: income * 0.2, spent: 0, color: T.teal, bg: T.tealSoft, icon: ICONS.piggy, desc: 'Spaargeld, beleggen en aflossingen' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>50 / 30 / 20 regel</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Gebaseerd op gezamenlijk netto inkomen van {fmt(income)}</div>
        </div>
        <div style={{ display: 'inline-flex', padding: 3, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
          {['50/30/20', 'Handmatig'].map(o => {
            const active = o === '50/30/20';
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rules.map(r => {
          const usedPct = r.budget > 0 ? (r.spent / r.budget) * 100 : 0;
          const remaining = r.budget - r.spent;
          return (
            <Card key={r.label} style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: r.bg, display: 'grid', placeItems: 'center', color: r.color, flexShrink: 0 }}>
                  {r.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{r.label}</span>
                      <span style={{ fontSize: 12, color: T.ink3 }}>({r.pct}%)</span>
                    </div>
                    <PctBadge pct={usedPct} />
                  </div>
                  <div style={{ fontSize: 12, color: T.ink3, marginBottom: 10 }}>{r.desc}</div>
                  <ProgressBar pct={usedPct} size={10} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: T.ink3 }}>
                      Besteed: <span style={{ color: T.ink, fontWeight: 500, ...TAB }}>{fmt(r.spent)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.ink3 }}>
                      Budget: <span style={{ color: T.ink, fontWeight: 500, ...TAB }}>{fmt(r.budget)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.ink3 }}>
                      Resterend: <span style={{ color: remaining >= 0 ? T.green : T.red, fontWeight: 500, ...TAB }}>{fmt(remaining)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ───── Category budget row ───── */
function CategoryBudgetRow({ icon, name, budget, spent, subs, expanded }) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;
  const hasSubs = subs && subs.length > 0;

  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 120px 200px 100px 40px',
        alignItems: 'center', padding: '14px 18px',
        borderBottom: `1px solid ${T.rule}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hasSubs && (
            <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'pointer' }}>
              {expanded ? ICONS.chevDown : ICONS.chevRight}
            </span>
          )}
          {!hasSubs && <span style={{ width: 14 }} />}
          <span style={{ color: T.ink3, display: 'inline-flex' }}>{icon}</span>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{name}</span>
        </div>
        <div style={{ fontSize: 13, color: T.ink, fontWeight: 500, ...TAB, textAlign: 'right' }}>{fmt(budget)}</div>
        <div style={{ fontSize: 13, color: T.ink2, ...TAB, textAlign: 'right' }}>{fmt(spent)}</div>
        <div style={{ padding: '0 12px' }}><ProgressBar pct={pct} /></div>
        <div style={{ textAlign: 'right' }}><PctBadge pct={pct} /></div>
        <div style={{ display: 'flex', justifyContent: 'center', color: T.ink4, cursor: 'pointer' }}>{ICONS.edit}</div>
      </div>
      {expanded && subs && subs.map((sub, i) => {
        const subPct = sub.budget > 0 ? (sub.spent / sub.budget) * 100 : 0;
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 120px 200px 100px 40px',
            alignItems: 'center', padding: '10px 18px 10px 62px',
            borderBottom: `1px solid ${T.rule}`,
            background: T.cardAlt,
          }}>
            <div style={{ fontSize: 13, color: T.ink3 }}>{sub.name}</div>
            <div style={{ fontSize: 12.5, color: T.ink3, ...TAB, textAlign: 'right' }}>{fmt(sub.budget)}</div>
            <div style={{ fontSize: 12.5, color: T.ink3, ...TAB, textAlign: 'right' }}>{fmt(sub.spent)}</div>
            <div style={{ padding: '0 12px' }}><ProgressBar pct={subPct} size={6} /></div>
            <div style={{ textAlign: 'right' }}><PctBadge pct={subPct} /></div>
            <div />
          </div>
        );
      })}
    </div>
  );
}

/* ───── Savings goals ───── */
function SavingsGoal({ name, target, current, deadline }) {
  const pct = target > 0 ? (current / target) * 100 : 0;
  return (
    <div style={{ padding: '16px 0', borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.target}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{name}</span>
          {deadline && <span style={{ fontSize: 11.5, color: T.ink4, background: T.bg, padding: '2px 8px', borderRadius: 4, border: `1px solid ${T.border}` }}>{deadline}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: T.ink3, ...TAB }}>{fmt(current)} / {fmt(target)}</span>
          <button style={{
            padding: '5px 12px', borderRadius: 6, border: `1px solid ${T.border}`,
            background: T.card, fontSize: 12, fontWeight: 500, color: T.blue, cursor: 'pointer',
          }}>Storten</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ height: 8, background: T.rule, borderRadius: 4, overflow: 'hidden', flex: 1 }}>
          <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: T.blue, borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.ink3, ...TAB, minWidth: 36, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

/* ───── Page ───── */
function Budgetten() {
  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: FONT,
      background: T.bg, color: T.ink,
      display: 'flex',
      fontWeight: 400, letterSpacing: -0.05,
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
            <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Budgetten</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Beheer je budgetten en spaardoelen · mei 2026</div>
          </div>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}>{ICONS.plus} Budget instellen</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <StatCard label="Totaal budget" value={6138.98} color={T.ink} />
            <StatCard label="Totaal besteed" value={2599.13} color={T.red} />
            <StatCard label="Totaal resterend" value={3539.85} color={T.green} />
          </div>

          {/* 50/30/20 Rule */}
          <RuleSection />

          {/* Budget per categorie */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Budget per categorie</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Klik op een categorie om subcategorieën te zien</div>
              </div>
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 120px 200px 100px 40px',
              padding: '10px 18px', background: T.cardAlt, borderBottom: `1px solid ${T.border}`,
              fontSize: 11.5, fontWeight: 500, color: T.ink3, letterSpacing: 0.3, textTransform: 'uppercase',
            }}>
              <div>Categorie</div>
              <div style={{ textAlign: 'right' }}>Budget</div>
              <div style={{ textAlign: 'right' }}>Besteed</div>
              <div style={{ paddingLeft: 12 }}>Voortgang</div>
              <div style={{ textAlign: 'right' }}>Status</div>
              <div />
            </div>

            {/* Category rows */}
            <CategoryBudgetRow
              icon={ICONS.home} name="Wonen" budget={2700} spent={2318.83} expanded={true}
              subs={[
                { name: 'Huur / Hypotheek', budget: 2400, spent: 2318.83 },
                { name: 'Gas / Water / Licht', budget: 350, spent: 0 },
                { name: 'Verzekeringen', budget: 100, spent: 0 },
              ]}
            />
            <CategoryBudgetRow
              icon={ICONS.cart} name="Dagelijks leven" budget={300} spent={176.95} expanded={true}
              subs={[
                { name: 'Boodschappen', budget: 200, spent: 150.06 },
                { name: 'Horeca & Afhaal', budget: 60, spent: 9.19 },
                { name: 'Verzorging & Huishouden', budget: 40, spent: 17.70 },
              ]}
            />
            <CategoryBudgetRow icon={ICONS.home} name="Verbouwing" budget={100} spent={52.82} expanded={false} subs={[{ name: 'Onderhoud / Verbouwing', budget: 100, spent: 52.82 }]} />
            <CategoryBudgetRow icon={ICONS.wifi} name="Abonnementen & Telecom" budget={60} spent={14.99} expanded={false} subs={[{ name: 'Streaming', budget: 20, spent: 14.99 }, { name: 'Internet & TV', budget: 40, spent: 0 }]} />
            <CategoryBudgetRow icon={ICONS.sun} name="Vrije tijd" budget={200} spent={0} expanded={false} subs={[]} />
            <CategoryBudgetRow icon={ICONS.car} name="Vervoer" budget={150} spent={0} expanded={false} subs={[]} />

            {/* Add budget */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 8, color: T.blue, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
              Budget toevoegen
            </div>
          </Card>

          {/* Spaardoelen */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.piggy}</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Spaardoelen</div>
              </div>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.card,
                fontSize: 12.5, fontWeight: 500, color: T.ink2, cursor: 'pointer',
              }}>{ICONS.plus} Spaardoel toevoegen</button>
            </div>
            <SavingsGoal name="Vakantie 2026" target={3000} current={0} deadline="aug 2026" />
            <SavingsGoal name="Keuken" target={15000} current={0} deadline={null} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Budgetten;
