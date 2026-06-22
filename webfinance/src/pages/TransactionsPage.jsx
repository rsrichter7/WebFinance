// ─── Transacties pagina ───
// Dunne pagina-component: roept useTransactions aan en geeft data door aan componenten.

import React, { useState, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import useTransactions from '../hooks/useTransactions'
import useSettings from '../hooks/useSettings'
import TransactionTopBar from '../components/transactions/TransactionTopBar'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionForm from '../components/transactions/TransactionForm'
import ImportFlow from '../components/transactions/ImportFlow'
import { StatCard } from '../components/ui/Card'

export default function TransactionsPage() {
  const { T } = useTheme()
  const {
    transactions, allTransactions, totals, transactionCount, eersteJaar, loading,
    addTransaction, removeTransaction, updateTransaction, fetchTransactions,
    filters, updateFilter, sort, updateSort, formOpen, setFormOpen,
  } = useTransactions()

  const { settings } = useSettings()

  const huidigSaldo = useMemo(() => {
    const sd = settings.startsaldo
    const tx = sd?.datum ? allTransactions.filter(t => t.datum >= sd.datum) : allTransactions
    const ink = tx.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
    const uit = tx.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    return (sd?.bedrag ?? 0) + ink - uit
  }, [allTransactions, settings.startsaldo])

  const [editingTx, setEditingTx]   = useState(null)
  const [importOpen, setImportOpen] = useState(false)

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3, fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
        Transacties laden…
      </div>
    )
  }

  return (
    <>
      <TransactionTopBar onNewClick={() => setFormOpen(true)} onImportClick={() => setImportOpen(true)} />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: '0 28px' }}>
          <StatCard label="Inkomsten" value={totals.inkomsten} color={T.green} accent={T.green} />
          <StatCard label="Uitgaven" value={totals.uitgaven} color={T.red} accent={T.red} />
          <StatCard label="Balans" value={totals.balans} color={T.blueText} accent={T.blue} />
        </div>

        <TransactionFilters filters={filters} updateFilter={updateFilter} eersteJaar={eersteJaar} />

        <div style={{ padding: '0 28px' }}>
          <TransactionTable transactions={transactions} sort={sort} onSort={updateSort}
            onDelete={removeTransaction} onEdit={(tx) => setEditingTx(tx)} count={transactionCount} />
        </div>
      </div>

      <TransactionForm
        open={formOpen || editingTx !== null}
        onClose={() => { setFormOpen(false); setEditingTx(null) }}
        onSave={addTransaction}
        onUpdate={(id, fields) => { updateTransaction(id, fields); setEditingTx(null) }}
        editingTransaction={editingTx}
        huidigSaldo={huidigSaldo}
      />

      <ImportFlow open={importOpen} onClose={() => setImportOpen(false)} onImportComplete={fetchTransactions} />
    </>
  )
}
