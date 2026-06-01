// ─── IncomePage ───
// Overzichtspagina voor vaste inkomsten.

import React, { useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import useFixedExpenses from '../hooks/useFixedExpenses'
import useTransactions from '../hooks/useTransactions'
import IncomeTopBar from '../components/income/IncomeTopBar'
import IncomeStats from '../components/income/IncomeStats'
import IncomeCostSplit from '../components/income/IncomeCostSplit'
import IncomeDonutCard from '../components/income/IncomeDonutCard'
import IncomeSection from '../components/income/IncomeSection'
import FixedForm from '../components/fixed/FixedForm'

export default function IncomePage() {
  const { T } = useTheme()
  const {
    groupedInkomsten, totals,
    addItem, updateItem, removeItem,
    formOpen, setFormOpen,
    editingItem, openEdit, closeForm,
    loading,
  } = useFixedExpenses()

  const { allTransactions } = useTransactions()

  const allItems = useMemo(
    () => groupedInkomsten.flatMap(g => g.items),
    [groupedInkomsten]
  )

  function handleSave(data, isEdit) {
    if (isEdit && editingItem) updateItem(editingItem.id, data)
    else addItem(data)
  }

  return (
    <>
      <IncomeTopBar onAdd={() => setFormOpen(true)} />
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: T.ink3, fontSize: 14 }}>
            Laden...
          </div>
        ) : (
          <>
            <IncomeStats totals={totals} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <IncomeCostSplit allTransactions={allTransactions} />
              <IncomeDonutCard items={allItems} />
            </div>
            <IncomeSection groupedInkomsten={groupedInkomsten} onEdit={openEdit} onRemove={removeItem} />
          </>
        )}
      </div>
      <FixedForm open={formOpen} editingItem={editingItem} onClose={closeForm} onSave={handleSave} initialType="Inkomst" />
    </>
  )
}
