/**
 * SettingsPanel - App settings and garden management
 */

import { motion } from 'framer-motion';
import { useFriendStore } from '../../core/stores/friendStore';
import { useUIStore } from '../../core/stores/uiStore';
import './SettingsPanel.css';

export function SettingsPanel() {
  const currentGarden = useFriendStore((state) => state.getCurrentGarden());
  const loadDemoData = useFriendStore((state) => state.loadDemoData);
  const clearAllData = useFriendStore((state) => state.clearAllData);
  const closePanel = useUIStore((state) => state.closePanel);

  const handleLoadDemo = () => {
    loadDemoData();
    closePanel();
  };

  const handleClearGarden = () => {
    if (window.confirm('Are you sure you want to clear all friends from this garden?')) {
      clearAllData();
    }
  };

  return (
    <div className="settings-panel">
      <h2 className="panel-heading">Settings</h2>

      {/* Current Garden Info */}
      <section className="settings-section">
        <h3 className="section-title">Current Garden</h3>
        <div className="garden-info-card">
          <span className="garden-icon-large">{currentGarden?.icon || '🏠'}</span>
          <span className="garden-name-large">{currentGarden?.name || 'No garden'}</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="settings-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="settings-actions">
          <motion.button
            className="action-item"
            onClick={handleLoadDemo}
            whileHover={{ x: 4 }}
          >
            <span className="action-icon">🌸</span>
            <span className="action-text">
              <span className="action-label">Load Demo Garden</span>
              <span className="action-desc">Try out Tended with sample friends</span>
            </span>
          </motion.button>

          <motion.button
            className="action-item danger"
            onClick={handleClearGarden}
            whileHover={{ x: 4 }}
          >
            <span className="action-icon">🗑️</span>
            <span className="action-text">
              <span className="action-label">Clear This Garden</span>
              <span className="action-desc">Remove all friends from current garden</span>
            </span>
          </motion.button>
        </div>
      </section>

      {/* About */}
      <section className="settings-section">
        <h3 className="section-title">About Tended</h3>
        <p className="about-text">
          A private friendship management app that helps you nurture your relationships intentionally.
          Friends are represented as kawaii potted plants — tend to them, and they thrive.
        </p>
        <p className="version-text">Version 1.0.0</p>
      </section>
    </div>
  );
}
