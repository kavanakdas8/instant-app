"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    const success = login(username);
    if (success) {
      router.push('/feed');
    } else {
      setError('Login failed');
    }
  };

  const handleQuickLogin = (demoUser: string) => {
    login(demoUser);
    router.push('/feed');
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-black select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
        {/* Glowing visual logo container */}
        <div className="w-14 h-14 bg-gradient-to-tr from-accent-pink to-accent-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-accent-pink/20 hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-7 h-7 text-black stroke-[2]" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-black tracking-tight text-white">
          Welcome back to Instants
        </h2>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Share your vibe. Log in to explore travel communities.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass p-6 rounded-2xl shadow-xl border border-zinc-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600 font-mono text-sm">
                  @
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="alice_adventures"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="block w-full pl-8 pr-3 py-2.5 bg-[#080808] border border-zinc-900 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 transition-all font-mono"
                />
              </div>
              {error && (
                <p className="mt-1 text-xs text-accent-pink font-semibold">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>Enter Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accs Divider */}
          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-900"></div>
              <span className="flex-shrink mx-4 text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Demo Accounts</span>
              <div className="flex-grow border-t border-zinc-900"></div>
            </div>

            <div className="mt-3 space-y-2">
              <button
                onClick={() => handleQuickLogin('alice_adventures')}
                className="w-full flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80')] bg-cover" />
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Alice Cooper (Admin)</p>
                    <p className="text-[10px] text-zinc-500 font-mono">@alice_adventures</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-accent-cyan" />
              </button>

              <button
                onClick={() => handleQuickLogin('emma_in_europe')}
                className="w-full flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80')] bg-cover" />
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Emma Watson (Traveler)</p>
                    <p className="text-[10px] text-zinc-500 font-mono">@emma_in_europe</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-accent-pink" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          New to Instants?{' '}
          <Link href="/signup" className="font-semibold text-accent-cyan hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
