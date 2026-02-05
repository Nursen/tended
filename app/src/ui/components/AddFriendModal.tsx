import { useState } from 'react';
import { useFriendStore } from '../../core/stores/friendStore';
import type { Tier } from '../../core/models/types';
import './AddFriendModal.css';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIER_OPTIONS: { value: Tier; label: string; description: string }[] = [
  { value: 1, label: 'Inner Circle', description: 'Your closest friends' },
  { value: 2, label: 'Close Friends', description: 'Regular, meaningful contact' },
  { value: 3, label: 'Good Friends', description: 'Monthly check-ins' },
  { value: 4, label: 'Friends', description: 'Quarterly contact' },
  { value: 5, label: 'Acquaintances', description: 'Occasional touchpoints' },
];

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier>(3);

  const addFriend = useFriendStore((state) => state.addFriend);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFriend(name.trim(), tier);
    setName('');
    setTier(3);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <header className="modal-header">
          <h2>Add a friend</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

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
            />
          </div>

          <div className="form-group">
            <label>Relationship tier</label>
            <div className="tier-options">
              {TIER_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`tier-option ${tier === option.value ? 'selected' : ''}`}
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
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              Plant friend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
