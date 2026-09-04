"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const LIVE_NODES = [
  {
    id: 1,
    location: 'Cusco, Peru',
    user: '@emma_in_europe',
    time: '3m ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&q=80',
    media: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=150&q=80',
    x: 15,
    y: 15,
    delay: 0,
    cardPos: 'top-3 left-3',
  },
  {
    id: 2,
    location: 'Tokyo, Japan',
    user: '@kento_tokyo',
    time: '12m ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&q=80',
    media: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=150&q=80',
    x: 85,
    y: 50,
    delay: 1.5,
    cardPos: '-translate-y-1/2 right-6',
  },
  {
    id: 3,
    location: 'Bali, Indonesia',
    user: '@alice_adventures',
    time: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&q=80',
    media: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80',
    x: 25,
    y: 85,
    delay: 0.8,
    cardPos: 'bottom-4 left-4',
  }
];

export const LiveMapCluster = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const isLight = theme === 'light';
  
  return (
    <div className={`relative w-full h-[320px] lg:h-[450px] my-4 z-10 flex flex-col justify-center font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
      
      {/* Map Connections (SVG Lines) */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
      >
        <path
          d={`M ${LIVE_NODES[0].x} ${LIVE_NODES[0].y} L ${LIVE_NODES[1].x} ${LIVE_NODES[1].y} L ${LIVE_NODES[2].x} ${LIVE_NODES[2].y} Z`}
          className={isLight ? "stroke-slate-900/10" : "stroke-white/20"}
          strokeWidth="0.4"
          strokeDasharray="1.5 2"
          fill="none"
        />
      </svg>

      {/* Nodes and Floating Cards */}
      {LIVE_NODES.map((node) => (
        <div 
          key={node.id} 
          className="absolute" 
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Node Wrapper centered on coordinates */}
          <div className="absolute w-0 h-0 flex items-center justify-center">
            
            {/* Radar Ping Node */}
            <div className="absolute w-6 h-6 bg-accent-cyan/30 rounded-full animate-ping" />
            <div className="absolute w-2 h-2 bg-accent-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]" />


          </div>
        </div>
      ))}
      
    </div>
  );
};

export default LiveMapCluster;
