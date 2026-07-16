'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Mail, Lock, ArrowRight } from 'lucide-react';

const DEMO_EMAIL = 'demo@dayspace.app';
const DEMO_PASSWORD = 'dayspace123';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [stage, setStage] = useState<'login' | 'welcome' | 'exit'>('login');

  useEffect(() => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (email.trim() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Invalid email or password. Try the demo credentials.');
      setShakeKey((k) => k + 1);
      return;
    }

    setStage('welcome');
    setTimeout(() => {
      setStage('exit');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 1800);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-page-bg p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] items-center justify-center">
        {/* Login card */}
        <div
          className={`w-full max-w-sm transition-all duration-500 ${
            stage !== 'login' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <div className="rounded-[28px] bg-surface px-8 py-10 shadow-sm ring-1 ring-black/5">
            <div className="mb-8 flex flex-col items-center text-center">
              <LayoutDashboard size={32} className="text-accent" />
              <span className="mt-2 text-lg font-semibold uppercase tracking-[0.15em] text-ink">
                DAYSPACE
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-transparent py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div key={shakeKey} className={`${error ? 'animate-shake' : ''}`}>
                <button
                  type="submit"
                  className="btn-base group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  Log In
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
                {error && (
                  <p className="mt-2 text-center text-xs text-highlight">
                    {error}
                  </p>
                )}
              </div>
            </form>

            <p className="mt-6 text-center text-[11px] text-muted">
              Demo credentials are pre-filled — just hit Log In.
            </p>
          </div>
        </div>
      </div>

      {/* Welcome overlay */}
      {stage !== 'login' && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-page-bg ${
            stage === 'welcome'
              ? 'animate-welcome-enter'
              : 'animate-welcome-exit'
          }`}
        >
          <p className="animate-welcome-text px-6 text-center font-fraunces text-2xl font-medium text-ink md:text-3xl lg:text-4xl">
            This workspace belongs to you, use as you wish.
          </p>
        </div>
      )}
    </div>
  );
}
