"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import { LogOut, Grid, MapPin, Heart, MessageCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function Profile() {
  const router = useRouter();
  const { username } = useParams();
  const { currentUser, feed, groups, logout } = useApp();
  
  const [selectedInstant, setSelectedInstant] = useState<Instant | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Find user data. If it's the logged-in user, fetch from context, else gather from feed
  const isMe = currentUser.username === username;
  
  let profileUser = {
    name: currentUser.name,
    username: currentUser.username,
    avatar: currentUser.avatar,
    bio: currentUser.bio,
    instants: currentUser.instants
  };

  if (!isMe) {
    // Gather from feed authors
    const authorPost = feed.find(p => p.authorUsername === username);
    if (authorPost) {
      profileUser = {
        name: authorPost.author,
        username: authorPost.authorUsername,
        avatar: authorPost.authorAvatar,
        bio: username === 'kento_tokyo' 
          ? 'Solo Tokyo explorer. Looking for the best ramen and hidden alleys. 🍜🇯🇵'
          : username === 'emma_in_europe'
          ? 'Backpacker traveling across Europe. Currently in Florence! 🍕🗺️'
          : 'Exploring the world one Instant at a time.',
        instants: feed.filter(p => p.authorUsername === username)
      };
    } else {
      // Fallback
      profileUser = {
        name: String(username).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        username: String(username),
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
        bio: 'Travel adventurer and Instants explorer.',
        instants: []
      };
    }
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Stats calculation
  const totalInstants = profileUser.instants?.length || 0;
  const totalLikes = (profileUser.instants || []).reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const activeGroups = groups.filter(g => g.members && g.members.includes(profileUser.username)).length;

  return (
    <div className="flex-1 flex flex-col bg-black px-4 pt-6 pb-20 select-none">
      {/* Profile Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-black tracking-tight text-white font-mono">
          @{profileUser.username}
        </h1>
        {isMe && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-accent-pink hover:border-accent-pink/30 active:scale-95 transition-all flex items-center space-x-1.5 text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        )}
      </div>

      {/* Avatar & Info details */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-900 bg-zinc-950 flex-shrink-0">
          <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-zinc-100">{profileUser.name}</h2>
          <p className="text-[11px] text-zinc-400 font-light mt-1.5 leading-relaxed">
            {profileUser.bio}
          </p>
        </div>
      </div>

      {/* Profile Quick Stats */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-900/60 mb-6 text-center">
        <div>
          <p className="text-base font-black text-zinc-100">{totalInstants}</p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Instants</p>
        </div>
        <div>
          <p className="text-base font-black text-zinc-100">{totalLikes}</p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Total Likes</p>
        </div>
        <div>
          <p className="text-base font-black text-zinc-100">{activeGroups}</p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Groups</p>
        </div>
      </div>

      {/* Feed / Grid Switcher Tab */}
      <div className="flex items-center space-x-1.5 border-b border-zinc-900 pb-3 mb-4 text-zinc-400 font-bold text-xs uppercase tracking-widest select-none">
        <Grid className="w-4 h-4 text-accent-cyan" />
        <span className="text-zinc-200">Captured Instants Archive</span>
      </div>

      {/* Captured Instants Grid */}
      {totalInstants === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-20 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-zinc-700" />
          <p className="text-xs text-zinc-600">No Instants shared yet by this user.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {profileUser.instants.map((inst) => (
            <div
              key={inst.id}
              onClick={() => setSelectedInstant(inst)}
              className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative cursor-pointer group hover:border-zinc-800 active:scale-[0.98] transition-all"
            >
              <img src={inst.url} alt="Grid post" className="w-full h-full object-cover scale-[1.03] group-hover:scale-100 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-3 transition-opacity">
                <div className="flex items-center space-x-1 text-white text-[10px] font-bold">
                  <Heart className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span>{inst.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-white text-[10px] font-bold">
                  <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span>{inst.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instant Details Drawer */}
      <Drawer
        isOpen={!!selectedInstant}
        onClose={() => setSelectedInstant(null)}
        title="Instant View"
      >
        {selectedInstant && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Visual Canvas */}
            <div className="aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-zinc-900 relative">
              <img src={selectedInstant.url} alt="Selected Instant" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] text-accent-cyan border border-white/5 uppercase tracking-widest font-bold">
                {selectedInstant.audience}
              </div>
            </div>

            {/* Author info & caption */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
              <div className="flex items-center space-x-3 mb-2.5">
                <img src={selectedInstant.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-black text-zinc-150">@{selectedInstant.authorUsername}</h4>
                  <p className="text-[9px] text-zinc-500">{selectedInstant.timestamp}</p>
                </div>
              </div>
              
              {selectedInstant.caption && (
                <p className="text-xs text-zinc-300 leading-relaxed font-light mt-2 border-t border-zinc-900/60 pt-2">
                  {selectedInstant.caption}
                </p>
              )}
            </div>

            {/* Likes / Comments summary */}
            <div className="flex items-center space-x-4 px-1 text-xs font-bold text-zinc-400">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-accent-pink fill-accent-pink/10" />
                <span>{selectedInstant.likes} Likes</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4 text-accent-cyan" />
                <span>{selectedInstant.comments.length} Comments</span>
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
