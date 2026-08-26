"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function ChatsEmptyState() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-6 h-full">
      <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-6 shadow-xl bg-black">
        <Send className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
      <p className="text-sm text-zinc-500 mb-8 max-w-[260px] text-center">
        Send private photos and messages to a friend or group.
      </p>
      <button 
        onClick={() => router.push('/chats?new=true')}
        className="bg-accent-cyan text-black font-black py-2.5 px-6 rounded-xl hover:bg-white transition-colors active:scale-95 shadow-md shadow-accent-cyan/10"
      >
        Send Message
      </button>
    </div>
  );
}
