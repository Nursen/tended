/**
 * PlantOnShelf - Clickable plant card that opens PlantCloseup
 * Replaces PlantCard's Link with onClick for room scene
 */

import { motion } from 'framer-motion';
import type { Friend, FriendHealthMetrics, HealthStatus } from '../../core/models/types';
import { getLastContactDescription } from '../../core/services/healthService';
import { Plant, healthToExpression } from './Plant';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import './PlantOnShelf.css';

interface PlantOnShelfProps {
  friend: Friend;
  health: FriendHealthMetrics | null;
}

const STATUS_COLORS: Record<HealthStatus, string> = {
  thriving: 'var(--color-health-thriving)',
  healthy: 'var(--color-health-healthy)',
  cooling: 'var(--color-health-cooling)',
  at_risk: 'var(--color-health-at-risk)',
  dormant: 'var(--color-health-dormant)',
};

export function PlantOnShelf({ friend, health }: PlantOnShelfProps) {
  const status = health?.healthStatus || 'healthy';
  const plantAppearance = useFriendStore((state) => state.getPlantAppearance(friend.id));
  const openPlantCloseup = useUIStore((state) => state.openPlantCloseup);

  const expression = healthToExpression(status);

  return (
    <motion.button
      className="plant-on-shelf"
      onClick={() => openPlantCloseup(friend.id)}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      layoutId={`plant-${friend.id}`}
    >
      <div className="plant-visual">
        <Plant
          plantType={plantAppearance?.plantType || 'monstera'}
          expression={expression}
          size="md"
          animate={true}
        />
      </div>
      <div className="plant-info">
        <span className="plant-name">{friend.name.split(' ')[0]}</span>
        {health && (
          <span className="plant-status" style={{ color: STATUS_COLORS[status] }}>
            {health.daysSinceLastContact < 0
              ? 'New'
              : getLastContactDescription(health.daysSinceLastContact)}
          </span>
        )}
      </div>
    </motion.button>
  );
}
