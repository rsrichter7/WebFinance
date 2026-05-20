// ─── BudgetsPage ───
// Budgetten overzichtspagina met 50/30/20 regel, categorie-tabel en spaardoelen.

import React, { useState } from 'react'
import useBudgets from '../hooks/useBudgets'
import BudgetTopBar from '../components/budgets/BudgetTopBar'
import BudgetStats from '../components/budgets/BudgetStats'
import BudgetRuleSection from '../components/budgets/BudgetRuleSection'
import BudgetCategoryTable from '../components/budgets/BudgetCategoryTable'
import BudgetSavingsGoals from '../components/budgets/BudgetSavingsGoals'
import BudgetForm from '../components/budgets/BudgetForm'

export default function BudgetsPage() {
  const {
    budgetModus, setBudgetModus,
    categorieBudgetten, spaardoelen,
    geselecteerdeMaand, setGeselecteerdeMaand,
    inkomen, totaalBudget, totaalBesteed, totaalResterend,
    totaalCategorieBudget,
    regelVerdeling, categorieOverzicht,
    voegBudgetToe, wijzigBudget,
    voegSpaardoelToe, verwijderSpaardoel, stortOpSpaardoel,
    handmatigeVerdeling, setHandmatigeVerdeling, actieveVerdeling,
  } = useBudgets()

  const [formOpen, setFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const handleSave = (data, isEdit) => {
    if (isEdit) {
      wijzigBudget(data.id, data)
    } else {
      voegBudgetToe(data)
    }
  }

  const handleCategorySave = (categorie, data) => {
    const bestaand = categorieBudgetten.find(b => b.categorie === categorie)
    if (bestaand) {
      wijzigBudget(bestaand.id, data)
    } else {
      voegBudgetToe({ categorie, ...data })
    }
  }

  return (
    <>
      <BudgetTopBar
        geselecteerdeMaand={geselecteerdeMaand}
        onMaandWijzig={setGeselecteerdeMaand}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <BudgetStats
          totaalBudget={totaalBudget}
          totaalBesteed={totaalBesteed}
          totaalResterend={totaalResterend}
        />
        <BudgetRuleSection
          regelVerdeling={regelVerdeling}
          inkomen={inkomen}
          budgetModus={budgetModus}
          onModusWijzig={setBudgetModus}
          actieveVerdeling={actieveVerdeling}
          handmatigeVerdeling={handmatigeVerdeling}
          onVerdelingWijzig={setHandmatigeVerdeling}
        />
        <BudgetCategoryTable
          categorieOverzicht={categorieOverzicht}
          onSave={handleCategorySave}
          budgetLimiet={inkomen}
          totaalCategorieBudget={totaalCategorieBudget}
        />
        <BudgetSavingsGoals
          spaardoelen={spaardoelen}
          onToevoegen={voegSpaardoelToe}
          onStorten={stortOpSpaardoel}
          onVerwijderen={verwijderSpaardoel}
        />
      </div>

      <BudgetForm
        open={formOpen}
        editingItem={editingBudget}
        onClose={() => { setFormOpen(false); setEditingBudget(null) }}
        onSave={handleSave}
        bestaandeCategorieën={categorieBudgetten.map(b => b.categorie)}
      />
    </>
  )
}