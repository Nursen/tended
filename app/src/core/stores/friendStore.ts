/**
 * Zustand store for friends and interactions
 * This is the central state management for Tended
 *
 * Supabase sync strategy:
 * - On auth, syncFromSupabase() loads all data from the server
 * - On mutations, we update Supabase first then update local state
 * - localStorage persist middleware stays as offline fallback
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
  Garden,
} from '../models/types';
import { TIER_PLANT_OPTIONS } from '../models/types';
import { getFriendHealth } from '../services/healthService';
import * as db from '../services/supabaseDataService';
import { isSupabaseConfigured } from '../services/supabase';
import { useUIStore } from './uiStore';

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Get the current user ID from Supabase auth (or null if not logged in)
import { supabase } from '../services/supabase';
const getCurrentUserId = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
};

// Fire-and-forget Supabase write — logs errors but doesn't block the UI
const syncWrite = (fn: () => Promise<unknown>) => {
  fn().catch((err) => console.error('[Supabase sync]', err));
};

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
  gardens: Garden[];
  currentGardenId: string | null;
  friends: Friend[];
  interactions: Interaction[];
  plantAppearances: Record<string, PlantAppearance>;

  // Sync state
  isLoading: boolean;
  error: string | null;
  syncFromSupabase: (userId: string) => Promise<void>;

  // Garden CRUD
  createGarden: (name: string, icon?: string, description?: string) => Garden;
  updateGarden: (id: string, updates: Partial<Omit<Garden, 'id' | 'createdAt'>>) => void;
  deleteGarden: (id: string) => void;
  switchGarden: (gardenId: string) => void;
  getCurrentGarden: () => Garden | null;

  // Friend CRUD (scoped to current garden)
  addFriend: (name: string, tier: Tier, roles?: FriendRole[]) => Friend | null;
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
  deleteInteraction: (interactionId: string) => void;
  getInteractionsForFriend: (friendId: string) => Interaction[];
  getRecentInteractions: (limit?: number) => Interaction[];

  // Demo mode
  loadDemoData: () => void;
  clearAllData: () => void;

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
  getCurrentGardenFriends: () => Friend[];
}

export const useFriendStore = create<FriendStore>()(
  persist(
    (set, get) => ({
      gardens: [],
      currentGardenId: null,
      friends: [],
      interactions: [],
      plantAppearances: {},
      isLoading: false,
      error: null,

      // ─────────────────────────────────────────────────────────────
      // SUPABASE SYNC
      // ─────────────────────────────────────────────────────────────

      syncFromSupabase: async (userId: string) => {
        if (!isSupabaseConfigured()) return;

        set({ isLoading: true, error: null });
        try {
          const [gardens, friends, interactions, plantAppearances] =
            await Promise.all([
              db.fetchGardens(userId),
              db.fetchFriends(userId),
              db.fetchInteractions(userId),
              db.fetchPlantAppearances(userId),
            ]);

          set({
            gardens,
            friends,
            interactions,
            plantAppearances,
            currentGardenId: gardens[0]?.id || null,
            isLoading: false,
          });
        } catch (err) {
          console.error('Failed to sync from Supabase:', err);
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Sync failed',
          });
        }
      },

      // ─────────────────────────────────────────────────────────────
      // GARDEN CRUD
      // ─────────────────────────────────────────────────────────────

      createGarden: (name, icon = '🏠', description) => {
        const garden: Garden = {
          id: generateId(),
          name,
          icon,
          description,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          gardens: [...state.gardens, garden],
          currentGardenId: state.currentGardenId || garden.id,
        }));

        // Sync to Supabase — create with server-generated ID then update local
        syncWrite(async () => {
          const userId = await getCurrentUserId();
          if (!userId) return;
          const remote = await db.createGarden(userId, { name, icon, description });
          // Replace the local garden with the one from Supabase (has server ID)
          set((state) => ({
            gardens: state.gardens.map((g) => (g.id === garden.id ? remote : g)),
            currentGardenId:
              state.currentGardenId === garden.id ? remote.id : state.currentGardenId,
            // Update any friends that point to the old garden ID
            friends: state.friends.map((f) =>
              f.gardenId === garden.id ? { ...f, gardenId: remote.id } : f
            ),
          }));
        });

        return garden;
      },

      updateGarden: (id, updates) => {
        set((state) => ({
          gardens: state.gardens.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));

        syncWrite(() => db.updateGarden(id, updates));
      },

      deleteGarden: (id) => {
        const { currentGardenId, gardens } = get();
        const remainingGardens = gardens.filter((g) => g.id !== id);

        set((state) => ({
          gardens: remainingGardens,
          currentGardenId:
            currentGardenId === id
              ? remainingGardens[0]?.id || null
              : currentGardenId,
          // Remove all friends and interactions from this garden
          friends: state.friends.filter((f) => f.gardenId !== id),
          interactions: state.interactions.filter((i) => {
            const friend = state.friends.find((f) => f.id === i.friendId);
            return friend?.gardenId !== id;
          }),
        }));

        // CASCADE on the server handles friends/interactions/appearances
        syncWrite(() => db.deleteGarden(id));
      },

      switchGarden: (gardenId) => {
        set({ currentGardenId: gardenId });
      },

      getCurrentGarden: () => {
        const { gardens, currentGardenId } = get();
        return gardens.find((g) => g.id === currentGardenId) || null;
      },

      // ─────────────────────────────────────────────────────────────
      // FRIEND CRUD
      // ─────────────────────────────────────────────────────────────

      addFriend: (name, tier, roles = []) => {
        const { currentGardenId } = get();
        if (!currentGardenId) return null;

        const now = new Date().toISOString();
        const id = generateId();

        const friend: Friend = {
          id,
          gardenId: currentGardenId,
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

        // Sync to Supabase — replace local placeholder IDs with server IDs
        syncWrite(async () => {
          const userId = await getCurrentUserId();
          if (!userId) return;
          const remote = await db.addFriend(userId, {
            gardenId: currentGardenId,
            name,
            tier,
            roles,
          });
          await db.upsertPlantAppearance(userId, remote.id, {
            plantType: plantAppearance.plantType,
            potStyle: plantAppearance.potStyle,
            potColor: plantAppearance.potColor,
          });
          // Swap local IDs with server IDs
          set((state) => {
            const { [id]: oldPA, ...restPA } = state.plantAppearances;
            // Also update UI store if this friend is currently selected
            const uiState = useUIStore.getState();
            if (uiState.selectedFriendId === id) {
              useUIStore.setState({ selectedFriendId: remote.id });
            }
            return {
              friends: state.friends.map((f) =>
                f.id === id ? { ...remote, gardenId: remote.gardenId } : f
              ),
              interactions: state.interactions.map((i) =>
                i.friendId === id ? { ...i, friendId: remote.id } : i
              ),
              plantAppearances: oldPA
                ? { ...restPA, [remote.id]: { ...oldPA, friendId: remote.id } }
                : restPA,
            };
          });
        });

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

        // Map app-level Friend fields to DB column names
        syncWrite(() => {
          const dbUpdates: Record<string, unknown> = {};
          if (updates.name !== undefined) dbUpdates.name = updates.name;
          if (updates.tier !== undefined) dbUpdates.tier = updates.tier;
          if (updates.roles !== undefined) dbUpdates.roles = updates.roles;
          if (updates.photo !== undefined) dbUpdates.photo = updates.photo;
          if (updates.birthday !== undefined) dbUpdates.birthday = updates.birthday;
          if (updates.location !== undefined) {
            dbUpdates.location_city = updates.location?.city;
            dbUpdates.location_region = updates.location?.region;
          }
          if (updates.importantDates !== undefined) dbUpdates.important_dates = updates.importantDates;
          if (updates.profile !== undefined) dbUpdates.profile_data = updates.profile;
          if (updates.tierHistory !== undefined) dbUpdates.tier_history = updates.tierHistory;
          if (Object.keys(dbUpdates).length > 0) {
            return db.updateFriend(id, dbUpdates);
          }
          return Promise.resolve();
        });
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

        // CASCADE on the server handles interactions + plant_appearances
        syncWrite(() => db.removeFriend(id));
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
        const newHistory = [...friend.tierHistory, { tier: newTier, date: now, reason }];

        // Update tier and add to history
        set((state) => ({
          friends: state.friends.map((f) =>
            f.id === friendId
              ? {
                  ...f,
                  tier: newTier,
                  tierHistory: newHistory,
                  updatedAt: now,
                }
              : f
          ),
        }));

        // Update plant type to match new tier
        const currentAppearance = get().plantAppearances[friendId];
        let newPlantType: PlantType | null = null;
        if (currentAppearance) {
          const tierPlants = TIER_PLANT_OPTIONS[newTier];
          // Only change plant if current plant doesn't belong to new tier
          if (!tierPlants.includes(currentAppearance.plantType)) {
            newPlantType = getRandomPlantForTier(newTier);
            set((state) => ({
              plantAppearances: {
                ...state.plantAppearances,
                [friendId]: {
                  ...currentAppearance,
                  plantType: newPlantType!,
                },
              },
            }));
          }
        }

        syncWrite(async () => {
          await db.updateFriend(friendId, {
            tier: newTier,
            tier_history: newHistory,
          });
          if (newPlantType && currentAppearance) {
            const userId = await getCurrentUserId();
            if (userId) {
              await db.upsertPlantAppearance(userId, friendId, {
                plantType: newPlantType,
                potStyle: currentAppearance.potStyle,
                potColor: currentAppearance.potColor,
              });
            }
          }
        });
      },

      // ─────────────────────────────────────────────────────────────
      // INTERACTIONS
      // ─────────────────────────────────────────────────────────────

      logInteraction: (friendId, type, note, initiatedBy, date) => {
        const localId = generateId();
        const dateStr = (date || new Date()).toISOString();
        const interaction: Interaction = {
          id: localId,
          friendId,
          type,
          date: dateStr,
          note,
          initiatedBy,
        };

        set((state) => ({
          interactions: [...state.interactions, interaction],
        }));

        // Update friend's updatedAt
        get().updateFriend(friendId, {});

        // Sync to Supabase
        syncWrite(async () => {
          const userId = await getCurrentUserId();
          if (!userId) return;
          const remote = await db.logInteraction(userId, {
            friendId,
            type,
            date: dateStr,
            note,
            initiatedBy,
          });
          // Swap local ID with server ID
          set((state) => ({
            interactions: state.interactions.map((i) =>
              i.id === localId ? remote : i
            ),
          }));
        });

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

      deleteInteraction: (interactionId) => {
        set((state) => ({
          interactions: state.interactions.filter((i) => i.id !== interactionId),
        }));

        syncWrite(() => db.deleteInteraction(interactionId));
      },

      // ─────────────────────────────────────────────────────────────
      // DEMO MODE
      // ─────────────────────────────────────────────────────────────

      loadDemoData: () => {
        // Create demo garden if it doesn't exist
        let demoGarden = get().gardens.find((g) => g.isDemo);
        if (!demoGarden) {
          demoGarden = {
            id: generateId(),
            name: 'Demo Garden',
            icon: '🌸',
            isDemo: true,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            gardens: [...state.gardens, demoGarden!],
            currentGardenId: demoGarden!.id,
          }));
        } else {
          set({ currentGardenId: demoGarden.id });
        }

        const demoFriends = [
          { name: 'Maya Chen', tier: 1 as Tier, birthday: '1992-03-15' },
          { name: 'James Wilson', tier: 1 as Tier, birthday: '1990-07-22' },
          { name: 'Sofia Rodriguez', tier: 2 as Tier, birthday: '1994-11-08' },
          { name: 'Alex Kim', tier: 2 as Tier },
          { name: 'Emma Thompson', tier: 3 as Tier, birthday: '1991-02-14' },
          { name: 'Marcus Johnson', tier: 3 as Tier },
          { name: 'Priya Patel', tier: 4 as Tier },
          { name: 'Jordan Lee', tier: 4 as Tier },
          { name: 'Sam Rivera', tier: 5 as Tier },
          { name: 'Taylor Swift', tier: 5 as Tier },
        ];

        const interactionTypes: InteractionType[] = ['text', 'call', 'hangout', 'deep_convo', 'event', 'helped'];

        demoFriends.forEach((demo, index) => {
          const friend = get().addFriend(demo.name, demo.tier);
          if (!friend) return;

          // Add birthday if present
          if (demo.birthday) {
            get().updateFriend(friend.id, { birthday: demo.birthday });
          }

          // Add some interactions with varying recency based on tier
          const interactionCount = Math.max(1, 6 - demo.tier);
          for (let i = 0; i < interactionCount; i++) {
            const daysAgo = Math.floor(Math.random() * (demo.tier * 20)) + (index % 3 === 0 ? 30 : 0);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            const type = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
            get().logInteraction(friend.id, type, undefined, Math.random() > 0.5 ? 'me' : 'them', date);
          }
        });
      },

      clearAllData: () => {
        const { currentGardenId } = get();
        if (!currentGardenId) return;

        // Only clear data for current garden
        set((state) => ({
          friends: state.friends.filter((f) => f.gardenId !== currentGardenId),
          interactions: state.interactions.filter((i) => {
            const friend = state.friends.find((f) => f.id === i.friendId);
            return friend?.gardenId !== currentGardenId;
          }),
          plantAppearances: Object.fromEntries(
            Object.entries(state.plantAppearances).filter(([friendId]) => {
              const friend = state.friends.find((f) => f.id === friendId);
              return friend?.gardenId !== currentGardenId;
            })
          ),
        }));
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
        const { friends, interactions, currentGardenId } = get();
        const gardenFriends = currentGardenId
          ? friends.filter((f) => f.gardenId === currentGardenId)
          : friends;
        return gardenFriends.map((friend) => getFriendHealth(friend, interactions));
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

        const merged = { ...current, ...updates };

        set((state) => ({
          plantAppearances: {
            ...state.plantAppearances,
            [friendId]: merged,
          },
        }));

        syncWrite(async () => {
          const userId = await getCurrentUserId();
          if (!userId) return;
          await db.upsertPlantAppearance(userId, friendId, {
            plantType: merged.plantType,
            potStyle: merged.potStyle,
            potColor: merged.potColor,
          });
        });
      },

      // ─────────────────────────────────────────────────────────────
      // QUERIES (scoped to current garden)
      // ─────────────────────────────────────────────────────────────

      getFriendsByTier: (tier) => {
        const { friends, currentGardenId } = get();
        return friends.filter((f) => f.tier === tier && (!currentGardenId || f.gardenId === currentGardenId));
      },

      getFriendsNeedingAttention: () => {
        const { friends, currentGardenId } = get();
        const allHealth = get().getAllFriendsHealth();
        const needsAttention = allHealth
          .filter((h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling')
          .map((h) => h.friendId);

        return friends.filter((f) =>
          needsAttention.includes(f.id) &&
          (!currentGardenId || f.gardenId === currentGardenId)
        );
      },

      getUpcomingBirthdays: (days = 30) => {
        const { friends, currentGardenId } = get();
        const now = new Date();
        const thisYear = now.getFullYear();

        const gardenFriends = currentGardenId
          ? friends.filter((f) => f.gardenId === currentGardenId)
          : friends;

        return gardenFriends
          .filter((f) => {
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

      getCurrentGardenFriends: () => {
        const { friends, currentGardenId } = get();
        if (!currentGardenId) return [];
        return friends.filter((f) => f.gardenId === currentGardenId);
      },
    }),
    {
      name: 'tended-friends-storage',
    }
  )
);
