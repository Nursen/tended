/**
 * AuthScreen — login/signup for Tended
 * Clean, warm, on-brand. Toggle between sign in and create account.
 */

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../core/services/auth';
import '../styles/AuthScreen.css';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (authError) {
      setError(authError);
    }
  };

  return (
    <div className="auth-screen">
      <motion.div
        className="auth-brand"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="auth-brand-icon" role="img" aria-label="plant">
          🌱
        </span>
        <h1 className="auth-brand-name">Tended</h1>
        <p className="auth-brand-tagline">Nurture your friendships</p>
      </motion.div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="auth-title">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading
              ? 'Loading...'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          <span className="auth-toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            className="auth-toggle-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
