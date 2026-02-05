/**
 * AddFriendPanel - Side panel for adding a new friend
 * Converted from AddFriendModal
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import type { Tier } from '../../core/models/types';
import './AddFriendPanel.css';

const TIER_OPTIONS: { value: Tier; label: string; description: string }[] = [
  { value: 1, label: 'Inner Circle', description: 'Your closest friends' },
  { value: 2, label: 'Close Friends', description: 'Regular, meaningful contact' },
  { value: 3, label: 'Good Friends', description: 'Monthly check-ins' },
  { value: 4, label: 'Friends', description: 'Quarterly contact' },
  { value: 5, label: 'Acquaintances', description: 'Occasional touchpoints' },
];

export function AddFriendPanel() {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier>(3);

  const addFriend = useFriendStore((state) => state.addFriend);
  const closePanel = useUIStore((state) => state.closePanel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFriend(name.trim(), tier);
    setName('');
    setTier(3);
    closePanel();
  };

  return (
    <div className="add-friend-panel">
      <h2 className="panel-heading">Add a friend</h2>
      <p className="panel-subtext">Plant a new friend in your garden</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their name"
            autoFocus
            className="text-input"
          />
        </div>

        <div className="form-group">
          <label>Relationship tier</label>
          <div className="tier-options">
            {TIER_OPTIONS.map((option, index) => (
              <motion.label
                key={option.value}
                className={`tier-option ${tier === option.value ? 'selected' : ''}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <input
                  type="radio"
                  name="tier"
                  value={option.value}
                  checked={tier === option.value}
                  onChange={() => setTier(option.value)}
                />
                <span className="tier-label">{option.label}</span>
                <span className="tier-desc">{option.description}</span>
              </motion.label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={closePanel}>
            Cancel
          </button>
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={!name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Plant friend
          </motion.button>
        </div>
      </form>
    </div>
  );
}
