"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function ChatsEmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-6 h-full relative border-r border-[#1C1C1E]">
        <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center mb-6 shadow-xl bg-zinc-950">
          <Send className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your Messages</h2>
        <p className="text-sm text-zinc-500 mb-8 max-w-[260px] text-center">
          Send private photos and messages to a friend or group.
        </p>
        <button 
          onClick={() => router.push('/chats?new=true')}
          className="bg-accent-purple text-white font-bold py-2.5 px-6 rounded-xl hover:bg-accent-purple/90 transition-colors active:scale-95 shadow-lg shadow-accent-purple/20"
        >
          Send Message
        </button>
      </div>

      {/* RIGHT PANE: Directory Empty state placeholder */}
      <div className="hidden xl:flex w-[300px] flex-col bg-[#000000] p-5 border-l border-zinc-900 justify-center items-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-accent-purple rounded-full animate-spin"></div>
        </div>
        <h3 className="text-sm font-bold text-zinc-300">Directory</h3>
        <p className="text-[10px] text-zinc-500 mt-1 max-w-[150px]">
          Select a chat to see team members and shared files.
        </p>
      </div>
    </div>
  );
}
