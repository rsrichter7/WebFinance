// ─── Transacties pagina ───
// Dunne pagina-component: roept useTransactions aan en geeft data door aan componenten.

import React from 'react'
import useTransactions from '../hooks/useTransactions'
import TransactionTopBar from '../components/transactions/TransactionTopBar'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionForm from '../components/transactions/TransactionForm'

export default function TransactionsPage() {
  const {
    transactions,
    totals,
    transactionCount,
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
        <TransactionFilters
          filters={filters}
          updateFilter={updateFilter}
          totals={totals}
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
