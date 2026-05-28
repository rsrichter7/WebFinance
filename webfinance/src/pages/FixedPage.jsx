// ─── FixedPage ───
// Overzichtspagina voor vaste lasten en inkomsten, met tabbladen per type.

import React, { useState } from 'react'
import useFixedExpenses from '../hooks/useFixedExpenses'
import FixedTopBar from '../components/fixed/FixedTopBar'
import FixedStats, { FixedUitgavenDonut } from '../components/fixed/FixedStats'
import FixedCategoryGroup from '../components/fixed/FixedCategoryGroup'
import FixedInkomstSection from '../components/fixed/FixedInkomstSection'
import FixedForm from '../components/fixed/FixedForm'
import FixedLoanSection from '../components/fixed/FixedLoanSection'
import { Card } from '../components/ui/Card'
import { ICONS } from '../components/ui/Icons'
import { T } from '../tokens'

export default function FixedPage() {
  const [activeTab, setActiveTab] = useState('uitgaven')

  const {
    items, groupedUitgaven, groupedInkomsten, totals, donutData,
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
            {/* StatCards — altijd zichtbaar */}
            <FixedStats totals={totals} />

            {/* Tabs — direct onder StatCards */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'uitgaven',  label: 'Uitgaven' },
                { id: 'inkomsten', label: 'Inkomsten' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 24px', borderRadius: 8,
                    fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: activeTab === tab.id ? 'none' : `1px solid ${T.rule}`,
                    background: activeTab === tab.id ? T.blue : T.card,
                    color: activeTab === tab.id ? '#fff' : T.ink2,
                    transition: 'background 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab-content */}
            {activeTab === 'uitgaven' ? (
              <>
                <FixedUitgavenDonut donutData={donutData} />
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
                <FixedLoanSection />
              </>
            ) : (
              <FixedInkomstSection
                groupedInkomsten={groupedInkomsten}
                onEdit={openEdit}
                onRemove={removeItem}
              />
            )}
          </>
        )}
      </div>

      <FixedForm
        open={formOpen}
        editingItem={editingItem}
        onClose={closeForm}
        onSave={handleSave}
        initialType={activeTab === 'inkomsten' ? 'Inkomst' : 'Uitgave'}
      />
    </>
  )
}
