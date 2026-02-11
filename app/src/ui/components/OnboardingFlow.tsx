/**
 * OnboardingFlow — new user welcome + add first friends
 * Three steps, completable in under 2 minutes.
 * Saves each friend to Supabase as they're added.
 */

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { TIER_LABELS, type Tier } from '../../core/models/types';
import '../styles/OnboardingFlow.css';

// Plant emoji per tier for visual delight during onboarding
const TIER_PLANT_EMOJI: Record<Tier, string> = {
  1: '🌺',
  2: '🌿',
  3: '🌱',
  4: '🪴',
  5: '🌵',
};

interface OnboardingProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier>(2);
  const [addedFriends, setAddedFriends] = useState<
    Array<{ name: string; tier: Tier }>
  >([]);

  const addFriend = useFriendStore((s) => s.addFriend);
  const createGarden = useFriendStore((s) => s.createGarden);
  const gardens = useFriendStore((s) => s.gardens);

  const handleAddFriend = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Ensure a garden exists
    if (gardens.length === 0) {
      createGarden('My Garden', '🏠');
    }

    const friend = addFriend(name.trim(), tier);
    if (friend) {
      setAddedFriends((prev) => [...prev, { name: name.trim(), tier }]);
      setName('');
      setTier(2);
    }
  };

  return (
    <div className="onboarding">
      {/* Progress dots */}
      <div className="onboarding-progress">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`onboarding-dot ${s === step ? 'active' : ''}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Welcome */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="onboarding-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="onboarding-icon">🌱</span>
            <h2 className="onboarding-title">Welcome to Tended!</h2>
            <p className="onboarding-desc">
              Tended helps you nurture your friendships like a garden. Each
              friend becomes a plant — the closer the friendship, the more it
              blooms. Tend to them regularly, and watch your garden thrive.
            </p>
            <button className="onboarding-cta" onClick={() => setStep(2)}>
              Let's get started
            </button>
          </motion.div>
        )}

        {/* STEP 2: Add friends */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="onboarding-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="onboarding-icon">🪴</span>
            <h2 className="onboarding-title">Plant your first friends</h2>
            <p className="onboarding-desc">
              Add a few friends to start your garden. Pick how close they are —
              your inner circle gets the biggest plants!
            </p>

            <form className="onboarding-add-form" onSubmit={handleAddFriend}>
              <input
                className="onboarding-name-input"
                type="text"
                placeholder="Friend's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button
                className="onboarding-add-btn"
                type="submit"
                disabled={!name.trim()}
              >
                Add
              </button>
            </form>

            <div className="onboarding-tier-row">
              <span className="onboarding-tier-label">Closeness:</span>
              <select
                className="onboarding-tier-select"
                value={tier}
                onChange={(e) => setTier(Number(e.target.value) as Tier)}
              >
                {([1, 2, 3, 4, 5] as Tier[]).map((t) => (
                  <option key={t} value={t}>
                    {TIER_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            {addedFriends.length > 0 && (
              <div className="onboarding-friends-list">
                {addedFriends.map((f, i) => (
                  <motion.div
                    key={i}
                    className="onboarding-friend-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="onboarding-friend-plant">
                      {TIER_PLANT_EMOJI[f.tier]}
                    </span>
                    <span className="onboarding-friend-name">{f.name}</span>
                    <span className="onboarding-friend-tier">
                      {TIER_LABELS[f.tier]}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            <button
              className="onboarding-cta"
              onClick={() => setStep(3)}
              disabled={addedFriends.length === 0}
            >
              {addedFriends.length >= 3
                ? 'See your garden'
                : `Add ${3 - addedFriends.length} more to continue`}
            </button>

            {addedFriends.length > 0 && addedFriends.length < 3 && (
              <button className="onboarding-skip" onClick={() => setStep(3)}>
                Skip — I'll add more later
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 3: Garden ready */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="onboarding-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="onboarding-icon">🌸</span>
            <h2 className="onboarding-title">Your garden is growing!</h2>
            <p className="onboarding-desc">
              You've planted {addedFriends.length} friend
              {addedFriends.length !== 1 ? 's' : ''}. Tap on any plant to see
              their profile, log interactions, and watch them grow. The more you
              tend to a friendship, the more it blooms.
            </p>
            <button className="onboarding-cta" onClick={onComplete}>
              Enter your garden
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
