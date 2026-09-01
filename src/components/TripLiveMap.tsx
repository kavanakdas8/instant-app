"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TravelGroup, UserProfile } from '@/context/AppContext';
import { Camera, MapPin, X, Activity } from 'lucide-react';

interface TripLiveMapProps {
  group: TravelGroup;
  users: UserProfile[];
  currentUser: UserProfile;
  toggleLocationSharing: () => void;
  onDropInstant: () => void;
  onClose: () => void;
}

export const TripLiveMap = ({
  group,
  users,
  currentUser,
  toggleLocationSharing,
  onDropInstant,
  onClose
}: TripLiveMapProps) => {
  // Get active members sharing location
  const activeMembers = users.filter(u => group.members.includes(u.username) && u.isLocationShared && u.currentLocation);
  
  // Dummy waypoints based on itinerary
  const waypoints = group.itinerary ? group.itinerary.map((stop, i) => ({
    id: stop.id,
    name: stop.name,
    x: 20 + (i * 25), // Distribute across X
    y: 70 - (i * 15)  // Distribute across Y
  })) : [];

  return (
    <div className="relative w-full h-[50vh] xl:h-[400px] bg-[#0F172A] border-b border-zinc-900 overflow-hidden font-sans text-white flex flex-col shrink-0 z-20 shadow-2xl">
      
      {/* Header / Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 pointer-events-auto">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-100">Live Trip Map</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800 rounded-full transition-colors pointer-events-auto shadow-xl"
        >
          <X className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Topographic Background / Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Polylines for Route */}
        {waypoints.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <path 
              d={`M ${waypoints[0].x}% ${waypoints[0].y}% ${waypoints.slice(1).map(wp => `L ${wp.x}% ${wp.y}%`).join(' ')}`}
              className="stroke-emerald-400/30"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
          </svg>
        )}

        {/* Render Waypoints */}
        {waypoints.map((wp, i) => (
          <div key={wp.id} className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${wp.x}%`, top: `${wp.y}%` }}>
            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg">
              <span className="text-[10px] font-bold text-slate-300">{i + 1}</span>
            </div>
            <div className="mt-1 px-2 py-0.5 bg-slate-900/80 rounded backdrop-blur border border-slate-800/50">
              <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">{wp.name}</span>
            </div>
          </div>
        ))}

        {/* Render Active Members */}
        {activeMembers.map((member) => (
          <motion.div 
            key={member.username}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            style={{ left: `${member.currentLocation!.lng}%`, top: `${member.currentLocation!.lat}%` }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
          >
            <div className="relative">
              {/* Ping Ring */}
              <div className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping opacity-75"></div>
              
              {/* Avatar Pin */}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 overflow-hidden shadow-[0_0_15px_rgba(52,211,153,0.4)] bg-slate-900 relative z-10">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>

              {/* Status Pill */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-full flex flex-col items-center whitespace-nowrap z-30 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-bold text-white">{member.name}</span>
                <span className="text-[9px] text-emerald-400">{member.currentLocation!.speed || member.currentLocation!.timestamp}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 px-4 flex items-center justify-between shrink-0 z-30 relative">
        
        {/* Toggle Share */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleLocationSharing}
            className={`relative w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${currentUser.isLocationShared ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${currentUser.isLocationShared ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">
              {currentUser.isLocationShared ? '🟢 Sharing Live Location' : '⚪ Ghost Mode (Hidden)'}
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wide">
              {activeMembers.length} ACTIVE MEMBERS
            </span>
          </div>
        </div>

        {/* Drop Instant Shortcut */}
        <button 
          onClick={onDropInstant}
          disabled={!currentUser.isLocationShared}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 px-4 py-2 rounded-xl transition-colors font-bold text-xs shadow-lg"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Drop Instant on Pin</span>
          <span className="sm:hidden">Drop</span>
        </button>

      </div>
    </div>
  );
};
