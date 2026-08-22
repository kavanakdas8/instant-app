"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useApp();

  useEffect(() => {
    // If the mock client context has auto-logged in, navigate to feed
    if (currentUser) {
      router.push('/feed');
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-black">
      <div className="flex flex-col items-center space-y-4">
        {/* Dynamic logo animation */}
        <div className="w-16 h-16 bg-gradient-to-tr from-accent-pink to-accent-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-accent-pink/20 animate-pulse">
          <span className="text-black text-2xl font-black italic tracking-tighter">I</span>
        </div>
        <h1 className="text-xl font-bold tracking-wider uppercase text-zinc-300">Instants</h1>
        <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
      </div>
    </div>
  );
}
