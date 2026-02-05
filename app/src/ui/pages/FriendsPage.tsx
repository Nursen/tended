import { useState } from 'react';
import { useFriendStore } from '../../core/stores/friendStore';
import { PlantCard } from '../components/PlantCard';
import { AddFriendModal } from '../components/AddFriendModal';
import type { Tier } from '../../core/models/types';
import './FriendsPage.css';

const TIER_LABELS: Record<Tier, string> = {
  1: 'Inner Circle',
  2: 'Close Friends',
  3: 'Good Friends',
  4: 'Friends',
  5: 'Acquaintances',
};

export function FriendsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all');

  const friends = useFriendStore((state) => state.friends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);

  const healthMetrics = getAllFriendsHealth();

  const filteredFriends = filterTier === 'all'
    ? friends
    : friends.filter((f) => f.tier === filterTier);

  return (
    <div className="friends-page">
      <header className="page-header">
        <div>
          <h1>Your Garden</h1>
          <p className="subtitle">
            {friends.length} friend{friends.length === 1 ? '' : 's'} in your garden
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add Friend
        </button>
      </header>

      <div className="filters">
        <button
          className={`filter-chip ${filterTier === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTier('all')}
        >
          All
        </button>
        {([1, 2, 3, 4, 5] as Tier[]).map((tier) => (
          <button
            key={tier}
            className={`filter-chip ${filterTier === tier ? 'active' : ''}`}
            onClick={() => setFilterTier(tier)}
          >
            {TIER_LABELS[tier]}
          </button>
        ))}
      </div>

      {filteredFriends.length > 0 ? (
        <div className="plant-grid">
          {filteredFriends.map((friend) => {
            const health = healthMetrics.find((h) => h.friendId === friend.id);
            return <PlantCard key={friend.id} friend={friend} health={health || null} />;
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-illustration">🌿</div>
          <h3>No friends here yet</h3>
          <p>
            {filterTier === 'all'
              ? 'Add your first friend to start growing your garden.'
              : `No friends in ${TIER_LABELS[filterTier as Tier]} yet.`}
          </p>
        </div>
      )}

      <AddFriendModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
