"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, TravelGroup } from '@/context/AppContext';
import { Search, MapPin, Compass, ArrowRight, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function Groups() {
  const router = useRouter();
  const { currentUser, groups, joinRequests, requestToJoinGroup } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Filter groups
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          group.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          group.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && group.destination === activeFilter;
  });

  // Check user membership or request state
  const getGroupState = (group: TravelGroup) => {
    const isMember = group.members.includes(currentUser.username);
    if (isMember) return 'joined';

    const req = joinRequests.find(r => r.groupId === group.id && r.username === currentUser.username);
    if (req) {
      return req.status; // 'pending', 'approved', 'declined'
    }

    return 'none';
  };

  const destinations = ['All', 'Europe', 'Japan', 'Global'];

  return (
    <div className="flex-1 flex flex-col bg-black px-4 pt-6 select-none pb-20">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
          <span>Travel Groups</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Discover like-minded adventurers and join exclusive trips.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search destination, vibe or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#080808] border border-zinc-900 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20"
        />
      </div>

      {/* Destination Pills filter tab */}
      <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
        {destinations.map((dest) => (
          <button
            key={dest}
            onClick={() => setActiveFilter(dest)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeFilter === dest
                ? 'bg-white text-black border-white'
                : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800'
            }`}
          >
            {dest}
          </button>
        ))}
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="py-16 text-center">
            <Compass className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No groups matching search filter.</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const groupState = getGroupState(group);
            
            return (
              <div 
                key={group.id} 
                className="glass p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between animate-fade-in-up"
              >
                {/* Header Information */}
                <div className="flex space-x-4 items-start mb-4">
                  <img 
                    src={group.avatar} 
                    alt={group.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-900" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-zinc-100 truncate">{group.name}</h3>
                    <div className="flex items-center space-x-1.5 text-zinc-500 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
                      <MapPin className="w-3 h-3 text-accent-cyan" />
                      <span>{group.destination}</span>
                      <span>•</span>
                      <span>{group.membersCount} members</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium mt-1 border-l-2 border-accent-purple/40 pl-2">
                      Vibe: {group.vibe}
                    </p>
                  </div>
                </div>

                {/* Description summary */}
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                  {group.description}
                </p>

                {/* Recent shared Instants thumbnails */}
                {group.recentInstants.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-2">Recent Instants Shared</p>
                    <div className="flex space-x-2">
                      {group.recentInstants.map((url, i) => (
                        <div key={i} className="w-16 h-20 rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
                          <img src={url} alt="Recent sharing" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer buttons / Action toggler */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
                  {groupState === 'joined' ? (
                    <>
                      <span className="text-[10px] text-accent-cyan font-bold tracking-wide flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5 fill-accent-cyan/15 text-accent-cyan" />
                        <span>Joined member</span>
                      </span>
                      <button
                        onClick={() => router.push(`/groups/${group.id}`)}
                        className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-bold rounded-xl flex items-center space-x-1.5 active:scale-95 transition-all"
                      >
                        <span>Open Chat</span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent-cyan" />
                      </button>
                    </>
                  ) : groupState === 'pending' ? (
                    <>
                      <span className="text-[10px] text-zinc-500 font-bold tracking-wide flex items-center space-x-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Pending approval</span>
                      </span>
                      <button
                        disabled
                        className="py-2 px-4 bg-zinc-950 border border-zinc-900 text-zinc-600 text-xs font-bold rounded-xl"
                      >
                        Requested
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] text-zinc-600 font-bold">Invite only</span>
                      <button
                        onClick={() => requestToJoinGroup(group.id)}
                        className="py-2 px-4 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 active:scale-[0.98] transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-black" />
                        <span>Request to Join</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
