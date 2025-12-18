export type StatKey = 'health' | 'wealth' | 'skills' | 'relationships' | 'happiness';

export interface Stats {
  health: number;
  wealth: number;
  skills: number;
  relationships: number;
  happiness: number;
}

export interface LifeStage {
  id: number;
  name: string;
  ageRange: string;
  theme: string;
  cardsPerHand: number;
  energyPerTurn: number;
  years: number;
}

export type CardCategory = 'opportunity' | 'crisis' | 'lifestyle' | 'relationship' | 'wildcard';

export type CardType = 'location' | 'education' | 'income' | 'expense' | 'decision';

export type SelectionPhase = 'location' | 'education' | 'income' | 'expenses' | 'decisions';

export interface CardEffect {
  stat: StatKey;
  delta: number;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  category: CardCategory;
  cardType: CardType;      // income, expense, or decision
  cost: number;            // mana cost
  effects: CardEffect[];   // deterministic changes
  tags?: string[];         // e.g. ['tech', 'risk', 'travel']
  riskChance?: number;     // 0–1, optional
  riskEffect?: CardEffect; // negative/positive outcome
  unlocks?: string[];      // card IDs that get added to next year's hand
  isFollowUp?: boolean;    // true if this card only appears as a follow-up
  isEvent?: boolean;       // true if this is an event (not a choice) - appears in year-end results
  subOptions?: string[];   // IDs of sub-option cards that appear when this is selected
  isSubOption?: boolean;   // true if this card is a sub-option of another card
  parentId?: string;       // ID of the parent card (if isSubOption)
  minWealth?: number;      // minimum net worth required to select this card
  requires?: string[];     // IDs of cards that must have been played previously to enable this card
  requiresLocation?: string[]; // IDs of location cards - player must be in one of these locations
  maxSubOptions?: number;  // maximum number of sub-options to display (randomly selected)
}