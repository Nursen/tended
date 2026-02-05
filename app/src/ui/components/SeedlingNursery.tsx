/**
 * SeedlingNursery - Special area for new connections and seedlings
 * Shows tier-5 friends and recently added friends as seedlings
 */

import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import { Plant, healthToExpression } from './Plant';
import './SeedlingNursery.css';

export function SeedlingNursery() {
  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const plantAppearances = useFriendStore((state) => state.plantAppearances);
  const openPlantCloseup = useUIStore((state) => state.openPlantCloseup);

  const friends = getCurrentGardenFriends();
  const healthMetrics = getAllFriendsHealth();

  // Get seedlings: tier 5 friends OR friends added in the last 14 days
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const seedlings = friends
    .filter((f) => {
      const isNewFriend = new Date(f.createdAt) > twoWeeksAgo;
      const isTier5 = f.tier === 5;
      return isNewFriend || isTier5;
    })
    .map((friend) => {
      const health = healthMetrics.find((h) => h.friendId === friend.id);
      const appearance = plantAppearances[friend.id];
      if (!appearance) return null;
      const isNew = new Date(friend.createdAt) > twoWeeksAgo;
      return { friend, health, appearance, isNew };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 6);

  if (seedlings.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="seedling-nursery"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="nursery-header">
        <div className="nursery-label">
          <span className="nursery-icon">🌱</span>
          <span className="nursery-title">Nursery</span>
        </div>
        <span className="nursery-hint">New connections growing roots</span>
      </div>

      <div className="nursery-tray">
        <div className="seedling-grid">
          {seedlings.map(({ friend, health, isNew }, index) => (
            <motion.button
              key={friend.id}
              className="seedling-cell"
              onClick={() => openPlantCloseup(friend.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Soil in cell */}
              <div className="seedling-soil" />

              {/* The seedling plant */}
              <motion.div
                className="seedling-plant"
                animate={{
                  rotate: [-2, 2, -2],
                  y: [0, -2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + index * 0.3,
                  ease: 'easeInOut',
                }}
              >
                <Plant
                  plantType="seedling"
                  expression={healthToExpression(health?.healthStatus || 'healthy')}
                  size="sm"
                  animate={true}
                />
              </motion.div>

              {/* Name tag */}
              <div className="seedling-name">{friend.name.split(' ')[0]}</div>

              {/* New badge */}
              {isNew && (
                <motion.div
                  className="new-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                >
                  New!
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Tray edge */}
        <div className="tray-edge" />
      </div>

      <p className="nursery-tip">
        Early care helps new friendships take root
      </p>
    </motion.div>
  );
}
