// ─── Transacties pagina ───
// Dunne pagina-component: roept useTransactions aan en geeft data door aan componenten.

import React, { useState } from 'react'
import useTransactions from '../hooks/useTransactions'
import TransactionTopBar from '../components/transactions/TransactionTopBar'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionForm from '../components/transactions/TransactionForm'
import { StatCard } from '../components/ui/Card'
import { T } from '../tokens'

export default function TransactionsPage() {
  const {
    transactions,
    totals,
    transactionCount,
    eersteJaar,
    addTransaction,
    removeTransaction,
    updateTransaction,
    filters,
    updateFilter,
    sort,
    updateSort,
    formOpen,
    setFormOpen,
  } = useTransactions()

  const [editingTx, setEditingTx] = useState(null)

  return (
    <>
      <TransactionTopBar onNewClick={() => setFormOpen(true)} />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Totalen als StatCards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: '0 28px' }}>
          <StatCard
            label="Inkomsten"
            value={totals.inkomsten}
            color={T.green}
            accent={T.green}
          />
          <StatCard
            label="Uitgaven"
            value={totals.uitgaven}
            color={T.red}
            accent={T.red}
          />
          <StatCard
            label="Balans"
            value={totals.balans}
            color={T.blueText}
            accent={T.blue}
          />
        </div>

        <TransactionFilters
          filters={filters}
          updateFilter={updateFilter}
          eersteJaar={eersteJaar}
        />

        <div style={{ padding: '0 28px' }}>
          <TransactionTable
            transactions={transactions}
            sort={sort}
            onSort={updateSort}
            onDelete={removeTransaction}
            onEdit={(tx) => setEditingTx(tx)}
            count={transactionCount}
          />
        </div>
      </div>

      <TransactionForm
        open={formOpen || editingTx !== null}
        onClose={() => { setFormOpen(false); setEditingTx(null) }}
        onSave={addTransaction}
        onUpdate={(id, fields) => { updateTransaction(id, fields); setEditingTx(null) }}
        editingTransaction={editingTx}
      />
    </>
  )
}