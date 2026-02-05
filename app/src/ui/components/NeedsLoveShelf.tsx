import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import { Plant, healthToExpression } from './Plant';
import './NeedsLoveShelf.css';

export function NeedsLoveShelf() {
  const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
  const getAllFriendsHealth = useFriendStore((state) => state.getAllFriendsHealth);
  const plantAppearances = useFriendStore((state) => state.plantAppearances);
  const openPlantCloseup = useUIStore((state) => state.openPlantCloseup);

  const friends = getCurrentGardenFriends();
  const healthMetrics = getAllFriendsHealth();

  const [isWatering, setIsWatering] = useState(false);
  const [wateredPlant, setWateredPlant] = useState<string | null>(null);

  // Get plants that need attention - with proper type narrowing
  const needsLove = healthMetrics
    .filter((h) => h.healthStatus === 'at_risk' || h.healthStatus === 'cooling')
    .map((h) => {
      const friend = friends.find((f) => f.id === h.friendId);
      const appearance = plantAppearances[h.friendId];
      if (!friend || !appearance) return null;
      return { health: h, friend, appearance };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 4);

  const handleWater = (friendId: string) => {
    setIsWatering(true);
    setWateredPlant(friendId);

    // Open plant closeup after animation
    setTimeout(() => {
      openPlantCloseup(friendId);
      setIsWatering(false);
      setWateredPlant(null);
    }, 800);
  };

  if (needsLove.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="needs-love-shelf"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="shelf-label-vertical">
        <span>Needs Love</span>
        <span className="label-heart">💔</span>
      </div>

      <div className="love-shelf-content">
        {/* Watering can */}
        <motion.div
          className="watering-can"
          animate={isWatering ? {
            rotate: [-10, -45, -45, -10],
            x: [0, 20, 20, 0],
          } : {}}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <svg viewBox="0 0 48 48" className="watering-can-svg">
            {/* Can body */}
            <ellipse cx="24" cy="32" rx="14" ry="10" fill="#64B5F6" />
            <rect x="10" y="22" width="28" height="12" rx="2" fill="#64B5F6" />
            {/* Handle */}
            <path d="M8,18 Q8,12 16,12 L16,16 Q12,16 12,20" stroke="#42A5F5" strokeWidth="3" fill="none" />
            {/* Spout */}
            <path d="M38,24 L48,18 L48,22 L40,26" fill="#42A5F5" />
            {/* Shine */}
            <ellipse cx="18" cy="28" rx="3" ry="4" fill="#90CAF9" opacity="0.6" />
          </svg>

          {/* Water drops when watering */}
          <AnimatePresence>
            {isWatering && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="water-drop"
                    initial={{ opacity: 1, y: 0, x: 30 + i * 5 }}
                    animate={{ opacity: 0, y: 60 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Plants on the shelf */}
        <div className="wilting-plants">
          {needsLove.map(({ friend, health, appearance }, index) => (
            <motion.div
              key={friend.id}
              className={`wilting-plant ${wateredPlant === friend.id ? 'being-watered' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleWater(friend.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Wilting effect - plant droops */}
              <motion.div
                className="plant-wrapper"
                animate={{
                  rotate: health.healthStatus === 'at_risk' ? [-3, -5, -3] : [-1, -2, -1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
              >
                <Plant
                  plantType={appearance.plantType}
                  expression={healthToExpression(health.healthStatus)}
                  size="sm"
                  animate={true}
                />
              </motion.div>

              {/* Name tag */}
              <div className="plant-name-tag">
                {friend.name.split(' ')[0]}
              </div>

              {/* Days indicator */}
              <motion.div
                className="days-badge"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {health.daysSinceLastContact}d
              </motion.div>

              {/* Water sparkle effect when watered */}
              <AnimatePresence>
                {wateredPlant === friend!.id && (
                  <motion.div
                    className="water-sparkle"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    ✨
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Shelf surface */}
        <div className="love-shelf-surface">
          <div className="shelf-wood" />
        </div>
      </div>

      {/* Hover hint */}
      <motion.div
        className="shelf-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click a plant to check in
      </motion.div>
    </motion.div>
  );
}
