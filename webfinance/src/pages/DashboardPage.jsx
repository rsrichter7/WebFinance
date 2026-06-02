// ─── Dashboard pagina ───
// Vraag-georiënteerde financiële coach: hero, mini-stats, verdeling, komende, leningen, trend, recente.

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import useTransactions from '../hooks/useTransactions'
import useFixedExpenses from '../hooks/useFixedExpenses'
import useSettings from '../hooks/useSettings'
import useProfiles from '../hooks/useProfiles'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { sparklineData, relatiefTijdstip } from '../utils/dashboardCalculations'

import TransactionForm from '../components/transactions/TransactionForm'
import DashboardTopBar    from '../components/dashboard/DashboardTopBar'
import DashboardHero      from '../components/dashboard/DashboardHero'
import DashboardMiniStat  from '../components/dashboard/DashboardMiniStat'
import DashboardVerdeling from '../components/dashboard/DashboardVerdeling'
import DashboardKomende   from '../components/dashboard/DashboardKomende'
import DashboardLeningen  from '../components/dashboard/DashboardLeningen'
import DashboardTrend     from '../components/dashboard/DashboardTrend'
import DashboardRecente   from '../components/dashboard/DashboardRecente'

const now = new Date()

export default function DashboardPage() {
  const { T }  = useTheme()
  const { user } = useAuth()
  const { allTransactions, addTransaction } = useTransactions()
  const { items: fixedItems } = useFixedExpenses()
  const { settings } = useSettings()
  const { persons }  = useProfiles()

  const voornaam = (user?.user_metadata?.full_name || '').split(' ')[0]

  const [maand, setMaand] = useState(now.getMonth() + 1)
  const [jaar,  setJaar]  = useState(now.getFullYear())
  const [showForm, setShowForm] = useState(false)

  function onMaandWijzig({ maand: m, jaar: j }) { setMaand(m); setJaar(j) }

  // ─── Maandtransacties ───
  const monthTx = useMemo(() => allTransactions.filter(t => {
    const d = new Date(t.datum)
    return d.getMonth() + 1 === maand && d.getFullYear() === jaar
  }), [allTransactions, maand, jaar])

  // ─── StatCard waarden ───
  const inkomsten = useMemo(() => monthTx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0), [monthTx])
  const uitgaven  = useMemo(() => monthTx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0), [monthTx])

  // ─── Huidig saldo (cumulatief, maand-onafhankelijk) ───
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
      <DashboardTopBar maand={maand} jaar={jaar} onMaandWijzig={onMaandWijzig} onAddTx={() => setShowForm(true)} voornaam={voornaam} />

      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* RIJ 1: Hero + 3 mini-stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
          <DashboardHero
            allTransactions={allTransactions} fixedExpenses={fixedItems}
            settings={settings} maand={maand} jaar={jaar}
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
              settings={settings} maand={maand} jaar={jaar}
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
