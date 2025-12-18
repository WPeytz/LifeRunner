<script setup lang="ts">
import type { Card } from '@/types/game'
import CardComp from './Card.vue'
import { useGameStore } from '@/stores/game'
import { getCardById } from '@/data/cards'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const props = defineProps<{
  highlightedCardId?: string | null
}>()

const gameStore = useGameStore()
const { filteredHand, activeSubOptions, activeThirdLevelOptions, currentSelections, lifeEnergy, locationSelections, educationSelections, incomeSelections, expenseSelections, decisionSelections, selectionPhase, visitedLocationCategories, visitedEducationCategories, visitedExpenseCategories, visitedIncomeCategories, visitedDecisionCategories, stats, activeTopLevelCategory, investmentAmount, maxInvestmentAmount, pendingWealth, lotteryPlayed, lotteryResult, showLotteryPopup, showAdmissionPopup, admissionResult, portfolio, portfolioTotalValue, portfolioGainLoss, wsopPlayed, wsopResult, showWsopPopup } = storeToRefs(gameStore)

// Check if a card's prerequisites are met (education/experience) or location requirements
function isLocked(card: Card): boolean {
  return !gameStore.meetsPrerequisites(card) || !gameStore.meetsLocationRequirement(card)
}

// Check if we're on the investing category
const isInvestingActive = computed(() => activeTopLevelCategory.value === 'investing')

// Check if a non-default investing option is selected
const hasActiveInvestment = computed(() => {
  const investingSubOptions = ['invest_index', 'invest_rental', 'invest_stocks', 'invest_crypto', 'invest_lottery']
  return incomeSelections.value.some(c => investingSubOptions.includes(c.id))
})

// Check if lottery tickets is selected
const isLotterySelected = computed(() => {
  return incomeSelections.value.some(c => c.id === 'invest_lottery')
})

function handlePlayLottery() {
  gameStore.playLottery()
}

function handleCloseLotteryPopup() {
  gameStore.closeLotteryPopup()
}

// Elite school application
const eliteSchools = ['edu_harvard', 'edu_mit']

function isEliteSchool(cardId: string): boolean {
  return eliteSchools.includes(cardId)
}

function getSchoolStatus(schoolId: string) {
  return gameStore.getEliteSchoolStatus(schoolId)
}

function handleApplyToSchool(schoolId: string) {
  gameStore.applyToEliteSchool(schoolId)
}

function handleCloseAdmissionPopup() {
  gameStore.closeAdmissionPopup()
}

// WSOP (World Series of Poker)
const isWsopSelected = computed(() => {
  return decisionSelections.value.some(c => c.id === 'career_wsop')
})

function handlePlayWSOP() {
  gameStore.playWSOP()
}

function handleCloseWsopPopup() {
  gameStore.closeWsopPopup()
}

// Helper to get WSOP outcome display
function getWsopOutcomeDisplay(outcome: string) {
  switch (outcome) {
    case 'winner':
      return { icon: '🏆', title: 'WORLD CHAMPION!', color: 'gold' }
    case 'final_table':
      return { icon: '🥈', title: 'FINAL TABLE!', color: 'silver' }
    case 'cashed':
      return { icon: '💵', title: 'IN THE MONEY!', color: 'green' }
    default:
      return { icon: '😔', title: 'BUSTED', color: 'red' }
  }
}

// Portfolio management
const isPortfolioSelected = computed(() => {
  return incomeSelections.value.some(c => c.id === 'invest_portfolio')
})

const buyAmount = ref(1000)
const selectedStockToBuy = ref('stock_index')
const selectedStockToSell = ref('')

function handleBuyStock() {
  if (buyAmount.value > 0 && buyAmount.value <= stats.value.wealth) {
    gameStore.buyStock(selectedStockToBuy.value, buyAmount.value)
  }
}

function handleSellStock(stockId: string, amount: number) {
  gameStore.sellStock(stockId, amount)
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low': return '#4ade80'
    case 'medium': return '#facc15'
    case 'high': return '#f97316'
    case 'extreme': return '#ef4444'
    default: return '#fff'
  }
}

// Format currency for display
function formatMoney(amount: number): string {
  const absAmount = Math.abs(amount)
  if (absAmount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (absAmount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

function handleInvestmentChange(event: Event) {
  const target = event.target as HTMLInputElement
  gameStore.setInvestmentAmount(Number(target.value))
}

// All selections across all phases
const allSelectedIds = computed(() => {
  return [
    ...locationSelections.value.map(c => c.id),
    ...educationSelections.value.map(c => c.id),
    ...incomeSelections.value.map(c => c.id),
    ...expenseSelections.value.map(c => c.id),
    ...decisionSelections.value.map(c => c.id),
  ]
})

// Current phase selections
const currentSelectedIds = computed(() => currentSelections.value.map(c => c.id))

// Check if a selection is a descendant of a given card (child, grandchild, etc.)
function isDescendantOf(selection: Card, ancestorId: string): boolean {
  let currentId = selection.parentId
  while (currentId) {
    if (currentId === ancestorId) return true
    const parent = getCardById(currentId)
    currentId = parent?.parentId
  }
  return false
}

// Check if a top-level category has a completed selection (a sub-option or deeper is selected)
function hasCompletedSelection(card: Card): boolean {
  if (!card.subOptions || card.subOptions.length === 0) return false

  // For location categories, only show as completed if user has explicitly visited/clicked on it
  if (card.cardType === 'location' && !visitedLocationCategories.value.has(card.id)) {
    return false
  }

  // For education categories, only show as completed if user has explicitly visited/clicked on it
  if (card.cardType === 'education' && !visitedEducationCategories.value.has(card.id)) {
    return false
  }

  // For expense categories, only show as completed if user has explicitly visited/clicked on it
  if (card.cardType === 'expense' && !visitedExpenseCategories.value.has(card.id)) {
    return false
  }

  // For income categories, only show as completed if user has explicitly visited/clicked on it
  if (card.cardType === 'income' && !visitedIncomeCategories.value.has(card.id)) {
    return false
  }

  // For decision categories, only show as completed if user has explicitly visited/clicked on it
  if (card.cardType === 'decision' && !visitedDecisionCategories.value.has(card.id)) {
    return false
  }

  const allSelections = [...locationSelections.value, ...educationSelections.value, ...incomeSelections.value, ...expenseSelections.value, ...decisionSelections.value]

  // Check if any selection is a descendant of this card
  for (const selection of allSelections) {
    if (selection.id !== card.id && isDescendantOf(selection, card.id)) {
      return true
    }
  }
  return false
}

// Get the deepest selected sub-option title for a top-level category
function getSelectedChoice(card: Card): string | undefined {
  if (!card.subOptions || card.subOptions.length === 0) return undefined

  const allSelections = [...locationSelections.value, ...educationSelections.value, ...incomeSelections.value, ...expenseSelections.value, ...decisionSelections.value]

  // Find the deepest selected descendant of this card
  let deepestSelection: Card | undefined = undefined
  let deepestDepth = 0

  for (const selection of allSelections) {
    if (selection.id === card.id) continue

    // Check if this selection is a descendant and calculate depth
    let depth = 0
    let currentId = selection.parentId
    let isDescendant = false

    while (currentId) {
      depth++
      if (currentId === card.id) {
        isDescendant = true
        break
      }
      const parent = getCardById(currentId)
      currentId = parent?.parentId
    }

    // Keep the deepest descendant (most specific choice)
    if (isDescendant && depth > deepestDepth) {
      deepestDepth = depth
      deepestSelection = selection
    }
  }

  return deepestSelection?.title
}

const usedEnergy = computed(() => {
  // Only count energy from income and decision cards - expenses are mandatory life costs
  const energySelections = [...incomeSelections.value, ...decisionSelections.value]
  return energySelections.reduce((sum, card) => sum + card.cost, 0)
})

const remainingEnergy = computed(() => {
  return lifeEnergy.value - usedEnergy.value
})

function isDisabled(card: Card): boolean {
  if (allSelectedIds.value.includes(card.id)) return false
  // Check minimum wealth requirement
  if (card.minWealth && stats.value.wealth < card.minWealth) return true
  // Expense cards are never disabled by energy - they're mandatory life costs
  if (selectionPhase.value === 'expenses' || card.cardType === 'expense') return false
  return card.cost > remainingEnergy.value
}

function handleToggle(card: Card) {
  gameStore.toggleCardSelection(card)
}
</script>

<template>
  <div class="hand-container">
    <section class="hand">
      <div v-if="filteredHand.length === 0" class="no-cards">
        No cards available for this phase
      </div>
      <CardComp
        v-for="card in filteredHand"
        :key="card.id"
        :card="card"
        :selected="currentSelectedIds.includes(card.id)"
        :disabled="isDisabled(card)"
        :highlighted="highlightedCardId === card.id"
        :completed="hasCompletedSelection(card)"
        :selected-choice="getSelectedChoice(card)"
        @toggle="handleToggle"
      />
    </section>

    <!-- Sub-options row (second level) -->
    <section v-if="activeSubOptions.length > 0" class="sub-options">
      <div class="sub-options-label">Choose a specific option:</div>
      <div class="sub-options-cards">
        <CardComp
          v-for="card in activeSubOptions"
          :key="card.id"
          :card="card"
          :selected="currentSelectedIds.includes(card.id)"
          :disabled="isDisabled(card)"
          :highlighted="false"
          @toggle="handleToggle"
        />
      </div>

      <!-- Investment amount slider -->
      <div v-if="isInvestingActive && hasActiveInvestment && !isLotterySelected && maxInvestmentAmount > 0" class="investment-slider">
        <div class="slider-header">
          <span class="slider-label">Investment Amount</span>
          <span class="slider-value">{{ formatMoney(investmentAmount) }}</span>
        </div>
        <input
          type="range"
          :min="0"
          :max="maxInvestmentAmount"
          :step="Math.max(100, Math.floor(maxInvestmentAmount / 100))"
          :value="investmentAmount"
          @input="handleInvestmentChange"
          class="slider"
        />
        <div class="slider-range">
          <span>$0</span>
          <span>{{ formatMoney(maxInvestmentAmount) }}</span>
        </div>
      </div>

      <!-- Lottery confirm button -->
      <div v-if="isLotterySelected && isInvestingActive" class="lottery-section">
        <div class="lottery-info">
          <span class="lottery-label">Try Your Luck!</span>
          <span class="lottery-odds">1% chance to win $100K | 99% chance to lose $1K</span>
        </div>
        <button
          v-if="!lotteryPlayed"
          @click="handlePlayLottery"
          class="lottery-confirm-btn"
        >
          Buy Lottery Ticket
        </button>
        <div v-else class="lottery-played">
          Lottery played this stage
        </div>
      </div>

      <!-- WSOP (World Series of Poker) confirm button -->
      <div v-if="isWsopSelected && activeTopLevelCategory === 'decision_career'" class="wsop-section">
        <div class="wsop-info">
          <span class="wsop-label">🃏 World Series of Poker Main Event</span>
          <span class="wsop-odds">Entry: $10,000 | Top Prize: $10M</span>
        </div>
        <button
          v-if="!wsopPlayed"
          @click="handlePlayWSOP"
          class="wsop-confirm-btn"
          :disabled="pendingWealth < 10000"
        >
          {{ pendingWealth < 10000 ? 'Need $10,000 to enter' : 'Enter Tournament ($10,000)' }}
        </button>
        <div v-else class="wsop-played">
          WSOP played this stage
        </div>
      </div>

      <!-- Elite School Apply Buttons -->
      <template v-for="card in activeSubOptions" :key="'apply-' + card.id">
        <div v-if="isEliteSchool(card.id) && currentSelectedIds.includes(card.id)" class="elite-school-section">
          <div class="elite-school-info">
            <span class="elite-school-label">🎓 {{ card.title }}</span>
            <span class="elite-school-odds">Low acceptance rate</span>
          </div>
          <button
            v-if="getSchoolStatus(card.id) === 'not_applied'"
            @click="handleApplyToSchool(card.id)"
            class="elite-school-apply-btn"
          >
            Apply to {{ card.title }}
          </button>
          <div v-else-if="getSchoolStatus(card.id) === 'admitted'" class="elite-school-admitted">
            ✅ Admitted! Select your major below.
          </div>
          <div v-else-if="getSchoolStatus(card.id) === 'rejected'" class="elite-school-rejected">
            ❌ Application rejected
          </div>
        </div>
      </template>

      <!-- Portfolio Management -->
      <div v-if="isPortfolioSelected && isInvestingActive" class="portfolio-section">
        <div class="portfolio-header">
          <span class="portfolio-title">📈 Stock Portfolio</span>
          <div class="portfolio-summary">
            <span class="portfolio-value">Value: {{ formatMoney(portfolioTotalValue) }}</span>
            <span class="portfolio-gain" :class="{ positive: portfolioGainLoss >= 0, negative: portfolioGainLoss < 0 }">
              {{ portfolioGainLoss >= 0 ? '+' : '' }}{{ formatMoney(portfolioGainLoss) }}
            </span>
          </div>
        </div>

        <!-- Current Holdings -->
        <div v-if="portfolio.length > 0" class="portfolio-holdings">
          <div class="holdings-title">Your Holdings</div>
          <div v-for="holding in portfolio" :key="holding.id" class="holding-row">
            <div class="holding-info">
              <span class="holding-name">{{ holding.name }}</span>
              <span class="holding-risk" :style="{ color: getRiskColor(holding.riskLevel) }">{{ holding.riskLevel }}</span>
            </div>
            <div class="holding-value">
              <span>{{ formatMoney(holding.currentValue) }}</span>
              <button class="sell-btn" @click="handleSellStock(holding.id, holding.currentValue)">Sell All</button>
            </div>
          </div>
        </div>

        <!-- Buy Stocks -->
        <div class="portfolio-buy">
          <div class="buy-title">Buy Investments</div>
          <div class="buy-controls">
            <select v-model="selectedStockToBuy" class="stock-select">
              <option value="stock_bonds">Bond Fund (Low Risk)</option>
              <option value="stock_index">S&P 500 Index (Low Risk)</option>
              <option value="stock_bluechip">Blue Chip Stocks (Medium Risk)</option>
              <option value="stock_growth">Growth Stocks (High Risk)</option>
              <option value="stock_tech">Tech Stocks (High Risk)</option>
              <option value="stock_crypto">Crypto Fund (Extreme Risk)</option>
            </select>
            <input
              type="number"
              v-model.number="buyAmount"
              :max="stats.wealth"
              min="100"
              step="100"
              class="buy-amount"
              placeholder="Amount"
            />
            <button
              class="buy-btn"
              @click="handleBuyStock"
              :disabled="buyAmount <= 0 || buyAmount > stats.wealth"
            >
              Buy
            </button>
          </div>
          <div class="available-funds">Available: {{ formatMoney(stats.wealth) }}</div>
        </div>
      </div>
    </section>

    <!-- Third-level options row -->
    <section v-if="activeThirdLevelOptions.length > 0" class="sub-options third-level">
      <div class="sub-options-label">Select your focus:</div>
      <div class="sub-options-cards">
        <CardComp
          v-for="card in activeThirdLevelOptions"
          :key="card.id"
          :card="card"
          :selected="currentSelectedIds.includes(card.id)"
          :disabled="isDisabled(card)"
          :locked="isLocked(card)"
          :highlighted="false"
          @toggle="handleToggle"
        />
      </div>
    </section>

    <!-- Lottery Result Popup -->
    <Teleport to="body">
      <div v-if="showLotteryPopup && lotteryResult" class="lottery-popup-overlay" @click="handleCloseLotteryPopup">
        <div class="lottery-popup" :class="lotteryResult.won ? 'won' : 'lost'" @click.stop>
          <div class="lottery-popup-icon">
            {{ lotteryResult.won ? '🎉' : '😢' }}
          </div>
          <h2 class="lottery-popup-title">
            {{ lotteryResult.won ? 'JACKPOT!' : 'Better Luck Next Time' }}
          </h2>
          <p class="lottery-popup-message">
            {{ lotteryResult.won
              ? `You WON $${lotteryResult.amount.toLocaleString()}!`
              : `You lost $${lotteryResult.amount.toLocaleString()}`
            }}
          </p>
          <button class="lottery-popup-btn" @click="handleCloseLotteryPopup">
            {{ lotteryResult.won ? 'Celebrate!' : 'Close' }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Admission Result Popup -->
    <Teleport to="body">
      <div v-if="showAdmissionPopup && admissionResult" class="admission-popup-overlay" @click="handleCloseAdmissionPopup">
        <div class="admission-popup" :class="admissionResult.admitted ? 'admitted' : 'rejected'" @click.stop>
          <div class="admission-popup-icon">
            {{ admissionResult.admitted ? '🎉' : '📧' }}
          </div>
          <h2 class="admission-popup-title">
            {{ admissionResult.admitted ? 'CONGRATULATIONS!' : 'We regret to inform you...' }}
          </h2>
          <p class="admission-popup-message">
            {{ admissionResult.admitted
              ? `You've been admitted to ${admissionResult.school}!`
              : `${admissionResult.school} has declined your application.`
            }}
          </p>
          <button class="admission-popup-btn" @click="handleCloseAdmissionPopup">
            {{ admissionResult.admitted ? 'Amazing!' : 'Close' }}
          </button>
        </div>
      </div>
    </Teleport>

    <!-- WSOP Result Popup -->
    <Teleport to="body">
      <div v-if="showWsopPopup && wsopResult" class="wsop-popup-overlay" @click="handleCloseWsopPopup">
        <div class="wsop-popup" :class="wsopResult.outcome" @click.stop>
          <div class="wsop-popup-icon">
            {{ getWsopOutcomeDisplay(wsopResult.outcome).icon }}
          </div>
          <h2 class="wsop-popup-title">
            {{ getWsopOutcomeDisplay(wsopResult.outcome).title }}
          </h2>
          <p class="wsop-popup-message">
            <template v-if="wsopResult.outcome === 'winner'">
              You WON the World Series of Poker Main Event!<br>
              Prize: <strong>${{ wsopResult.amount.toLocaleString() }}</strong>
            </template>
            <template v-else-if="wsopResult.outcome === 'final_table'">
              You made the FINAL TABLE!<br>
              Prize: <strong>${{ wsopResult.amount.toLocaleString() }}</strong>
            </template>
            <template v-else-if="wsopResult.outcome === 'cashed'">
              You finished in the money!<br>
              Prize: <strong>${{ wsopResult.amount.toLocaleString() }}</strong>
            </template>
            <template v-else>
              You busted out of the tournament.<br>
              Lost your $10,000 entry fee.
            </template>
          </p>
          <button class="wsop-popup-btn" :class="wsopResult.outcome" @click="handleCloseWsopPopup">
            {{ wsopResult.outcome === 'bust' ? 'Close' : 'Celebrate!' }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hand-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.hand {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
}

.no-cards {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  padding: 2rem;
  text-align: center;
}

.sub-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(233, 69, 96, 0.1);
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 12px;
  margin: 0 1rem;
}

.sub-options-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sub-options-cards {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.sub-options.third-level {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.3);
}

.sub-options.third-level .sub-options-label {
  color: #4ade80;
}

/* Investment Slider */
.investment-slider {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.slider-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slider-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
  transition: transform 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.slider-range {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Lottery Section */
.lottery-section {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
  border: 2px solid rgba(147, 51, 234, 0.5);
  border-radius: 12px;
  text-align: center;
}

.lottery-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.lottery-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c084fc;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.lottery-odds {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.lottery-confirm-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lottery-confirm-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.5);
}

.lottery-confirm-btn:active {
  transform: scale(0.98);
}

.lottery-played {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* Lottery Popup */
.lottery-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lottery-popup {
  background: #1a1a2e;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lottery-popup.won {
  border: 3px solid #4ade80;
  box-shadow: 0 0 60px rgba(74, 222, 128, 0.4);
}

.lottery-popup.lost {
  border: 3px solid #ef4444;
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.3);
}

.lottery-popup-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.lottery-popup-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.lottery-popup.won .lottery-popup-title {
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.lottery-popup.lost .lottery-popup-title {
  color: #ef4444;
}

.lottery-popup-message {
  font-size: 1.25rem;
  color: #fff;
  margin: 0 0 1.5rem;
}

.lottery-popup.won .lottery-popup-message {
  color: #4ade80;
  font-weight: 700;
}

.lottery-popup-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.lottery-popup.won .lottery-popup-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.lottery-popup.lost .lottery-popup-btn {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.lottery-popup-btn:hover {
  transform: scale(1.05);
}

/* WSOP Section */
.wsop-section {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(161, 98, 7, 0.2) 100%);
  border: 2px solid rgba(234, 179, 8, 0.5);
  border-radius: 12px;
  text-align: center;
}

.wsop-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.wsop-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #facc15;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.wsop-odds {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.wsop-confirm-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #000;
  background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wsop-confirm-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(234, 179, 8, 0.5);
}

.wsop-confirm-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.wsop-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: #fff;
}

.wsop-played {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* WSOP Popup */
.wsop-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.wsop-popup {
  background: #1a1a2e;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: popIn 0.3s ease;
}

.wsop-popup.winner {
  border: 3px solid #ffd700;
  box-shadow: 0 0 80px rgba(255, 215, 0, 0.6);
}

.wsop-popup.final_table {
  border: 3px solid #c0c0c0;
  box-shadow: 0 0 60px rgba(192, 192, 192, 0.4);
}

.wsop-popup.cashed {
  border: 3px solid #4ade80;
  box-shadow: 0 0 40px rgba(74, 222, 128, 0.3);
}

.wsop-popup.bust {
  border: 3px solid #ef4444;
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.3);
}

.wsop-popup-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.wsop-popup-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.wsop-popup.winner .wsop-popup-title {
  color: #ffd700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.7);
}

.wsop-popup.final_table .wsop-popup-title {
  color: #c0c0c0;
  text-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.wsop-popup.cashed .wsop-popup-title {
  color: #4ade80;
}

.wsop-popup.bust .wsop-popup-title {
  color: #ef4444;
}

.wsop-popup-message {
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.wsop-popup-message strong {
  font-size: 1.3rem;
}

.wsop-popup-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.wsop-popup-btn.winner {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #000;
}

.wsop-popup-btn.final_table {
  background: linear-gradient(135deg, #9ca3af 0%, #c0c0c0 100%);
  color: #000;
}

.wsop-popup-btn.cashed {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.wsop-popup-btn.bust {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.wsop-popup-btn:hover {
  transform: scale(1.05);
}

/* Elite School Section */
.elite-school-section {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.15) 100%);
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 12px;
  text-align: center;
}

.elite-school-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.elite-school-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fca5a5;
  letter-spacing: 0.5px;
}

.elite-school-odds {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.elite-school-apply-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.elite-school-apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.5);
}

.elite-school-apply-btn:active {
  transform: scale(0.98);
}

.elite-school-admitted {
  font-size: 0.95rem;
  color: #4ade80;
  font-weight: 600;
}

.elite-school-rejected {
  font-size: 0.95rem;
  color: #f87171;
  font-style: italic;
}

/* Admission Popup */
.admission-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.admission-popup {
  background: #1a1a2e;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  max-width: 400px;
  animation: popIn 0.3s ease;
}

.admission-popup.admitted {
  border: 3px solid #4ade80;
  box-shadow: 0 0 60px rgba(74, 222, 128, 0.4);
}

.admission-popup.rejected {
  border: 3px solid #f87171;
  box-shadow: 0 0 40px rgba(248, 113, 113, 0.3);
}

.admission-popup-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.admission-popup-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admission-popup.admitted .admission-popup-title {
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.admission-popup.rejected .admission-popup-title {
  color: #f87171;
}

.admission-popup-message {
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 1.5rem;
}

.admission-popup.admitted .admission-popup-message {
  color: #4ade80;
  font-weight: 600;
}

.admission-popup-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.admission-popup.admitted .admission-popup-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.admission-popup.rejected .admission-popup-btn {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.admission-popup-btn:hover {
  transform: scale(1.05);
}

/* Portfolio Section */
.portfolio-section {
  width: 100%;
  max-width: 500px;
  margin-top: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.portfolio-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4ade80;
}

.portfolio-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.portfolio-value {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.portfolio-gain {
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.portfolio-gain.positive {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.2);
}

.portfolio-gain.negative {
  color: #f87171;
  background: rgba(248, 113, 113, 0.2);
}

.portfolio-holdings {
  margin-bottom: 1rem;
}

.holdings-title,
.buy-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.holding-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.holding-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.holding-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.holding-risk {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.holding-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.sell-btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.sell-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
}

.portfolio-buy {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.buy-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stock-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(30, 30, 50, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  outline: none;
}

.stock-select:focus {
  border-color: #4ade80;
}

.stock-select option {
  background: #1e1e32;
  color: #fff;
}

.buy-amount {
  width: 100px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: #fff;
  background: rgba(30, 30, 50, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  outline: none;
}

.buy-amount:focus {
  border-color: #4ade80;
}

.buy-btn {
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.buy-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(34, 197, 94, 0.4);
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.available-funds {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
}
</style>
