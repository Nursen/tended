import { Link } from 'react-router-dom';
import type { Friend, FriendHealthMetrics, HealthStatus } from '../../core/models/types';
import { getLastContactDescription } from '../../core/services/healthService';
import { Plant, healthToExpression } from './Plant';
import { useFriendStore } from '../../core/stores/friendStore';
import './PlantCard.css';

interface PlantCardProps {
  friend: Friend;
  health: FriendHealthMetrics | null;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_COLORS: Record<HealthStatus, string> = {
  thriving: 'var(--color-health-thriving)',
  healthy: 'var(--color-health-healthy)',
  cooling: 'var(--color-health-cooling)',
  at_risk: 'var(--color-health-at-risk)',
  dormant: 'var(--color-health-dormant)',
};

export function PlantCard({ friend, health, size = 'md' }: PlantCardProps) {
  const status = health?.healthStatus || 'healthy';
  const plantAppearance = useFriendStore((state) => state.getPlantAppearance(friend.id));
  const expression = healthToExpression(status);

  return (
    <Link to={`/friends/${friend.id}`} className={`plant-card plant-card-${size}`}>
      <div className="plant-visual">
        <Plant
          plantType={plantAppearance?.plantType || 'monstera'}
          expression={expression}
          size={size}
          animate={true}
        />
      </div>
      <div className="plant-info">
        <span className="plant-name">{friend.name}</span>
        {health && (
          <span className="plant-status" style={{ color: STATUS_COLORS[status] }}>
            {health.daysSinceLastContact < 0
              ? 'New friend'
              : getLastContactDescription(health.daysSinceLastContact)}
          </span>
        )}
      </div>
    </Link>
  );
}
