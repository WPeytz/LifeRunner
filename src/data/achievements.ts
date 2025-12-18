export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  rarity: AchievementRarity
  icon: string
  unlocked: boolean
}

export const rarityColors: Record<AchievementRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: 'rgba(156, 163, 175, 0.15)',
    border: 'rgba(156, 163, 175, 0.4)',
    text: '#9ca3af',
    glow: 'rgba(156, 163, 175, 0.3)',
  },
  rare: {
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    text: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  epic: {
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    text: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
  legendary: {
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    text: '#f97316',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
}

export const achievements: Achievement[] = [
  // Common (Grey) - 4 achievements
  {
    id: 'debt_free',
    title: 'Debt Free',
    description: 'Become completely debt free',
    rarity: 'common',
    icon: '💳',
    unlocked: false,
  },
  {
    id: 'graduate_university',
    title: 'Graduate',
    description: 'Graduate from university',
    rarity: 'common',
    icon: '🎓',
    unlocked: false,
  },
  {
    id: 'job_promotion',
    title: 'Moving Up',
    description: 'Get promoted at your job',
    rarity: 'common',
    icon: '📈',
    unlocked: false,
  },
  {
    id: 'move_city',
    title: 'New Horizons',
    description: 'Move to a new city',
    rarity: 'common',
    icon: '🏙️',
    unlocked: false,
  },
  {
    id: 'index_fund',
    title: 'Passive Investor',
    description: 'Invest in an index fund',
    rarity: 'common',
    icon: '📊',
    unlocked: false,
  },
  {
    id: 'get_married',
    title: 'Get Married',
    description: 'Get married',
    rarity: 'common',
    icon: '💍',
    unlocked: false,
  },
  {
    id: 'get_pet',
    title: 'Get a Pet',
    description: 'Adopt a furry companion',
    rarity: 'common',
    icon: '🐕',
    unlocked: false,
  },

  // Rare (Blue) - 3 achievements
  {
    id: 'retire_millionaire',
    title: 'Golden Years',
    description: 'Retire as a millionaire',
    rarity: 'rare',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'five_countries',
    title: 'World Traveler',
    description: 'Live in five different countries',
    rarity: 'rare',
    icon: '🌍',
    unlocked: false,
  },
  {
    id: 'graduate_degree',
    title: 'Scholar',
    description: 'Earn a graduate degree',
    rarity: 'rare',
    icon: '📜',
    unlocked: false,
  },
  {
    id: 'start_company',
    title: 'Entrepreneur',
    description: 'Start your own company',
    rarity: 'rare',
    icon: '🏢',
    unlocked: false,
  },
  {
    id: 'make_game',
    title: 'Game Developer',
    description: 'Make a video game',
    rarity: 'rare',
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'publish_book',
    title: 'Publish a Book',
    description: 'Become a published author',
    rarity: 'rare',
    icon: '📚',
    unlocked: false,
  }, 
  {
    id: 'learn_instrument',
    title: 'Learn an Instrument',
    description: 'Master a musical instrument',
    rarity: 'rare',
    icon: '🎸',
    unlocked: false,
  },

  // Epic (Purple) - 3 achievements
  {
    id: 'ten_million',
    title: 'Eight Figures',
    description: 'Achieve a net worth of $10 million',
    rarity: 'epic',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'seven_continents',
    title: 'Global Citizen',
    description: 'Live on all seven continents',
    rarity: 'epic',
    icon: '🌎',
    unlocked: false,
  },
  {
    id: 'wsop_winner',
    title: 'Card Shark',
    description: 'Win the World Series of Poker',
    rarity: 'epic',
    icon: '🃏',
    unlocked: false,
  },
  {
    id: 'youtube_million',
    title: 'YouTube Star',
    description: 'Get 1 million subscribers on YouTube',
    rarity: 'epic',
    icon: '📺',
    unlocked: false,
  },
  {
    id: 'movie_star',
    title: 'Movie Star',
    description: 'Become a famous movie star',
    rarity: 'epic',
    icon: '🎬',
    unlocked: false,
  },
  {
    id: 'army_general',
    title: 'General',
    description: 'Become a general in the army',
    rarity: 'epic',
    icon: '🎖️',
    unlocked: false,
  },
  {
    id: 'chess_grandmaster',
    title: 'Grandmaster',
    description: 'Become a chess grandmaster',
    rarity: 'epic',
    icon: '♟️',
    unlocked: false,
  },
  {
    id: 'olympic_medal',
    title: 'Win an Olympic Medal',
    description: 'Compete and medal at the Olympics',
    rarity: 'epic',
    icon: '🥇',
    unlocked: false,
  },
  {
    id: 'fortune_500_ceo',
    title: 'Fortune 500 CEO',
    description: 'Become CEO of a Fortune 500 company',
    rarity: 'epic',
    icon: '👔',
    unlocked: false,
  },

  // Legendary (Orange) - 5 achievements
  {
    id: 'billionaire',
    title: 'Billionaire',
    description: 'Achieve a net worth of $1 billion',
    rarity: 'legendary',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'president',
    title: 'Mr. President',
    description: 'Become President of the United States',
    rarity: 'legendary',
    icon: '🇺🇸',
    unlocked: false,
  },
  {
    id: 'mars',
    title: 'Martian',
    description: 'Travel to Mars',
    rarity: 'legendary',
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'discover_agi',
    title: 'Singularity',
    description: 'Discover Artificial General Intelligence (AGI)',
    rarity: 'legendary',
    icon: '🤖',
    unlocked: false,
  },
  {
    id: 'cure_cancer',
    title: 'Miracle Worker',
    description: 'Cure cancer and save millions of lives',
    rarity: 'legendary',
    icon: '🧬',
    unlocked: false,
  },
]

export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return achievements.filter(a => a.rarity === rarity)
}
