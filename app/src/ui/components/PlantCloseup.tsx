/**
 * PlantCloseup - Zoomed plant view with floating info cards
 * Opens when clicking a plant on the shelf
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import { Plant, healthToExpression } from './Plant';
import { getLastContactDescription } from '../../core/services/healthService';
import {
  TIER_LABELS,
  INTERACTION_LABELS,
  INTERACTION_ICONS,
  type InteractionType,
} from '../../core/models/types';
import './PlantCloseup.css';

interface PlantCloseupProps {
  friendId: string;
}

export function PlantCloseup({ friendId }: PlantCloseupProps) {
  const [justLogged, setJustLogged] = useState<string | null>(null);

  const friend = useFriendStore((state) => state.getFriend(friendId));
  const plantAppearance = useFriendStore((state) => state.getPlantAppearance(friendId));
  const health = useFriendStore((state) => state.getFriendHealth(friendId));
  const interactions = useFriendStore((state) =>
    state.interactions
      .filter((i) => i.friendId === friendId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  );
  const logInteraction = useFriendStore((state) => state.logInteraction);
  const closePlantCloseup = useUIStore((state) => state.closePlantCloseup);

  if (!friend) return null;

  const handleQuickLog = (type: InteractionType) => {
    logInteraction(friend.id, type);
    setJustLogged(type);
    setTimeout(() => setJustLogged(null), 1500);
  };

  const expression = healthToExpression(health?.healthStatus || 'healthy');

  return (
    <motion.div
      className="plant-closeup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <motion.button
        className="closeup-close"
        onClick={closePlantCloseup}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Main plant - zoomed */}
      <motion.div
        className="closeup-plant"
        layoutId={`plant-${friendId}`}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Plant
          plantType={plantAppearance?.plantType || 'monstera'}
          expression={expression}
          size="lg"
          animate={true}
        />
      </motion.div>

      {/* Name card - top */}
      <motion.div
        className="info-card name-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="friend-name">{friend.name}</h2>
        <span className="tier-badge">{TIER_LABELS[friend.tier]}</span>
      </motion.div>

      {/* Status card - left */}
      <motion.div
        className="info-card status-card"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="status-label">Last connected</div>
        <div className="status-value">
          {health?.daysSinceLastContact === undefined || health.daysSinceLastContact < 0
            ? 'Not yet'
            : getLastContactDescription(health.daysSinceLastContact)}
        </div>
      </motion.div>

      {/* Quick actions - bottom */}
      <motion.div
        className="info-card actions-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {justLogged && (
          <motion.div
            className="log-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Logged {INTERACTION_LABELS[justLogged as InteractionType].toLowerCase()}!
          </motion.div>
        )}
        <div className="quick-actions">
          {(['text', 'call', 'hangout', 'deep_convo'] as InteractionType[]).map((type) => (
            <motion.button
              key={type}
              className={`action-btn ${justLogged === type ? 'just-logged' : ''}`}
              onClick={() => handleQuickLog(type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={INTERACTION_LABELS[type]}
            >
              <span className="action-icon">{INTERACTION_ICONS[type]}</span>
            </motion.button>
          ))}
        </div>
        <p className="actions-hint">Tap to log an interaction</p>
      </motion.div>

      {/* Recent history - right */}
      {interactions.length > 0 && (
        <motion.div
          className="info-card history-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="history-label">Recent</div>
          <ul className="history-list">
            {interactions.map((interaction) => (
              <li key={interaction.id} className="history-item">
                <span className="history-icon">{INTERACTION_ICONS[interaction.type]}</span>
                <span className="history-date">
                  {new Date(interaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
