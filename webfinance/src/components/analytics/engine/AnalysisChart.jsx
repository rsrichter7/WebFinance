// ─── AnalysisChart ───
// Routeert een analyse-config naar de juiste tekenaar op basis van familie.

import React from 'react'
import GroupChartEngine from './GroupChartEngine'
import TrendChartEngine from './TrendChartEngine'

export default function AnalysisChart({ familie, config, allTransactions, period }) {
  if (familie === 'trend') {
    return <TrendChartEngine config={config} allTransactions={allTransactions} period={period} />
  }
  return <GroupChartEngine config={config} allTransactions={allTransactions} period={period} />
}
