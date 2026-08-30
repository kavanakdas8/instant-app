"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Camera, Compass, Users, ShieldCheck, Zap } from 'lucide-react';
import Logo from '@/components/Logo';

const LOADING_STAGES = [
  { threshold: 25, label: "Warming up camera optics & sensors...", badge: "OPTICS" },
  { threshold: 50, label: "Discovering live moments & vibes nearby...", badge: "DISCOVERY" },
  { threshold: 75, label: "Syncing wanderlust circles & stories...", badge: "NETWORK" },
  { threshold: 95, label: "Calibrating real-time feed stream...", badge: "OPTIMIZING" },
  { threshold: 100, label: "Ready to explore! Transitioning to Login...", badge: "READY" },
];

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const goToLogin = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    // Smooth transition delay
    setTimeout(() => {
      router.push('/login');
    }, 400);
  }, [isNavigating, router]);

  // Smooth loading progression
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Smooth random increment
        const increment = Math.floor(Math.random() * 18) + 12;
        const next = Math.min(prev + increment, 100);
        return next;
      });
    }, 190);

    return () => clearInterval(timer);
  }, []);

  // When progress reaches 100%, automatically transition to /login
  useEffect(() => {
    if (progress >= 100 && !isNavigating) {
      const autoNavTimer = setTimeout(() => {
        goToLogin();
      }, 500);

      return () => clearTimeout(autoNavTimer);
    }
  }, [progress, isNavigating, goToLogin]);

  // Allow keyboard shortcuts (Enter / Space / Escape) to skip immediately to login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        goToLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToLogin]);

  // Get current active stage
  const currentStage =
    LOADING_STAGES.find((stage) => progress <= stage.threshold) ||
    LOADING_STAGES[LOADING_STAGES.length - 1];

  return (
    <div
      className={`relative min-h-screen w-full bg-[#05060f] text-white flex flex-col justify-between items-center p-6 sm:p-10 select-none overflow-hidden transition-all duration-500 ${isNavigating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
    >
      {/* Background Animated Neon Glow Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF2E93]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00F0FF]/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#9D4EDD]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Matrix / Dot Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />



      {/* Centerpiece Hero Section */}
      <main className="flex flex-col items-center justify-center space-y-8 z-20 my-auto w-full max-w-md text-center">

        {/* Orbital Glowing Brand Emblem */}
        <div className="relative group cursor-pointer" onClick={goToLogin}>
          {/* Outer Slow Counter-Rotating Dashed Orbit */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-[#00F0FF]/30 animate-spin-slow-reverse pointer-events-none" />

          {/* Middle Glowing Ambient Ring */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-[#FF2E93] via-[#9D4EDD] to-[#00F0FF] opacity-60 blur-lg group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow" />

          {/* Central Glossy Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-950/90 border border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
            {/* Shimmer overlay sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E93]/20 via-transparent to-[#00F0FF]/20 mix-blend-screen" />

            {/* Shimmer ray animation */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-shimmer pointer-events-none" />

            {/* Glowing Logo Icon */}
            <div className="relative flex items-center justify-center">
              <Logo className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-[0_0_15px_rgba(255,46,147,0.8)]" />
            </div>
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              INSTANTS
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs sm:max-w-sm leading-relaxed mx-auto font-medium">
            Live candid moments, vertical travel feeds & authentic vibe connections.
          </p>
        </div>

        {/* Modern Segmented Progress Bar & Loading Status */}
        <div className="w-full max-w-xs sm:max-w-sm space-y-3 pt-2">
          {/* Progress Track */}
          <div className="relative w-full bg-black/60 border border-white/10 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner backdrop-blur-md">
            {/* Filled Bar */}
            <div
              className="relative bg-gradient-to-r from-[#FF2E93] via-[#9D4EDD] to-[#00F0FF] h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,240,255,0.6)]"
              style={{ width: `${progress}%` }}
            >
              {/* Gleam Head on Progress Bar */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* Stage Status Text & Numeric Percent */}
          <div className="flex justify-between items-center text-xs font-mono px-1">
            <span className="text-zinc-400 text-[11px] truncate max-w-[210px] sm:max-w-[240px] text-left">
              {currentStage.label}
            </span>
            <span className="text-[#00F0FF] font-bold text-[11px] tracking-wider shrink-0">
              {progress}%
            </span>
          </div>
        </div>


        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-medium text-zinc-400">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Camera className="w-3 h-3 text-[#FF2E93]" />
            <span>Candid Instants</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Compass className="w-3 h-3 text-[#00F0FF]" />
            <span>Global Feeds</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Users className="w-3 h-3 text-[#9D4EDD]" />
            <span>Travel Vibes</span>
          </div>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row justify-center items-center gap-2 z-20 pt-4 border-t border-white/[0.05] text-[11px] text-zinc-600 font-medium">
        <p className="tracking-wide">
          © 2026 Instants App
        </p>
      </footer>
    </div>
  );
}
