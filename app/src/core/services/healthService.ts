/**
 * Health scoring service
 * Computes friendship health status from interaction history
 */

import { differenceInDays, subDays } from 'date-fns';
import type {
  Friend,
  Interaction,
  HealthStatus,
  FriendHealthMetrics,
} from '../models/types';
import { TIER_CADENCE_DAYS } from '../models/types';

/**
 * Calculate the health score (0-100) for a friendship
 * This number is never shown directly to users — it maps to qualitative status
 */
export function calculateHealthScore(
  friend: Friend,
  interactions: Interaction[],
  now: Date = new Date()
): number {
  const cadenceTarget = TIER_CADENCE_DAYS[friend.tier];

  // Filter to this friend's interactions
  const friendInteractions = interactions
    .filter((i) => i.friendId === friend.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // If no interactions ever, base score on how new the friend is
  if (friendInteractions.length === 0) {
    const daysSinceCreated = differenceInDays(now, new Date(friend.createdAt));
    // New friends get grace period (30 days), then score decays
    if (daysSinceCreated < 30) return 60;
    if (daysSinceCreated < 60) return 45;
    return 25;
  }

  // Most recent interaction
  const lastInteraction = friendInteractions[0];
  const daysSinceLast = differenceInDays(now, new Date(lastInteraction.date));

  // Interactions in last 90 days
  const ninetyDaysAgo = subDays(now, 90);
  const recentInteractions = friendInteractions.filter(
    (i) => new Date(i.date) >= ninetyDaysAgo
  );

  // ─────────────────────────────────────────────────────────────
  // SCORE COMPONENTS
  // ─────────────────────────────────────────────────────────────

  // 1. Recency score (0-40 points)
  // Based on days since last contact vs tier-appropriate cadence
  let recencyScore = 0;
  const recencyRatio = daysSinceLast / cadenceTarget;
  if (recencyRatio <= 0.5) {
    recencyScore = 40; // Well within cadence
  } else if (recencyRatio <= 1) {
    recencyScore = 40 - (recencyRatio - 0.5) * 20; // 40 -> 30
  } else if (recencyRatio <= 2) {
    recencyScore = 30 - (recencyRatio - 1) * 15; // 30 -> 15
  } else if (recencyRatio <= 3) {
    recencyScore = 15 - (recencyRatio - 2) * 10; // 15 -> 5
  } else {
    recencyScore = Math.max(0, 5 - (recencyRatio - 3) * 2);
  }

  // 2. Frequency score (0-30 points)
  // Based on number of interactions in last 90 days
  const expectedInteractions90 = Math.ceil(90 / cadenceTarget);
  const frequencyRatio = recentInteractions.length / expectedInteractions90;
  let frequencyScore = 0;
  if (frequencyRatio >= 1) {
    frequencyScore = 30;
  } else if (frequencyRatio >= 0.5) {
    frequencyScore = 20 + (frequencyRatio - 0.5) * 20;
  } else {
    frequencyScore = frequencyRatio * 40;
  }

  // 3. Quality mix score (0-20 points)
  // Bonus for having deep conversations, not just texts
  const qualityTypes = ['deep_convo', 'hangout', 'event', 'helped'];
  const qualityInteractions = recentInteractions.filter((i) =>
    qualityTypes.includes(i.type)
  );
  const qualityRatio = recentInteractions.length
    ? qualityInteractions.length / recentInteractions.length
    : 0;
  const qualityScore = Math.min(20, qualityRatio * 40);

  // 4. Reciprocity adjustment (-10 to +10 points)
  // Only penalize extreme imbalance
  let reciprocityScore = 0;
  const interactionsWithInitiator = friendInteractions.filter(
    (i) => i.initiatedBy
  );
  if (interactionsWithInitiator.length >= 4) {
    const myInitiations = interactionsWithInitiator.filter(
      (i) => i.initiatedBy === 'me'
    ).length;
    const theirInitiations = interactionsWithInitiator.filter(
      (i) => i.initiatedBy === 'them'
    ).length;
    const total = myInitiations + theirInitiations;
    if (total > 0) {
      const ratio = myInitiations / total;
      // Only penalize if you're doing >80% of initiating
      if (ratio > 0.8) {
        reciprocityScore = -10;
      } else if (ratio > 0.7) {
        reciprocityScore = -5;
      } else if (ratio >= 0.3 && ratio <= 0.7) {
        reciprocityScore = 5; // Balanced = small bonus
      }
    }
  }

  // Total score
  const totalScore = Math.round(
    Math.max(0, Math.min(100, recencyScore + frequencyScore + qualityScore + reciprocityScore))
  );

  return totalScore;
}

/**
 * Map a health score (0-100) to a qualitative status
 */
export function scoreToStatus(score: number): HealthStatus {
  if (score >= 80) return 'thriving';
  if (score >= 60) return 'healthy';
  if (score >= 40) return 'cooling';
  if (score >= 20) return 'at_risk';
  return 'dormant';
}

/**
 * Get full health metrics for a friend
 */
export function getFriendHealth(
  friend: Friend,
  interactions: Interaction[],
  now: Date = new Date()
): FriendHealthMetrics {
  const friendInteractions = interactions
    .filter((i) => i.friendId === friend.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const healthScore = calculateHealthScore(friend, interactions, now);
  const healthStatus = scoreToStatus(healthScore);
  const cadenceTarget = TIER_CADENCE_DAYS[friend.tier];

  // Days since last contact
  let daysSinceLastContact = Infinity;
  if (friendInteractions.length > 0) {
    daysSinceLastContact = differenceInDays(
      now,
      new Date(friendInteractions[0].date)
    );
  }

  // Interactions in last 90 days
  const ninetyDaysAgo = subDays(now, 90);
  const interactionsLast90Days = friendInteractions.filter(
    (i) => new Date(i.date) >= ninetyDaysAgo
  ).length;

  // On track if within cadence
  const onTrack = daysSinceLastContact <= cadenceTarget;

  // Reciprocity ratio (optional, only if enough data)
  let reciprocityRatio: number | undefined;
  const withInitiator = friendInteractions.filter((i) => i.initiatedBy);
  if (withInitiator.length >= 4) {
    const myCount = withInitiator.filter((i) => i.initiatedBy === 'me').length;
    reciprocityRatio = myCount / withInitiator.length;
  }

  return {
    friendId: friend.id,
    healthScore,
    healthStatus,
    daysSinceLastContact:
      daysSinceLastContact === Infinity ? -1 : daysSinceLastContact,
    interactionsLast90Days,
    cadenceTarget,
    onTrack,
    reciprocityRatio,
  };
}

/**
 * Get a human-readable time description for last contact
 */
export function getLastContactDescription(days: number): string {
  if (days < 0) return 'No contact yet';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'About a week ago';
  if (days < 30) return 'A few weeks ago';
  if (days < 60) return 'About a month ago';
  if (days < 90) return 'A couple months ago';
  if (days < 180) return 'A few months ago';
  if (days < 365) return 'Several months ago';
  return 'Over a year ago';
}

/**
 * Map health status to face expression for plant
 */
export function healthToExpression(status: HealthStatus): string {
  switch (status) {
    case 'thriving':
      return 'happy';
    case 'healthy':
      return 'content';
    case 'cooling':
      return 'content'; // Still okay, just needs attention
    case 'at_risk':
      return 'worried';
    case 'dormant':
      return 'sleeping';
    default:
      return 'content';
  }
}
