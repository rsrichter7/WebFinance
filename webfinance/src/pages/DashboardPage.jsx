// ─── Dashboard pagina ───
// Financieel overzicht: StatCards, donut, staafdiagram, spaardoelen, recente tx, kostenverdeling, 50/30/20.

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import useTransactions from '../hooks/useTransactions'
import useBudgets from '../hooks/useBudgets'
import useSettings from '../hooks/useSettings'
import { useAuth } from '../hooks/useAuth'
import TransactionForm from '../components/transactions/TransactionForm'
import DashboardTopBar from '../components/dashboard/DashboardTopBar'
import DashboardStatCards from '../components/dashboard/DashboardStatCards'
import DashboardCategoryDonut from '../components/dashboard/DashboardCategoryDonut'
import DashboardYearChart from '../components/dashboard/DashboardYearChart'
import DashboardSavingsGoals from '../components/dashboard/DashboardSavingsGoals'
import DashboardRecentTx from '../components/dashboard/DashboardRecentTx'
import DashboardCostSplit from '../components/dashboard/DashboardCostSplit'
import DashboardRuleScore from '../components/dashboard/DashboardRuleScore'
const now = new Date()

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { allTransactions, addTransaction } = useTransactions()
  const { spaardoelen, actieveVerdeling } = useBudgets()
  const { settings } = useSettings()

  const voornaam = user?.user_metadata?.full_name?.split(' ')[0] || ''

  const [maand, setMaand] = useState(now.getMonth() + 1)
  const [jaar, setJaar]   = useState(now.getFullYear())
  const [showForm, setShowForm] = useState(false)

  const startsaldo = settings.startsaldo

  function onMaandWijzig({ maand: m, jaar: j }) { setMaand(m); setJaar(j) }

  // ─── Gefilterde transacties voor geselecteerde maand (alle tx, geen startsaldo filter) ───
  const monthTx = useMemo(() => allTransactions.filter(t => {
    const d = new Date(t.datum)
    return d.getMonth() + 1 === maand && d.getFullYear() === jaar
  }), [allTransactions, maand, jaar])

  // ─── Vorige maand ───
  const prevMaand = maand === 1 ? 12 : maand - 1
  const prevJaar  = maand === 1 ? jaar - 1 : jaar
  const prevMonthTx = useMemo(() => allTransactions.filter(t => {
    const d = new Date(t.datum)
    return d.getMonth() + 1 === prevMaand && d.getFullYear() === prevJaar
  }), [allTransactions, prevMaand, prevJaar])

  // ─── StatCard waarden (geselecteerde maand) ───
  const inkomsten     = useMemo(() => monthTx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0), [monthTx])
  const uitgaven      = useMemo(() => monthTx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0), [monthTx])
  const prevInkomsten = useMemo(() => prevMonthTx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0), [prevMonthTx])
  const prevUitgaven  = useMemo(() => prevMonthTx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0), [prevMonthTx])

  // ─── Huidig saldo (cumulatief, maand-onafhankelijk): startsaldo + alle tx na peildatum ───
  const huidigSaldo = useMemo(() => {
    const tx = startsaldo?.datum
      ? allTransactions.filter(t => t.datum >= startsaldo.datum)
      : allTransactions
    const totInkomsten = tx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
    const totUitgaven  = tx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    return (startsaldo?.bedrag ?? 0) + totInkomsten - totUitgaven
  }, [allTransactions, startsaldo])

  // ─── Categorie totalen voor donut ───
  const categoryTotals = useMemo(() => {
    const uitg = monthTx.filter(t => t.type === 'Uitgave')
    const map = {}
    for (const t of uitg) {
      map[t.categorie] = (map[t.categorie] || 0) + t.bedrag
    }
    return Object.entries(map).map(([cat, bedrag]) => ({ cat, bedrag }))
  }, [monthTx])

  // ─── Jaardata voor staafdiagram ───
  const yearData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const mTx = allTransactions.filter(t => {
        const d = new Date(t.datum)
        return d.getMonth() + 1 === m && d.getFullYear() === jaar
      })
      return {
        inkomsten: mTx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0),
        uitgaven:  mTx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0),
      }
    })
  }, [allTransactions, jaar])

  // ─── Recente 5 transacties (ongefilterd op maand) ───
  const recentTx = useMemo(() => {
    return [...allTransactions]
      .sort((a, b) => {
        if (b.datum !== a.datum) return b.datum.localeCompare(a.datum)
        return b.id - a.id
      })
      .slice(0, 5)
  }, [allTransactions])

  // ─── 50/30/20 score ───
  const ruleData = useMemo(() => {
    const v = actieveVerdeling
    const uitg = monthTx.filter(t => t.type === 'Uitgave')
    const soorten = ['noodzaak', 'wens', 'sparen']
    const result = {}
    for (const s of soorten) {
      const budget  = inkomsten * (v[s] / 100)
      const besteed = uitg.filter(t => t.soort?.toLowerCase() === s).reduce((sum, t) => sum + t.bedrag, 0)
      result[s] = { budget, besteed, pct: budget > 0 ? (besteed / budget) * 100 : 0 }
    }
    return result
  }, [monthTx, inkomsten, actieveVerdeling])

  return (
    <>
      <DashboardTopBar
        maand={maand} jaar={jaar}
        onMaandWijzig={onMaandWijzig}
        onAddTx={() => setShowForm(true)}
        voornaam={voornaam}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <DashboardStatCards
          maand={maand} jaar={jaar}
          inkomsten={inkomsten} uitgaven={uitgaven}
          prevInkomsten={prevInkomsten} prevUitgaven={prevUitgaven}
          huidigSaldo={huidigSaldo}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <DashboardCostSplit allTransactions={allTransactions} />
          <DashboardYearChart yearData={yearData} jaar={jaar} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <DashboardSavingsGoals
            spaardoelen={spaardoelen}
            onNaarBudgetten={() => navigate('/budgetten')}
          />
          <DashboardRecentTx recentTx={recentTx} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <DashboardCategoryDonut categoryTotals={categoryTotals} maand={maand} />
          <DashboardRuleScore ruleData={ruleData} inkomsten={inkomsten} />
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
