"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const { signup } = useApp();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    const success = signup(name, username, bio);
    if (success) {
      router.push('/feed');
    } else {
      setError('Signup failed');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-black select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-tr from-accent-pink to-accent-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-accent-pink/20">
          <Sparkles className="w-7 h-7 text-black stroke-[2]" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-black tracking-tight text-white">
          Create an account
        </h2>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Join the visual travel log and find your next crew.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass p-6 rounded-2xl shadow-xl border border-zinc-900">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Alice Cooper"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="block w-full px-3 py-2.5 bg-[#080808] border border-zinc-900 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 transition-all"
              />
            </div>

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
            </div>

            <div>
              <label htmlFor="bio" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Bio (optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={2}
                placeholder="Tell us where you are traveling next..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="block w-full px-3 py-2.5 bg-[#080808] border border-zinc-900 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 transition-all resize-none"
              />
            </div>

            {error && (
              <p className="mt-1 text-xs text-accent-pink font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent-cyan hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
