// ─── FixedPage ───
// Overzichtspagina voor vaste lasten (alleen uitgaven) en leningen.

import React from 'react'
import useFixedExpenses from '../hooks/useFixedExpenses'
import FixedTopBar from '../components/fixed/FixedTopBar'
import FixedStats, { FixedUitgavenDonut } from '../components/fixed/FixedStats'
import FixedCategoryGroup from '../components/fixed/FixedCategoryGroup'
import FixedForm from '../components/fixed/FixedForm'
import FixedLoanSection from '../components/fixed/FixedLoanSection'
import FixedSuggesties from '../components/fixed/FixedSuggesties'
import { Card } from '../components/ui/Card'
import { ICONS } from '../components/ui/Icons'
import { useTheme } from '../hooks/useTheme'

export default function FixedPage() {
  const { T } = useTheme()
  const {
    items, groupedUitgaven, totals, donutData,
    addItem, removeItem, updateItem,
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
      <FixedTopBar onAdd={() => setFormOpen(true)} />
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <FixedSuggesties />

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: T.ink3, fontSize: 14 }}>
            Laden...
          </div>
        ) : items.filter(i => i.type === 'Uitgave').length === 0 ? (
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
              Voeg je eerste terugkerende kosten toe
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
            <FixedStats totals={totals} />
            {/* Verdeling + leningen naast elkaar op donut-plek */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
              <FixedUitgavenDonut donutData={donutData} />
              <FixedLoanSection />
            </div>
            {groupedUitgaven.map(group => (
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
          </>
        )}
      </div>

      <FixedForm
        open={formOpen}
        editingItem={editingItem}
        onClose={closeForm}
        onSave={handleSave}
        initialType="Uitgave"
      />
    </>
  )
}
