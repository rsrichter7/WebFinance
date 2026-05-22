/* Webfinance — Instellingen (modal overlay).
   Triggered from the account-menu in the sidebar.
   Modal has its OWN sidebar with sections. */

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

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
  shadowModal: '0 30px 60px -12px rgba(17,24,39,0.30), 0 8px 24px rgba(17,24,39,0.10)',
  shadowMenu:  '0 14px 30px -8px rgba(17,24,39,0.18), 0 4px 10px rgba(17,24,39,0.06)',
};
const TAB = { fontVariantNumeric: 'tabular-nums' };
const FONT = "'Inter', system-ui, sans-serif";
const fmt = (n) => '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

  user:      <Ico size={16} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  sliders:   <Ico size={16} d={<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>} />,
  folder:    <Ico size={16} d={<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>} />,
  database:  <Ico size={16} d={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>} />,
  bell:      <Ico size={16} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  info:      <Ico size={16} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>} />,
  shield:    <Ico size={16} d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>} />,

  close:     <Ico size={16} d={<><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>} />,
  download:  <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />,
  upload:    <Ico size={14} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />,
  github:    <Ico size={14} d={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>} />,
  link:      <Ico size={14} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
  logout:    <Ico size={14} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />,
  help:      <Ico size={14} d={<><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  warn:      <Ico size={16} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
};

/* ───── Sidebar of the underlying page (no Instellingen entry anymore) ───── */
function PageSidebar({ accountMenuOpen }) {
  const nav = [
    { k: 'dash',  label: 'Dashboard',    icon: ICONS.dashboard, active: true },
    { k: 'tx',    label: 'Transacties',  icon: ICONS.tx },
    { k: 'ana',   label: 'Analytics',    icon: ICONS.analytics },
    { k: 'bud',   label: 'Budgetten',    icon: ICONS.budget },
    { k: 'fix',   label: 'Vaste lasten', icon: ICONS.fixed },
    { k: 'cal',   label: 'Kalender',     icon: ICONS.cal, premium: true },
  ];
  return (
    <aside style={{
      width: 240, flex: '0 0 240px',
      background: T.card, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', padding: '20px 14px',
      position: 'relative',
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

      {/* Account row — clickable trigger */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 8px 8px',
          borderTop: `1px solid ${T.border}`,
          background: accountMenuOpen ? T.bg : 'transparent',
          borderRadius: accountMenuOpen ? 8 : 0,
          cursor: 'pointer',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E7FF', color: '#3730A3', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600 }}>RR</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ronald Richter</div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.bg, color: T.ink3, border: `1px solid ${T.border}`, letterSpacing: 0.3 }}>GRATIS</span>
            </div>
            <div style={{ fontSize: 11, color: T.ink3 }}>ronald@webfin.nl</div>
          </div>
          <span style={{ color: T.ink4, display: 'inline-flex', transform: accountMenuOpen ? 'rotate(180deg)' : 'none' }}>{ICONS.chevDown}</span>
        </div>

        {/* Account dropdown menu */}
        {accountMenuOpen && (
          <div style={{
            position: 'absolute', left: 4, right: 4, bottom: '100%', marginBottom: 8,
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
            boxShadow: T.shadowMenu, padding: 4, zIndex: 30,
          }}>
            <MenuItem icon={ICONS.settings} label="Instellingen" highlight />
            <MenuItem icon={ICONS.help} label="Help & support" />
            <div style={{ height: 1, background: T.rule, margin: '4px 0' }} />
            <MenuItem icon={ICONS.logout} label="Uitloggen" danger />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4, padding: '6px 8px', borderRadius: 6, fontSize: 11.5, color: T.ink3, cursor: 'pointer', border: `1px solid ${T.border}` }}>
        {ICONS.collapse} <span>Inklappen</span>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, highlight, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
      fontSize: 13,
      color: danger ? T.red : T.ink2,
      background: highlight ? T.bg : 'transparent',
      fontWeight: highlight ? 500 : 400,
    }}>
      <span style={{ color: danger ? T.red : T.ink3, display: 'inline-flex' }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/* ───── Faded dashboard placeholder (background behind the modal) ───── */
function PageBackground({ accountMenuOpen }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: FONT, background: T.bg, color: T.ink,
      display: 'flex', position: 'relative',
    }}>
      <PageSidebar accountMenuOpen={accountMenuOpen} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
        }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Dashboard</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Overzicht van mei 2026 — 8 dagen verstreken</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* dummy stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {['Totaal saldo','Inkomsten','Uitgaven','Resterend'].map((l, i) => (
              <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, boxShadow: T.shadow }}>
                <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500 }}>{l}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: T.ink, ...TAB, marginTop: 10, letterSpacing: -0.5 }}>{['€600,87','€3.200,00','€2.599,13','€400,87'][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 20 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, height: 320, boxShadow: T.shadow }} />
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, height: 320, boxShadow: T.shadow }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Common atoms ───── */
function Toggle({ on }) {
  return (
    <div style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? T.blue : T.borderHi,
      padding: 2, cursor: 'pointer',
      display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
    }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.ink4 }}>{hint}</div>}
    </div>
  );
}

function Input({ value, placeholder, disabled, suffix }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px',
      border: `1px solid ${T.border}`, borderRadius: 8,
      background: disabled ? T.cardAlt : T.card,
      fontSize: 13.5,
      color: value ? T.ink : T.ink4,
      opacity: disabled ? 0.7 : 1,
    }}>
      <span style={{ flex: 1 }}>{value || placeholder}</span>
      {suffix && <span style={{ color: T.ink4, display: 'inline-flex' }}>{suffix}</span>}
    </div>
  );
}

function Select({ value, width, disabled, hint }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 8,
      border: `1px solid ${T.border}`,
      background: disabled ? T.cardAlt : T.card,
      fontSize: 13, color: disabled ? T.ink3 : T.ink, fontWeight: 400,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: width || '100%', justifyContent: 'space-between',
      opacity: disabled ? 0.85 : 1,
    }}>
      <span>{value}</span>
      <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.chevDown}</span>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{description}</div>}
    </div>
  );
}

function SubSection({ title, description, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 4 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{description}</div>}
      {children}
    </div>
  );
}

function Btn({ children, variant = 'secondary', icon, disabled, full }) {
  const styles = {
    primary:   { bg: T.blue, color: '#fff', border: T.blue },
    secondary: { bg: T.card, color: T.ink, border: T.border },
    danger:    { bg: T.card, color: T.red, border: '#FECACA' },
    dangerSolid:{ bg: T.red, color: '#fff', border: T.red },
    ghost:     { bg: 'transparent', color: T.ink2, border: 'transparent' },
  }[variant];
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
      padding: '8px 14px', borderRadius: 8,
      border: `1px solid ${styles.border}`, background: styles.bg, color: styles.color,
      fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      width: full ? '100%' : 'auto',
    }}>{icon} {children}</button>
  );
}

/* ───── Section contents ───── */

function ProfielContent() {
  return (
    <React.Fragment>
      <SectionHeader title="Profiel" description="Je persoonlijke gegevens — voor nu lokaal opgeslagen" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#E0E7FF', color: '#3730A3',
          display: 'grid', placeItems: 'center',
          fontSize: 18, fontWeight: 600,
        }}>RR</div>
        <div>
          <Btn variant="secondary">Wijzig avatar</Btn>
          <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 6 }}>PNG of JPG, max 2MB</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="Voornaam">
          <Input value="Ronald" />
        </Field>
        <Field label="Achternaam">
          <Input value="Richter" />
        </Field>
      </div>

      <Field label="E-mail" hint="Lokaal opgeslagen — accounts worden later toegevoegd">
        <Input value="ronald@webfin.nl" />
      </Field>

      <div style={{
        marginTop: 24, padding: 14,
        background: T.blueSoft, border: '1px solid #DBEAFE',
        borderRadius: 10, fontSize: 12.5, color: T.blueText,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ display: 'inline-flex', marginTop: 1 }}>{ICONS.info}</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Voorbereid op accounts</div>
          <div style={{ color: T.ink3 }}>Zodra cloud-sync beschikbaar is, kun je je profiel koppelen aan een account zonder gegevens te verliezen.</div>
        </div>
      </div>
    </React.Fragment>
  );
}

function VoorkeurenContent() {
  return (
    <React.Fragment>
      <SectionHeader title="Voorkeuren" description="Taal, valuta, datumformaat en thema" />

      <SubSection title="Regio">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Taal" hint="Meer talen worden later toegevoegd">
            <Select value="Nederlands" />
          </Field>
          <Field label="Valuta">
            <Select value="EUR (€)" />
          </Field>
        </div>
      </SubSection>

      <SubSection title="Datumformaat">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { val: 'long', label: '8 mei 2026', desc: 'Lang formaat', active: true },
            { val: 'dmy',  label: '08-05-2026', desc: 'Dag-Maand-Jaar', active: false },
            { val: 'iso',  label: '2026-05-08', desc: 'ISO 8601', active: false },
          ].map(o => (
            <div key={o.val} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10,
              border: `1.5px solid ${o.active ? T.blue : T.border}`,
              background: o.active ? T.blueSoft : T.card, cursor: 'pointer',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${o.active ? T.blue : T.borderHi}`,
                display: 'grid', placeItems: 'center',
              }}>{o.active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.blue }} />}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB }}>{o.label}</div>
                <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{o.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Thema" description="Styling van het donkere thema komt later — toggle werkt al">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Donkere modus</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Gebruik een donkere achtergrond</div>
          </div>
          <Toggle on={false} />
        </div>
      </SubSection>
    </React.Fragment>
  );
}

function CategorieenContent() {
  const cats = [
    { name: 'Wonen', expanded: true, subs: ['Huur / Hypotheek', 'Gas / Water / Licht', 'Verzekeringen (woning)', 'Onderhoud / Verbouwing'] },
    { name: 'Vervoer', subs: ['Brandstof / Laden', 'Auto-onderhoud', 'Parkeren', 'Openbaar vervoer'] },
    { name: 'Dagelijks leven', subs: ['Boodschappen', 'Horeca & Afhaal', 'Verzorging & Huishouden'] },
    { name: 'Abonnementen & Telecom', subs: ['Streaming', 'Internet & TV', 'Telefoon', 'Bankkosten'] },
    { name: 'Vrije tijd', subs: ['Vakantie', 'Shoppen', 'Sport & Hobby', 'Cadeaus'] },
    { name: 'Financieel', subs: ['Salaris / Inkomsten', 'Leningen', 'Sparen', 'Onvoorzien / Buffer'] },
  ];
  return (
    <React.Fragment>
      <SectionHeader title="Categorieën" description="Beheer hoofd- en subcategorieën voor je transacties" />

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        {cats.map((c, i) => (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              borderBottom: (c.expanded || i < cats.length - 1) ? `1px solid ${T.rule}` : 'none',
              background: T.card,
            }}>
              <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'grab' }}>{ICONS.grip}</span>
              <span style={{ color: T.ink3, display: 'inline-flex' }}>{c.expanded ? ICONS.chevDown : ICONS.chevRight}</span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: T.ink }}>{c.name}</span>
              <span style={{ fontSize: 11, color: T.ink4, ...TAB }}>{c.subs.length} sub</span>
              <button style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.edit}</button>
              <button style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.trash}</button>
            </div>
            {c.expanded && c.subs.map((s, j) => (
              <div key={j} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px 8px 42px',
                borderBottom: (j < c.subs.length - 1 || i < cats.length - 1) ? `1px solid ${T.rule}` : 'none',
                background: T.cardAlt,
              }}>
                <span style={{ color: T.ink4, display: 'inline-flex', cursor: 'grab' }}>{ICONS.grip}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: T.ink3 }}>{s}</span>
                <button style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }}>{ICONS.trash}</button>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          padding: '8px 12px',
          border: `1px dashed ${T.borderHi}`, borderRadius: 8,
          fontSize: 13, color: T.ink4, background: T.cardAlt,
        }}>Nieuwe hoofdcategorie…</div>
        <Btn variant="primary" icon={ICONS.plus}>Toevoegen</Btn>
      </div>
    </React.Fragment>
  );
}

function DataContent({ confirmOpen }) {
  return (
    <React.Fragment>
      <SectionHeader title="Data beheer" description="Exporteer, importeer of wis je gegevens" />

      <SubSection title="Exporteren">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataRow
            icon={ICONS.download}
            title="Backup (JSON)"
            desc="Alle data: transacties, categorieën, vaste lasten en instellingen"
            meta="≈ 142 KB"
            action="Exporteer JSON"
          />
          <DataRow
            icon={ICONS.download}
            title="Transacties (CSV)"
            desc="Alleen transacties, importeerbaar in Excel/Numbers"
            meta="28 rijen"
            action="Exporteer CSV"
          />
        </div>
      </SubSection>

      <SubSection title="Importeren">
        <DataRow
          icon={ICONS.upload}
          title="Backup terugzetten"
          desc="Selecteer een eerder geëxporteerd JSON-bestand"
          meta="Vervangt alle huidige data"
          action="Bestand kiezen"
          actionVariant="secondary"
        />
      </SubSection>

      <SubSection title="Gevarenzone" description="Niet ongedaan te maken">
        <div style={{
          border: `1px solid #FECACA`, borderRadius: 10,
          padding: 14, background: T.redSoft,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.redText }}>Alle data wissen</div>
            <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>Verwijdert alle transacties, categorieën, vaste lasten en instellingen permanent</div>
          </div>
          <Btn variant="danger" icon={ICONS.trash}>Alles wissen</Btn>
        </div>
      </SubSection>

      {/* Confirm dialog */}
      {confirmOpen && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(17,24,39,0.30)',
          display: 'grid', placeItems: 'center', zIndex: 5,
        }}>
          <div style={{
            width: 380, background: T.card, borderRadius: 12,
            boxShadow: T.shadowModal, padding: 22,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: T.redSoft, color: T.red,
              display: 'grid', placeItems: 'center', marginBottom: 12,
            }}>{ICONS.warn}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Weet je het zeker?</div>
            <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 16 }}>
              Hiermee verwijder je <b style={{ color: T.ink }}>alle data</b> uit Webfinance. Deze actie kan niet ongedaan worden gemaakt.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: T.ink2 }}>Typ <span style={{ fontFamily: 'monospace', color: T.red }}>VERWIJDER</span> om te bevestigen</label>
              <Input value="" placeholder="VERWIJDER" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><Btn variant="secondary" full>Annuleer</Btn></div>
              <div style={{ flex: 1 }}><Btn variant="dangerSolid" full disabled>Alles wissen</Btn></div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function DataRow({ icon, title, desc, meta, action, actionVariant = 'secondary' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 14, border: `1px solid ${T.border}`, borderRadius: 10,
      background: T.card,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: T.bg, color: T.ink2, display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ fontSize: 11.5, color: T.ink4, ...TAB, marginRight: 4 }}>{meta}</div>
      <Btn variant={actionVariant}>{action}</Btn>
    </div>
  );
}

function NotificatiesContent() {
  return (
    <React.Fragment>
      <SectionHeader title="Notificaties" description="Meldingen voor budgetten, vaste lasten en updates" />

      <div style={{
        border: `1px dashed ${T.borderHi}`, borderRadius: 12,
        padding: 36, textAlign: 'center', background: T.cardAlt,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: T.amberSoft, color: T.amber,
          display: 'grid', placeItems: 'center',
          margin: '0 auto 14px',
        }}>{ICONS.bell}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Nog niet beschikbaar</div>
        <div style={{ fontSize: 13, color: T.ink3, maxWidth: 360, margin: '0 auto', lineHeight: 1.55 }}>
          Notificaties worden geactiveerd zodra je een Webfinance-account hebt aangemaakt.
          Voor nu draait alles lokaal in je browser.
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <SubSection title="In voorbereiding" description="Deze meldingen worden later beschikbaar">
          {[
            { label: 'Budget bijna overschreden', desc: 'Per categorie · drempel instelbaar' },
            { label: 'Aankomende vaste lasten', desc: '3 dagen voor afschrijving' },
            { label: 'Maandelijks overzicht', desc: 'Eerste van de maand' },
            { label: 'Productupdates', desc: 'Nieuwe features en verbeteringen' },
          ].map((n, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < 3 ? `1px solid ${T.rule}` : 'none',
              opacity: 0.55,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{n.label}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{n.desc}</div>
              </div>
              <Toggle on={false} />
            </div>
          ))}
        </SubSection>
      </div>
    </React.Fragment>
  );
}

function OverContent({ versionClicks = 0 }) {
  return (
    <React.Fragment>
      <SectionHeader title="Over Webfinance" description="Versie, credits en bronnen" />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 18, border: `1px solid ${T.border}`, borderRadius: 12,
        background: T.card, marginBottom: 18,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: T.ink, color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 28, fontWeight: 600,
        }}>€</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>Webfinance</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, color: T.ink3, ...TAB, cursor: 'pointer',
            marginTop: 2, padding: '2px 6px', margin: '2px 0 0 -6px', borderRadius: 4,
            background: versionClicks > 0 ? T.bg : 'transparent',
          }}>
            v0.4.2
            {versionClicks > 0 && versionClicks < 5 && (
              <span style={{ fontSize: 10, color: T.ink4 }}>· {versionClicks}/5</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.ink4, marginTop: 4 }}>Persoonlijk financieel beheer · lokaal-eerst</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
          background: T.greenSoft, color: T.greenText, letterSpacing: 0.3,
        }}>BÈTA</span>
      </div>

      <SubSection title="Credits">
        <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.7 }}>
          Gebouwd door <b style={{ color: T.ink }}>Ronald Richter</b>, 2026.<br />
          Iconen door <a style={{ color: T.blue, textDecoration: 'none' }}>Lucide</a>.
          Typografie: <a style={{ color: T.blue, textDecoration: 'none' }}>Inter</a> door Rasmus Andersson.
        </div>
      </SubSection>

      <SubSection title="Bronnen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <LinkRow icon={ICONS.github} label="GitHub repository" sub="github.com/rrichter/webfinance" />
          <LinkRow icon={ICONS.link} label="Documentatie" sub="docs.webfin.nl" />
          <LinkRow icon={ICONS.help} label="Support & feedback" sub="hello@webfin.nl" />
        </div>
      </SubSection>

      <div style={{
        fontSize: 11.5, color: T.ink4, marginTop: 24,
        paddingTop: 16, borderTop: `1px solid ${T.rule}`,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>© 2026 Webfinance</span>
        <span>MIT License</span>
      </div>
    </React.Fragment>
  );
}

function LinkRow({ icon, label, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px',
      border: `1px solid ${T.border}`, borderRadius: 10,
      background: T.card, cursor: 'pointer',
    }}>
      <span style={{ color: T.ink3, display: 'inline-flex' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{label}</div>
        <div style={{ fontSize: 11.5, color: T.ink4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginTop: 1 }}>{sub}</div>
      </div>
      <span style={{ color: T.ink4, display: 'inline-flex', transform: 'rotate(-45deg)' }}>{ICONS.chevRight}</span>
    </div>
  );
}

function AdminContent({ premiumOn }) {
  return (
    <React.Fragment>
      <SectionHeader title="Admin" description="Verborgen ontwikkelaars-instellingen" />

      <div style={{
        padding: 14, borderRadius: 10,
        background: T.amberSoft, border: `1px solid #FDE68A`,
        display: 'flex', alignItems: 'flex-start', gap: 10,
        marginBottom: 24,
      }}>
        <span style={{ color: T.amber, display: 'inline-flex', marginTop: 1 }}>{ICONS.warn}</span>
        <div style={{ fontSize: 12.5, color: '#78350F', lineHeight: 1.5 }}>
          <b>Wees voorzichtig.</b> Deze instellingen zijn voor ontwikkelaars en kunnen de app onstabiel maken.
          Niet bedoeld voor eindgebruikers.
        </div>
      </div>

      <SubSection title="Feature flags">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10,
          marginBottom: 8,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Premium modus
              {premiumOn && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>ACTIEF</span>}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>App-breed via <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11.5, color: T.violet }}>usePremium()</code> hook</div>
          </div>
          <Toggle on={premiumOn} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10,
          marginBottom: 8,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Debug overlay</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Toon component-grenzen en performance metrics</div>
          </div>
          <Toggle on={false} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Mock data</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Vervang lokale data met voorbeelddata</div>
          </div>
          <Toggle on={true} />
        </div>
      </SubSection>

      <SubSection title="Diagnostiek">
        <div style={{
          padding: 14, borderRadius: 10, background: T.bg,
          border: `1px solid ${T.border}`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11.5, color: T.ink3, lineHeight: 1.7,
        }}>
          <div>build: <span style={{ color: T.ink }}>0.4.2-dev (a3f9c1e)</span></div>
          <div>storage: <span style={{ color: T.ink }}>localStorage · 142 KB / 5 MB</span></div>
          <div>entries: <span style={{ color: T.ink }}>28 tx · 7 cats · 9 vaste lasten</span></div>
          <div>locale: <span style={{ color: T.ink }}>nl-NL · Europe/Amsterdam</span></div>
        </div>
      </SubSection>

      <SubSection title="Acties">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn variant="secondary" icon={ICONS.trash}>Reset localStorage</Btn>
          <Btn variant="secondary" icon={ICONS.upload}>Seed voorbeelddata</Btn>
          <Btn variant="danger" icon={ICONS.warn}>Force error</Btn>
        </div>
      </SubSection>
    </React.Fragment>
  );
}

/* ───── The modal ───── */
function SettingsModal({ section = 'profiel', adminUnlocked = false, versionClicks = 0, confirmDelete = false, premiumOn = false }) {
  const sections = [
    { k: 'profiel',    label: 'Profiel',         icon: ICONS.user },
    { k: 'voorkeuren', label: 'Voorkeuren',      icon: ICONS.sliders },
    { k: 'cat',        label: 'Categorieën',     icon: ICONS.folder },
    { k: 'data',       label: 'Data beheer',     icon: ICONS.database },
    { k: 'notif',      label: 'Notificaties',    icon: ICONS.bell },
    { k: 'over',       label: 'Over Webfinance', icon: ICONS.info },
  ];
  if (adminUnlocked) sections.push({ k: 'admin', label: 'Admin', icon: ICONS.shield, admin: true });

  const renderContent = () => {
    switch (section) {
      case 'voorkeuren': return <VoorkeurenContent />;
      case 'cat':        return <CategorieenContent />;
      case 'data':       return <DataContent confirmOpen={confirmDelete} />;
      case 'notif':      return <NotificatiesContent />;
      case 'over':       return <OverContent versionClicks={versionClicks} />;
      case 'admin':      return <AdminContent premiumOn={premiumOn} />;
      default:           return <ProfielContent />;
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(17,24,39,0.45)',
      display: 'grid', placeItems: 'center',
      zIndex: 20,
    }}>
      <div style={{
        width: 960, height: 660,
        background: T.card, borderRadius: 14,
        boxShadow: T.shadowModal,
        border: `1px solid ${T.border}`,
        display: 'flex', overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Modal sidebar */}
        <aside style={{
          width: 220, flex: '0 0 220px',
          background: T.cardAlt, borderRight: `1px solid ${T.border}`,
          padding: '20px 12px', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '0 10px 16px', fontSize: 11, fontWeight: 600, color: T.ink4, letterSpacing: 0.4, textTransform: 'uppercase' }}>Instellingen</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sections.map(s => {
              const active = s.k === section;
              return (
                <div key={s.k} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8,
                  background: active ? T.card : 'transparent',
                  color: active ? T.ink : T.ink2,
                  fontSize: 13.5, fontWeight: active ? 500 : 400,
                  position: 'relative', cursor: 'pointer',
                  border: active ? `1px solid ${T.border}` : `1px solid transparent`,
                }}>
                  <span style={{
                    color: active ? T.blue : (s.admin ? T.amber : T.ink3),
                    display: 'inline-flex',
                  }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>{s.label}</span>
                  {s.admin && (
                    <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.3, padding: '2px 5px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>DEV</span>
                  )}
                </div>
              );
            })}
          </nav>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '10px 10px 0', borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.ink4 }}>
            Lokaal opgeslagen · v0.4.2
          </div>
        </aside>

        {/* Modal content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 13, color: T.ink3 }}>
              <span style={{ color: T.ink4 }}>Instellingen</span> <span style={{ color: T.ink4, margin: '0 6px' }}>/</span>
              <span style={{ color: T.ink, fontWeight: 500 }}>{sections.find(s => s.k === section)?.label}</span>
            </div>
            <button style={{
              border: 'none', background: 'transparent', color: T.ink3,
              padding: 6, borderRadius: 6, cursor: 'pointer', display: 'inline-flex',
            }}>{ICONS.close}</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
            {renderContent()}
          </div>

          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: T.cardAlt,
          }}>
            <div style={{ fontSize: 12, color: T.ink4 }}>Wijzigingen worden automatisch opgeslagen</div>
            <Btn variant="primary">Klaar</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── Full page = background + (optional modal / dropdown) ───── */
function InstellingenView({ mode = 'modal', section, adminUnlocked, versionClicks, confirmDelete, premiumOn }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      fontFamily: FONT, background: T.bg, color: T.ink,
      WebkitFontSmoothing: 'antialiased',
      position: 'relative', overflow: 'hidden',
      letterSpacing: -0.05,
    }}>
      <PageBackground accountMenuOpen={mode === 'menu'} />
      {mode === 'modal' && (
        <SettingsModal
          section={section}
          adminUnlocked={adminUnlocked}
          versionClicks={versionClicks}
          confirmDelete={confirmDelete}
          premiumOn={premiumOn}
        />
      )}
    </div>
  );
}

window.InstellingenView = InstellingenView;
