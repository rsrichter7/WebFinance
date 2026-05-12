/* Webfinance — Instellingen page.
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
  chevDown:  <Ico size={14} d={<path d="M6 9l6 6 6-6"/>} />,
  chevRight: <Ico size={14} d={<path d="M9 18l6-6-6-6"/>} />,
  grip:      <Ico size={14} d={<><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></>} />,
  users:     <Ico size={16} d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  palette:   <Ico size={16} d={<><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.64 1.5-1.5 0-.38-.15-.74-.41-1.01-.27-.27-.41-.63-.41-1.01 0-.86.64-1.5 1.5-1.5h1.77A5.98 5.98 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></>} />,
  bell:      <Ico size={16} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  link:      <Ico size={16} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
  user:      <Ico size={16} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  download:  <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />,
  globe:     <Ico size={14} d={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>} />,
  sun:       <Ico size={14} d={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />,
  moon:      <Ico size={14} d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} />,
  monitor:   <Ico size={14} d={<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>} />,
};

/* ───── Sidebar ───── */
function Sidebar() {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true },
    { k: 'set',   label: 'Instellingen', icon: ICONS.settings, active: true },
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

/* ───── Section card ───── */
function Section({ icon, title, description, children }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: T.blue, display: 'inline-flex' }}>{icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{title}</div>
          {description && <div style={{ fontSize: 12, color: T.ink3, marginTop: 1 }}>{description}</div>}
        </div>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  );
}

/* ───── Toggle switch ───── */
function Toggle({ on }) {
  return (
    <div style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? T.blue : T.borderHi,
      padding: 2, cursor: 'pointer',
      display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background 0.2s',
    }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  );
}

/* ───── Setting row ───── */
function SettingRow({ label, description, children, border = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: border ? `1px solid ${T.rule}` : 'none',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>{children}</div>
    </div>
  );
}

/* ───── Dropdown ───── */
function Select({ value, width = 180 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '7px 12px', borderRadius: 8,
      border: `1px solid ${T.border}`, background: T.card,
      fontSize: 13, color: T.ink, fontWeight: 400,
      cursor: 'pointer', width, justifyContent: 'space-between',
    }}>
      <span>{value}</span>
      <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.chevDown}</span>
    </div>
  );
}

/* ───── Category item ───── */
function CategoryItem({ name, subs, expanded }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 0', borderBottom: `1px solid ${T.rule}`,
      }}>
        <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'grab' }}>{ICONS.grip}</span>
        <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'pointer' }}>
          {expanded ? ICONS.chevDown : ICONS.chevRight}
        </span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: T.ink }}>{name}</span>
        <span style={{ fontSize: 11, color: T.ink4 }}>{subs.length} sub</span>
        <button style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.trash}</button>
      </div>
      {expanded && subs.map((sub, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 0 8px 44px', borderBottom: `1px solid ${T.rule}`,
          background: T.cardAlt,
        }}>
          <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'grab' }}>{ICONS.grip}</span>
          <span style={{ flex: 1, fontSize: 12.5, color: T.ink3 }}>{sub}</span>
          <button style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.trash}</button>
        </div>
      ))}
    </div>
  );
}

/* ───── Person row ───── */
function PersonRow({ name, initials, color, salary }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0', borderBottom: `1px solid ${T.rule}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: color.bg, color: color.fg,
        display: 'grid', placeItems: 'center',
        fontSize: 13, fontWeight: 600,
      }}>{initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{name}</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 1 }}>Netto salaris: <span style={{ fontWeight: 500, color: T.ink, ...TAB }}>{fmt(salary)}</span></div>
      </div>
      <button style={{ border: 'none', background: 'transparent', padding: 6, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.edit}</button>
    </div>
  );
}

/* ───── Theme option ───── */
function ThemeOption({ icon, label, active }) {
  return (
    <div style={{
      flex: 1, padding: '14px 16px', borderRadius: 10,
      border: `1.5px solid ${active ? T.blue : T.border}`,
      background: active ? T.blueSoft : T.card,
      cursor: 'pointer', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      <span style={{ color: active ? T.blue : T.ink3, display: 'inline-flex' }}>{icon}</span>
      <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 400, color: active ? T.blueText : T.ink3 }}>{label}</span>
    </div>
  );
}

/* ───── Page ───── */
function Instellingen() {
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
            <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Instellingen</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Beheer je app-voorkeuren en accountgegevens</div>
          </div>
        </div>

        {/* Content — max width for readability */}
        <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ maxWidth: 720, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ─── Categorieën ─── */}
            <Section icon={ICONS.settings} title="Categorieën" description="Beheer hoofd- en subcategorieën voor je transacties">
              <CategoryItem name="Wonen" expanded={true} subs={['Huur / Hypotheek', 'Gas / Water / Licht', 'Gemeentelijke belastingen', 'Verzekeringen (woning)', 'Onderhoud / Verbouwing']} />
              <CategoryItem name="Vervoer" expanded={false} subs={['Brandstof / Laden', 'Auto-onderhoud', 'Parkeren', 'Openbaar vervoer']} />
              <CategoryItem name="Dagelijks leven" expanded={false} subs={['Boodschappen', 'Horeca & Afhaal', 'Verzorging & Huishouden']} />
              <CategoryItem name="Abonnementen & Telecom" expanded={false} subs={['Streaming', 'Internet & TV', 'Telefoon', 'Bankkosten', 'Overige abonnementen']} />
              <CategoryItem name="Vrije tijd" expanded={false} subs={['Vakantie', 'Shoppen', 'Sport & Hobby', 'Cadeaus', 'Uitgaan']} />
              <CategoryItem name="Financieel" expanded={false} subs={['Salaris / Inkomsten', 'Leningen', 'Sparen', 'Onvoorzien / Buffer', 'Belastingteruggave']} />
              <CategoryItem name="Overig" expanded={false} subs={['Overig']} />

              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <input type="text" placeholder="Nieuwe categorie..." style={{
                  flex: 1, padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8,
                  fontSize: 13, fontFamily: FONT, color: T.ink, outline: 'none',
                }} />
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: 'none', background: T.blue, color: '#fff',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>{ICONS.plus} Toevoegen</button>
              </div>
              <div style={{ fontSize: 12, color: T.ink4, marginTop: 8 }}>Klik op een categorie om subcategorieën te zien en toe te voegen</div>
            </Section>

            {/* ─── Huishouden ─── */}
            <Section icon={ICONS.users} title="Huishouden" description="Personen en salarisverdeling">
              <PersonRow name="Ronald Richter" initials="RR" color={{ bg: '#E0E7FF', fg: '#3730A3' }} salary={3138.98} />
              <PersonRow name="Anne de Reus" initials="AM" color={{ bg: '#FCE7F3', fg: '#9D174D' }} salary={3000} />

              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: T.blue, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
                Persoon toevoegen
              </div>

              <div style={{ marginTop: 20, padding: '14px 0', borderTop: `1px solid ${T.rule}` }}>
                <SettingRow label="Verdeelmethode" description="Hoe worden gezamenlijke kosten verdeeld?" border={false}>
                  <Select value="Naar ratio" />
                </SettingRow>
              </div>

              <div style={{
                marginTop: 8, padding: 14, background: T.blueSoft, borderRadius: 10,
                border: `1px solid #DBEAFE`, fontSize: 12.5, color: T.blueText,
              }}>
                Totaal huishoudinkomen: <span style={{ fontWeight: 600, ...TAB }}>{fmt(6138.98)}</span>
                <span style={{ color: T.ink3, marginLeft: 8 }}>Ronald 51,1% · Anne 48,9%</span>
              </div>
            </Section>

            {/* ─── Budget methode ─── */}
            <Section icon={ICONS.budget} title="Budget methode" description="Kies hoe je budgetten worden berekend">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { value: '5030', label: '50/30/20 regel', desc: 'Automatisch: 50% noodzaak, 30% wensen, 20% sparen', active: true },
                  { value: 'manual', label: 'Handmatig', desc: 'Stel zelf budgetten in per categorie', active: false },
                  { value: 'custom', label: 'Aangepast', desc: 'Kies je eigen percentages (bijv. 60/25/15)', active: false },
                ].map(opt => (
                  <div key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    border: `1.5px solid ${opt.active ? T.blue : T.border}`,
                    background: opt.active ? T.blueSoft : T.card,
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      border: `2px solid ${opt.active ? T.blue : T.borderHi}`,
                      display: 'grid', placeItems: 'center',
                    }}>
                      {opt.active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.blue }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ─── Weergave ─── */}
            <Section icon={ICONS.palette} title="Weergave" description="Uiterlijk en taalvoorkeuren">
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2, marginBottom: 10 }}>Thema</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <ThemeOption icon={ICONS.sun} label="Licht" active={true} />
                  <ThemeOption icon={ICONS.moon} label="Donker" active={false} />
                  <ThemeOption icon={ICONS.monitor} label="Systeem" active={false} />
                </div>
              </div>

              <SettingRow label="Taal" description="De taal van de interface">
                <Select value="Nederlands" />
              </SettingRow>
              <SettingRow label="Valuta" description="Standaard valuta voor bedragen">
                <Select value="EUR (€)" width={140} />
              </SettingRow>
              <SettingRow label="Startpagina" description="Welke pagina opent als eerste">
                <Select value="Dashboard" width={160} />
              </SettingRow>
              <SettingRow label="Compacte modus" description="Kleinere kaarten, meer data op het scherm" border={false}>
                <Toggle on={false} />
              </SettingRow>
            </Section>

            {/* ─── Meldingen ─── */}
            <Section icon={ICONS.bell} title="Meldingen" description="Configureer je notificaties">
              <SettingRow label="Budgetwaarschuwing" description="Ontvang een melding als je budget bijna op is">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Select value="80%" width={90} />
                  <Toggle on={true} />
                </div>
              </SettingRow>
              <SettingRow label="Maandelijks overzicht" description="Ontvang een e-mail samenvatting per maand">
                <Toggle on={true} />
              </SettingRow>
              <SettingRow label="Herinnering vaste lasten" description="Herinnering voor aankomende vaste lasten" border={false}>
                <Toggle on={false} />
              </SettingRow>
            </Section>

            {/* ─── Rekeningen (Premium) ─── */}
            <Section icon={ICONS.link} title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Rekeningen
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
              </span>
            } description="Koppel je bankrekeningen voor automatische import">
              <div style={{
                border: `1px dashed ${T.borderHi}`, borderRadius: 10,
                padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: T.cardAlt,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.amberSoft, display: 'grid', placeItems: 'center', color: T.amber, marginBottom: 10 }}>
                  {ICONS.lock}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 4 }}>Premium functie</div>
                <div style={{ fontSize: 12, color: T.ink4, marginBottom: 12, textAlign: 'center', maxWidth: 300 }}>
                  Koppel je bankrekeningen voor automatische import van transacties
                </div>
                <button style={{
                  padding: '7px 16px', borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.card,
                  fontSize: 12.5, fontWeight: 500, color: T.ink3, cursor: 'not-allowed', opacity: 0.6,
                }}>Rekening toevoegen</button>
              </div>
            </Section>

            {/* ─── Account ─── */}
            <Section icon={ICONS.user} title="Account" description="Profielgegevens en abonnement">
              <SettingRow label="Naam" description="ronald@webfin.nl">
                <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>Ronald Richter</span>
              </SettingRow>
              <SettingRow label="Abonnement">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: T.bg, color: T.ink3, border: `1px solid ${T.border}` }}>Gratis plan</span>
                  <button style={{
                    padding: '6px 14px', borderRadius: 8,
                    border: 'none', background: T.blue, color: '#fff',
                    fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                  }}>Upgrade naar Premium</button>
                </div>
              </SettingRow>
              <SettingRow label="Data exporteren" description="Download al je gegevens als CSV, Excel of PDF">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8,
                    border: `1px solid ${T.border}`, background: T.card,
                    fontSize: 12.5, fontWeight: 500, color: T.ink3, cursor: 'not-allowed', opacity: 0.6,
                  }}>{ICONS.download} Exporteren</button>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
                </div>
              </SettingRow>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.rule}` }}>
                <span style={{ fontSize: 12.5, color: T.red, cursor: 'pointer', fontWeight: 500 }}>Account verwijderen</span>
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Instellingen;
