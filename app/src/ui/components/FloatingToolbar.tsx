/**
 * FloatingToolbar - Bottom action bar for the room
 * Contains: Add Friend, Garden Switcher, Settings
 */

import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import './FloatingToolbar.css';

export function FloatingToolbar() {
  const currentGarden = useFriendStore((state) => state.getCurrentGarden());
  const openPanel = useUIStore((state) => state.openPanel);

  return (
    <motion.div
      className="floating-toolbar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.button
        className="toolbar-btn add-btn"
        onClick={() => openPanel('add')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="btn-icon">+</span>
        <span className="btn-label">Add Friend</span>
      </motion.button>

      <motion.button
        className="toolbar-btn garden-btn"
        onClick={() => openPanel('gardens')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="garden-icon">{currentGarden?.icon || '🏠'}</span>
        <span className="garden-name">{currentGarden?.name || 'Select Garden'}</span>
        <span className="dropdown-arrow">▾</span>
      </motion.button>

      <motion.button
        className="toolbar-btn icon-btn"
        onClick={() => openPanel('settings')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
