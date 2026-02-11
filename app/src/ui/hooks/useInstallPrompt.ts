/**
 * useInstallPrompt — encapsulates PWA install prompt logic
 *
 * Why a hook: The beforeinstallprompt event must be captured early and
 * stored. This hook wires up the listener on mount and exposes a clean
 * API for components to trigger the native prompt or check platform.
 */

import { useEffect, useState, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallPromptState {
  /** True when app is already running as installed PWA */
  isStandalone: boolean;
  /** True on iOS Safari (needs manual install instructions) */
  isIOS: boolean;
  /** True when we have a native install prompt available (Android/desktop Chrome) */
  canPromptNative: boolean;
  /** Trigger the native install prompt. Returns true if user accepted. */
  promptInstall: () => Promise<boolean>;
  /** Whether the one-time prompt screen was already shown */
  wasPromptShown: boolean;
  /** Mark the one-time prompt as shown */
  markPromptShown: () => void;
  /** Whether the banner was dismissed */
  wasBannerDismissed: boolean;
  /** Dismiss the banner permanently */
  dismissBanner: () => void;
}

const PROMPT_KEY = 'tended-install-prompted';
const BANNER_KEY = 'tended-install-banner-dismissed';

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS standalone check
    ('standalone' in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

function getIsIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export function useInstallPrompt(): InstallPromptState {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canPromptNative, setCanPromptNative] = useState(false);
  const [wasPromptShown, setWasPromptShown] = useState(
    () => localStorage.getItem(PROMPT_KEY) === 'true'
  );
  const [wasBannerDismissed, setWasBannerDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === 'true'
  );

  const isStandalone = getIsStandalone();
  const isIOS = getIsIOS();

  // Capture the beforeinstallprompt event (Android/desktop Chrome)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setCanPromptNative(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt.current) return false;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setCanPromptNative(false);
    return outcome === 'accepted';
  }, []);

  const markPromptShown = useCallback(() => {
    localStorage.setItem(PROMPT_KEY, 'true');
    setWasPromptShown(true);
  }, []);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(BANNER_KEY, 'true');
    setWasBannerDismissed(true);
  }, []);

  return {
    isStandalone,
    isIOS,
    canPromptNative,
    promptInstall,
    wasPromptShown,
    markPromptShown,
    wasBannerDismissed,
    dismissBanner,
  };
}
