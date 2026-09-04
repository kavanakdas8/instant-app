"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AlertCircle, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa6';

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email or username is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    setError('');

    // Simulate database lookup/validation delay
    setTimeout(() => {
      // Map email to potential user credentials
      const cleanUsername = email.includes('@')
        ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
        : email.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const loginSuccess = login(cleanUsername);

      if (loginSuccess) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push('/feed');
        }, 600);
      } else {
        setError(`No account found for "${email}". If you don't have an account, sign up below!`);
        setLoading(false);
      }
    }, 750);
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

      {/* Form Area */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-1.5 sm:p-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="rounded-[1.4rem] p-6 sm:p-8 bg-[#090A0F]/85 border border-white/[0.06]">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">Welcome back, explorer</h1>
            <p className="text-sm text-zinc-400 mt-1.5">Enter your credentials to access your trips, feed, and passport.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl font-medium flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Success! Entering Instants Feed...</span>
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
              <span className="flex-shrink mx-4 text-xs text-zinc-500 font-mono uppercase tracking-wider">or continue with email</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="alex@company.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="block w-full h-11 bg-white/[0.03] border border-white/10 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-10 transition-colors outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/[0.03] text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-0 accent-emerald-500 cursor-pointer" />
                <span className="text-xs text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-2 h-11 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in to Instants</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-400 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
