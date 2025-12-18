<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const gameStore = useGameStore()
const { stats, incomeSelections, expenseSelections, decisionSelections, currentStage, investmentAmount } = storeToRefs(gameStore)

// Format number as currency
function formatMoney(amount: number): string {
  const absAmount = Math.abs(amount)
  if (absAmount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (absAmount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

// Get the number of years in the current stage
const stageYears = computed(() => currentStage.value.years)

// Investment return rates for preview (expected returns, not accounting for risk)
const investmentReturnRates: Record<string, number> = {
  'invest_index': 0.08,
  'invest_rental': 0.12,
  'invest_stocks': 0.15,
  'invest_crypto': 0.50,
  'invest_lottery': 0.01, // Show 1% expected return for lottery (1% chance of 1000% return)
}

// Calculate projected investment returns
const projectedInvestmentReturns = computed(() => {
  const investmentCard = incomeSelections.value.find(c =>
    ['invest_index', 'invest_rental', 'invest_stocks', 'invest_crypto', 'invest_lottery'].includes(c.id)
  )
  if (!investmentCard || investmentAmount.value <= 0) return 0
  const returnRate = investmentReturnRates[investmentCard.id] || 0
  return Math.round(investmentAmount.value * returnRate * stageYears.value)
})

// Calculate projected wealth change from all current selections (per year)
const projectedWealthChangePerYear = computed(() => {
  const allSelections = [...incomeSelections.value, ...expenseSelections.value, ...decisionSelections.value]
  // Exclude investment cards from the base calculation (handled separately)
  const investmentIds = ['invest_index', 'invest_rental', 'invest_stocks', 'invest_crypto', 'invest_lottery']
  return allSelections.reduce((sum, card) => {
    if (investmentIds.includes(card.id)) return sum // Skip investment cards
    const wealthEffect = card.effects.find(e => e.stat === 'wealth')
    return sum + (wealthEffect?.delta || 0)
  }, 0)
})

// Cash Flow represents the projected change multiplied by years in this stage plus investment returns
const cashFlow = computed(() => projectedWealthChangePerYear.value * stageYears.value + projectedInvestmentReturns.value)

// Net Worth represents accumulated wealth + projected change for this period
const netWorth = computed(() => stats.value.wealth + cashFlow.value)
</script>

<template>
  <div class="finance-bar">
    <div class="finance-stat" title="Money left each year">
      <span class="finance-icon">💵</span>
      <span class="finance-label">Cash Flow ({{ stageYears }}yr)</span>
      <span class="finance-value" :class="{ positive: cashFlow > 0, negative: cashFlow < 0 }">
        {{ cashFlow >= 0 ? '+' : '' }}{{ formatMoney(cashFlow) }}
      </span>
    </div>
    <div class="finance-divider"></div>
    <div class="finance-stat" title="What you own minus what you owe">
      <span class="finance-icon">🏦</span>
      <span class="finance-label">Net Worth</span>
      <span class="finance-value" :class="{ positive: netWorth > 0, negative: netWorth < 0 }">
        {{ formatMoney(netWorth) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.finance-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 0.6rem 1.25rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.finance-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.finance-icon {
  font-size: 1.1rem;
}

.finance-label {
  font-size: 0.75rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.finance-value {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  min-width: 2rem;
}

.finance-value.positive {
  color: #4ade80;
}

.finance-value.negative {
  color: #f87171;
}

.finance-divider {
  width: 1px;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
}
</style>
