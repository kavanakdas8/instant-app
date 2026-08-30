"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Eye, EyeOff, Lock, Mail, UserPlus, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const STORY_CIRCLES = [
  {
    id: 's1',
    url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[20%] left-[15%] w-20 h-20 rounded-full border-2 border-white/40 shadow-xl animate-float-1',
    delay: '0s'
  },
  {
    id: 's2',
    url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[10%] right-[20%] w-24 h-24 rounded-full border-2 border-white/30 shadow-xl animate-float-2',
    delay: '1.2s'
  },
  {
    id: 's3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    className: 'absolute bottom-[20%] left-[22%] w-28 h-28 rounded-full border-4 border-white/50 shadow-2xl animate-float-3',
    delay: '2.5s'
  },
  {
    id: 's4',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=150&q=80',
    className: 'absolute bottom-[15%] right-[15%] w-16 h-16 rounded-full border-2 border-white/20 shadow-xl animate-float-4',
    delay: '3.8s'
  },
  {
    id: 's5',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-accent-pink/50 shadow-2xl animate-float-1',
    delay: '0.5s'
  }
];

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState('');
  const [noAccountFound, setNoAccountFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemos, setShowDemos] = useState(false);

  // Set initial theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('instants-auth-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('instants-auth-theme', nextTheme);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email or username is required');
      setNoAccountFound(false);
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      setNoAccountFound(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setNoAccountFound(false);
      return;
    }

    setLoading(true);
    setError('');
    setNoAccountFound(false);

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
        setNoAccountFound(true);
        setError(`No account found for "${email}". If you don't have an account, sign up below!`);
        setLoading(false);
      }
    }, 750);
  };

  const handleDemoLogin = (demoName: string) => {
    setLoading(true);
    setError('');
    setNoAccountFound(false);
    setTimeout(() => {
      login(demoName);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/feed');
      }, 500);
    }, 600);
  };

  // Color mapping variables based on theme state
  const isLight = theme === 'light';
  const bgColor = isLight ? 'bg-slate-50' : 'bg-slate-950';
  const cardBg = isLight ? 'bg-white border-slate-200 shadow-slate-100' : 'bg-slate-900 border-slate-800 shadow-none';
  const textColor = isLight ? 'text-slate-900' : 'text-zinc-100';
  const subTextColor = isLight ? 'text-slate-500' : 'text-zinc-400';
  const inputBg = isLight ? 'bg-slate-50' : 'bg-slate-950';
  const inputBorder = isLight ? 'border-slate-200 focus:border-slate-400 focus:ring-slate-200' : 'border-slate-800 focus:border-slate-600 focus:ring-slate-800';
  const btnColor = isLight ? 'bg-[#1E293B] hover:bg-slate-800 text-white' : 'bg-white hover:bg-zinc-100 text-slate-950';
  const dividerBorder = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`flex-grow flex flex-col lg:flex-row min-h-screen ${bgColor} ${textColor} transition-colors duration-300 font-sans`}>

      {/* Theme Toggle Floating Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-50 p-2.5 rounded-full border shadow-sm transition-all duration-300 ${isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        aria-label="Toggle Theme"
      >
        {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* LEFT COLUMN: Reskinned Brand Image Area with Story Circle Art */}
      <div className="w-full lg:w-[45%] xl:w-[45%] min-h-[320px] lg:min-h-screen bg-slate-950 bg-gradient-to-br from-indigo-950 via-slate-900 to-[#FF2E93]/20 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">

        {/* Brand Logo & Name */}
        <div className="flex items-center z-10 space-x-2">
          <Logo className="w-8 h-8 text-white drop-shadow-md" />
          <span className="text-lg font-black tracking-wider uppercase text-white">Instants</span>
        </div>

        {/* Dynamic Story Circles Composition (Floating circles in the center) */}
        <div className="relative w-full h-[260px] lg:h-[400px] flex items-center justify-center my-6 z-10">
          {STORY_CIRCLES.map((circle) => (
            <div
              key={circle.id}
              className={`${circle.className} overflow-hidden bg-cover bg-center cursor-pointer transition-all duration-500 hover:scale-[1.1] hover:border-accent-cyan/80`}
              style={{
                backgroundImage: `url(${circle.url})`,
                animationDelay: circle.delay
              }}
            >
              {/* Semi-transparent blur overlay ring inside circle */}
              <div className="w-full h-full bg-black/5 hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>

        {/* Visual Brand Text */}
        <div className="z-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Start sharing real life on Instants.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-sm leading-relaxed">
            Create candid logs, invite your closest friends, and join travel vibes that match yours.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* RIGHT COLUMN: Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-screen">

        <div className={`w-full max-w-[440px] p-6 sm:p-10 rounded-3xl border shadow-md ${cardBg} transition-all duration-300 flex flex-col justify-between`}>

          <div>
            {/* Top Branding Section */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-base font-black tracking-wider uppercase">Instants</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20 font-bold">
                Account Sign In
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Welcome back
              </h1>
              <p className={`text-xs ${subTextColor} leading-relaxed`}>
                Sign in to your account. If you don't have one yet, you can sign up in seconds.
              </p>
            </div>

            {/* Form Area */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error / Account not found banner */}
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl font-medium space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  {noAccountFound && (
                    <Link
                      href={`/signup?email=${encodeURIComponent(email)}`}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-95 text-black font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-[0.98]"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create Account with this Email →</span>
                    </Link>
                  )}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl font-medium flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Success! Entering Instants Feed...</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="text"
                    placeholder="example@email.com or username"
                    value={email}
                    disabled={loading || success}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                      setNoAccountFound(false);
                    }}
                    className={`block w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className={`block text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    Password
                  </label>
                  <Link href="#" className="text-[10px] font-semibold text-accent-pink hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    disabled={loading || success}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                      setNoAccountFound(false);
                    }}
                    className={`block w-full pl-10 pr-10 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 shadow-sm ${btnColor} ${loading ? 'opacity-80 cursor-wait' : ''}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="mt-5">
              <div className="relative flex py-1.5 items-center">
                <div className={`flex-grow border-t ${dividerBorder}`}></div>
                <span className={`flex-shrink mx-4 text-[9px] uppercase font-bold tracking-widest ${subTextColor}`}>
                  Or quick test login
                </span>
                <div className={`flex-grow border-t ${dividerBorder}`}></div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('alice_adventures')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                    }`}
                >
                  <span className="text-xs font-semibold">Alice (Admin)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('emma_in_europe')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                    }`}
                >
                  <span className="text-xs font-semibold">Emma (Traveler)</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Access Toggle */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowDemos(!showDemos)}
                className={`text-xs font-semibold underline ${subTextColor} hover:text-slate-400 transition-colors`}
              >
                {showDemos ? 'Hide All Test Accounts' : 'Show All Test Accounts'}
              </button>

              {showDemos && (
                <div className={`mt-3 p-3.5 rounded-xl border text-left space-y-2 transition-all duration-300 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Select any pre-configured user:</p>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('alice_adventures')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                      }`}
                  >
                    <span>Alice Cooper</span>
                    <span className="font-mono text-[9px] text-accent-pink">@alice_adventures</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('emma_in_europe')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                      }`}
                  >
                    <span>Emma Watson</span>
                    <span className="font-mono text-[9px] text-accent-cyan">@emma_in_europe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('kento_tokyo')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                      }`}
                  >
                    <span>Kento Sato</span>
                    <span className="font-mono text-[9px] text-purple-400">@kento_tokyo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('bob_travels')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                      }`}
                  >
                    <span>Bob Vance</span>
                    <span className="font-mono text-[9px] text-emerald-400">@bob_travels</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Signup Redirect & Copyright */}
          <div className="mt-8 text-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs mb-3 font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-accent-cyan hover:underline ml-1">
                Sign up
              </Link>
            </p>
            <p className={`text-[10px] font-medium tracking-wide ${subTextColor}`}>
              © 2026 Instants App
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
