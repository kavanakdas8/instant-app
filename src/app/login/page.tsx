"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Eye, EyeOff, Lock, Mail, Camera } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState('');
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
      setError('Email is required');
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

    // Simulate database lookup/validation delay
    setTimeout(() => {
      // Map email to potential user credentials
      const cleanUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      const loginSuccess = login(cleanUsername);

      if (loginSuccess) {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push('/feed');
        }, 800);
      } else {
        setError('Login failed. Please verify credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = (demoName: string) => {
    setLoading(true);
    setTimeout(() => {
      login(demoName);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/feed');
      }, 500);
    }, 800);
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
    <div className={`flex-grow flex flex-col justify-center items-center min-h-screen ${bgColor} ${textColor} transition-colors duration-300 font-sans p-4 sm:p-6 relative`}>
      
      {/* Theme Toggle Floating Button */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-50 p-2.5 rounded-full border shadow-sm transition-all duration-300 ${
          isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
        }`}
        aria-label="Toggle Theme"
      >
        {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Center Auth Card */}
      <div className={`w-full max-w-[440px] p-6 sm:p-10 rounded-3xl border shadow-md ${cardBg} transition-all duration-300 flex flex-col justify-between`}>
        
        <div>
          {/* Top Branding Section */}
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-pink to-accent-cyan flex items-center justify-center shadow-md">
              <Camera className="w-4.5 h-4.5 text-black stroke-[2.2]" />
            </div>
            <span className="text-base font-black tracking-wider uppercase">Instants</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Welcome to Instants! 👋
            </h1>
            <p className={`text-xs ${subTextColor} leading-relaxed`}>
              Your community is waiting. Sign in to share and discover real-life moments.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-xl font-medium">
                Success! Entering Instants Feed...
              </div>
            )}

            <div>
              <label htmlFor="email" className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  disabled={loading || success}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
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
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-5">
            <div className="relative flex py-1.5 items-center">
              <div className={`flex-grow border-t ${dividerBorder}`}></div>
              <span className={`flex-shrink mx-4 text-[9px] uppercase font-bold tracking-widest ${subTextColor}`}>
                Or sign in with
              </span>
              <div className={`flex-grow border-t ${dividerBorder}`}></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <button 
                type="button" 
                onClick={() => handleDemoLogin('alice_adventures')}
                className={`flex items-center justify-center space-x-2 py-2.5 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.465 0-6.28-2.815-6.28-6.28s2.815-6.28 6.28-6.28c1.637 0 3.125.63 4.254 1.652l3.078-3.077C19.347 2.683 15.975 1.5 12.24 1.5 5.867 1.5.7 6.667.7 13s5.167 11.5 11.54 11.5c6.518 0 11.233-4.582 11.233-11.233 0-.771-.082-1.35-.193-1.982H12.24Z"/>
                </svg>
                <span className="text-xs font-semibold">Google</span>
              </button>

              <button 
                type="button"
                onClick={() => handleDemoLogin('emma_in_europe')}
                className={`flex items-center justify-center space-x-2 py-2.5 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs font-semibold">Facebook</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Access */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setShowDemos(!showDemos)}
              className={`text-xs font-semibold underline ${subTextColor} hover:text-slate-400 transition-colors`}
            >
              {showDemos ? 'Hide Demo Accounts' : 'Show Demo Accounts (Quick Login)'}
            </button>
            
            {showDemos && (
              <div className={`mt-3 p-3.5 rounded-xl border text-left space-y-2.5 transition-all duration-300 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Click to instantly log in as:</p>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('alice_adventures')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${
                    isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                  }`}
                >
                  <span>Alice Cooper (Admin)</span>
                  <span className="font-mono text-[9px] text-accent-pink">@alice_adventures</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('emma_in_europe')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.01] ${
                    isLight ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-zinc-200'
                  }`}
                >
                  <span>Emma Watson (Traveler)</span>
                  <span className="font-mono text-[9px] text-accent-cyan">@emma_in_europe</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Signup Redirect & Copyright */}
        <div className="mt-8 text-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs mb-3">
            Don't you have an account?{' '}
            <Link href="/signup" className="font-bold text-accent-cyan hover:underline">
              Sign up
            </Link>
          </p>
          <p className={`text-[10px] font-medium tracking-wide ${subTextColor}`}>
            © 2026 Instants App
          </p>
        </div>

      </div>

    </div>
  );
}
