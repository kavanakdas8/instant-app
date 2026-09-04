"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AlertCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa6';

function SignupParamsHandler({
  onEmailFound
}: {
  onEmailFound: (email: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      onEmailFound(emailParam);
    }
  }, [searchParams, onEmailFound]);
  return null;
}

export default function Signup() {
  const router = useRouter();
  const { signup } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setError('First name is required'); return; }
    if (!email.trim()) { setError('Email address is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    setError('');

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const baseUsername = email.includes('@')
      ? email.split('@')[0]
      : `${firstName}_${lastName || 'traveler'}`;
    const cleanUsername = baseUsername.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now()}`;
    const bioText = 'New adventurer sharing real life on Instants. 🌍✨';
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    setTimeout(() => {
      const success = signup(fullName, cleanUsername, bioText, defaultAvatar);
      setLoading(false);
      if (success) {
        router.push('/feed');
      } else {
        setError('Registration failed. Please try again.');
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 z-10 font-sans text-white bg-black">
      {/* Coastal Background Image & Overlay */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Moody coastal cliffs"
          className="h-full w-full object-cover object-center select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/70 to-black/90 backdrop-blur-[2px] pointer-events-none" />
      </div>

      <Suspense fallback={null}>
        <SignupParamsHandler
          onEmailFound={(emailVal) => {
            setEmail(emailVal);
            if (emailVal.includes('@')) {
              const namePart = emailVal.split('@')[0].split('.')[0];
              if (namePart && !firstName) {
                setFirstName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
              }
            }
          }}
        />
      </Suspense>

      {/* Form Area */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-1.5 sm:p-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="rounded-[1.4rem] p-6 sm:p-8 bg-[#090A0F]/85 border border-white/[0.06]">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Create your travel passport</h1>
            <p className="text-sm text-zinc-400 mt-1.5">Join thousands of travelers sharing live moments and joining group trips.</p>
          </div>

          <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3.5">
              <button type="button" className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                <FaGoogle className="w-4 h-4" />
                <span>Google</span>
              </button>
              <button type="button" className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                <FaApple className="w-4 h-4" />
                <span>Apple</span>
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs text-zinc-500 font-mono uppercase tracking-wider">or sign up with email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="firstName" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full h-11 bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full h-11 bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full h-11 bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full h-11 bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Get started for free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
