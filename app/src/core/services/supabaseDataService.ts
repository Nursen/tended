/**
 * Supabase data service
 * Mirrors the friendStore interface but persists to Supabase.
 * All functions take userId for RLS — the server enforces access,
 * but we pass it for the insert rows.
 */

import { supabase } from './supabase';
import type {
  Friend,
  Interaction,
  InteractionType,
  InitiatedBy,
  Tier,
  FriendRole,
  PlantAppearance,
  Garden,
} from '../models/types';

// ─────────────────────────────────────────────────────────────
// HELPERS — map between app types and DB rows
// ─────────────────────────────────────────────────────────────

function gardenFromRow(row: Record<string, unknown>): Garden {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || undefined,
    icon: row.icon as string,
    isDemo: row.is_demo as boolean,
    createdAt: row.created_at as string,
  };
}

function friendFromRow(row: Record<string, unknown>): Friend {
  return {
    id: row.id as string,
    gardenId: row.garden_id as string,
    name: row.name as string,
    photo: (row.photo as string) || undefined,
    tier: row.tier as Tier,
    roles: (row.roles as FriendRole[]) || [],
    location: (row.location_city as string)
      ? { city: row.location_city as string, region: (row.location_region as string) || undefined }
      : undefined,
    birthday: (row.birthday as string) || undefined,
    importantDates: (row.important_dates as Friend['importantDates']) || undefined,
    profile: (row.profile_data as Friend['profile']) || undefined,
    tierHistory: ((row.tier_history as unknown[]) || []).map((th: unknown) => {
      const entry = th as Record<string, unknown>;
      return {
        tier: entry.tier as Tier,
        date: entry.date as string,
        reason: (entry.reason as string) || undefined,
      };
    }),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function interactionFromRow(row: Record<string, unknown>): Interaction {
  return {
    id: row.id as string,
    friendId: row.friend_id as string,
    type: row.type as InteractionType,
    date: row.date as string,
    note: (row.note as string) || undefined,
    initiatedBy: (row.initiated_by as InitiatedBy) || undefined,
  };
}

function plantAppearanceFromRow(row: Record<string, unknown>): PlantAppearance {
  return {
    friendId: row.friend_id as string,
    plantType: row.plant_type as PlantAppearance['plantType'],
    potStyle: row.pot_style as PlantAppearance['potStyle'],
    potColor: row.pot_color as PlantAppearance['potColor'],
  };
}

// ─────────────────────────────────────────────────────────────
// GARDENS
// ─────────────────────────────────────────────────────────────

export async function fetchGardens(userId: string): Promise<Garden[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gardens')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return (data || []).map(gardenFromRow);
}

export async function createGarden(
  userId: string,
  garden: { name: string; icon?: string; description?: string; isDemo?: boolean }
): Promise<Garden> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('gardens')
    .insert({
      user_id: userId,
      name: garden.name,
      icon: garden.icon || '🏠',
      description: garden.description || null,
      is_demo: garden.isDemo || false,
    })
    .select()
    .single();
  if (error) throw error;
  return gardenFromRow(data);
}

export async function updateGarden(
  gardenId: string,
  updates: { name?: string; icon?: string; description?: string }
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('gardens')
    .update(updates)
    .eq('id', gardenId);
  if (error) throw error;
}

export async function deleteGarden(gardenId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('gardens').delete().eq('id', gardenId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────
// FRIENDS
// ─────────────────────────────────────────────────────────────

export async function fetchFriends(userId: string): Promise<Friend[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return (data || []).map(friendFromRow);
}

export async function addFriend(
  userId: string,
  friend: {
    gardenId: string;
    name: string;
    tier: Tier;
    roles?: FriendRole[];
    birthday?: string;
  }
): Promise<Friend> {
  if (!supabase) throw new Error('Supabase not configured');
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('friends')
    .insert({
      user_id: userId,
      garden_id: friend.gardenId,
      name: friend.name,
      tier: friend.tier,
      roles: friend.roles || [],
      birthday: friend.birthday || null,
      tier_history: [{ tier: friend.tier, date: now }],
    })
    .select()
    .single();
  if (error) throw error;
  return friendFromRow(data);
}

export async function updateFriend(
  friendId: string,
  updates: Partial<{
    name: string;
    tier: number;
    roles: string[];
    photo: string;
    location_city: string;
    location_region: string;
    birthday: string;
    important_dates: unknown;
    profile_data: unknown;
    tier_history: unknown[];
  }>
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('friends')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', friendId);
  if (error) throw error;
}

export async function removeFriend(friendId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('friends').delete().eq('id', friendId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────
// INTERACTIONS
// ─────────────────────────────────────────────────────────────

export async function fetchInteractions(userId: string): Promise<Interaction[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(interactionFromRow);
}

export async function logInteraction(
  userId: string,
  interaction: {
    friendId: string;
    type: InteractionType;
    date?: string;
    note?: string;
    initiatedBy?: InitiatedBy;
  }
): Promise<Interaction> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('interactions')
    .insert({
      user_id: userId,
      friend_id: interaction.friendId,
      type: interaction.type,
      date: interaction.date || new Date().toISOString(),
      note: interaction.note || null,
      initiated_by: interaction.initiatedBy || null,
    })
    .select()
    .single();
  if (error) throw error;
  return interactionFromRow(data);
}

export async function deleteInteraction(interactionId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('interactions')
    .delete()
    .eq('id', interactionId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────
// PLANT APPEARANCES
// ─────────────────────────────────────────────────────────────

export async function fetchPlantAppearances(
  userId: string
): Promise<Record<string, PlantAppearance>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('plant_appearances')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  const result: Record<string, PlantAppearance> = {};
  for (const row of data || []) {
    const pa = plantAppearanceFromRow(row);
    result[pa.friendId] = pa;
  }
  return result;
}

export async function upsertPlantAppearance(
  userId: string,
  friendId: string,
  appearance: { plantType: string; potStyle: string; potColor: string }
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('plant_appearances')
    .upsert(
      {
        user_id: userId,
        friend_id: friendId,
        plant_type: appearance.plantType,
        pot_style: appearance.potStyle,
        pot_color: appearance.potColor,
      },
      { onConflict: 'friend_id' }
    );
  if (error) throw error;
}
