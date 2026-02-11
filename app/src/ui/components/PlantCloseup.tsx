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
  type HealthStatus,
} from '../../core/models/types';
import './PlantCloseup.css';

interface PlantCloseupProps {
  friendId: string;
}

/** Calculate days until the next occurrence of a birthday */
function getDaysUntilBirthday(birthdayStr: string): number {
  const now = new Date();
  const [, month, day] = birthdayStr.split('-').map(Number);
  const thisYear = now.getFullYear();
  let next = new Date(thisYear, month - 1, day);
  // Zero out time for clean day comparison
  const today = new Date(thisYear, now.getMonth(), now.getDate());
  if (next < today) {
    next = new Date(thisYear + 1, month - 1, day);
  }
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Format a birthday string for display */
function formatBirthday(birthdayStr: string): string {
  const [, month, day] = birthdayStr.split('-').map(Number);
  const date = new Date(2000, month - 1, day); // year doesn't matter for display
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/** Build reach-out prompts based on friend name and health status */
function getReachOutPrompts(firstName: string, healthStatus: HealthStatus) {
  const prompts: Array<{ label: string; message: string; description: string }> = [
    {
      label: 'Quick check-in',
      message: `Hey ${firstName}! Just thinking about you. How's everything going?`,
      description: 'Simple and warm',
    },
    {
      label: 'Photo prompt',
      message: `We should do this again soon!`,
      description: `Dig up a photo with ${firstName} and send it`,
    },
  ];

  // Low-pressure reconnect only for cooling/at_risk/dormant
  const needsGentleTouch: HealthStatus[] = ['cooling', 'at_risk', 'dormant'];
  if (needsGentleTouch.includes(healthStatus)) {
    prompts.push({
      label: 'Low-pressure reconnect',
      message: `Hey ${firstName}, no need to reply right now \u2014 just wanted you to know I'm thinking of you.`,
      description: "No pressure, just warmth",
    });
  }

  return prompts;
}

export function PlantCloseup({ friendId }: PlantCloseupProps) {
  const [justLogged, setJustLogged] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [showReachOut, setShowReachOut] = useState(false);

  const getFriend = useFriendStore((state) => state.getFriend);
  const getPlantAppearance = useFriendStore((state) => state.getPlantAppearance);
  const getFriendHealth = useFriendStore((state) => state.getFriendHealth);
  const allInteractions = useFriendStore((state) => state.interactions);
  const logInteraction = useFriendStore((state) => state.logInteraction);
  const updateFriend = useFriendStore((state) => state.updateFriend);
  const closePlantCloseup = useUIStore((state) => state.closePlantCloseup);

  const friend = getFriend(friendId);
  const plantAppearance = getPlantAppearance(friendId);
  const health = getFriendHealth(friendId);
  const interactions = allInteractions
    .filter((i) => i.friendId === friendId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (!friend) return null;

  const handleQuickLog = (type: InteractionType) => {
    logInteraction(friend.id, type);
    setJustLogged(type);
    setTimeout(() => setJustLogged(null), 1500);
  };

  const handleAddNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    const existingNotes = friend.profile?.rawNotes || [];
    updateFriend(friend.id, {
      profile: {
        ...friend.profile,
        rawNotes: [...existingNotes, text],
      },
    });
    setNoteInput('');
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const expression = healthToExpression(health?.healthStatus || 'healthy');
  const healthStatus = health?.healthStatus || 'healthy';
  const firstName = friend.name.split(' ')[0];
  const reachOutPrompts = getReachOutPrompts(firstName, healthStatus);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the background, not on children
    if (e.target === e.currentTarget) {
      closePlantCloseup();
    }
  };

  return (
    <motion.div
      className="plant-closeup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackgroundClick}
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

      {/* Name card - top (includes birthday) */}
      <motion.div
        className="info-card name-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="friend-name">{friend.name}</h2>
        <span className="tier-badge">{TIER_LABELS[friend.tier]}</span>
        {friend.birthday && (
          <div className="birthday-row">
            <span className="birthday-icon">&#127874;</span>
            <span className="birthday-text">
              {formatBirthday(friend.birthday)}
              {' \u2014 '}
              {getDaysUntilBirthday(friend.birthday) === 0
                ? 'Today!'
                : `${getDaysUntilBirthday(friend.birthday)}d away`}
            </span>
          </div>
        )}
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

      {/* Reach-out prompts - Friendship Action Engine V1 */}
      <motion.div
        className="info-card reachout-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        {!showReachOut ? (
          <motion.button
            className="reachout-trigger"
            onClick={() => setShowReachOut(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="reachout-trigger-icon">&#128140;</span>
            Reach Out to {firstName}
          </motion.button>
        ) : (
          <>
            <div className="reachout-header">Not sure what to say?</div>
            <div className="reachout-subtext">
              Tap a prompt to open your messages
            </div>
            <div className="reachout-prompts">
              {reachOutPrompts.map((prompt) => (
                <div key={prompt.label} className="reachout-prompt">
                  <span className="reachout-prompt-label">{prompt.label}</span>
                  <span className="reachout-prompt-desc">{prompt.description}</span>
                  <span className="reachout-prompt-preview">&ldquo;{prompt.message}&rdquo;</span>
                  <div className="reachout-channels">
                    <a
                      className="channel-btn channel-sms"
                      href={`sms:?body=${encodeURIComponent(prompt.message)}`}
                    >
                      💬 Text
                    </a>
                    <a
                      className="channel-btn channel-whatsapp"
                      href={`https://wa.me/?text=${encodeURIComponent(prompt.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📱 WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="reachout-dismiss"
              onClick={() => setShowReachOut(false)}
            >
              Maybe later
            </button>
          </>
        )}
      </motion.div>

      {/* Notes section */}
      <motion.div
        className="info-card notes-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="notes-header">Notes</div>
        {friend.profile?.rawNotes && friend.profile.rawNotes.length > 0 ? (
          <ul className="notes-list">
            {friend.profile.rawNotes.map((note, i) => (
              <li key={i} className="notes-item">{note}</li>
            ))}
          </ul>
        ) : (
          <p className="notes-empty">No notes yet</p>
        )}
        <div className="notes-input-row">
          <input
            type="text"
            className="notes-input"
            placeholder="Add a note..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={handleNoteKeyDown}
          />
          <motion.button
            className="notes-add-btn"
            onClick={handleAddNote}
            disabled={!noteInput.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>
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
