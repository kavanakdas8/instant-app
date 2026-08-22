"use client";

import React from 'react';

export const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center items-stretch font-sans antialiased selection:bg-accent-pink/30">
      {/* Outer borders represent a mock phone wrapper on desktop screens */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-black border-x border-zinc-900 relative shadow-2xl overflow-hidden">
        {/* Top Notch/StatusBar Simulation for mobile aesthetics */}
        <div className="h-6 bg-black border-b border-zinc-950 flex justify-between items-center px-6 text-[10px] text-zinc-500 select-none z-50">
          <span>9:41</span>
          <div className="w-16 h-3 bg-zinc-900 rounded-full mx-2 border border-zinc-800 flex justify-center items-center">
            <div className="w-2 h-2 bg-black rounded-full mr-1.5"></div>
            <div className="w-6 h-1 bg-zinc-800 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-1">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-zinc-600 rounded-sm p-0.5 flex justify-start items-center">
              <div className="w-2.5 h-full bg-zinc-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Core Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};
export default MobileContainer;
