/**
 * Zustand store for friends and interactions
 * This is the central state management for Tended
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Friend,
  Interaction,
  InteractionType,
  InitiatedBy,
  Tier,
  FriendRole,
  FriendHealthMetrics,
  PlantAppearance,
  PlantType,
  PotStyle,
  PotColor,
} from '../models/types';
import { TIER_PLANT_OPTIONS } from '../models/types';
import { getFriendHealth } from '../services/healthService';

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Get a random plant type for a tier
const getRandomPlantForTier = (tier: Tier): PlantType => {
  const options = TIER_PLANT_OPTIONS[tier];
  return options[Math.floor(Math.random() * options.length)];
};

// Get a random pot color
const getRandomPotColor = (): PotColor => {
  const colors: PotColor[] = ['sage', 'terracotta', 'pink', 'yellow', 'blue', 'lavender'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get a random pot style
const getRandomPotStyle = (): PotStyle => {
  const styles: PotStyle[] = ['cylinder', 'tapered', 'round', 'terracotta', 'basket'];
  return styles[Math.floor(Math.random() * styles.length)];
};

interface FriendStore {
  // State
  friends: Friend[];
  interactions: Interaction[];
  plantAppearances: Record<string, PlantAppearance>;

  // Friend CRUD
  addFriend: (name: string, tier: Tier, roles?: FriendRole[]) => Friend;
  updateFriend: (id: string, updates: Partial<Friend>) => void;
  removeFriend: (id: string) => void;
  getFriend: (id: string) => Friend | undefined;

  // Tier management
  changeTier: (friendId: string, newTier: Tier, reason?: string) => void;

  // Interactions
  logInteraction: (
    friendId: string,
    type: InteractionType,
    note?: string,
    initiatedBy?: InitiatedBy,
    date?: Date
  ) => Interaction;
  getInteractionsForFriend: (friendId: string) => Interaction[];
  getRecentInteractions: (limit?: number) => Interaction[];

  // Health metrics (computed)
  getFriendHealth: (friendId: string) => FriendHealthMetrics | null;
  getAllFriendsHealth: () => FriendHealthMetrics[];

  // Plant appearance
  getPlantAppearance: (friendId: string) => PlantAppearance | null;
  updatePlantAppearance: (
    friendId: string,
    updates: Partial<Omit<PlantAppearance, 'friendId'>>
  ) => void;

  // Queries
  getFriendsByTier: (tier: Tier) => Friend[];
  getFriendsNeedingAttention: () => Friend[];
  getUpcomingBirthdays: (days?: number) => Friend[];
}

export const useFriendStore = create<FriendStore>()(
  persist(
    (set, get) => ({
      friends: [],
      interactions: [],
      plantAppearances: {},

      // ─────────────────────────────────────────────────────────────
      // FRIEND CRUD
      // ─────────────────────────────────────────────────────────────

      addFriend: (name, tier, roles = []) => {
        const now = new Date().toISOString();
        const id = generateId();

        const friend: Friend = {
          id,
          name,
          tier,
          roles,
          tierHistory: [{ tier, date: now }],
          createdAt: now,
          updatedAt: now,
        };

        // Create default plant appearance
        const plantAppearance: PlantAppearance = {
          friendId: id,
          plantType: getRandomPlantForTier(tier),
          potStyle: getRandomPotStyle(),
          potColor: getRandomPotColor(),
        };

        set((state) => ({
          friends: [...state.friends, friend],
          plantAppearances: {
            ...state.plantAppearances,
            [id]: plantAppearance,
          },
        }));

        return friend;
      },

      updateFriend: (id, updates) => {
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === id
              ? { ...f, ...updates, updatedAt: new Date().toISOString() }
              : f
          ),
        }));
      },

      removeFriend: (id) => {
        set((state) => {
          const { [id]: _, ...remainingAppearances } = state.plantAppearances;
          return {
            friends: state.friends.filter((f) => f.id !== id),
            interactions: state.interactions.filter((i) => i.friendId !== id),
            plantAppearances: remainingAppearances,
          };
        });
      },

      getFriend: (id) => {
        return get().friends.find((f) => f.id === id);
      },

      // ─────────────────────────────────────────────────────────────
      // TIER MANAGEMENT
      // ─────────────────────────────────────────────────────────────

      changeTier: (friendId, newTier, reason) => {
        const friend = get().getFriend(friendId);
        if (!friend || friend.tier === newTier) return;

        const now = new Date().toISOString();

        // Update tier and add to history
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === friendId
              ? {
                  ...f,
                  tier: newTier,
                  tierHistory: [...f.tierHistory, { tier: newTier, date: now, reason }],
                  updatedAt: now,
                }
              : f
          ),
        }));

        // Update plant type to match new tier
        const currentAppearance = get().plantAppearances[friendId];
        if (currentAppearance) {
          const tierPlants = TIER_PLANT_OPTIONS[newTier];
          // Only change plant if current plant doesn't belong to new tier
          if (!tierPlants.includes(currentAppearance.plantType)) {
            set((state) => ({
              plantAppearances: {
                ...state.plantAppearances,
                [friendId]: {
                  ...currentAppearance,
                  plantType: getRandomPlantForTier(newTier),
                },
              },
            }));
          }
        }
      },

      // ─────────────────────────────────────────────────────────────
      // INTERACTIONS
      // ─────────────────────────────────────────────────────────────

      logInteraction: (friendId, type, note, initiatedBy, date) => {
        const interaction: Interaction = {
          id: generateId(),
          friendId,
          type,
          date: (date || new Date()).toISOString(),
          note,
          initiatedBy,
        };

        set((state) => ({
          interactions: [...state.interactions, interaction],
        }));

        // Update friend's updatedAt
        get().updateFriend(friendId, {});

        return interaction;
      },

      getInteractionsForFriend: (friendId) => {
        return get()
          .interactions.filter((i) => i.friendId === friendId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getRecentInteractions: (limit = 10) => {
        return get()
          .interactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      },

      // ─────────────────────────────────────────────────────────────
      // HEALTH METRICS
      // ─────────────────────────────────────────────────────────────

      getFriendHealth: (friendId) => {
        const friend = get().getFriend(friendId);
        if (!friend) return null;
        return getFriendHealth(friend, get().interactions);
      },

      getAllFriendsHealth: () => {
        const { friends, interactions } = get();
        return friends.map((friend) => getFriendHealth(friend, interactions));
      },

      // ─────────────────────────────────────────────────────────────
      // PLANT APPEARANCE
      // ─────────────────────────────────────────────────────────────

      getPlantAppearance: (friendId) => {
        return get().plantAppearances[friendId] || null;
      },

      updatePlantAppearance: (friendId, updates) => {
        const current = get().plantAppearances[friendId];
        if (!current) return;

        set((state) => ({
          plantAppearances: {
            ...state.plantAppearances,
            [friendId]: { ...current, ...updates },
          },
        }));
      },

      // ─────────────────────────────────────────────────────────────
      // QUERIES
      // ─────────────────────────────────────────────────────────────

      getFriendsByTier: (tier) => {
        return get().friends.filter((f) => f.tier === tier);
      },

      getFriendsNeedingAttention: () => {
        const allHealth = get().getAllFriendsHealth();
        const needsAttention = allHealth
          .filter((h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling')
          .map((h) => h.friendId);

        return get().friends.filter((f) => needsAttention.includes(f.id));
      },

      getUpcomingBirthdays: (days = 30) => {
        const now = new Date();
        const thisYear = now.getFullYear();

        return get()
          .friends.filter((f) => {
            if (!f.birthday) return false;

            // Parse birthday (YYYY-MM-DD) and set to this year
            const [_, month, day] = f.birthday.split('-').map(Number);
            const birthdayThisYear = new Date(thisYear, month - 1, day);

            // If birthday already passed this year, use next year
            if (birthdayThisYear < now) {
              birthdayThisYear.setFullYear(thisYear + 1);
            }

            const daysUntil = Math.ceil(
              (birthdayThisYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            return daysUntil <= days && daysUntil >= 0;
          })
          .sort((a, b) => {
            // Sort by upcoming birthday
            const getNextBirthday = (bday: string) => {
              const [_, month, day] = bday.split('-').map(Number);
              const date = new Date(thisYear, month - 1, day);
              if (date < now) date.setFullYear(thisYear + 1);
              return date;
            };
            return (
              getNextBirthday(a.birthday!).getTime() -
              getNextBirthday(b.birthday!).getTime()
            );
          });
      },
    }),
    {
      name: 'tended-friends-storage',
    }
  )
);
