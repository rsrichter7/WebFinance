// ─── Dashboard pagina ───
// Orchestratie: Kalendermaand-modus of Loonperiode-modus, op basis van instellingen.

import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import useTransactions from '../hooks/useTransactions'
import useFixedExpenses from '../hooks/useFixedExpenses'
import useSettings from '../hooks/useSettings'
import useProfiles from '../hooks/useProfiles'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { sparklineData, relatiefTijdstip } from '../utils/dashboardCalculations'
import { getLoonPeriodeByOffset } from '../utils/loonperiode'

import TransactionForm   from '../components/transactions/TransactionForm'
import DashboardTopBar   from '../components/dashboard/DashboardTopBar'
import DashboardHero     from '../components/dashboard/DashboardHero'
import DashboardMiniStat from '../components/dashboard/DashboardMiniStat'
import DashboardVerdeling from '../components/dashboard/DashboardVerdeling'
import DashboardKomende  from '../components/dashboard/DashboardKomende'
import DashboardLeningen from '../components/dashboard/DashboardLeningen'
import DashboardTrend    from '../components/dashboard/DashboardTrend'
import DashboardRecente  from '../components/dashboard/DashboardRecente'

const now = new Date()

function datumBereikMaand(maand, jaar) {
  const start     = `${jaar}-${String(maand).padStart(2, '0')}-01`
  const lastDay   = new Date(jaar, maand, 0).getDate()
  const eind      = `${jaar}-${String(maand).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  const prevM     = maand === 1 ? 12 : maand - 1
  const prevJ     = maand === 1 ? jaar - 1 : jaar
  const prevStart = `${prevJ}-${String(prevM).padStart(2, '0')}-01`
  const prevLast  = new Date(prevJ, prevM, 0).getDate()
  const prevEind  = `${prevJ}-${String(prevM).padStart(2, '0')}-${String(prevLast).padStart(2, '0')}`
  return { startDatum: start, eindDatum: eind, prevStartDatum: prevStart, prevEindDatum: prevEind, label: null }
}

export default function DashboardPage() {
  const { T }    = useTheme()
  const { user } = useAuth()
  const { allTransactions, addTransaction } = useTransactions()
  const { items: fixedItems, hoofdinkomst } = useFixedExpenses()
  const { settings }  = useSettings()
  const { persons }   = useProfiles()

  const voornaam = (user?.user_metadata?.full_name || '').split(' ')[0]

  const dashboardPeriode = settings.dashboard_periode || 'maand'

  // Kalendermaand-navigatie
  const [maand, setMaand] = useState(now.getMonth() + 1)
  const [jaar,  setJaar]  = useState(now.getFullYear())

  // Loonperiode-navigatie
  const [periodeOffset, setPeriodeOffset] = useState(0)
  const [loonOverrides, setLoonOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem('webfinance_loonperiode_override') || '{}') }
    catch { return {} }
  })

  // Reset offset naar 0 bij wisselen naar loon-modus
  useEffect(() => {
    if (dashboardPeriode === 'loon') setPeriodeOffset(0)
  }, [dashboardPeriode])

  const [showForm, setShowForm] = useState(false)

  function onMaandWijzig({ maand: m, jaar: j }) { setMaand(m); setJaar(j) }

  function onOverrideStart(ankerMaand, dateStr) {
    const updated = { ...loonOverrides, [ankerMaand]: dateStr }
    setLoonOverrides(updated)
    localStorage.setItem('webfinance_loonperiode_override', JSON.stringify(updated))
  }

  // ─── Vroegste transactiedatum (grens voor terugnavigatie) ───
  const eersteDatum = useMemo(() => {
    if (allTransactions.length === 0) return new Date().toISOString().split('T')[0]
    return allTransactions.reduce((min, t) => t.datum < min ? t.datum : min, allTransactions[0].datum)
  }, [allTransactions])

  // ─── Actief datumbereik ───
  const bereik = useMemo(() => {
    if (dashboardPeriode === 'loon') {
      const huidig = getLoonPeriodeByOffset(allTransactions, hoofdinkomst, periodeOffset, loonOverrides)
      const vorig  = getLoonPeriodeByOffset(allTransactions, hoofdinkomst, periodeOffset - 1, loonOverrides)
      if (!huidig) return datumBereikMaand(maand, jaar)
      return {
        startDatum:    huidig.start,
        eindDatum:     huidig.eind,
        label:         huidig.label,
        prevStartDatum: vorig?.start || null,
        prevEindDatum:  vorig?.eind  || null,
      }
    }
    return datumBereikMaand(maand, jaar)
  }, [dashboardPeriode, hoofdinkomst, periodeOffset, loonOverrides, allTransactions, maand, jaar])

  // ─── Periode-transacties ───
  const monthTx = useMemo(() =>
    allTransactions.filter(t => t.datum >= bereik.startDatum && t.datum <= bereik.eindDatum),
    [allTransactions, bereik.startDatum, bereik.eindDatum]
  )

  // ─── MiniStat waarden ───
  const inkomsten = useMemo(() => monthTx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0), [monthTx])
  const uitgaven  = useMemo(() => monthTx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0), [monthTx])

  // ─── Huidig saldo (cumulatief, periode-onafhankelijk) ───
  const huidigSaldo = useMemo(() => {
    const sd = settings.startsaldo
    const tx = sd?.datum ? allTransactions.filter(t => t.datum >= sd.datum) : allTransactions
    const ink = tx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
    const uit = tx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    return (sd?.bedrag ?? 0) + ink - uit
  }, [allTransactions, settings.startsaldo])

  // ─── Sparklines ───
  const inSparkline  = useMemo(() => sparklineData(allTransactions, 'Inkomst', 6), [allTransactions])
  const uitSparkline = useMemo(() => sparklineData(allTransactions, 'Uitgave', 6), [allTransactions])

  // ─── Saldo meta-tekst ───
  const saldoMeta = useMemo(() => {
    if (allTransactions.length === 0) return ''
    const latest = [...allTransactions].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))[0]
    return latest?.createdAt ? `Bijgewerkt ${relatiefTijdstip(latest.createdAt)}` : ''
  }, [allTransactions])

  // ─── Recente 5 transacties ───
  const recentTx = useMemo(() =>
    [...allTransactions]
      .sort((a, b) => {
        if (b.datum !== a.datum) return b.datum.localeCompare(a.datum)
        return (b.createdAt || '').localeCompare(a.createdAt || '')
      })
      .slice(0, 5),
    [allTransactions]
  )

  return (
    <>
      <DashboardTopBar
        maand={maand} jaar={jaar} onMaandWijzig={onMaandWijzig}
        onAddTx={() => setShowForm(true)} voornaam={voornaam}
        dashboardPeriode={dashboardPeriode}
        startDatum={bereik.startDatum} eindDatum={bereik.eindDatum}
        periodeLabel={bereik.label}
        onPeriodeVorige={() => setPeriodeOffset(o => o - 1)}
        onPeriodeVolgende={() => setPeriodeOffset(o => o + 1)}
        onOverrideStart={onOverrideStart}
        kanVorige={bereik.startDatum > eersteDatum}
        kanVolgende={
          dashboardPeriode === 'loon'
            ? periodeOffset < 1
            : (jaar * 12 + (maand - 1)) <= (now.getFullYear() * 12 + now.getMonth())
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* RIJ 1: Hero + 3 mini-stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          <DashboardHero
            allTransactions={allTransactions} fixedExpenses={fixedItems}
            settings={settings}
            startDatum={bereik.startDatum} eindDatum={bereik.eindDatum}
            prevStartDatum={bereik.prevStartDatum} prevEindDatum={bereik.prevEindDatum}
            periodeLabel={bereik.label}
          />
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 10 }}>
            <DashboardMiniStat label="Inkomsten" value={inkomsten} color="#059669"
              glow={T.glowGreen} iconKey="arrUp"
              sparklineData={inSparkline} sparklineType="bar" sparklineColor="#059669"
              animDelay={80}
            />
            <DashboardMiniStat label="Uitgaven" value={uitgaven} color="#DC2626"
              glow={T.glowRed} iconKey="arrDown"
              sparklineData={uitSparkline} sparklineType="bar" sparklineColor="#DC2626"
              animDelay={160}
            />
            <DashboardMiniStat label="Huidig saldo" value={huidigSaldo} color="#1E5AA8"
              glow={T.glowBlue} iconKey="wallet"
              sparklineType="area" sparklineColor="#2563EB"
              metaText={saldoMeta}
              animDelay={240}
            />
          </div>
        </div>

        {/* RIJ 2: Verdeling + Komende + Leningen */}
        <div style={{ display: 'grid', gridTemplateColumns: persons.length > 1 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 14 }}>
          {persons.length > 1 && (
            <DashboardVerdeling
              allTransactions={allTransactions} persons={persons}
              settings={settings}
              startDatum={bereik.startDatum} eindDatum={bereik.eindDatum}
              animDelay={80}
            />
          )}
          <DashboardKomende fixedExpenses={fixedItems} animDelay={160} />
          <DashboardLeningen animDelay={240} />
        </div>

        {/* RIJ 3: Trend chart + Recente transacties */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
          <DashboardTrend allTransactions={allTransactions} animDelay={80} />
          <DashboardRecente recentTx={recentTx} animDelay={160} />
        </div>

      </div>

      {showForm && createPortal(
        <TransactionForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSave={(tx) => { addTransaction(tx); setShowForm(false) }}
        />,
        document.body
      )}
    </>
  )
}
