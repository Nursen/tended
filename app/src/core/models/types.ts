/**
 * Core data types for Tended friendship management app
 */

// ─────────────────────────────────────────────────────────────
// TIERS & ROLES
// ─────────────────────────────────────────────────────────────

export type Tier = 1 | 2 | 3 | 4 | 5;

export const TIER_LABELS: Record<Tier, string> = {
  1: 'Inner Circle',
  2: 'Close Friend',
  3: 'Good Friend',
  4: 'Friend',
  5: 'Acquaintance',
};

export const TIER_DESCRIPTIONS: Record<Tier, string> = {
  1: 'Ride-or-die. Godparent candidates. You drop everything for them.',
  2: 'You see them regularly. They help you move. You share real struggles.',
  3: 'Solid friendships. You attend their major life events.',
  4: 'Pleasant connections. Coffee catch-ups. Crash on their couch in their city.',
  5: 'New or distant. A text every few months. Potential to grow.',
};

// Target contact frequency in days for each tier
export const TIER_CADENCE_DAYS: Record<Tier, number> = {
  1: 7,   // Weekly
  2: 14,  // Bi-weekly
  3: 30,  // Monthly
  4: 90,  // Quarterly
  5: 180, // Semi-annually
};

export type FriendRole =
  | 'mentor'           // Life advice, wisdom
  | 'emotional_anchor' // Deep conversations, vulnerability
  | 'adventure'        // Travel, experiences, spontaneity
  | 'professional'     // Career advice, networking
  | 'connector'        // Knows everyone, brings groups together
  | 'accountability'   // Goals, growth, honest feedback
  | 'local_guide'      // Knows their city well
  | 'fun_energy';      // Lifts your mood, good times

export const ROLE_LABELS: Record<FriendRole, string> = {
  mentor: 'Mentor',
  emotional_anchor: 'Emotional Anchor',
  adventure: 'Adventure Partner',
  professional: 'Professional Ally',
  connector: 'Social Connector',
  accountability: 'Accountability Partner',
  local_guide: 'Local Guide',
  fun_energy: 'Fun Energy',
};

// ─────────────────────────────────────────────────────────────
// FRIEND
// ─────────────────────────────────────────────────────────────

export interface Friend {
  id: string;
  name: string;
  photo?: string;
  tier: Tier;
  roles: FriendRole[];

  // Location
  location?: {
    city: string;
    region?: string; // state/country
  };

  // Important dates
  birthday?: string; // ISO date string (YYYY-MM-DD)
  importantDates?: Array<{
    label: string;
    date: string; // ISO date
  }>;

  // Structured profile data
  profile?: FriendProfile;

  // Tier history for tracking promotions/demotions
  tierHistory: Array<{
    tier: Tier;
    date: string; // ISO date
    reason?: string;
  }>;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface FriendProfile {
  // Basics
  basics?: {
    partner?: string;
    kids?: string;
    pets?: string;
    dietary?: string[];
    drinks?: string[];
    doesntDrink?: string[];
  };

  // Favorites
  favorites?: {
    restaurants?: string[];
    candy?: string[];
    brands?: string[];
    books?: string[];
    activities?: string[];
  };

  // Life updates
  life?: {
    job?: string;
    goals?: string[];
    stressors?: string[];
    bigNews?: Array<{ text: string; date: string }>;
  };

  // Gift intel
  giftIntel?: {
    sizes?: Record<string, string>; // e.g., { tops: 'M', shoes: '7.5' }
    likes?: string[];
    dislikes?: string[];
    giftIdeas?: Array<{ idea: string; addedDate: string }>;
  };

  // Free-form notes
  rawNotes?: string[];
}

// ─────────────────────────────────────────────────────────────
// INTERACTIONS
// ─────────────────────────────────────────────────────────────

export type InteractionType =
  | 'text'
  | 'call'
  | 'hangout'
  | 'deep_convo'
  | 'event'        // Attended their event
  | 'helped'       // Helped with something
  | 'group_hangout';

export const INTERACTION_LABELS: Record<InteractionType, string> = {
  text: 'Texted',
  call: 'Called',
  hangout: 'Hung out',
  deep_convo: 'Deep conversation',
  event: 'Attended event',
  helped: 'Helped out',
  group_hangout: 'Group hangout',
};

export const INTERACTION_ICONS: Record<InteractionType, string> = {
  text: '💬',
  call: '📞',
  hangout: '🤝',
  deep_convo: '💭',
  event: '🎉',
  helped: '🤲',
  group_hangout: '👥',
};

export type InitiatedBy = 'me' | 'them' | 'mutual';

export interface Interaction {
  id: string;
  friendId: string;
  type: InteractionType;
  date: string; // ISO datetime
  note?: string;
  initiatedBy?: InitiatedBy;
}

// ─────────────────────────────────────────────────────────────
// HEALTH STATUS (computed, not stored)
// ─────────────────────────────────────────────────────────────

export type HealthStatus =
  | 'thriving'  // Doing great
  | 'healthy'   // On track
  | 'cooling'   // Starting to drift
  | 'at_risk'   // Needs attention
  | 'dormant';  // Gone quiet

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  thriving: 'Thriving',
  healthy: 'Healthy',
  cooling: 'Cooling',
  at_risk: 'Needs attention',
  dormant: 'Dormant',
};

export const HEALTH_STATUS_COLORS: Record<HealthStatus, string> = {
  thriving: '#7CAA6D',  // Sage green
  healthy: '#8BB87A',   // Light green
  cooling: '#FFE17B',   // Yellow
  at_risk: '#D4896A',   // Terracotta
  dormant: '#9BA39C',   // Muted gray-green
};

export interface FriendHealthMetrics {
  friendId: string;
  healthScore: number;        // 0-100 (hidden from UI)
  healthStatus: HealthStatus;
  daysSinceLastContact: number;
  interactionsLast90Days: number;
  cadenceTarget: number;      // Days, based on tier
  onTrack: boolean;
  reciprocityRatio?: number;  // 0-1, only computed if enough data
}

// ─────────────────────────────────────────────────────────────
// FRIENDSHIP FUND (Budget)
// ─────────────────────────────────────────────────────────────

export type GiftOccasion =
  | 'birthday'
  | 'holiday'
  | 'milestone'
  | 'spontaneous'
  | 'hosting'
  | 'travel';

export interface GiftExpense {
  id: string;
  friendId: string;
  date: string; // ISO date
  amount: number;
  occasion: GiftOccasion;
  description: string;
  note?: string;
}

export interface FriendBudget {
  friendId: string;
  year: number;
  annualBudget: number;
  customBudget?: number; // Override for special friends
}

export interface OccasionBudget {
  year: number;
  occasion: GiftOccasion;
  budget: number;
}

// ─────────────────────────────────────────────────────────────
// NUDGES
// ─────────────────────────────────────────────────────────────

export type NudgeType =
  | 'cadence'     // Auto: time since last contact
  | 'date'        // Auto: birthday, event coming up
  | 'contextual'  // Auto: you're in their city
  | 'scheduled'   // Manual: user-created reminder
  | 'suggested';  // AI: based on context

export interface Nudge {
  id: string;
  friendId?: string;
  type: NudgeType;
  message: string;           // The actionable prompt
  scheduledFor: string;      // ISO datetime
  deliveryMethod: 'in_app' | 'email' | 'sms';
  recurrence?: 'one_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  status: 'pending' | 'sent' | 'acted_on' | 'dismissed';
  generatedFrom?: string;    // What triggered it
}

// ─────────────────────────────────────────────────────────────
// PLANT VISUALS (mapping friends to plants)
// ─────────────────────────────────────────────────────────────

export type PlantType =
  // Tier 1 - High maintenance tropicals
  | 'monstera'
  | 'fiddle_leaf_fig'
  | 'bird_of_paradise'
  | 'orchid'
  // Tier 2 - Expressive houseplants
  | 'pothos'
  | 'peace_lily'
  | 'rubber_plant'
  // Tier 3 - Forgiving everyday plants
  | 'fern'
  | 'spider_plant'
  | 'herbs'
  // Tier 4 - Low maintenance
  | 'succulent'
  | 'snake_plant'
  | 'aloe'
  // Tier 5 - Neglect tolerant
  | 'cactus'
  | 'air_plant'
  | 'seedling';

export const TIER_PLANT_OPTIONS: Record<Tier, PlantType[]> = {
  1: ['monstera', 'fiddle_leaf_fig', 'bird_of_paradise', 'orchid'],
  2: ['pothos', 'peace_lily', 'rubber_plant'],
  3: ['fern', 'spider_plant', 'herbs'],
  4: ['succulent', 'snake_plant', 'aloe'],
  5: ['cactus', 'air_plant', 'seedling'],
};

export type PotStyle =
  | 'cylinder'
  | 'tapered'
  | 'round'
  | 'terracotta'
  | 'basket';

export type PotColor =
  | 'sage'      // #7CAA6D
  | 'terracotta' // #D4896A
  | 'pink'      // #F7A8B8
  | 'yellow'    // #FFE17B
  | 'blue'      // #A8D5E2
  | 'lavender'; // #B8A8D9

export type FaceExpression =
  | 'happy'
  | 'content'
  | 'sleeping'
  | 'worried'
  | 'excited'
  | 'winking';

export interface PlantAppearance {
  friendId: string;
  plantType: PlantType;
  potStyle: PotStyle;
  potColor: PotColor;
}
