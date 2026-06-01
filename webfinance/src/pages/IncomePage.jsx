// ─── IncomePage ───
// Overzichtspagina voor vaste inkomsten.

import React from 'react'
import { useTheme } from '../hooks/useTheme'
import useFixedExpenses from '../hooks/useFixedExpenses'
import IncomeTopBar from '../components/income/IncomeTopBar'
import IncomeStats from '../components/income/IncomeStats'
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
            <IncomeSection groupedInkomsten={groupedInkomsten} onEdit={openEdit} onRemove={removeItem} />
          </>
        )}
      </div>
      <FixedForm open={formOpen} editingItem={editingItem} onClose={closeForm} onSave={handleSave} initialType="Inkomst" />
    </>
  )
}
