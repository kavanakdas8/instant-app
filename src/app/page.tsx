"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { currentUser, isInitialized } = useApp();
  const [progress, setProgress] = useState(15);
  const [isReady, setIsReady] = useState(false);

  // Smooth loading animation progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        // Accelerate smoothly
        const increment = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  // Navigate after loading screen finishes and context is initialized
  useEffect(() => {
    if (!isReady || !isInitialized) return;

    const navTimer = setTimeout(() => {
      if (currentUser) {
        router.push('/feed');
      } else {
        router.push('/login');
      }
    }, 350);

    return () => clearTimeout(navTimer);
  }, [isReady, isInitialized, currentUser, router]);

  const handleSkip = () => {
    if (currentUser) {
      router.push('/feed');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden select-none">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent-pink/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar / Status */}
      <div className="w-full flex justify-between items-center z-10 pt-4">
        <div className="flex items-center space-x-2 text-[10px] tracking-widest uppercase font-mono text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>INITIALIZING</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Center Branding & Animated Logo */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10 my-auto">
        {/* Glow Ring Logo Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-pink via-purple-500 to-accent-cyan rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
          <div className="relative w-24 h-24 bg-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-pink/30 to-accent-cyan/30 mix-blend-overlay" />
            <span className="text-white text-4xl font-black italic tracking-tighter drop-shadow-md">
              I
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              INSTANTS
            </h1>
            <Sparkles className="w-4 h-4 text-accent-pink animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed mx-auto font-medium">
            Live candid moments, adventure vibes & real connections.
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-56 space-y-2 pt-4">
          <div className="w-full bg-zinc-900/80 border border-white/5 h-2 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-accent-pink via-purple-500 to-accent-cyan h-full rounded-full transition-all duration-300 ease-out shadow-sm shadow-accent-pink/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1">
            <span>{progress === 100 ? 'Ready' : 'Loading experience...'}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="z-10 pb-4 text-center">
        <p className="text-[11px] text-zinc-600 font-medium tracking-wide">
          © 2026 Instants App • Travel in the Moment
        </p>
      </div>
    </div>
  );
}
