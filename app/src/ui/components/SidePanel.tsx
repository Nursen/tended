/**
 * SidePanel - Generic sliding panel from the right
 * Used for Add Friend, Settings, Garden Switcher
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './SidePanel.css';

interface SidePanelProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

export function SidePanel({ children, onClose, title }: SidePanelProps) {
  return (
    <motion.div
      className="side-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="panel-header">
        {title && <h2 className="panel-title">{title}</h2>}
        <button
          className="panel-close"
          onClick={onClose}
          aria-label="Close panel"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </motion.div>
  );
}
