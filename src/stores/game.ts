import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { baseDeck, getCardById } from '@/data/cards';
import { lifeStages, totalStages } from '@/data/lifeStages';
import { getRandomEventsForStage, type RandomEvent } from '@/data/randomEvents';
import type { Card, Stats, LifeStage, SelectionPhase } from '@/types/game';

export type GamePhase = 'idle' | 'choosing' | 'events' | 'resolving' | 'ended';

export const useGameStore = defineStore('game', () => {
  const stageIndex = ref(0); // 0-9 for 10 stages
  const lifeEnergy = ref(5);
  const stats = ref<Stats>({
    health: 5,
    wealth: 0,
    skills: 0,
    relationships: 0,
    happiness: 3,
  });

  const phase = ref<GamePhase>('idle');
  const selectionPhase = ref<SelectionPhase>('location');
  const deck = ref<Card[]>([...baseDeck]);
  const hand = ref<Card[]>([]);
  const selectedCards = ref<Card[]>([]);
  const locationSelections = ref<Card[]>([]);
  const educationSelections = ref<Card[]>([]);
  const incomeSelections = ref<Card[]>([]);
  const expenseSelections = ref<Card[]>([]);
  const decisionSelections = ref<Card[]>([]);
  const lifeLog = ref<string[]>([]);
  const isDead = ref(false);

  // Track unlocked follow-up cards for next stage
  const unlockedCardIds = ref<string[]>([]);

  // Track cards that have been played (to prevent duplicates)
  const playedCardIds = ref<Set<string>>(new Set());

  // Resume history - track education and work experience with stage info
  interface ResumeEntry {
    cardId: string;
    cardTitle: string;
    parentTitle?: string;  // Parent category title (e.g., "University", "Full-Time Job")
    stageName: string;
    ageRange: string;
    type: 'education' | 'work';
  }
  const resumeHistory = ref<ResumeEntry[]>([]);

  // Track previous stage's expense selections for "Same as last stage" feature
  const previousExpenseSelections = ref<Card[]>([]);

  // Track previous relationship selection for defaults
  const previousRelationshipSelection = ref<Card | null>(null);

  // Year results tracking
  const lastPlayedCards = ref<Card[]>([]);
  const lastStatChanges = ref<Record<string, number>>({});
  const lastRiskEvents = ref<string[]>([]);
  const lastTriggeredEvents = ref<Card[]>([]);
  const stageRandomEvents = ref<RandomEvent[]>([]);

  // Current stage info
  const currentStage = computed((): LifeStage => {
    return lifeStages[stageIndex.value] || lifeStages[0];
  });

  const maxLifeEnergy = computed(() => {
    return currentStage.value.energyPerTurn;
  });

  const isLastStage = computed(() => {
    return stageIndex.value >= totalStages - 1;
  });

  // Education types that qualify for scholarships and student loans
  const qualifyingEducationIds = ['edu_community', 'edu_university', 'edu_trade', 'edu_graduate', 'edu_harvard', 'edu_mit'];

  // Prefixes for education sub-options that indicate full-time education
  const qualifyingEducationPrefixes = ['uni_', 'cc_', 'trade_', 'grad_', 'harvard_', 'mit_'];

  // Check if player has selected qualifying education (community college, university, trade school, or graduate school)
  // Also checks if any selection is a descendant of a qualifying education type
  const hasQualifyingEducation = computed(() => {
    return educationSelections.value.some(card => {
      // Direct match
      if (qualifyingEducationIds.includes(card.id)) return true;
      // Check by prefix (e.g., uni_math, cc_nursing, trade_electrician, grad_law)
      if (qualifyingEducationPrefixes.some(prefix => card.id.startsWith(prefix))) return true;
      // Check if parent is a qualifying education
      if (card.parentId && qualifyingEducationIds.includes(card.parentId)) return true;
      return false;
    });
  });

  // Check if player has a job (reactively)
  const hasJob = computed(() => {
    return Array.from(playedCardIds.value).some(id => id.startsWith('job_')) ||
           incomeSelections.value.some(c => c.id.startsWith('job_'));
  });

  // Get cards filtered by current selection phase (excluding sub-options)
  const filteredHand = computed(() => {
    const phaseToType: Record<SelectionPhase, string> = {
      location: 'location',
      education: 'education',
      income: 'income',
      expenses: 'expense',
      decisions: 'decision',
    };
    const cardType = phaseToType[selectionPhase.value];
    let cards = hand.value.filter(card => {
      if (card.cardType !== cardType || card.isSubOption) return false;

      // Hide scholarship unless qualifying education is selected
      if (card.id === 'scholarship' && !hasQualifyingEducation.value) return false;

      // Hide full-time job if pursuing full-time education (university, community college, trade school, graduate school)
      if (card.id === 'full_time_job' && hasQualifyingEducation.value) return false;

      return true;
    });

    // Dynamically add Career category to decisions if player has a job (selected this stage)
    if (cardType === 'decision' && hasJob.value) {
      const hasCareer = cards.some(c => c.id === 'decision_career');
      if (!hasCareer) {
        const careerCard = getCardById('decision_career');
        if (careerCard) {
          // Insert Career at the beginning
          cards = [careerCard, ...cards];
        }
      }
    }

    return cards;
  });

  // Track which top-level category is currently "open" (showing its sub-options)
  const activeTopLevelCategory = ref<string | null>(null);

  // Track which expense categories have been explicitly visited/confirmed by the user
  const visitedExpenseCategories = ref<Set<string>>(new Set());

  // Track which income categories have been explicitly visited/confirmed by the user
  const visitedIncomeCategories = ref<Set<string>>(new Set());

  // Track which decision categories have been explicitly visited/confirmed by the user
  const visitedDecisionCategories = ref<Set<string>>(new Set());

  // Track which location categories have been explicitly visited/confirmed by the user
  const visitedLocationCategories = ref<Set<string>>(new Set());

  // Track which education categories have been explicitly visited/confirmed by the user
  const visitedEducationCategories = ref<Set<string>>(new Set());

  // Track investment amount (how much of net worth to invest)
  const investmentAmount = ref(0);
  const maxInvestmentAmount = computed(() => Math.max(0, stats.value.wealth));

  // Calculate pending wealth (current wealth + wealth effects from current selections)
  const pendingWealth = computed(() => {
    let wealth = stats.value.wealth;
    const allSelections = [
      ...locationSelections.value,
      ...educationSelections.value,
      ...incomeSelections.value,
      ...expenseSelections.value,
      ...decisionSelections.value,
    ];
    for (const card of allSelections) {
      for (const effect of card.effects) {
        if (effect.stat === 'wealth') {
          wealth += effect.delta;
        }
      }
    }
    return wealth;
  });

  // Lottery state
  const lotteryPlayed = ref(false);
  const lotteryResult = ref<{ won: boolean; amount: number } | null>(null);
  const showLotteryPopup = ref(false);

  // WSOP (World Series of Poker) state
  const wsopPlayed = ref(false);
  const wsopResult = ref<{ outcome: 'winner' | 'final_table' | 'cashed' | 'bust'; amount: number } | null>(null);
  const showWsopPopup = ref(false);

  // Achievement tracking
  const unlockedAchievements = ref<Set<string>>(new Set());

  function unlockAchievement(achievementId: string) {
    if (!unlockedAchievements.value.has(achievementId)) {
      unlockedAchievements.value.add(achievementId);
    }
  }

  function isAchievementUnlocked(achievementId: string): boolean {
    return unlockedAchievements.value.has(achievementId);
  }

  // Elite school application state
  const eliteSchoolApplications = ref<Record<string, 'pending' | 'admitted' | 'rejected'>>({});
  const showAdmissionPopup = ref(false);
  const admissionResult = ref<{ school: string; admitted: boolean } | null>(null);

  // Stock portfolio state
  interface PortfolioHolding {
    id: string;
    name: string;
    shares: number;
    costBasis: number; // Total amount invested
    currentValue: number;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  }
  const portfolio = ref<PortfolioHolding[]>([]);
  const portfolioTotalValue = computed(() =>
    portfolio.value.reduce((sum, h) => sum + h.currentValue, 0)
  );
  const portfolioTotalCost = computed(() =>
    portfolio.value.reduce((sum, h) => sum + h.costBasis, 0)
  );
  const portfolioGainLoss = computed(() => portfolioTotalValue.value - portfolioTotalCost.value);

  // Stock definitions with risk/reward profiles
  const stockDefinitions: Record<string, { name: string; riskLevel: 'low' | 'medium' | 'high' | 'extreme'; minReturn: number; maxReturn: number }> = {
    'stock_index': { name: 'S&P 500 Index Fund', riskLevel: 'low', minReturn: -0.10, maxReturn: 0.20 },
    'stock_bonds': { name: 'Bond Fund', riskLevel: 'low', minReturn: 0.01, maxReturn: 0.08 },
    'stock_bluechip': { name: 'Blue Chip Stocks', riskLevel: 'medium', minReturn: -0.20, maxReturn: 0.35 },
    'stock_growth': { name: 'Growth Stocks', riskLevel: 'high', minReturn: -0.40, maxReturn: 0.60 },
    'stock_tech': { name: 'Tech Stocks', riskLevel: 'high', minReturn: -0.50, maxReturn: 0.80 },
    'stock_crypto': { name: 'Crypto Fund', riskLevel: 'extreme', minReturn: -0.70, maxReturn: 1.50 },
  };

  function buyStock(stockId: string, amount: number) {
    if (amount <= 0 || amount > stats.value.wealth) return;

    const stockDef = stockDefinitions[stockId];
    if (!stockDef) return;

    // Deduct from wealth
    stats.value.wealth -= amount;

    // Check if we already own this stock
    const existing = portfolio.value.find(h => h.id === stockId);
    if (existing) {
      existing.shares += amount; // Using amount as "shares" for simplicity
      existing.costBasis += amount;
      existing.currentValue += amount;
    } else {
      portfolio.value.push({
        id: stockId,
        name: stockDef.name,
        shares: amount,
        costBasis: amount,
        currentValue: amount,
        riskLevel: stockDef.riskLevel,
      });
    }
  }

  function sellStock(stockId: string, amount: number) {
    const holding = portfolio.value.find(h => h.id === stockId);
    if (!holding || amount <= 0 || amount > holding.currentValue) return;

    // Calculate proportional cost basis to remove
    const proportion = amount / holding.currentValue;
    const costToRemove = holding.costBasis * proportion;

    // Add to wealth
    stats.value.wealth += amount;

    // Update or remove holding
    holding.currentValue -= amount;
    holding.costBasis -= costToRemove;
    holding.shares -= amount;

    // Remove if sold everything
    if (holding.currentValue <= 0) {
      portfolio.value = portfolio.value.filter(h => h.id !== stockId);
    }
  }

  function updatePortfolioValues() {
    // Called at the end of each stage to simulate market changes
    portfolio.value.forEach(holding => {
      const stockDef = stockDefinitions[holding.id];
      if (!stockDef) return;

      // Random return within the stock's range
      const returnRate = stockDef.minReturn + Math.random() * (stockDef.maxReturn - stockDef.minReturn);
      holding.currentValue = Math.max(0, holding.currentValue * (1 + returnRate));

      // Round to nearest dollar
      holding.currentValue = Math.round(holding.currentValue);
    });

    // Remove holdings that went to zero
    portfolio.value = portfolio.value.filter(h => h.currentValue > 0);
  }

  function applyToEliteSchool(schoolId: string) {
    // 20% chance of admission
    const admitted = Math.random() < 0.2;
    eliteSchoolApplications.value[schoolId] = admitted ? 'admitted' : 'rejected';
    admissionResult.value = {
      school: schoolId === 'edu_harvard' ? 'Harvard' : 'MIT',
      admitted
    };
    showAdmissionPopup.value = true;
  }

  function closeAdmissionPopup() {
    showAdmissionPopup.value = false;
  }

  function getEliteSchoolStatus(schoolId: string): 'pending' | 'admitted' | 'rejected' | 'not_applied' {
    return eliteSchoolApplications.value[schoolId] || 'not_applied';
  }

  // Map elite school majors to their regular university equivalents
  const eliteDegreeEquivalents: Record<string, string> = {
    'harvard_business': 'uni_business',
    'harvard_law_undergrad': 'uni_social_science',
    'harvard_economics': 'uni_economics',
    'harvard_cs': 'uni_cs',
    'harvard_biology': 'uni_biology',
    'harvard_government': 'uni_social_science',
    'mit_cs': 'uni_cs',
    'mit_engineering': 'uni_engineering',
    'mit_physics': 'uni_physics',
    'mit_math': 'uni_math',
    'mit_economics': 'uni_economics',
    'mit_biology': 'uni_biology',
  };

  // Check if a card's prerequisites are met (at least one of the required cards has been played)
  function meetsPrerequisites(card: Card): boolean {
    if (!card.requires || card.requires.length === 0) return true;
    // Card is enabled if ANY of the required cards have been played
    // Also check elite school equivalents
    return card.requires.some(reqId => {
      if (playedCardIds.value.has(reqId)) return true;
      // Check if any elite degree equivalent was played
      for (const [eliteId, regularId] of Object.entries(eliteDegreeEquivalents)) {
        if (regularId === reqId && playedCardIds.value.has(eliteId)) return true;
      }
      return false;
    });
  }

  // Check if player is in one of the required locations
  function meetsLocationRequirement(card: Card): boolean {
    if (!card.requiresLocation || card.requiresLocation.length === 0) return true;
    // Card is enabled if player is in ANY of the required locations (check both played cards and current selection)
    return card.requiresLocation.some(locId =>
      playedCardIds.value.has(locId) || currentLocation.value === locId
    );
  }

  // Check if player completed university (played any university major, including elite schools)
  const hasCompletedUniversity = computed(() => {
    const universityMajors = [
      // Regular university majors
      'uni_english', 'uni_physics', 'uni_chemistry', 'uni_biology', 'uni_engineering', 'uni_math', 'uni_social_science', 'uni_history', 'uni_business', 'uni_psychology', 'uni_economics', 'uni_cs', 'uni_philosophy', 'uni_euro_lang', 'uni_asian_lang',
      // Harvard majors
      'harvard_business', 'harvard_law_undergrad', 'harvard_economics', 'harvard_cs', 'harvard_biology', 'harvard_government',
      // MIT majors
      'mit_cs', 'mit_engineering', 'mit_physics', 'mit_math', 'mit_economics', 'mit_biology'
    ];
    return universityMajors.some(majorId => playedCardIds.value.has(majorId));
  });

  // Get sub-options for the currently active top-level category only
  const activeSubOptions = computed(() => {
    if (!activeTopLevelCategory.value) return [];

    const activeCard = getCardById(activeTopLevelCategory.value);
    if (!activeCard || !activeCard.subOptions) return [];

    // Get sub-options and potentially swap university for graduate school
    let subOptionIds = [...activeCard.subOptions];

    // If this is the education category, swap university with graduate school based on completion
    if (activeTopLevelCategory.value === 'decision_education') {
      if (hasCompletedUniversity.value) {
        // Replace edu_university with edu_graduate
        subOptionIds = subOptionIds.map(id => id === 'edu_university' ? 'edu_graduate' : id);
      } else {
        // Remove edu_graduate if university not completed (it shouldn't show yet)
        subOptionIds = subOptionIds.filter(id => id !== 'edu_graduate');
      }
    }

    // If this is the loans category, hide student loan unless qualifying education is selected
    if (activeTopLevelCategory.value === 'loans' && !hasQualifyingEducation.value) {
      subOptionIds = subOptionIds.filter(id => id !== 'loan_student');
    }

    // If this is the work category, hide full-time job if pursuing full-time education (university, community college, trade school)
    if (activeTopLevelCategory.value === 'income_work' && hasQualifyingEducation.value) {
      subOptionIds = subOptionIds.filter(id => id !== 'full_time_job');
    }

    // If this is the career category, only show WSOP if player is a poker player in Vegas
    if (activeTopLevelCategory.value === 'decision_career') {
      const isPokerPlayer = playedCardIds.value.has('job_poker_player') ||
                            incomeSelections.value.some(c => c.id === 'job_poker_player');
      const isInVegas = currentLocation.value === 'city_vegas';
      if (!isPokerPlayer || !isInVegas) {
        subOptionIds = subOptionIds.filter(id => id !== 'career_wsop');
      }
    }

    // If this card has maxSubOptions, randomly limit the sub-options shown
    if (activeCard.maxSubOptions && subOptionIds.length > activeCard.maxSubOptions) {
      // For hobbies, always show 'hobbies_none' and randomize the rest
      if (activeTopLevelCategory.value === 'decision_hobbies') {
        if (randomHobbies.value.length === 0) {
          // Filter out hobbies_none, shuffle the rest, then add hobbies_none back at the start
          const otherHobbies = subOptionIds.filter(id => id !== 'hobbies_none');
          const shuffled = [...otherHobbies].sort(() => Math.random() - 0.5);
          randomHobbies.value = ['hobbies_none', ...shuffled.slice(0, activeCard.maxSubOptions - 1)];
        }
        subOptionIds = randomHobbies.value;
      } else {
        // For other cards with maxSubOptions, shuffle and limit
        const shuffled = [...subOptionIds].sort(() => Math.random() - 0.5);
        subOptionIds = shuffled.slice(0, activeCard.maxSubOptions);
      }
    }

    // Return the actual card objects for sub-options, filtering out cards that don't meet prerequisites or location requirements
    return subOptionIds
      .map(id => getCardById(id))
      .filter((c): c is Card => c !== undefined)
      .filter(c => meetsPrerequisites(c) && meetsLocationRequirement(c));
  });

  // Track which random options were selected for this stage
  const randomUniversityMajors = ref<string[]>([]);
  const randomCities = ref<string[]>([]);
  const randomCountries = ref<string[]>([]);
  const randomHobbies = ref<string[]>([]);

  // All available city IDs for random selection
  const allCityIds = ['city_nyc', 'city_la', 'city_chicago', 'city_houston', 'city_phoenix', 'city_philly', 'city_san_antonio', 'city_san_diego', 'city_dallas', 'city_san_jose', 'city_sf', 'city_vegas', 'city_boston', 'city_dc'];

  // Track current location (city or country)
  const currentLocation = ref<string | null>(null);

  // Get third-level sub-options (sub-options of sub-options) - only for active category
  const activeThirdLevelOptions = computed(() => {
    if (!activeTopLevelCategory.value) return [];

    const allSelections = [...locationSelections.value, ...educationSelections.value, ...incomeSelections.value, ...expenseSelections.value, ...decisionSelections.value];
    const thirdLevelIds: string[] = [];

    // Elite schools that require admission
    const eliteSchools = ['edu_harvard', 'edu_mit'];

    // Get sub-options from selected sub-option cards that belong to the active category
    allSelections.forEach(card => {
      if (card.subOptions && card.isSubOption && card.parentId === activeTopLevelCategory.value) {
        // For elite schools, only show majors if admitted
        if (eliteSchools.includes(card.id)) {
          if (eliteSchoolApplications.value[card.id] === 'admitted') {
            thirdLevelIds.push(...card.subOptions);
          }
          return; // Skip to next card
        }
        // For university, only show 5 random majors
        if (card.id === 'edu_university') {
          if (randomUniversityMajors.value.length === 0) {
            const shuffled = [...card.subOptions].sort(() => Math.random() - 0.5);
            randomUniversityMajors.value = shuffled.slice(0, 5);
          }
          thirdLevelIds.push(...randomUniversityMajors.value);
        }
        // For cities, only show 5 random cities
        else if (card.id === 'loc_city') {
          if (randomCities.value.length === 0) {
            const shuffled = [...card.subOptions].sort(() => Math.random() - 0.5);
            randomCities.value = shuffled.slice(0, 5);
          }
          thirdLevelIds.push(...randomCities.value);
        }
        // For countries, only show 5 random countries
        else if (card.id === 'loc_abroad') {
          if (randomCountries.value.length === 0) {
            const shuffled = [...card.subOptions].sort(() => Math.random() - 0.5);
            randomCountries.value = shuffled.slice(0, 5);
          }
          thirdLevelIds.push(...randomCountries.value);
        }
        else {
          thirdLevelIds.push(...card.subOptions);
        }
      }
    });

    // Return the actual card objects
    // For full-time jobs, show all options (locked ones will be displayed as unavailable)
    // For other categories, filter out cards that don't meet prerequisites or location requirements
    const cards = thirdLevelIds
      .map(id => getCardById(id))
      .filter((c): c is Card => c !== undefined)
      .filter(c => {
        // Show all full-time job options (they'll be displayed as locked if requirements not met)
        if (c.parentId === 'full_time_job') return true;
        // For other categories, apply normal filtering
        return meetsPrerequisites(c) && meetsLocationRequirement(c);
      });

    // Sort full-time jobs: available jobs first, then locked jobs
    return cards.sort((a, b) => {
      if (a.parentId === 'full_time_job' && b.parentId === 'full_time_job') {
        const aAvailable = meetsPrerequisites(a) && meetsLocationRequirement(a);
        const bAvailable = meetsPrerequisites(b) && meetsLocationRequirement(b);
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
      }
      return 0;
    });
  });

  // Get current selections based on phase
  const currentSelections = computed(() => {
    switch (selectionPhase.value) {
      case 'location':
        return locationSelections.value;
      case 'education':
        return educationSelections.value;
      case 'income':
        return incomeSelections.value;
      case 'expenses':
        return expenseSelections.value;
      case 'decisions':
        return decisionSelections.value;
    }
  });

  // Get top-level category IDs for current phase
  const topLevelCategoryIds = computed(() => {
    return filteredHand.value.map(card => card.id);
  });

  // Get current category index
  const currentCategoryIndex = computed(() => {
    if (!activeTopLevelCategory.value) return -1;
    return topLevelCategoryIds.value.indexOf(activeTopLevelCategory.value);
  });

  const canGoNext = computed(() => {
    // Can go next if there's a next category in current phase, or if not on last phase
    if (activeTopLevelCategory.value) {
      const nextIndex = currentCategoryIndex.value + 1;
      if (nextIndex < topLevelCategoryIds.value.length) return true;
    }
    return selectionPhase.value !== 'decisions';
  });

  const canGoBack = computed(() => {
    // Can go back if there's a previous category in current phase, or if not on first phase
    if (activeTopLevelCategory.value) {
      const prevIndex = currentCategoryIndex.value - 1;
      if (prevIndex >= 0) return true;
    }
    return selectionPhase.value !== 'location';
  });

  // Default income options
  const defaultIncomeIds = [
    'work_none',             // No Job (default for work)
    'schol_none',            // No Scholarship (default for scholarship)
    'loan_none',             // No Loans (default for loans)
    'invest_none',           // No Investing (default for investing)
  ];

  // Default middle expense options for each category
  const defaultExpenseIds = [
    'housing_rent_cheap',    // Budget Apartment (middle of housing)
    'transport_used_car',    // Used Car (middle of transport)
    'food_mixed',            // Mixed Lifestyle (middle of food)
    'insurance_standard',    // Standard Coverage (middle of insurance)
    'fun_moderate',          // Moderate Fun (middle of fun)
    'other_comfortable',     // Comfortable (middle of other)
  ];

  // Default education options
  const defaultEducationIds = [
    'edu_none',              // No Studying (default for education)
  ];

  // Default decision options
  const defaultDecisionIds = [
    'social_minimal',        // Keep to Myself (default for social life)
    'hobbies_none',          // No Hobbies (default for hobbies)
    'health_neglect',        // Neglect Health (default for health)
    'values_comfort',        // Seek Comfort (default for values)
  ];

  // Default location options
  const defaultLocationIds = [
    'loc_stay',              // Don't Move (default for location)
  ];

  function setDefaultIncome() {
    // Set default income options (like No Job for work)
    const defaultIncome: Card[] = [];
    defaultIncomeIds.forEach(id => {
      const card = getCardById(id);
      if (card) {
        // Add the parent category card first if it exists
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && !defaultIncome.find(c => c.id === parentCard.id)) {
            defaultIncome.push(parentCard);
          }
        }
        defaultIncome.push(card);
      }
    });
    incomeSelections.value = defaultIncome;
  }

  function setDefaultExpenses() {
    // Set the middle option for each expense category
    // Also include the parent category cards so they show as completed
    const defaultExpenses: Card[] = [];
    defaultExpenseIds.forEach(id => {
      const card = getCardById(id);
      if (card) {
        // Add the parent category card first if it exists
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && !defaultExpenses.find(c => c.id === parentCard.id)) {
            defaultExpenses.push(parentCard);
          }
        }
        defaultExpenses.push(card);
      }
    });

    // If player has debt, set loan minimum payment as default
    if (stats.value.wealth < 0) {
      const loanCategory = getCardById('expense_loan');
      const loanMinimum = getCardById('loan_minimum');
      if (loanCategory && loanMinimum) {
        defaultExpenses.push(loanCategory);
        defaultExpenses.push(loanMinimum);
      }
    }

    expenseSelections.value = defaultExpenses;
  }

  function setDefaultDecisions() {
    // Set default decision options
    const defaultDecisions: Card[] = [];
    defaultDecisionIds.forEach(id => {
      const card = getCardById(id);
      if (card) {
        // Add the parent category card first if it exists
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && !defaultDecisions.find(c => c.id === parentCard.id)) {
            defaultDecisions.push(parentCard);
          }
        }
        defaultDecisions.push(card);
      }
    });

    // Set career default if player has a job: Coast (do nothing special)
    const hasJob = Array.from(playedCardIds.value).some(id => id.startsWith('job_')) ||
                   incomeSelections.value.some(c => c.id.startsWith('job_'));
    if (hasJob) {
      const careerCategory = getCardById('decision_career');
      const careerCoast = getCardById('career_coast');
      if (careerCategory && careerCoast) {
        defaultDecisions.push(careerCategory);
        defaultDecisions.push(careerCoast);
      }
    }

    // Set relationship default: first stage = Stay Single, after = previous selection
    const relationshipCard = previousRelationshipSelection.value || getCardById('rel_single');
    if (relationshipCard) {
      // Add the relationships category card first
      const relationshipsCategory = getCardById('decision_relationships');
      if (relationshipsCategory && !defaultDecisions.find(c => c.id === relationshipsCategory.id)) {
        defaultDecisions.push(relationshipsCategory);
      }
      defaultDecisions.push(relationshipCard);
    }

    decisionSelections.value = defaultDecisions;
  }

  // Helper to add Career default when a job is first selected mid-stage
  function addCareerDefaultIfNeeded() {
    // Check if Career is already in decisions
    const hasCareerSelection = decisionSelections.value.some(c => c.id === 'decision_career' || c.parentId === 'decision_career');
    if (hasCareerSelection) return;

    // Add Career category and default Coast option
    const careerCategory = getCardById('decision_career');
    const careerCoast = getCardById('career_coast');
    if (careerCategory && careerCoast) {
      decisionSelections.value.push(careerCategory);
      decisionSelections.value.push(careerCoast);
    }
  }

  function setDefaultLocation() {
    // Set default location options (Don't Move)
    const defaultLocation: Card[] = [];
    defaultLocationIds.forEach(id => {
      const card = getCardById(id);
      if (card) {
        // Add the parent category card first if it exists
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && !defaultLocation.find(c => c.id === parentCard.id)) {
            defaultLocation.push(parentCard);
            // Mark parent category as visited so it shows as completed
            visitedLocationCategories.value.add(parentCard.id);
          }
        }
        defaultLocation.push(card);
      }
    });
    locationSelections.value = defaultLocation;
  }

  function setDefaultEducation() {
    // Set default education options (No Studying)
    const defaultEducation: Card[] = [];
    defaultEducationIds.forEach(id => {
      const card = getCardById(id);
      if (card) {
        // Add the parent category card first if it exists
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && !defaultEducation.find(c => c.id === parentCard.id)) {
            defaultEducation.push(parentCard);
            // Mark parent category as visited so it shows as completed
            visitedEducationCategories.value.add(parentCard.id);
          }
        }
        defaultEducation.push(card);
      }
    });
    educationSelections.value = defaultEducation;
  }

  function startNewGame() {
    stageIndex.value = 0;
    stats.value = {
      health: 5,
      wealth: 0,
      skills: 0,
      relationships: 0,
      happiness: 3,
    };
    deck.value = [...baseDeck];
    hand.value = [];
    selectedCards.value = [];
    locationSelections.value = [];
    educationSelections.value = [];
    incomeSelections.value = [];
    expenseSelections.value = [];
    decisionSelections.value = [];
    selectionPhase.value = 'location';
    lifeLog.value = [];
    isDead.value = false;
    lifeEnergy.value = currentStage.value.energyPerTurn;
    phase.value = 'choosing';
    lastPlayedCards.value = [];
    lastStatChanges.value = {};
    lastRiskEvents.value = [];
    lastTriggeredEvents.value = [];
    unlockedCardIds.value = [];
    playedCardIds.value = new Set();
    resumeHistory.value = [];
    previousExpenseSelections.value = [];
    previousRelationshipSelection.value = null;
    randomUniversityMajors.value = [];
    randomCities.value = [];
    randomCountries.value = [];
    randomHobbies.value = [];
    activeTopLevelCategory.value = null;
    visitedExpenseCategories.value = new Set();
    visitedIncomeCategories.value = new Set();
    visitedDecisionCategories.value = new Set();
    visitedLocationCategories.value = new Set();
    visitedEducationCategories.value = new Set();
    investmentAmount.value = 0;
    lotteryPlayed.value = false;
    lotteryResult.value = null;
    showLotteryPopup.value = false;
    wsopPlayed.value = false;
    wsopResult.value = null;
    showWsopPopup.value = false;
    eliteSchoolApplications.value = {};
    showAdmissionPopup.value = false;
    admissionResult.value = null;
    portfolio.value = [];
    // Set random starting city
    const randomStartingCity = allCityIds[Math.floor(Math.random() * allCityIds.length)];
    currentLocation.value = randomStartingCity;
    playedCardIds.value.add(randomStartingCity); // Mark as played so location-specific jobs unlock
    drawHand();
    setDefaultLocation();
    setDefaultEducation();
    setDefaultIncome();
    setDefaultExpenses();
    setDefaultDecisions();
  }

  function setInvestmentAmount(amount: number) {
    investmentAmount.value = Math.max(0, Math.min(amount, maxInvestmentAmount.value));
  }

  // Play the lottery - 1% chance to win $100k, 99% chance to lose $1k
  function playLottery() {
    if (lotteryPlayed.value) return;

    const roll = Math.random();
    const won = roll < 0.01; // 1% chance to win
    const amount = won ? 100000 : -1000;

    // Apply the result to wealth
    stats.value.wealth += amount;

    // Store the result
    lotteryResult.value = { won, amount: Math.abs(amount) };
    lotteryPlayed.value = true;
    showLotteryPopup.value = true;
  }

  function closeLotteryPopup() {
    showLotteryPopup.value = false;
  }

  // Play the World Series of Poker
  function playWSOP() {
    if (wsopPlayed.value) return;

    // Entry fee: $10,000
    const entryFee = 10000;
    stats.value.wealth -= entryFee;

    // Determine outcome
    const roll = Math.random();
    let outcome: 'winner' | 'final_table' | 'cashed' | 'bust';
    let winnings: number;

    if (roll < 0.01) {
      // 1% chance: Win the Main Event - $10M
      outcome = 'winner';
      winnings = 10000000;
      // Unlock the Card Shark achievement
      unlockAchievement('wsop_winner');
    } else if (roll < 0.06) {
      // 5% chance: Final table - $1M
      outcome = 'final_table';
      winnings = 1000000;
    } else if (roll < 0.31) {
      // 25% chance: Cash - $25k
      outcome = 'cashed';
      winnings = 25000;
    } else {
      // 69% chance: Bust - lose entry fee
      outcome = 'bust';
      winnings = 0;
    }

    // Add winnings to wealth
    stats.value.wealth += winnings;

    // Store result
    wsopResult.value = { outcome, amount: winnings };
    wsopPlayed.value = true;
    showWsopPopup.value = true;
  }

  function closeWsopPopup() {
    showWsopPopup.value = false;
  }

  // Copy previous stage's expense selections
  function copyPreviousExpenses() {
    if (previousExpenseSelections.value.length === 0) return;

    // Copy the previous selections
    expenseSelections.value = [...previousExpenseSelections.value];

    // Mark all expense categories as visited
    previousExpenseSelections.value.forEach(card => {
      if (card.subOptions && card.subOptions.length > 0 && !card.isSubOption) {
        visitedExpenseCategories.value.add(card.id);
      }
    });
  }

  function drawHand() {
    const decisionCardsPerHand = 5; // Only decisions are randomly selected

    // Get unlocked follow-up cards that are NOT events and haven't been played
    const unlockedCards: Card[] = [];
    unlockedCardIds.value.forEach(id => {
      const card = getCardById(id);
      if (card && !card.isEvent && !playedCardIds.value.has(id)) {
        unlockedCards.push(card);
      }
    });

    // Clear unlocked cards after adding them
    unlockedCardIds.value = [];

    // Check if player has a job (any card starting with 'job_' has been played OR selected this stage)
    const hasJob = Array.from(playedCardIds.value).some(id => id.startsWith('job_')) ||
                   incomeSelections.value.some(c => c.id.startsWith('job_'));

    // Top-level decision categories that should always appear every stage
    // Career appears first (before social) but only if player has a job
    const alwaysShowIds = hasJob
      ? ['decision_career', 'decision_social', 'decision_relationships', 'decision_hobbies', 'decision_health', 'decision_values']
      : ['decision_social', 'decision_relationships', 'decision_hobbies', 'decision_health', 'decision_values'];

    // Location category always shows in location phase
    const locationAlwaysShowIds = ['decision_location'];

    // Education category always shows in education phase
    const educationAlwaysShowIds = ['decision_education'];

    // Cards that are only available in certain stages (0-indexed)
    const stageRestrictedCards: Record<string, { maxStage: number }> = {
      // Scholarships are now controlled by education selection, not stage
    };

    // Check if player has debt (negative wealth)
    const hasDebt = stats.value.wealth < 0;

    // Get available base cards (not follow-ups, not events, not sub-options, not already played)
    // Exception: always include the top-level decision categories even if played before
    // Exception: loan repayment appears every stage if player has debt
    const availableCards = deck.value.filter(card => {
      if (card.isFollowUp || card.isEvent || card.isSubOption) return false;

      // Check stage restrictions
      const restriction = stageRestrictedCards[card.id];
      if (restriction && stageIndex.value > restriction.maxStage) return false;

      // Loan repayment only appears when player has debt, but appears every stage they have debt
      if (card.id === 'expense_loan') {
        return hasDebt;
      }

      // Allow if not played, or if it's an always-show category
      return !playedCardIds.value.has(card.id) || alwaysShowIds.includes(card.id) || locationAlwaysShowIds.includes(card.id) || educationAlwaysShowIds.includes(card.id);
    });

    // Separate cards by type
    const locationCards = availableCards.filter(c => c.cardType === 'location');
    const educationCards = availableCards.filter(c => c.cardType === 'education');
    const incomeCards = availableCards.filter(c => c.cardType === 'income');
    const expenseCards = availableCards.filter(c => c.cardType === 'expense');
    const decisionCards = availableCards.filter(c => c.cardType === 'decision');

    // Shuffle only decisions
    const shuffleArray = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // Location: show the location category card
    // Education: show the education category card
    // Income and Expense: show ALL main category cards
    // Decisions: Social Life, Health, Values always appear + randomly select other decisions
    const selectedLocation = locationCards;
    const selectedEducation = educationCards;
    const selectedIncome = incomeCards;
    const selectedExpense = expenseCards;

    // Always include Social Life, Health, and Values cards, plus random other decisions
    const alwaysShowCards = decisionCards.filter(c => alwaysShowIds.includes(c.id));
    const otherDecisionCards = decisionCards.filter(c => !alwaysShowIds.includes(c.id));
    const randomDecisions = shuffleArray(otherDecisionCards).slice(0, decisionCardsPerHand - alwaysShowCards.length);
    const selectedDecision = [...alwaysShowCards, ...randomDecisions];

    // Combine all cards plus any unlocked follow-ups
    hand.value = [...unlockedCards, ...selectedLocation, ...selectedEducation, ...selectedIncome, ...selectedExpense, ...selectedDecision];
  }

  function toggleCardSelection(card: Card) {
    // Get the right selection array based on current phase
    let selections: Card[];
    switch (selectionPhase.value) {
      case 'location':
        selections = locationSelections.value;
        break;
      case 'education':
        selections = educationSelections.value;
        break;
      case 'income':
        selections = incomeSelections.value;
        break;
      case 'expenses':
        selections = expenseSelections.value;
        break;
      case 'decisions':
        selections = decisionSelections.value;
        break;
    }

    const exists = selections.find(c => c.id === card.id);

    // Calculate total cost - only income and decisions cost energy (expenses are mandatory)
    const energySelections = [...incomeSelections.value, ...decisionSelections.value];
    const totalCost = energySelections.reduce((sum, c) => sum + c.cost, 0);

    // Check if this is a main category card (has subOptions and is NOT a sub-option itself)
    const isTopLevelCategory = card.subOptions && card.subOptions.length > 0 && !card.isSubOption;

    if (exists) {
      // For top-level categories: clicking again just closes the panel, keeps selections
      if (isTopLevelCategory) {
        // Mark category as visited when user interacts with it
        if (selectionPhase.value === 'location') {
          visitedLocationCategories.value.add(card.id);
        } else if (selectionPhase.value === 'education') {
          visitedEducationCategories.value.add(card.id);
        } else if (selectionPhase.value === 'expenses') {
          visitedExpenseCategories.value.add(card.id);
        } else if (selectionPhase.value === 'income') {
          visitedIncomeCategories.value.add(card.id);
        } else if (selectionPhase.value === 'decisions') {
          visitedDecisionCategories.value.add(card.id);
        }
        if (activeTopLevelCategory.value === card.id) {
          // Close the sub-options panel but keep the selection
          activeTopLevelCategory.value = null;
        } else {
          // Open this category's sub-options
          activeTopLevelCategory.value = card.id;
        }
        return;
      }

      // For expense sub-options: don't allow deselection - must always have one selected
      // Clicking the same option again just keeps it selected
      if (selectionPhase.value === 'expenses' && card.isSubOption) {
        return;
      }

      // For non-top-level cards: remove from the appropriate array
      // Also remove any sub-options if deselecting a parent card
      switch (selectionPhase.value) {
        case 'location':
          locationSelections.value = locationSelections.value.filter(c => c.id !== card.id && c.parentId !== card.id);
          // Revert to previously played location if deselecting a city/country
          if (card.id.startsWith('city_') || card.id.startsWith('country_')) {
            const previousLocation = Array.from(playedCardIds.value).find(id => id.startsWith('city_') || id.startsWith('country_'));
            currentLocation.value = previousLocation || null;
          }
          break;
        case 'education':
          educationSelections.value = educationSelections.value.filter(c => c.id !== card.id && c.parentId !== card.id);
          break;
        case 'income':
          incomeSelections.value = incomeSelections.value.filter(c => c.id !== card.id && c.parentId !== card.id);
          break;
        case 'expenses':
          expenseSelections.value = expenseSelections.value.filter(c => c.id !== card.id && c.parentId !== card.id);
          break;
        case 'decisions':
          decisionSelections.value = decisionSelections.value.filter(c => c.id !== card.id && c.parentId !== card.id);
          break;
      }
      return;
    }

    if (isTopLevelCategory) {
      // Set this as the active category to show its sub-options
      activeTopLevelCategory.value = card.id;

      // Mark category as visited when user interacts with it
      if (selectionPhase.value === 'location') {
        visitedLocationCategories.value.add(card.id);
      } else if (selectionPhase.value === 'education') {
        visitedEducationCategories.value.add(card.id);
      } else if (selectionPhase.value === 'expenses') {
        visitedExpenseCategories.value.add(card.id);
      } else if (selectionPhase.value === 'income') {
        visitedIncomeCategories.value.add(card.id);
      } else if (selectionPhase.value === 'decisions') {
        visitedDecisionCategories.value.add(card.id);
      }

      // Job categories (full_time_job, part_time_job): don't remove existing job selections yet
      // The previous job should only be replaced when selecting a specific sub-option
      const jobCategories = ['full_time_job', 'part_time_job'];
      if (jobCategories.includes(card.id)) {
        // Just open the category panel without removing existing selections
        // Add the category card only if not already present
        switch (selectionPhase.value) {
          case 'location':
            if (!locationSelections.value.find(c => c.id === card.id)) {
              locationSelections.value.push(card);
            }
            break;
          case 'education':
            if (!educationSelections.value.find(c => c.id === card.id)) {
              educationSelections.value.push(card);
            }
            break;
          case 'income':
            if (!incomeSelections.value.find(c => c.id === card.id)) {
              incomeSelections.value.push(card);
            }
            break;
          case 'expenses':
            if (!expenseSelections.value.find(c => c.id === card.id)) {
              expenseSelections.value.push(card);
            }
            break;
          case 'decisions':
            if (!decisionSelections.value.find(c => c.id === card.id)) {
              decisionSelections.value.push(card);
            }
            break;
        }
        return;
      }

      // For top-level category cards: only allow ONE of that specific category
      // Remove this category and all its descendants, then add the new selection
      const removeCardAndDescendants = (selections: Card[], categoryId: string): Card[] => {
        return selections.filter(c => {
          // Remove the category card itself
          if (c.id === categoryId) return false;
          // Remove direct sub-options of this category
          if (c.parentId === categoryId) return false;
          // Remove deeper descendants (sub-options whose parent is a sub-option of this category)
          const parentCard = getCardById(c.parentId || '');
          if (parentCard && parentCard.parentId === categoryId) return false;
          return true;
        });
      };

      switch (selectionPhase.value) {
        case 'location':
          locationSelections.value = removeCardAndDescendants(locationSelections.value, card.id);
          locationSelections.value.push(card);
          break;
        case 'education':
          educationSelections.value = removeCardAndDescendants(educationSelections.value, card.id);
          educationSelections.value.push(card);
          break;
        case 'income':
          incomeSelections.value = removeCardAndDescendants(incomeSelections.value, card.id);
          incomeSelections.value.push(card);
          break;
        case 'expenses':
          expenseSelections.value = removeCardAndDescendants(expenseSelections.value, card.id);
          expenseSelections.value.push(card);
          break;
        case 'decisions':
          decisionSelections.value = removeCardAndDescendants(decisionSelections.value, card.id);
          decisionSelections.value.push(card);
          break;
      }
      return;
    }

    // Check if this is a sub-option card
    if (card.isSubOption && card.parentId) {
      // Find the top-level category (may be parent or grandparent)
      const parentCard = getCardById(card.parentId);
      const topLevelCategoryId = parentCard?.isSubOption ? parentCard.parentId : card.parentId;

      // Job categories - when selecting a specific job, remove all other job selections
      const jobCategories = ['full_time_job', 'part_time_job'];
      const isJobSelection = jobCategories.includes(topLevelCategoryId || '');

      // Helper to check if a card belongs to a job category
      const belongsToJobCategory = (c: Card): boolean => {
        if (jobCategories.includes(c.id)) return true;
        if (c.parentId && jobCategories.includes(c.parentId)) return true;
        // Check grandparent
        const cParent = getCardById(c.parentId || '');
        if (cParent && cParent.parentId && jobCategories.includes(cParent.parentId)) return true;
        return false;
      };

      // Helper to check if a card belongs to the same top-level category
      const belongsToSameTopCategory = (c: Card): boolean => {
        if (!c.isSubOption) return false;
        if (c.parentId === topLevelCategoryId) return true;
        // Check if it's a deeper descendant (grandchild)
        const cParent = getCardById(c.parentId || '');
        if (cParent && cParent.parentId === topLevelCategoryId) return true;
        return false;
      };

      // Helper to filter out sibling branches while keeping the ancestor chain
      const filterSiblingBranches = (selections: Card[]): Card[] => {
        return selections.filter(c => {
          // If selecting a job, remove ALL job-related selections (from any job category)
          if (isJobSelection && belongsToJobCategory(c)) {
            // Keep only the parent of the new card
            if (c.id === card.parentId) return true;
            // Keep grandparent if applicable
            if (parentCard?.isSubOption && c.id === parentCard.parentId) return true;
            return false;
          }

          if (!belongsToSameTopCategory(c)) return true;
          // Keep direct parent of the new card
          if (c.id === card.parentId) return true;
          // Keep grandparent if applicable
          if (parentCard?.isSubOption && c.id === parentCard.parentId) return true;
          // Remove everything else in the same top-level category
          return false;
        });
      };

      // For sub-options: only allow ONE path through the hierarchy
      // Remove any other sub-options from the same top-level category
      switch (selectionPhase.value) {
        case 'location':
          locationSelections.value = filterSiblingBranches(locationSelections.value);
          break;
        case 'education':
          educationSelections.value = filterSiblingBranches(educationSelections.value);
          break;
        case 'income':
          incomeSelections.value = filterSiblingBranches(incomeSelections.value);
          break;
        case 'expenses':
          expenseSelections.value = filterSiblingBranches(expenseSelections.value);
          break;
        case 'decisions':
          decisionSelections.value = filterSiblingBranches(decisionSelections.value);
          break;
      }

      // Also add the parent card if not already present (for second-level cards)
      if (parentCard && !parentCard.isSubOption) {
        // Parent is a top-level category, add it if not present
        switch (selectionPhase.value) {
          case 'location':
            if (!locationSelections.value.find(c => c.id === parentCard.id)) {
              locationSelections.value.push(parentCard);
            }
            break;
          case 'education':
            if (!educationSelections.value.find(c => c.id === parentCard.id)) {
              educationSelections.value.push(parentCard);
            }
            break;
          case 'income':
            if (!incomeSelections.value.find(c => c.id === parentCard.id)) {
              incomeSelections.value.push(parentCard);
            }
            break;
          case 'expenses':
            if (!expenseSelections.value.find(c => c.id === parentCard.id)) {
              expenseSelections.value.push(parentCard);
            }
            break;
          case 'decisions':
            if (!decisionSelections.value.find(c => c.id === parentCard.id)) {
              decisionSelections.value.push(parentCard);
            }
            break;
        }
      }
    }

    // Check energy - expenses, location, and education don't cost energy, only income and decisions do
    const canAfford = selectionPhase.value === 'expenses' || selectionPhase.value === 'location' || selectionPhase.value === 'education' || totalCost + card.cost <= lifeEnergy.value;

    // Check minimum wealth requirement
    const meetsWealthRequirement = !card.minWealth || stats.value.wealth >= card.minWealth;

    if (canAfford && meetsWealthRequirement) {
      switch (selectionPhase.value) {
        case 'location':
          locationSelections.value.push(card);
          break;
        case 'education':
          educationSelections.value.push(card);
          break;
        case 'income':
          incomeSelections.value.push(card);
          break;
        case 'expenses':
          expenseSelections.value.push(card);
          break;
        case 'decisions':
          decisionSelections.value.push(card);
          break;
      }

      // If a job was just selected, add Career default to decisions
      if (selectionPhase.value === 'income' && card.id.startsWith('job_')) {
        addCareerDefaultIfNeeded();
      }
    }

    // Immediately update currentLocation when a city or country is selected
    if (card.id.startsWith('city_') || card.id.startsWith('country_')) {
      currentLocation.value = card.id;
    }
  }

  // Helper to clear parent category cards (cards with subOptions and no effects) from a selection array
  // This keeps the actual sub-option selections but removes the parent "category" cards
  function clearParentCards(selections: Card[]): Card[] {
    return selections.filter(c => {
      // Keep cards that don't have subOptions (they're leaf selections)
      // OR keep cards that have subOptions but also have effects (they're playable)
      const hasSubOptions = c.subOptions && c.subOptions.length > 0;
      const hasEffects = c.effects && c.effects.length > 0;
      // Remove parent category cards (have subOptions, no effects, cost is 0)
      if (hasSubOptions && !hasEffects && c.cost === 0) {
        return false;
      }
      return true;
    });
  }

  // Helper to select a top-level category (add to selections if not already there)
  function selectTopLevelCategory(categoryId: string) {
    const card = getCardById(categoryId);
    if (!card) return;

    activeTopLevelCategory.value = categoryId;

    // Add to selections if not already selected
    let selections: Card[];
    switch (selectionPhase.value) {
      case 'location':
        selections = locationSelections.value;
        if (!selections.find(c => c.id === categoryId)) {
          locationSelections.value.push(card);
        }
        break;
      case 'education':
        selections = educationSelections.value;
        if (!selections.find(c => c.id === categoryId)) {
          educationSelections.value.push(card);
        }
        break;
      case 'income':
        selections = incomeSelections.value;
        if (!selections.find(c => c.id === categoryId)) {
          incomeSelections.value.push(card);
        }
        break;
      case 'expenses':
        selections = expenseSelections.value;
        if (!selections.find(c => c.id === categoryId)) {
          expenseSelections.value.push(card);
        }
        break;
      case 'decisions':
        selections = decisionSelections.value;
        if (!selections.find(c => c.id === categoryId)) {
          decisionSelections.value.push(card);
        }
        break;
    }
  }

  function nextPhase() {
    // If there's an active category, try to go to the next category first
    if (activeTopLevelCategory.value) {
      const nextIndex = currentCategoryIndex.value + 1;
      if (nextIndex < topLevelCategoryIds.value.length) {
        // Go to next category in current phase and select it
        selectTopLevelCategory(topLevelCategoryIds.value[nextIndex]);
        return;
      }
    }

    // No more categories in this phase, move to next phase
    if (selectionPhase.value === 'location') {
      locationSelections.value = clearParentCards(locationSelections.value);
      selectionPhase.value = 'education';
    } else if (selectionPhase.value === 'education') {
      educationSelections.value = clearParentCards(educationSelections.value);
      selectionPhase.value = 'income';
    } else if (selectionPhase.value === 'income') {
      incomeSelections.value = clearParentCards(incomeSelections.value);
      selectionPhase.value = 'expenses';
    } else if (selectionPhase.value === 'expenses') {
      expenseSelections.value = clearParentCards(expenseSelections.value);
      selectionPhase.value = 'decisions';
    }
    // Close any open sub-options panel
    activeTopLevelCategory.value = null;
  }

  function prevPhase() {
    // If there's an active category, try to go to the previous category first
    if (activeTopLevelCategory.value) {
      const prevIndex = currentCategoryIndex.value - 1;
      if (prevIndex >= 0) {
        // Go to previous category in current phase and select it
        selectTopLevelCategory(topLevelCategoryIds.value[prevIndex]);
        return;
      }
    }

    // No more categories before this, move to previous phase
    if (selectionPhase.value === 'decisions') {
      decisionSelections.value = clearParentCards(decisionSelections.value);
      selectionPhase.value = 'expenses';
    } else if (selectionPhase.value === 'expenses') {
      expenseSelections.value = clearParentCards(expenseSelections.value);
      selectionPhase.value = 'income';
    } else if (selectionPhase.value === 'income') {
      incomeSelections.value = clearParentCards(incomeSelections.value);
      selectionPhase.value = 'education';
    } else if (selectionPhase.value === 'education') {
      educationSelections.value = clearParentCards(educationSelections.value);
      selectionPhase.value = 'location';
    }
    // Close any open sub-options panel
    activeTopLevelCategory.value = null;
  }

  function goToPhase(targetPhase: SelectionPhase) {
    // Clear parent categories from current phase so sub-options close
    if (selectionPhase.value === 'location') {
      locationSelections.value = clearParentCards(locationSelections.value);
    } else if (selectionPhase.value === 'education') {
      educationSelections.value = clearParentCards(educationSelections.value);
    } else if (selectionPhase.value === 'income') {
      incomeSelections.value = clearParentCards(incomeSelections.value);
    } else if (selectionPhase.value === 'expenses') {
      expenseSelections.value = clearParentCards(expenseSelections.value);
    } else if (selectionPhase.value === 'decisions') {
      decisionSelections.value = clearParentCards(decisionSelections.value);
    }
    selectionPhase.value = targetPhase;
    // Close any open sub-options panel
    activeTopLevelCategory.value = null;
  }

  function playStage() {
    // Combine all selections from all phases
    const allSelections = [...locationSelections.value, ...educationSelections.value, ...incomeSelections.value, ...expenseSelections.value, ...decisionSelections.value];
    if (allSelections.length === 0) return;

    // Use combined selections
    selectedCards.value = allSelections;

    // Reset tracking
    lastStatChanges.value = {
      health: 0,
      happiness: 0,
      wealth: 0,
      skills: 0,
      relationships: 0,
    };
    lastRiskEvents.value = [];
    lastTriggeredEvents.value = [];
    lastPlayedCards.value = [...selectedCards.value];

    // Generate random events for this stage
    stageRandomEvents.value = getRandomEventsForStage();

    // Collect unlocked cards from played cards
    const newUnlocks: string[] = [];
    const triggeredEventIds: string[] = [];

    // pay energy
    const totalCost = selectedCards.value.reduce((sum, c) => sum + c.cost, 0);
    lifeEnergy.value -= totalCost;

    const stageYears = currentStage.value.years;

    // Investment IDs that use the investment amount for returns
    const investmentCardIds = ['invest_index', 'invest_rental', 'invest_stocks', 'invest_crypto', 'invest_lottery'];
    // Return rates for each investment type (as decimals)
    const investmentReturnRates: Record<string, number> = {
      'invest_index': 0.08,    // 8% return
      'invest_rental': 0.12,   // 12% return
      'invest_stocks': 0.15,   // 15% return
      'invest_crypto': 0.50,   // 50% potential return
      'invest_lottery': 10.0,  // 1000% return (if you win)
    };
    // Risk rates for investments (chance of losing money)
    const investmentRiskRates: Record<string, number> = {
      'invest_index': 0.10,
      'invest_rental': 0.20,
      'invest_stocks': 0.35,
      'invest_crypto': 0.50,
      'invest_lottery': 0.99,
    };
    // Loss rates for investments (how much you lose as a fraction)
    const investmentLossRates: Record<string, number> = {
      'invest_index': 0.05,    // Lose 5% of investment
      'invest_rental': 0.10,   // Lose 10% of investment
      'invest_stocks': 0.20,   // Lose 20% of investment
      'invest_crypto': 0.50,   // Lose 50% of investment
      'invest_lottery': 1.0,   // Lose 100% (all of it)
    };

    // Education card IDs that should appear on resume
    const educationCardIds = [
      'edu_self', 'self_coding', 'self_language', 'self_cooking', 'self_music', 'self_photography',
      'edu_community', 'cc_general', 'cc_nursing', 'cc_business', 'cc_education', 'cc_it',
      'edu_university', 'uni_english', 'uni_physics', 'uni_chemistry', 'uni_biology', 'uni_engineering',
      'uni_math', 'uni_social_science', 'uni_history', 'uni_business', 'uni_psychology', 'uni_economics',
      'uni_cs', 'uni_philosophy', 'uni_euro_lang', 'uni_asian_lang',
      'edu_harvard', 'harvard_business', 'harvard_law_undergrad', 'harvard_economics', 'harvard_cs', 'harvard_biology', 'harvard_government',
      'edu_mit', 'mit_cs', 'mit_engineering', 'mit_physics', 'mit_math', 'mit_economics', 'mit_biology',
      'edu_graduate', 'grad_law', 'grad_medicine', 'grad_mba', 'grad_phd',
      'edu_trade', 'trade_electrician', 'trade_plumber', 'trade_hvac', 'trade_welding', 'trade_automotive',
    ];

    // Work card IDs that should appear on resume
    const workCardIds = [
      // Full-time jobs
      'full_time_job',
      // Entry-level
      'job_retail', 'job_fastfood', 'job_warehouse', 'job_callcenter',
      // Mid-level
      'job_office', 'job_sales', 'job_technician',
      // Professional
      'job_tech', 'job_nurse', 'job_accountant', 'job_teacher', 'job_engineer',
      // Trades
      'job_electrician', 'job_plumber', 'job_mechanic',
      // Advanced/Elite
      'job_doctor', 'job_lawyer', 'job_executive', 'job_professor',
      // Promotions - Professional
      'job_tech_senior', 'job_tech_manager',
      'job_engineer_senior', 'job_engineer_director',
      'job_accountant_senior', 'job_accountant_manager',
      'job_nurse_senior', 'job_nurse_manager',
      'job_teacher_senior', 'job_teacher_head',
      // Promotions - Trades
      'job_electrician_master', 'job_electrician_contractor',
      'job_plumber_master', 'job_plumber_contractor',
      'job_mechanic_senior', 'job_mechanic_manager',
      // Part-time
      'part_time_job', 'pt_barista', 'pt_tutor', 'pt_rideshare', 'pt_freelance', 'pt_retail',
      // Internships
      'internship', 'intern_tech', 'intern_finance', 'intern_marketing', 'intern_healthcare', 'intern_legal',
    ];

    // Parent categories that should be combined with their children on resume
    const educationParentCategories = ['edu_university', 'edu_graduate', 'edu_community', 'edu_trade', 'edu_self', 'edu_harvard', 'edu_mit'];
    const workParentCategories = ['full_time_job', 'part_time_job', 'internship'];

    selectedCards.value.forEach(card => {
      // Mark card as played so it won't appear again
      playedCardIds.value.add(card.id);

      // Update current location if this is a city or country card
      if (card.id.startsWith('city_') || card.id.startsWith('country_')) {
        currentLocation.value = card.id;
      }

      // Add to resume if it's an education or work card
      // Only add leaf nodes (cards with no sub-options or whose sub-options aren't selected)
      // and skip parent categories - they'll be included via their children's parentTitle
      if (educationCardIds.includes(card.id) && !educationParentCategories.includes(card.id)) {
        // Find the parent title if this is a sub-option
        let parentTitle: string | undefined;
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && educationParentCategories.includes(parentCard.id)) {
            parentTitle = parentCard.title;
          }
        }
        resumeHistory.value.push({
          cardId: card.id,
          cardTitle: card.title,
          parentTitle,
          stageName: currentStage.value.name,
          ageRange: currentStage.value.ageRange,
          type: 'education',
        });
      } else if (workCardIds.includes(card.id) && !workParentCategories.includes(card.id)) {
        // Find the parent title if this is a sub-option
        let parentTitle: string | undefined;
        if (card.parentId) {
          const parentCard = getCardById(card.parentId);
          if (parentCard && workParentCategories.includes(parentCard.id)) {
            parentTitle = parentCard.title;
          }
        }
        resumeHistory.value.push({
          cardId: card.id,
          cardTitle: card.title,
          parentTitle,
          stageName: currentStage.value.name,
          ageRange: currentStage.value.ageRange,
          type: 'work',
        });
      }

      // Check if this is an investment card
      const isInvestmentCard = investmentCardIds.includes(card.id);

      if (isInvestmentCard && investmentAmount.value > 0) {
        // Calculate investment returns based on investment amount
        const returnRate = investmentReturnRates[card.id] || 0;
        const riskRate = investmentRiskRates[card.id] || 0;
        const lossRate = investmentLossRates[card.id] || 0;

        // Check if investment failed (risk event)
        const roll = Math.random();
        if (roll < riskRate) {
          // Investment lost money
          const lossAmount = Math.round(investmentAmount.value * lossRate * stageYears);
          stats.value.wealth -= lossAmount;
          lastStatChanges.value.wealth -= lossAmount;
          lastRiskEvents.value.push(`${card.title} lost money!`);
          lifeLog.value.push(`Investment risk from ${card.title}!`);
        } else {
          // Investment gained money
          const gainAmount = Math.round(investmentAmount.value * returnRate * stageYears);
          stats.value.wealth += gainAmount;
          lastStatChanges.value.wealth += gainAmount;
        }

        // Apply non-wealth effects (like skills) normally
        card.effects.forEach(effect => {
          if (effect.stat !== 'wealth') {
            stats.value[effect.stat] += effect.delta;
            lastStatChanges.value[effect.stat] += effect.delta;
          }
        });
      } else {
        // Track effects normally - wealth is multiplied by years in this stage
        card.effects.forEach(effect => {
          const multiplier = effect.stat === 'wealth' ? stageYears : 1;
          const adjustedDelta = effect.delta * multiplier;
          stats.value[effect.stat] += adjustedDelta;
          lastStatChanges.value[effect.stat] += adjustedDelta;
        });

        // Check risk - wealth risks are also multiplied by years
        if (card.riskChance && card.riskEffect) {
          const roll = Math.random();
          if (roll < card.riskChance) {
            const riskMultiplier = card.riskEffect.stat === 'wealth' ? stageYears : 1;
            const adjustedRiskDelta = card.riskEffect.delta * riskMultiplier;
            stats.value[card.riskEffect.stat] += adjustedRiskDelta;
            lastStatChanges.value[card.riskEffect.stat] += adjustedRiskDelta;
            lifeLog.value.push(`Risk event from ${card.title}!`);
          }
        }
      }

      // Collect unlocks - separate events from choice cards
      if (card.unlocks) {
        card.unlocks.forEach(unlockId => {
          // Skip already played cards
          if (playedCardIds.value.has(unlockId)) return;

          const unlockedCard = getCardById(unlockId);
          if (unlockedCard?.isEvent) {
            // Events are triggered immediately (randomly pick one)
            triggeredEventIds.push(unlockId);
          } else {
            // Choice cards go to next hand
            newUnlocks.push(unlockId);
          }
        });
      }

      lifeLog.value.push(`${currentStage.value.ageRange}: Played "${card.title}"`);
    });

    // Apply random event effects
    stageRandomEvents.value.forEach(event => {
      event.effects.forEach(effect => {
        const multiplier = effect.stat === 'wealth' ? stageYears : 1;
        const adjustedDelta = effect.delta * multiplier;
        stats.value[effect.stat] += adjustedDelta;
        lastStatChanges.value[effect.stat] += adjustedDelta;
      });
      lifeLog.value.push(`${currentStage.value.ageRange}: Event - "${event.title}"`);
    });

    // Trigger one random event from the pool of possible events
    if (triggeredEventIds.length > 0) {
      const shuffledEvents = [...triggeredEventIds].sort(() => Math.random() - 0.5);
      const eventId = shuffledEvents[0];
      const eventCard = getCardById(eventId);
      if (eventCard) {
        // Mark event as played
        playedCardIds.value.add(eventCard.id);

        // Apply event effects - wealth is multiplied by years in this stage
        eventCard.effects.forEach(effect => {
          const multiplier = effect.stat === 'wealth' ? stageYears : 1;
          const adjustedDelta = effect.delta * multiplier;
          stats.value[effect.stat] += adjustedDelta;
          lastStatChanges.value[effect.stat] += adjustedDelta;
        });
        lastTriggeredEvents.value.push(eventCard);
        lifeLog.value.push(`${currentStage.value.ageRange}: Event - "${eventCard.title}"`);

        // Events can also unlock further cards
        if (eventCard.unlocks) {
          eventCard.unlocks.forEach(unlockId => {
            // Skip already played cards
            if (playedCardIds.value.has(unlockId)) return;

            const unlockedCard = getCardById(unlockId);
            if (unlockedCard?.isEvent) {
              unlockedCardIds.value.push(unlockId);
            } else {
              newUnlocks.push(unlockId);
            }
          });
        }
      }
    }

    // Store unlocked choice cards for next stage
    if (newUnlocks.length > 0) {
      const shuffledUnlocks = [...newUnlocks].sort(() => Math.random() - 0.5);
      unlockedCardIds.value = [...unlockedCardIds.value, ...shuffledUnlocks.slice(0, Math.min(2, shuffledUnlocks.length))];
    }

    // Show events animation first
    phase.value = 'events';
  }

  function finishEventsAnimation() {
    // Transition from events to resolving (show summary)
    phase.value = 'resolving';
  }

  function advanceToNextStage() {
    // check death
    if (stats.value.health <= 0) {
      isDead.value = true;
      phase.value = 'ended';
      return;
    }

    // Update portfolio values based on market performance
    updatePortfolioValues();

    // Save current expense selections for "Same as last stage" feature
    previousExpenseSelections.value = [...expenseSelections.value];

    // Save current relationship selection for next stage default
    const relationshipIds = ['rel_single', 'rel_dating', 'rel_committed', 'rel_married', 'rel_family'];
    const currentRelationship = decisionSelections.value.find(c => relationshipIds.includes(c.id));
    if (currentRelationship) {
      previousRelationshipSelection.value = currentRelationship;
    }

    // advance stage
    stageIndex.value += 1;

    // Check if game is over
    if (stageIndex.value >= totalStages) {
      phase.value = 'ended';
      return;
    }

    lifeEnergy.value = currentStage.value.energyPerTurn;
    selectedCards.value = [];
    locationSelections.value = [];
    educationSelections.value = [];
    incomeSelections.value = [];
    expenseSelections.value = [];
    decisionSelections.value = [];
    selectionPhase.value = 'location';
    randomUniversityMajors.value = [];
    randomCities.value = [];
    randomCountries.value = [];
    randomHobbies.value = [];
    activeTopLevelCategory.value = null;
    visitedExpenseCategories.value = new Set();
    visitedIncomeCategories.value = new Set();
    visitedDecisionCategories.value = new Set();
    visitedLocationCategories.value = new Set();
    visitedEducationCategories.value = new Set();
    investmentAmount.value = 0;
    lotteryPlayed.value = false;
    lotteryResult.value = null;
    showLotteryPopup.value = false;
    wsopPlayed.value = false;
    wsopResult.value = null;
    showWsopPopup.value = false;
    eliteSchoolApplications.value = {};
    showAdmissionPopup.value = false;
    admissionResult.value = null;
    drawHand();
    setDefaultLocation();
    setDefaultEducation();
    setDefaultIncome();
    setDefaultExpenses();
    setDefaultDecisions();
    phase.value = 'choosing';
  }

  // Calculate life archetype based on final stats
  function getLifeArchetype(): { title: string; description: string } {
    const s = stats.value;
    const total = s.health + s.wealth + s.skills + s.relationships + s.happiness;

    // Find dominant stats
    const statValues = [
      { name: 'wealth', value: s.wealth },
      { name: 'skills', value: s.skills },
      { name: 'relationships', value: s.relationships },
      { name: 'happiness', value: s.happiness },
      { name: 'health', value: s.health },
    ].sort((a, b) => b.value - a.value);

    const top = statValues[0].name;

    // Archetypes based on dominant stats
    if (s.wealth >= 10 && s.happiness >= 5) {
      return { title: 'The Mogul', description: 'You built an empire and enjoyed every moment.' };
    }
    if (s.relationships >= 10 && s.happiness >= 5) {
      return { title: 'The Beloved', description: 'Surrounded by love, you lived a rich life.' };
    }
    if (s.skills >= 10 && s.wealth >= 5) {
      return { title: 'The Expert', description: 'Your mastery opened doors others never knew existed.' };
    }
    if (s.happiness >= 10) {
      return { title: 'The Free Spirit', description: 'You found joy in the journey itself.' };
    }
    if (s.wealth >= 10 && s.happiness < 3) {
      return { title: 'The Workaholic', description: 'You have it all... except time to enjoy it.' };
    }
    if (s.relationships >= 8 && s.wealth < 0) {
      return { title: 'The Heart', description: 'Rich in love, if not in gold.' };
    }
    if (s.health >= 8 && s.happiness >= 5) {
      return { title: 'The Balanced', description: 'A healthy body, a peaceful mind.' };
    }
    if (total >= 25) {
      return { title: 'The Achiever', description: 'You excelled in everything you touched.' };
    }
    if (total <= 5) {
      return { title: 'The Survivor', description: 'Life was hard, but you made it through.' };
    }
    if (s.skills >= 8) {
      return { title: 'The Scholar', description: 'Knowledge was your greatest treasure.' };
    }
    if (top === 'wealth') {
      return { title: 'The Provider', description: 'Security for yourself and those you love.' };
    }
    if (top === 'relationships') {
      return { title: 'The Connector', description: 'Your network is your net worth.' };
    }
    if (top === 'happiness') {
      return { title: 'The Optimist', description: 'You chose joy, again and again.' };
    }

    return { title: 'The Wanderer', description: 'A unique path, all your own.' };
  }

  return {
    stageIndex,
    stats,
    lifeEnergy,
    maxLifeEnergy,
    phase,
    selectionPhase,
    hand,
    filteredHand,
    activeSubOptions,
    activeThirdLevelOptions,
    activeTopLevelCategory,
    selectedCards,
    locationSelections,
    educationSelections,
    incomeSelections,
    expenseSelections,
    decisionSelections,
    currentSelections,
    canGoNext,
    canGoBack,
    lifeLog,
    isDead,
    lastPlayedCards,
    lastStatChanges,
    lastRiskEvents,
    lastTriggeredEvents,
    stageRandomEvents,
    unlockedCardIds,
    currentStage,
    isLastStage,
    hasQualifyingEducation,
    visitedLocationCategories,
    visitedEducationCategories,
    visitedExpenseCategories,
    visitedIncomeCategories,
    visitedDecisionCategories,
    investmentAmount,
    maxInvestmentAmount,
    pendingWealth,
    meetsPrerequisites,
    meetsLocationRequirement,
    currentLocation,
    resumeHistory,
    previousExpenseSelections,
    startNewGame,
    drawHand,
    toggleCardSelection,
    nextPhase,
    prevPhase,
    goToPhase,
    playStage,
    finishEventsAnimation,
    advanceToNextStage,
    getLifeArchetype,
    setInvestmentAmount,
    copyPreviousExpenses,
    lotteryPlayed,
    lotteryResult,
    showLotteryPopup,
    playLottery,
    closeLotteryPopup,
    wsopPlayed,
    wsopResult,
    showWsopPopup,
    playWSOP,
    closeWsopPopup,
    eliteSchoolApplications,
    showAdmissionPopup,
    admissionResult,
    applyToEliteSchool,
    closeAdmissionPopup,
    getEliteSchoolStatus,
    portfolio,
    portfolioTotalValue,
    portfolioTotalCost,
    portfolioGainLoss,
    stockDefinitions,
    buyStock,
    sellStock,
    unlockedAchievements,
    unlockAchievement,
    isAchievementUnlocked,
  };
});
