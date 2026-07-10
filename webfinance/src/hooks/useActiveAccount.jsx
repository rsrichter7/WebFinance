// ─── useActiveAccount ───
// Context voor de actieve rekening: onthoudt welke rekening gekozen is.
// Filtert in deze fase nog niets — puur state + localStorage-sync.

import React, { createContext, useContext, useState, useEffect } from 'react'
import useAccounts from './useAccounts'

const STORAGE_KEY = 'webfinance_actieve_rekening'
const AccountContext = createContext(null)

export function AccountProvider({ children }) {
  const { accounts, loading } = useAccounts()

  const [activeAccountId, setActiveAccountId] = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  )

  // Zodra rekeningen geladen zijn: kies de eerste als er geen geldige actieve rekening is
  useEffect(() => {
    if (loading || accounts.length === 0) return
    const bestaat = accounts.some(acc => acc.id === activeAccountId)
    if (!bestaat) {
      const eerste = accounts[0]
      setActiveAccountId(eerste.id)
      localStorage.setItem(STORAGE_KEY, eerste.id)
    }
  }, [loading, accounts, activeAccountId])

  function setActiveAccount(id) {
    setActiveAccountId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  const activeAccount = accounts.find(acc => acc.id === activeAccountId) || null

  const activeStartsaldo = (activeAccount?.startsaldoBedrag !== null && activeAccount?.startsaldoBedrag !== undefined)
    ? { bedrag: activeAccount.startsaldoBedrag, datum: activeAccount.startsaldoDatum }
    : null

  return (
    <AccountContext.Provider value={{ accounts, activeAccount, activeAccountId, activeStartsaldo, setActiveAccount, loading }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useActiveAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) {
    return { accounts: [], activeAccount: null, activeAccountId: null, activeStartsaldo: null, setActiveAccount: () => {}, loading: true }
  }
  return ctx
}
