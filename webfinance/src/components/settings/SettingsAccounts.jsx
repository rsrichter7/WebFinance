// ─── SettingsAccounts ───
// Beheer van rekeningen: toevoegen, hernoemen, verwijderen, persoonlijk/gedeeld kiezen.

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import useAccounts from '../../hooks/useAccounts'
import { supabase } from '../../supabaseClient'
import { clearAllCaches } from '../../hooks/cacheManager'
import { fmtDate } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { Card, Badge } from '../ui/Card'
import ConfirmDialog from '../ui/ConfirmDialog'
import AccountModal from './AccountModal'
import BankKoppelModal from './BankKoppelModal'

export default function SettingsAccounts() {
  const { T } = useTheme()
  const { accounts, addAccount, updateAccount, removeAccount, refresh } = useAccounts()
  const { activeAccountId, setActiveAccount } = useActiveAccount()
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [ontkoppelTarget, setOntkoppelTarget] = useState(null)
  const [koppelOpen, setKoppelOpen] = useState(false)

  function handleSave(data) {
    if (modal.type === 'edit') updateAccount(modal.account.id, data)
    else addAccount(data)
    setModal(null)
  }

  async function handleDelete() {
    const id = deleteTarget.id
    const overig = accounts.filter(a => a.id !== id)
    await removeAccount(id)
    if (id === activeAccountId && overig.length > 0) setActiveAccount(overig[0].id)
    setDeleteTarget(null)
  }

  async function handleOntkoppel() {
    const id = ontkoppelTarget.id
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/bank/ontkoppel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rekening_id: id }),
    })
    clearAllCaches()
    refresh()
    setOntkoppelTarget(null)
  }

  const addBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Rekeningen</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.5 }}>
          Beheer je bankrekeningen — persoonlijk of gedeeld met je huishouden.
        </div>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {accounts.map(acc => (
            <AccountRow
              key={acc.id}
              acc={acc}
              T={T}
              kanVerwijderen={accounts.length > 1}
              onEdit={() => setModal({ type: 'edit', account: acc })}
              onDelete={() => setDeleteTarget(acc)}
              onOntkoppel={() => setOntkoppelTarget(acc)}
            />
          ))}
          {accounts.length === 0 && (
            <div style={{ fontSize: 13, color: T.ink3, padding: '8px 4px' }}>Nog geen rekeningen.</div>
          )}
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setModal({ type: 'add' })} style={addBtn}>
          <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
          Rekening toevoegen
        </button>
        <button onClick={() => setKoppelOpen(true)} style={addBtn}>
          <span style={{ display: 'inline-flex' }}>{ICONS.link}</span>
          Koppel bank
        </button>
      </div>

      {modal && createPortal(
        <AccountModal modal={modal} onSave={handleSave} onClose={() => setModal(null)} />,
        document.body
      )}

      {koppelOpen && <BankKoppelModal onClose={() => setKoppelOpen(false)} />}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`${deleteTarget?.naam ?? ''} verwijderen?`}
        message="Alle data die aan deze rekening gekoppeld is — transacties, vaste lasten, budgetten, spaardoelen en leningen — wordt definitief verwijderd. Dit kan niet ongedaan worden gemaakt."
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={!!ontkoppelTarget}
        title={`Bankkoppeling van ${ontkoppelTarget?.naam ?? ''} verwijderen?`}
        message="De rekening en alle transacties blijven behouden — alleen de automatische verbinding met je bank wordt verbroken. Je kunt later opnieuw koppelen."
        onConfirm={handleOntkoppel}
        onClose={() => setOntkoppelTarget(null)}
      />
    </div>
  )
}

function AccountRow({ acc, T, kanVerwijderen, onEdit, onDelete, onOntkoppel }) {
  const gekoppeld = !!acc.externAccountId
  const iconBtn = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, cursor: 'pointer', display: 'grid', placeItems: 'center' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{acc.naam}</span>
          {acc.gedeeld
            ? <Badge color={T.blueText} bg={T.blueSoft}>Gedeeld</Badge>
            : <Badge color={T.ink3} bg={T.rule}>Persoonlijk</Badge>}
          {gekoppeld && <Badge color={T.greenText} bg={T.greenSoft}>Gekoppeld</Badge>}
        </div>
        {acc.iban && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{acc.iban}</div>}
        {gekoppeld && acc.koppelingVervalt && (
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            Bankkoppeling · verloopt {fmtDate(acc.koppelingVervalt)}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {gekoppeld && (
          <button onClick={onOntkoppel} style={iconBtn} title="Bankkoppeling verwijderen">
            {ICONS.link}
          </button>
        )}
        <button onClick={onEdit} style={iconBtn}>{ICONS.edit}</button>
        <button
          onClick={() => kanVerwijderen && onDelete()}
          style={{ ...iconBtn, opacity: kanVerwijderen ? 1 : 0.3, cursor: kanVerwijderen ? 'pointer' : 'not-allowed' }}
          title={kanVerwijderen ? `${acc.naam} verwijderen` : 'Minimaal één rekening vereist'}
        >
          {ICONS.trash}
        </button>
      </div>
    </div>
  )
}
