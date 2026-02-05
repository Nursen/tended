import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { PlantCard } from '../components/PlantCard';
import { AddFriendModal } from '../components/AddFriendModal';
import { CozyBackground } from '../components/CozyBackground';
import { BulletinBoard } from '../components/BulletinBoard';
import { NeedsLoveShelf } from '../components/NeedsLoveShelf';
import { TIER_LABELS, type Tier } from '../../core/models/types';
import './FriendsPage.css';

// Plant-themed tier descriptions for the room
const TIER_PLANT_LABELS: Record<Tier, string> = {
  1: 'Tropicals',
  2: 'Houseplants',
  3: 'Everyday',
  4: 'Succulents',
  5: 'Cacti',
};

export function FriendsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const currentGarden = useFriendStore((state) => state.getCurrentGarden());

  const friends = getCurrentGardenFriends();
  const healthMetrics = getAllFriendsHealth();

  // Check if any friends need attention (for showing NeedsLoveShelf)
  const hasNeedsLove = healthMetrics.some(
    (h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling'
  );

  // Group friends by tier (excluding those in "needs love")
  const needsLoveIds = new Set(
    healthMetrics
      .filter((h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling')
      .map((h) => h.friendId)
  );

  const healthyFriends = friends.filter((f) => !needsLoveIds.has(f.id));

  const friendsByTier = healthyFriends.reduce((acc, friend) => {
    if (!acc[friend.tier]) acc[friend.tier] = [];
    acc[friend.tier].push(friend);
    return acc;
  }, {} as Record<Tier, typeof friends>);

  const activeTiers = ([1, 2, 3, 4, 5] as Tier[]).filter(
    (tier) => friendsByTier[tier]?.length > 0
  );

  return (
    <div className="friends-page">
      <CozyBackground />

      {/* Room layout */}
      <div className="room-layout">
        {/* Left side - Bulletin board */}
        <aside className="room-left">
          <BulletinBoard />
        </aside>

        {/* Center - Main content */}
        <main className="room-center">
          <motion.header
            className="garden-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="garden-title">
              <h1>{currentGarden?.name || 'Your Garden'}</h1>
              <p className="subtitle">
                {friends.length} plant{friends.length === 1 ? '' : 's'} growing
              </p>
            </div>
            <motion.button
              className="btn btn-primary add-btn"
              onClick={() => setIsAddModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Add Friend
            </motion.button>
          </motion.header>

          {/* Needs Love Shelf - only shows if there are plants needing attention */}
          {hasNeedsLove && <NeedsLoveShelf />}

          {friends.length === 0 ? (
            <motion.div
              className="empty-garden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="empty-shelf">
                <div className="shelf-surface"></div>
                <p className="empty-text">Your shelves are empty...</p>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => setIsAddModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Plant your first friend
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="garden-shelves">
              {activeTiers.map((tier, tierIndex) => (
                <motion.div
                  key={tier}
                  className="shelf-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + tierIndex * 0.1 }}
                >
                  <div className="shelf-label">
                    <span className="tier-name">{TIER_LABELS[tier]}</span>
                    <span className="tier-desc">{TIER_PLANT_LABELS[tier]}</span>
                  </div>
                  <div className="shelf">
                    <div className="plants-on-shelf">
                      {friendsByTier[tier].map((friend, friendIndex) => {
                        const health = healthMetrics.find((h) => h.friendId === friend.id);
                        return (
                          <motion.div
                            key={friend.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + tierIndex * 0.1 + friendIndex * 0.05 }}
                          >
                            <PlantCard
                              friend={friend}
                              health={health || null}
                              size="lg"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="shelf-surface"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* Right side - Window area (handled by CozyBackground) */}
        <aside className="room-right">
          {/* Window is rendered in CozyBackground */}
        </aside>
      </div>

      <AddFriendModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
