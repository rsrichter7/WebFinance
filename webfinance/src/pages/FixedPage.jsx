// ─── FixedPage ───
// Overzichtspagina voor vaste lasten, gegroepeerd per categorie.

import React from 'react'
import useFixedExpenses from '../hooks/useFixedExpenses'
import FixedTopBar from '../components/fixed/FixedTopBar'
import FixedStats from '../components/fixed/FixedStats'
import FixedCategoryGroup from '../components/fixed/FixedCategoryGroup'
import FixedForm from '../components/fixed/FixedForm'
import FixedLoanSection from '../components/fixed/FixedLoanSection'
import { Card } from '../components/ui/Card'
import { ICONS } from '../components/ui/Icons'
import { T } from '../tokens'

export default function FixedPage() {
  const {
    items, grouped, totals, donutData,
    addItem, removeItem, updateItem,
    formOpen, setFormOpen,
    editingItem, openEdit, closeForm,
    loading,
  } = useFixedExpenses()

  function handleSave(data, isEdit) {
    if (isEdit && editingItem) {
      updateItem(editingItem.id, data)
    } else {
      addItem(data)
    }
  }

  return (
    <>
      <FixedTopBar onAdd={() => setFormOpen(true)} />
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: T.ink3, fontSize: 14 }}>
            Laden...
          </div>
        ) : items.length === 0 ? (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 56, gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: T.rule, display: 'grid', placeItems: 'center',
              color: T.ink4, marginBottom: 4,
            }}>
              {ICONS.fixed}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>Nog geen vaste lasten</div>
            <div style={{ fontSize: 13, color: T.ink3, textAlign: 'center', maxWidth: 320 }}>
              Voeg je eerste terugkerende kosten of inkomsten toe
            </div>
            <button
              onClick={() => setFormOpen(true)}
              style={{
                marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', borderRadius: 8, border: 'none',
                background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {ICONS.plus} Vaste last toevoegen
            </button>
          </Card>
        ) : (
          <>
            <FixedStats totals={totals} donutData={donutData} />

            {grouped.map(group => (
              <FixedCategoryGroup
                key={group.name}
                icon={group.icon}
                title={group.name}
                color={group.color}
                colorSoft={group.colorSoft}
                items={group.items}
                subtotal={group.subtotal}
                onEdit={openEdit}
                onRemove={removeItem}
              />
            ))}

            <FixedLoanSection />
          </>
        )}
      </div>

      <FixedForm
        open={formOpen}
        editingItem={editingItem}
        onClose={closeForm}
        onSave={handleSave}
      />
    </>
  )
}