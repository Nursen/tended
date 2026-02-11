/**
 * InstallPrompt — one-time full-screen "add to home screen" prompt
 *
 * Shown once after onboarding completes. Detects iOS vs Android
 * and shows the appropriate install flow. Skips entirely if the
 * user already has the app installed (standalone mode).
 */

import { motion } from 'framer-motion';
import type { InstallPromptState } from '../hooks/useInstallPrompt';
import '../styles/InstallPrompt.css';

interface InstallPromptProps {
  install: InstallPromptState;
  onContinue: () => void;
}

/** Inline SVG for the iOS share icon -- avoids an asset dependency */
function IOSShareIcon() {
  return (
    <span className="install-prompt-share-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </span>
  );
}

function IOSInstructions() {
  return (
    <div className="install-prompt-steps">
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">1</span>
        <span className="install-prompt-step-text">
          Tap the <strong>Share</strong> button <IOSShareIcon /> at the bottom of Safari
        </span>
      </div>
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">2</span>
        <span className="install-prompt-step-text">
          Scroll down and tap <strong>"Add to Home Screen"</strong>
        </span>
      </div>
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">3</span>
        <span className="install-prompt-step-text">
          Tap <strong>"Add"</strong> in the top right
        </span>
      </div>
    </div>
  );
}

function AndroidInstructions() {
  return (
    <div className="install-prompt-steps">
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">1</span>
        <span className="install-prompt-step-text">
          Tap the <strong>menu</strong> (three dots) in Chrome
        </span>
      </div>
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">2</span>
        <span className="install-prompt-step-text">
          Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>
        </span>
      </div>
      <div className="install-prompt-step">
        <span className="install-prompt-step-number">3</span>
        <span className="install-prompt-step-text">
          Tap <strong>"Install"</strong> to confirm
        </span>
      </div>
    </div>
  );
}

export function InstallPrompt({ install, onContinue }: InstallPromptProps) {
  const { isIOS, canPromptNative, promptInstall, markPromptShown } = install;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    // Whether they accepted or dismissed, we move on
    markPromptShown();
    if (accepted) {
      // Small delay so the install animation can finish
      setTimeout(onContinue, 500);
    } else {
      onContinue();
    }
  };

  const handleSkip = () => {
    markPromptShown();
    onContinue();
  };

  return (
    <div className="install-prompt">
      <motion.div
        className="install-prompt-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="install-prompt-icon" role="img" aria-label="plant in phone">
          🪴
        </span>
        <h2 className="install-prompt-title">Get Tended on your phone</h2>
        <p className="install-prompt-desc">
          Add Tended to your home screen for the best experience
          — notifications, offline access, and it feels like a real app.
        </p>

        {/* iOS: show manual steps */}
        {isIOS && <IOSInstructions />}

        {/* Android/Chrome with native prompt available */}
        {canPromptNative && (
          <button className="install-prompt-cta" onClick={handleInstall}>
            Install Tended
          </button>
        )}

        {/* Android without native prompt: show manual steps */}
        {!isIOS && !canPromptNative && <AndroidInstructions />}

        <button className="install-prompt-skip" onClick={handleSkip}>
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
