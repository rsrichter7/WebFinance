// ─── Transacties pagina ───
// Dunne pagina-component: roept useTransactions aan en geeft data door aan componenten.

import React from 'react'
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
    filters,
    updateFilter,
    sort,
    updateSort,
    formOpen,
    setFormOpen,
  } = useTransactions()

  return (
    <>
      <TransactionTopBar onNewClick={() => setFormOpen(true)} />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Totalen als StatCards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: '0 28px' }}>
          <StatCard
            label="Uitgaven"
            value={totals.uitgaven}
            color={T.red}
            accent={T.red}
          />
          <StatCard
            label="Inkomsten"
            value={totals.inkomsten}
            color={T.green}
            accent={T.green}
          />
          <StatCard
            label="Balans"
            value={totals.balans}
            color={totals.balans >= 0 ? T.green : T.red}
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
            count={transactionCount}
          />
        </div>
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={addTransaction}
      />
    </>
  )
}