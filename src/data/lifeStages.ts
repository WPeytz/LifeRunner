import type { LifeStage } from '@/types/game';

export const lifeStages: LifeStage[] = [
  {
    id: 1,
    name: 'Early Freedom',
    ageRange: '18-22',
    theme: 'Education & Independence',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 4,
  },
  {
    id: 2,
    name: 'Finding Your Path',
    ageRange: '22-26',
    theme: 'Skills & First Job',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 4,
  },
  {
    id: 3,
    name: 'Building Foundations',
    ageRange: '26-30',
    theme: 'Career or Adventure',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 4,
  },
  {
    id: 4,
    name: 'Connections',
    ageRange: '30-35',
    theme: 'Relationships & Roots',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 5,
  },
  {
    id: 5,
    name: 'Peak Years',
    ageRange: '35-40',
    theme: 'Ambition vs Burnout',
    cardsPerHand: 6,
    energyPerTurn: 12,
    years: 5,
  },
  {
    id: 6,
    name: 'The Juggle',
    ageRange: '40-50',
    theme: 'Family & Career Tension',
    cardsPerHand: 6,
    energyPerTurn: 12,
    years: 10,
  },
  {
    id: 7,
    name: 'Harvest',
    ageRange: '50-65',
    theme: 'Wealth vs Happiness',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 15,
  },
  {
    id: 8,
    name: 'Legacy',
    ageRange: '65+',
    theme: 'What You Leave Behind',
    cardsPerHand: 5,
    energyPerTurn: 12,
    years: 15,
  },
];

export function getStageById(id: number): LifeStage | undefined {
  return lifeStages.find(stage => stage.id === id);
}

export function getStageByIndex(index: number): LifeStage | undefined {
  return lifeStages[index];
}

export const totalStages = lifeStages.length;
