/**
 * GardenSwitcherPanel - Side panel for switching/managing gardens
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import './GardenSwitcherPanel.css';

export function GardenSwitcherPanel() {
  const [showNewGarden, setShowNewGarden] = useState(false);
  const [newGardenName, setNewGardenName] = useState('');

  const gardens = useFriendStore((state) => state.gardens);
  const currentGardenId = useFriendStore((state) => state.currentGardenId);
  const switchGarden = useFriendStore((state) => state.switchGarden);
  const createGarden = useFriendStore((state) => state.createGarden);
  const loadDemoData = useFriendStore((state) => state.loadDemoData);
  const closePanel = useUIStore((state) => state.closePanel);

  const handleCreateGarden = () => {
    if (newGardenName.trim()) {
      const garden = createGarden(newGardenName.trim());
      switchGarden(garden.id);
      setNewGardenName('');
      setShowNewGarden(false);
      closePanel();
    }
  };

  const handleSwitchGarden = (gardenId: string) => {
    switchGarden(gardenId);
    closePanel();
  };

  const handleLoadDemo = () => {
    loadDemoData();
    closePanel();
  };

  return (
    <div className="garden-switcher-panel">
      <h2 className="panel-heading">Your Gardens</h2>
      <p className="panel-subtext">Switch between your friend collections</p>

      <div className="garden-list">
        {gardens.map((garden, index) => (
          <motion.button
            key={garden.id}
            className={`garden-item ${garden.id === currentGardenId ? 'active' : ''}`}
            onClick={() => handleSwitchGarden(garden.id)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="garden-icon">{garden.icon}</span>
            <span className="garden-info">
              <span className="garden-name">{garden.name}</span>
              {garden.isDemo && <span className="demo-badge">Demo</span>}
            </span>
            {garden.id === currentGardenId && (
              <span className="active-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Create new garden */}
      {showNewGarden ? (
        <motion.div
          className="new-garden-form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <input
            type="text"
            placeholder="Garden name..."
            value={newGardenName}
            onChange={(e) => setNewGardenName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateGarden()}
            autoFocus
            className="text-input"
          />
          <div className="new-garden-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowNewGarden(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateGarden}
              disabled={!newGardenName.trim()}
            >
              Create
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          className="garden-item new-garden-btn"
          onClick={() => setShowNewGarden(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="garden-icon">+</span>
          <span className="garden-name">New garden...</span>
        </motion.button>
      )}

      {/* Demo garden helper */}
      {gardens.length === 0 && (
        <div className="demo-helper">
          <p>New here? Try the demo garden to see how Tended works.</p>
          <button className="btn btn-primary" onClick={handleLoadDemo}>
            Load demo garden
          </button>
        </div>
      )}
    </div>
  );
}
