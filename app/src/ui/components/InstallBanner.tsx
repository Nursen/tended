/**
 * InstallBanner — persistent thin banner at top of RoomScene
 *
 * Only visible when:
 * - Not in standalone mode (not already installed)
 * - The one-time prompt was already shown (don't double-nag)
 * - User hasn't dismissed this banner
 */

import { motion } from 'framer-motion';
import type { InstallPromptState } from '../hooks/useInstallPrompt';
import '../styles/InstallPrompt.css';

interface InstallBannerProps {
  install: InstallPromptState;
}

export function InstallBanner({ install }: InstallBannerProps) {
  const {
    isStandalone,
    isIOS,
    canPromptNative,
    promptInstall,
    wasPromptShown,
    wasBannerDismissed,
    dismissBanner,
  } = install;

  // Don't render if already installed, prompt not shown yet, or dismissed
  if (isStandalone || !wasPromptShown || wasBannerDismissed) {
    return null;
  }

  const handleInstall = async () => {
    if (canPromptNative) {
      await promptInstall();
      dismissBanner();
    }
    // For iOS/manual: the text is enough guidance, dismiss on action
  };

  return (
    <motion.div
      className="install-banner"
      initial={{ opacity: 0, y: -32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="install-banner-text">
        Add to home screen for notifications
      </span>

      {canPromptNative && (
        <button className="install-banner-action" onClick={handleInstall}>
          Install
        </button>
      )}

      {isIOS && (
        <span className="install-banner-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Tap Share then "Add to Home Screen"
        </span>
      )}

      <button
        className="install-banner-dismiss"
        onClick={dismissBanner}
        aria-label="Dismiss install banner"
      >
        x
      </button>
    </motion.div>
  );
}
