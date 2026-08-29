"use client";

import Link from 'next/link';
import { Compass, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-black text-white px-6 text-center min-h-[70vh]">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
        <AlertCircle className="w-8 h-8 text-accent-pink animate-pulse" />
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-2">Page Not Found</h2>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">
        The instant or page you are looking for doesn't exist or has moved.
      </p>
      <Link
        href="/feed"
        className="px-6 py-3 bg-gradient-to-r from-accent-pink to-accent-cyan text-black font-bold rounded-xl text-xs flex items-center space-x-2 active:scale-95 transition-transform"
      >
        <Compass className="w-4 h-4" />
        <span>Return to Feed</span>
      </Link>
    </div>
  );
}
