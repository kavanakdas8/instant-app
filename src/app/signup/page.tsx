"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Camera, ArrowRight, Check, AlertCircle, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import Logo from '@/components/Logo';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
];

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
  const { signup, globalTheme } = useApp();

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States
  const theme = globalTheme === 'light' ? 'light' : 'dark';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set initial theme preference
  useEffect(() => {
    // Handled globally
  }, []);

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

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

  // Color mapping variables based on theme state
  const isLight = theme === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-[#000000]';
  const cardBg = isLight ? 'bg-white border-black/20 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-none';
  const textColor = isLight ? 'text-slate-900' : 'text-zinc-100';
  const subTextColor = isLight ? 'text-slate-500' : 'text-zinc-400';
  const inputBg = isLight ? 'bg-slate-50' : 'bg-slate-950';
  const inputBorder = isLight
    ? 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
    : 'border-slate-800 focus:border-purple-600 focus:ring-purple-950';
  const labelColor = isLight ? 'text-slate-600' : 'text-zinc-400';
  const dividerBorder = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`relative flex items-center justify-center min-h-screen p-6 sm:p-10 lg:p-16 ${bgColor} ${textColor} transition-colors duration-300 font-sans`}>
      
      {/* Coastal Background Image & Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
          alt="Moody coastal cliffs at twilight"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0B0F19]/80 to-black/90 pointer-events-none" />
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
      <div className="relative z-10 w-full flex justify-center">
        <div className={`w-full max-w-[480px] p-6 sm:p-8 rounded-3xl shadow-md bg-[#050508] border border-white/10 transition-all duration-300`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">Create Account</h1>
                <p className={`text-xs ${subTextColor}`}>Fill in details to set up your candid profile.</p>
              </div>
            </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Row (Side by side) */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="firstName" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe (optional)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-95 active:scale-[0.98] text-black text-sm font-bold rounded-xl shadow-lg shadow-accent-pink/20 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Signup</span>
                      <Check className="w-4 h-4 ml-1 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account */}
              <div className="mt-6 text-center text-xs font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-accent-cyan hover:underline ml-1">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
