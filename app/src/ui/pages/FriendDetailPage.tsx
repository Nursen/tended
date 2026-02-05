import { useParams, useNavigate } from 'react-router-dom';
import { useFriendStore } from '../../core/stores/friendStore';
import { getLastContactDescription } from '../../core/services/healthService';
import { Plant, healthToExpression } from '../components/Plant';
import type { Tier, InteractionType } from '../../core/models/types';
import './FriendDetailPage.css';

const TIER_LABELS: Record<Tier, string> = {
  1: 'Inner Circle',
  2: 'Close Friends',
  3: 'Good Friends',
  4: 'Friends',
  5: 'Acquaintances',
};

const INTERACTION_LABELS: Record<InteractionType, string> = {
  text: 'Text',
  call: 'Call',
  hangout: 'Hangout',
  event: 'Event',
  deep_convo: 'Deep Convo',
  helped: 'Helped',
  group_hangout: 'Group Hangout',
};

export function FriendDetailPage() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();

  const getFriend = useFriendStore((state) => state.getFriend);
  const getFriendHealth = useFriendStore((state) => state.getFriendHealth);
  const getInteractionsForFriend = useFriendStore((state) => state.getInteractionsForFriend);
  const getPlantAppearance = useFriendStore((state) => state.getPlantAppearance);
  const logInteraction = useFriendStore((state) => state.logInteraction);

  const friend = friendId ? getFriend(friendId) : undefined;
  const health = friendId ? getFriendHealth(friendId) : null;
  const interactions = friendId ? getInteractionsForFriend(friendId) : [];
  const plantAppearance = friendId ? getPlantAppearance(friendId) : null;

  if (!friend) {
    return (
      <div className="not-found">
        <h2>Friend not found</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/friends')}>
          Back to garden
        </button>
      </div>
    );
  }

  const handleQuickLog = (type: InteractionType) => {
    logInteraction(friend.id, type);
  };

  return (
    <div className="friend-detail-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <header className="friend-header">
        <div className="friend-plant">
          <Plant
            plantType={plantAppearance?.plantType || 'monstera'}
            expression={healthToExpression(health?.healthStatus || 'healthy')}
            size="lg"
            animate={true}
          />
        </div>
        <div className="friend-info">
          <h1>{friend.name}</h1>
          <span className="tier-badge">{TIER_LABELS[friend.tier]}</span>
          {health && (
            <p className="last-contact">
              {health.daysSinceLastContact < 0
                ? 'No contact logged yet'
                : getLastContactDescription(health.daysSinceLastContact)}
            </p>
          )}
        </div>
      </header>

      <section className="quick-log section">
        <h3>Log an interaction</h3>
        <div className="quick-log-buttons">
          {(['text', 'call', 'hangout', 'deep_convo'] as InteractionType[]).map((type) => (
            <button
              key={type}
              className="btn btn-secondary"
              onClick={() => handleQuickLog(type)}
            >
              {INTERACTION_LABELS[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="history section">
        <h3>Recent history</h3>
        {interactions.length > 0 ? (
          <ul className="interaction-list">
            {interactions.slice(0, 10).map((interaction) => (
              <li key={interaction.id} className="interaction-item">
                <span className="interaction-type">
                  {INTERACTION_LABELS[interaction.type]}
                </span>
                <span className="interaction-date">
                  {new Date(interaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {interaction.note && (
                  <p className="interaction-note">{interaction.note}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-history">No interactions logged yet.</p>
        )}
      </section>
    </div>
  );
}
