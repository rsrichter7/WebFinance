// ─── FixedLoanSection ───
// Leningen-sectie op de Vaste Lasten pagina.
// Lijst per type + formulier voor toevoegen/bewerken.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import useLoans from '../../hooks/useLoans'
import LoanCard from './LoanCard'
import LoanForm from './LoanForm'
import ConfirmDialog from '../ui/ConfirmDialog'

const TYPEN = ['Hypotheek', 'Autolening', 'Studieschuld', 'Persoonlijke lening']

export default function FixedLoanSection() {
  const { T } = useTheme()
  const { loans, loading, addLoan, updateLoan, deleteLoan } = useLoans()
  const [formOpen, setFormOpen]         = useState(false)
  const [editingLoan, setEditingLoan]   = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  function openEdit(loan) {
    setEditingLoan(loan)
    setFormOpen(true)
  }

  function openNieuw() {
    setEditingLoan(null)
    setFormOpen(true)
  }

  function handleClose() {
    setFormOpen(false)
    setEditingLoan(null)
  }

  function handleSave(data, isEdit) {
    if (isEdit && editingLoan) updateLoan(editingLoan.id, data)
    else addLoan(data)
  }

  function handleDelete(id) {
    setPendingDelete(id)
  }

  const heeftLeningen = loans.length > 0
  const typenMetLeningen = TYPEN.filter(t => loans.some(l => l.type === t))

  return (
    <>
      <Card style={{ padding: 22 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: heeftLeningen ? 20 : 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.violet, display: 'inline-flex' }}>{ICONS.trending}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Leningen</div>
              {heeftLeningen && (
                <div style={{ fontSize: 12, color: T.ink4, marginTop: 1 }}>
                  {loans.length} lening{loans.length !== 1 ? 'en' : ''}
                </div>
              )}
            </div>
          </div>
          {heeftLeningen && (
            <button onClick={openNieuw} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.card,
              fontSize: 13, fontWeight: 500, color: T.ink2,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {ICONS.plus} Lening toevoegen
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ fontSize: 13, color: T.ink4, padding: '12px 0' }}>Laden...</div>
        ) : !heeftLeningen ? (
          // Lege staat
          <>
            <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 16 }}>
              Houd je aflossingen en restschuld bij
            </div>
            <div style={{
              border: `1px dashed ${T.borderHi}`, borderRadius: 10,
              padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: T.cardAlt,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: T.violetSoft, display: 'grid', placeItems: 'center',
                color: T.violet, marginBottom: 12,
              }}>
                {ICONS.coin}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 4 }}>
                Nog geen leningen toegevoegd
              </div>
              <div style={{ fontSize: 12, color: T.ink4, marginBottom: 14, textAlign: 'center', maxWidth: 320 }}>
                Voeg een lening toe om je aflossingen, rentepercentage en restschuld bij te houden
              </div>
              <button onClick={openNieuw} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.card,
                fontSize: 13, fontWeight: 500, color: T.ink2,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {ICONS.plus} Lening toevoegen
              </button>
            </div>
          </>
        ) : (
          // Lijst per type
          typenMetLeningen.map(type => (
            <div key={type} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 20px', marginBottom: 2 }}>
                {type}
              </div>
              {loans.filter(l => l.type === type).map(loan => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))
        )}
      </Card>

      <LoanForm
        open={formOpen}
        editingLoan={editingLoan}
        onClose={handleClose}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Lening verwijderen?"
        message="Weet je zeker dat je deze lening wilt verwijderen? De bijbehorende aflossing (vaste last) wordt ook verwijderd. Dit kan niet ongedaan worden gemaakt."
        onConfirm={() => { deleteLoan(pendingDelete); setPendingDelete(null) }}
        onClose={() => setPendingDelete(null)}
      />
    </>
  )
}
