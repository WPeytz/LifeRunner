import type { CardEffect } from '@/types/game'

export interface RandomEvent {
  id: string
  title: string
  description: string
  effects: CardEffect[]
  emoji: string
  isPositive: boolean
}

// Pool of random life events that can happen during any stage
export const randomEventPool: RandomEvent[] = [
  // Positive Events
  {
    id: 'event_lottery_small',
    title: 'Lucky Day!',
    description: 'You found $50 on the street!',
    effects: [{ stat: 'wealth', delta: 50 }, { stat: 'happiness', delta: 1 }],
    emoji: '🍀',
    isPositive: true,
  },
  {
    id: 'event_new_friend',
    title: 'New Connection',
    description: 'You hit it off with someone at a coffee shop.',
    effects: [{ stat: 'relationships', delta: 1 }],
    emoji: '☕',
    isPositive: true,
  },
  {
    id: 'event_workout_win',
    title: 'Fitness Milestone',
    description: 'You crushed a personal record at the gym!',
    effects: [{ stat: 'health', delta: 1 }, { stat: 'happiness', delta: 1 }],
    emoji: '💪',
    isPositive: true,
  },
  {
    id: 'event_raise',
    title: 'Surprise Raise',
    description: 'Your hard work was noticed - you got a raise!',
    effects: [{ stat: 'wealth', delta: 5000 }, { stat: 'happiness', delta: 1 }],
    emoji: '📈',
    isPositive: true,
  },
  {
    id: 'event_viral_post',
    title: 'Internet Famous',
    description: 'Your social media post went viral!',
    effects: [{ stat: 'relationships', delta: 2 }, { stat: 'happiness', delta: 1 }],
    emoji: '📱',
    isPositive: true,
  },
  {
    id: 'event_good_checkup',
    title: 'Clean Bill of Health',
    description: 'Your doctor says you\'re in great shape!',
    effects: [{ stat: 'health', delta: 1 }, { stat: 'happiness', delta: 1 }],
    emoji: '🩺',
    isPositive: true,
  },
  {
    id: 'event_skill_breakthrough',
    title: 'Eureka Moment',
    description: 'Something finally clicked - you leveled up a skill!',
    effects: [{ stat: 'skills', delta: 1 }, { stat: 'happiness', delta: 1 }],
    emoji: '💡',
    isPositive: true,
  },
  {
    id: 'event_inheritance_small',
    title: 'Unexpected Gift',
    description: 'A relative left you a small inheritance.',
    effects: [{ stat: 'wealth', delta: 3000 }],
    emoji: '🎁',
    isPositive: true,
  },
  {
    id: 'event_promotion',
    title: 'Career Advancement',
    description: 'You got promoted at work!',
    effects: [{ stat: 'wealth', delta: 8000 }, { stat: 'skills', delta: 1 }],
    emoji: '🎉',
    isPositive: true,
  },
  {
    id: 'event_vacation_deal',
    title: 'Amazing Vacation',
    description: 'You found an incredible travel deal and had a great trip!',
    effects: [{ stat: 'happiness', delta: 2 }, { stat: 'health', delta: 1 }],
    emoji: '✈️',
    isPositive: true,
  },

  // Negative Events
  {
    id: 'event_car_trouble',
    title: 'Car Breakdown',
    description: 'Your car needed unexpected repairs.',
    effects: [{ stat: 'wealth', delta: -800 }, { stat: 'happiness', delta: -1 }],
    emoji: '🚗',
    isPositive: false,
  },
  {
    id: 'event_sick',
    title: 'Under the Weather',
    description: 'A nasty flu knocked you out for a week.',
    effects: [{ stat: 'health', delta: -1 }, { stat: 'happiness', delta: -1 }],
    emoji: '🤒',
    isPositive: false,
  },
  {
    id: 'event_lost_wallet',
    title: 'Lost Wallet',
    description: 'Someone stole your wallet on the subway.',
    effects: [{ stat: 'wealth', delta: -200 }, { stat: 'happiness', delta: -1 }],
    emoji: '👛',
    isPositive: false,
  },
  {
    id: 'event_friend_moved',
    title: 'Friend Moved Away',
    description: 'A close friend relocated to another city.',
    effects: [{ stat: 'relationships', delta: -1 }, { stat: 'happiness', delta: -1 }],
    emoji: '😢',
    isPositive: false,
  },
  {
    id: 'event_appliance_broke',
    title: 'Appliance Disaster',
    description: 'Your washing machine flooded the apartment!',
    effects: [{ stat: 'wealth', delta: -600 }, { stat: 'happiness', delta: -1 }],
    emoji: '🌊',
    isPositive: false,
  },
  {
    id: 'event_parking_ticket',
    title: 'Parking Ticket',
    description: 'You came back to a ticket on your windshield.',
    effects: [{ stat: 'wealth', delta: -150 }, { stat: 'happiness', delta: -1 }],
    emoji: '🎫',
    isPositive: false,
  },
  {
    id: 'event_burnout',
    title: 'Burnout',
    description: 'You pushed too hard and hit a wall.',
    effects: [{ stat: 'health', delta: -1 }, { stat: 'happiness', delta: -2 }],
    emoji: '😮‍💨',
    isPositive: false,
  },
  {
    id: 'event_argument',
    title: 'Falling Out',
    description: 'A heated argument damaged a relationship.',
    effects: [{ stat: 'relationships', delta: -1 }, { stat: 'happiness', delta: -1 }],
    emoji: '💔',
    isPositive: false,
  },
  {
    id: 'event_scammed',
    title: 'Online Scam',
    description: 'You fell for a phishing email and lost some money.',
    effects: [{ stat: 'wealth', delta: -500 }, { stat: 'happiness', delta: -1 }],
    emoji: '🎣',
    isPositive: false,
  },
  {
    id: 'event_dental',
    title: 'Dental Emergency',
    description: 'A sudden toothache led to an expensive dentist visit.',
    effects: [{ stat: 'wealth', delta: -400 }, { stat: 'health', delta: -1 }],
    emoji: '🦷',
    isPositive: false,
  },

  // Neutral/Mixed Events
  {
    id: 'event_job_offer',
    title: 'Job Opportunity',
    description: 'A recruiter reached out with an interesting offer.',
    effects: [{ stat: 'skills', delta: 1 }],
    emoji: '📧',
    isPositive: true,
  },
  {
    id: 'event_reunion',
    title: 'Unexpected Reunion',
    description: 'You ran into an old friend from school!',
    effects: [{ stat: 'relationships', delta: 1 }, { stat: 'happiness', delta: 1 }],
    emoji: '🤗',
    isPositive: true,
  },
  {
    id: 'event_hobby',
    title: 'New Hobby',
    description: 'You discovered a passion you never knew you had.',
    effects: [{ stat: 'happiness', delta: 2 }, { stat: 'skills', delta: 1 }],
    emoji: '🎨',
    isPositive: true,
  },
  {
    id: 'event_mentor',
    title: 'Found a Mentor',
    description: 'An experienced professional took you under their wing.',
    effects: [{ stat: 'skills', delta: 2 }, { stat: 'relationships', delta: 1 }],
    emoji: '🧙',
    isPositive: true,
  },
  {
    id: 'event_tax_refund',
    title: 'Tax Refund',
    description: 'The IRS owes you money for once!',
    effects: [{ stat: 'wealth', delta: 1500 }, { stat: 'happiness', delta: 1 }],
    emoji: '💵',
    isPositive: true,
  },
]

// Get 1-3 random events for a stage
export function getRandomEventsForStage(): RandomEvent[] {
  const shuffled = [...randomEventPool].sort(() => Math.random() - 0.5)
  const count = Math.floor(Math.random() * 3) + 1 // 1-3 events
  return shuffled.slice(0, count)
}
