import { useEffect, useState } from 'react';
import { RoomScene } from './ui/components/RoomScene';
import { AuthScreen } from './ui/components/AuthScreen';
import { OnboardingFlow } from './ui/components/OnboardingFlow';
import { AuthProvider, useAuth } from './core/services/auth';
import { isSupabaseConfigured } from './core/services/supabase';
import { useFriendStore } from './core/stores/friendStore';
import './ui/styles/tokens.css';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const friends = useFriendStore((s) => s.friends);
  const isLoading = useFriendStore((s) => s.isLoading);
  const syncFromSupabase = useFriendStore((s) => s.syncFromSupabase);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Sync data from Supabase when user logs in
  useEffect(() => {
    if (user?.id) {
      syncFromSupabase(user.id);
    }
  }, [user?.id, syncFromSupabase]);

  // If Supabase is not configured, skip auth — run in local-only mode
  if (!isSupabaseConfigured()) {
    return <RoomScene />;
  }

  // Auth loading state
  if (authLoading || isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--color-background)',
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          color: 'var(--color-text-muted)',
        }}
      >
        Loading...
      </div>
    );
  }

  // Not authenticated — show login/signup
  if (!user) {
    return <AuthScreen />;
  }

  // Authenticated but no friends yet — show onboarding
  if (friends.length === 0 && !onboardingComplete) {
    return <OnboardingFlow onComplete={() => setOnboardingComplete(true)} />;
  }

  // Main app
  return <RoomScene />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
