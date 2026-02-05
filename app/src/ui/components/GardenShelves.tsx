/**
 * GardenShelves - Plants organized by tier on wooden shelves
 * Extracted from FriendsPage for the room scene
 */

import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import { PlantOnShelf } from './PlantOnShelf';
import { TIER_LABELS, type Tier } from '../../core/models/types';
import './GardenShelves.css';

// Plant-themed tier descriptions
const TIER_PLANT_LABELS: Record<Tier, string> = {
  1: 'Tropicals',
  2: 'Houseplants',
  3: 'Everyday',
  4: 'Succulents',
  5: 'Cacti',
};

export function GardenShelves() {
  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const currentGarden = useFriendStore((state) => state.getCurrentGarden());
  const openPanel = useUIStore((state) => state.openPanel);

  const friends = getCurrentGardenFriends();
  const healthMetrics = getAllFriendsHealth();

  // Exclude plants that are in the "needs love" shelf
  const needsLoveIds = new Set(
    healthMetrics
      .filter((h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling')
      .map((h) => h.friendId)
  );

  const healthyFriends = friends.filter((f) => !needsLoveIds.has(f.id));

  // Group by tier
  const friendsByTier = healthyFriends.reduce((acc, friend) => {
    if (!acc[friend.tier]) acc[friend.tier] = [];
    acc[friend.tier].push(friend);
    return acc;
  }, {} as Record<Tier, typeof friends>);

  const activeTiers = ([1, 2, 3, 4, 5] as Tier[]).filter(
    (tier) => friendsByTier[tier]?.length > 0
  );

  // Empty state
  if (friends.length === 0) {
    return (
      <motion.div
        className="garden-shelves-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="empty-shelf-content">
          <div className="empty-illustration">
            <span className="big-seedling">🌱</span>
          </div>
          <h2>Your garden is empty</h2>
          <p>Add your first friend to start tending your relationships.</p>
          <motion.button
            className="btn btn-primary"
            onClick={() => openPanel('add')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Plant your first friend
          </motion.button>
        </div>
        <div className="shelf-surface" />
      </motion.div>
    );
  }

  return (
    <div className="garden-shelves">
      {/* Garden title */}
      <motion.div
        className="garden-title-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="garden-title">
          <h1>{currentGarden?.name || 'Your Garden'}</h1>
          <p className="plant-count">
            {friends.length} plant{friends.length === 1 ? '' : 's'} growing
          </p>
        </div>
      </motion.div>

      {/* Tier shelves */}
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
                    <PlantOnShelf friend={friend} health={health || null} />
                  </motion.div>
                );
              })}
            </div>
            <div className="shelf-surface" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
