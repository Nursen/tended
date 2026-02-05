import { useState } from 'react';
import { useFriendStore } from '../../core/stores/friendStore';
import { PlantCard } from '../components/PlantCard';
import { AddFriendModal } from '../components/AddFriendModal';
import { CozyBackground } from '../components/CozyBackground';
import type { Tier } from '../../core/models/types';
import './FriendsPage.css';

const TIER_LABELS: Record<Tier, string> = {
  1: 'Inner Circle',
  2: 'Close Friends',
  3: 'Good Friends',
  4: 'Friends',
  5: 'Acquaintances',
};

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  1: 'High-maintenance tropicals',
  2: 'Expressive houseplants',
  3: 'Forgiving everyday plants',
  4: 'Low-maintenance succulents',
  5: 'Neglect-tolerant cacti',
};

export function FriendsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);

  const friends = getCurrentGardenFriends();

  const healthMetrics = getAllFriendsHealth();

  // Group friends by tier
  const friendsByTier = friends.reduce((acc, friend) => {
    if (!acc[friend.tier]) acc[friend.tier] = [];
    acc[friend.tier].push(friend);
    return acc;
  }, {} as Record<Tier, typeof friends>);

  // Get tiers that have friends
  const activeTiers = ([1, 2, 3, 4, 5] as Tier[]).filter(
    (tier) => friendsByTier[tier]?.length > 0
  );

  return (
    <div className="friends-page">
      <CozyBackground />
      <header className="garden-header">
        <div className="garden-title">
          <h1>Your Garden</h1>
          <p className="subtitle">
            {friends.length} plant{friends.length === 1 ? '' : 's'} growing
          </p>
        </div>
        <button className="btn btn-primary add-btn" onClick={() => setIsAddModalOpen(true)}>
          + Add Friend
        </button>
      </header>

      {friends.length === 0 ? (
        <div className="empty-garden">
          <div className="empty-shelf">
            <div className="shelf-surface"></div>
            <p className="empty-text">Your shelves are empty...</p>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
              Plant your first friend
            </button>
          </div>
        </div>
      ) : (
        <div className="garden-shelves">
          {activeTiers.map((tier) => (
            <div key={tier} className="shelf-row">
              <div className="shelf-label">
                <span className="tier-name">{TIER_LABELS[tier]}</span>
                <span className="tier-desc">{TIER_DESCRIPTIONS[tier]}</span>
              </div>
              <div className="shelf">
                <div className="plants-on-shelf">
                  {friendsByTier[tier].map((friend) => {
                    const health = healthMetrics.find((h) => h.friendId === friend.id);
                    return (
                      <PlantCard
                        key={friend.id}
                        friend={friend}
                        health={health || null}
                        size="lg"
                      />
                    );
                  })}
                </div>
                <div className="shelf-surface"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFriendModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
