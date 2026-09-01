"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp, Instant, UserProfile } from '@/context/AppContext';
import { LogOut, Grid, MapPin, Heart, MessageCircle, AlertCircle, ShieldAlert, Settings, Bookmark, UserSquare, Link as LinkIcon, Compass, UserCheck, Users, PlusSquare, Bell, Send, MoreHorizontal, X, Edit3, Star, CheckCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Drawer from '@/components/Drawer';
import Logo from '@/components/Logo';

export default function Profile() {
  const router = useRouter();
  const { username } = useParams();
  const { currentUser, feed, groups, logout, allUsers } = useApp();
  
  const [selectedInstant, setSelectedInstant] = useState<Instant | null>(null);
  const [activeTab, setActiveTab] = useState<'instants' | 'trips' | 'reviews'>('instants');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  // Find user data from allUsers context
  const decodedUsername = decodeURIComponent(String(username));
  const isMe = currentUser.username === decodedUsername;
  
  const contextUser = allUsers.find(u => u.username === decodedUsername);
  
  let profileUser: UserProfile = contextUser || {
    name: decodedUsername.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    username: decodedUsername,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    bio: 'Travel adventurer and Instants explorer.',
    instants: feed.filter(p => p.authorUsername === decodedUsername),
    stats: { tripsCompleted: 0, destinationsVisited: 0, reputationScore: 'New' },
    stamps: [],
    reviews: []
  };

  // Get Trips/Groups user is part of
  const userTrips = groups.filter(g => g.members.includes(profileUser.username) || g.adminUsername === profileUser.username);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Stats calculation
  const totalInstants = profileUser.instants?.length || 0;
  const totalLikes = (profileUser.instants || []).reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalFollowers = isMe ? 992 : 124;

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col overflow-x-hidden relative">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex">
        <aside className="w-[260px] bg-[#000000] border-r border-[#27272A] p-6 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
          <div className="flex flex-col">
            {/* Brand Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Logo className="w-6 h-6 text-white" />
                <span className="text-xl font-black tracking-wider uppercase text-white select-none">Instants</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 mt-2">
              <button
                onClick={() => router.push('/feed?tab=explore')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
              >
                <Compass className="w-6 h-6 text-zinc-400" />
                <span>Explore</span>
              </button>


              <button
                onClick={() => router.push('/feed?tab=friends')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
              >
                <Users className="w-6 h-6 text-zinc-400" />
                <span>Friends</span>
              </button>

              <button
                onClick={() => router.push('/capture')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
              >
                <PlusSquare className="w-6 h-6 text-zinc-400" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => router.push('/notifications')}
                className="w-full flex items-center justify-between px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <Bell className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <span>Activity</span>
                </div>
              </button>

              <button
                onClick={() => router.push('/chats')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all group"
              >
                <Send className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span>Messages</span>
              </button>

              <button
                onClick={() => router.push(`/profile/${currentUser.username}`)}
                className="w-full flex items-center space-x-4 px-3 py-3 bg-[#18181B] text-white border border-[#27272A] rounded-xl text-[15px] font-bold transition-all"
              >
                <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-zinc-700" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => router.push('/settings')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all mt-auto"
              >
                <Settings className="w-6 h-6 text-zinc-400" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-[260px] flex flex-col bg-black relative min-h-screen">
        <div className="flex-1 flex flex-col bg-black md:px-12 md:pt-10 px-4 pt-6 pb-20 select-none max-w-4xl mx-auto w-full">
          
          {/* 1. Travel Passport Header & Hero */}
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Background Map Graphic (Subtle) */}
            <div className="absolute right-0 top-0 opacity-[0.03] w-64 h-64 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="flex flex-col md:flex-row items-center md:items-start relative z-10">
              {/* Avatar with Status Ring */}
              <div className="relative mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <div className={`absolute -inset-1 rounded-full border-2 ${profileUser.currentLocation ? 'border-emerald-400 animate-pulse' : 'border-zinc-700'}`}></div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-slate-950 bg-slate-900 z-10 relative cursor-pointer">
                  <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                </div>
                {profileUser.currentLocation && (
                  <div className="absolute bottom-0 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 z-20 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
              </div>

              {/* Info & Stats */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 w-full">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{profileUser.name}</h1>
                    <p className="text-sm font-medium text-slate-400 mb-3">@{profileUser.username}</p>
                    <p className="text-sm text-slate-300 max-w-md mx-auto md:mx-0 leading-relaxed">{profileUser.bio}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center justify-center space-x-3 shrink-0">
                    {isMe ? (
                      <button className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors border border-white/10 flex items-center space-x-2">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Passport</span>
                      </button>
                    ) : (
                      <>
                        <button className="px-5 py-2 rounded-xl bg-accent-cyan text-slate-900 font-bold text-sm hover:bg-accent-cyan/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                          Follow
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/10">
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Traveler Stats Strip */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 font-mono mt-6 pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-bold">{profileUser.stats?.tripsCompleted || 0}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Trips</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-bold">{profileUser.stats?.destinationsVisited || 0}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Destinations</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-emerald-400 text-lg font-bold flex items-center space-x-1">
                      <span>{profileUser.stats?.reputationScore || 'New'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Destination Badges & Passport Stamps */}
          {profileUser.stamps && profileUser.stamps.length > 0 && (
            <div className="mb-10 w-full overflow-x-auto no-scrollbar pb-2">
              <h3 className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-3 ml-1">Passport Stamps</h3>
              <div className="flex items-center space-x-3">
                {profileUser.stamps.map((stamp) => (
                  <div key={stamp.id} className="flex items-center space-x-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl px-3 py-2 cursor-pointer transition-colors shrink-0">
                    <span className="text-lg">{stamp.icon}</span>
                    <span className="text-xs font-bold text-zinc-300">{stamp.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Profile Content Navigation Tabs */}
          <div className="flex items-center space-x-6 border-b border-zinc-800 mb-6">
            <button 
              onClick={() => setActiveTab('instants')}
              className={`pb-3 text-[12px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'instants' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <div className="flex items-center space-x-2">
                <Grid className="w-4 h-4" />
                <span>Instants</span>
              </div>
              {activeTab === 'instants' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
            <button 
              onClick={() => setActiveTab('trips')}
              className={`pb-3 text-[12px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'trips' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Trips & Groups</span>
              </div>
              {activeTab === 'trips' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-[12px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'reviews' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </div>
              {activeTab === 'reviews' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
          </div>

          {/* Tab Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'instants' && (
              <motion.div 
                key="instants"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                {totalInstants === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center py-20 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-zinc-700" />
                    <p className="text-sm text-zinc-600">No Instants shared yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {profileUser.instants.map((inst) => (
                      <div
                        key={inst.id}
                        onClick={() => setSelectedInstant(inst)}
                        className="aspect-square bg-zinc-950 overflow-hidden relative cursor-pointer group transition-all"
                      >
                        {inst.type === 'video' ? (
                          <video src={inst.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={inst.url} alt="Grid post" className="w-full h-full object-cover" />
                        )}
                        
                        {/* Media Type Icon */}
                        {inst.type === 'video' && (
                          <div className="absolute top-2 right-2 drop-shadow-md">
                            <Video className="w-5 h-5 text-white/90" />
                          </div>
                        )}
                        
                        {/* Location Overlay Tag */}
                        {inst.destination && (
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <MapPin className="w-3 h-3 text-accent-cyan" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider">{inst.destination}</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity z-20">
                          <div className="flex items-center space-x-1.5 text-white font-bold">
                            <Heart className="w-5 h-5 fill-white stroke-none" />
                            <span>{inst.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-white font-bold">
                            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                            <span>{inst.comments.length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'trips' && (
              <motion.div 
                key="trips"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {userTrips.length === 0 ? (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-zinc-500 text-sm">Hasn't joined any trips yet.</p>
                  </div>
                ) : (
                  userTrips.map(trip => (
                    <div key={trip.id} onClick={() => router.push(`/chats/${trip.id}`)} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-black border border-zinc-800">
                            <img src={trip.avatar} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm font-bold text-white">{trip.name}</span>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                      <div className="mt-auto space-y-1">
                        <div className="flex items-center space-x-1.5 text-zinc-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-zinc-400">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-xs">{trip.members.length} Members</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="reviews"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!profileUser.reviews || profileUser.reviews.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-zinc-500 text-sm">No traveler reviews yet.</p>
                  </div>
                ) : (
                  profileUser.reviews.map(review => (
                    <div key={review.id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <img src={review.authorAvatar} className="w-10 h-10 rounded-full border border-zinc-700 object-cover shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-sm text-white">{review.author}</span>
                            <span className="text-xs text-zinc-500">@{review.authorUsername}</span>
                            <CheckCircle className="w-3 h-3 text-accent-cyan" />
                          </div>
                          <p className="text-sm text-zinc-300 italic mb-3">"{review.text}"</p>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{review.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>

      {/* Instant Details Modal (Instagram Web Style) */}
      {selectedInstant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-10 bg-black/80 backdrop-blur-sm">
          <button 
            onClick={() => setSelectedInstant(null)} 
            className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors z-[60]"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="bg-[#000000] border-0 md:border md:border-[#27272A] w-full max-w-[1200px] h-full md:h-[90vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl rounded-none md:rounded-sm z-50">
            {/* Visual Canvas (Left Column) */}
            <div className="w-full h-[50vh] md:h-full md:w-[55%] lg:w-[65%] bg-black flex items-center justify-center relative md:border-r border-[#27272A]">
              <img src={selectedInstant.url} alt="Selected Instant" className="max-w-full max-h-full object-contain" />
            </div>

            {/* Info Panel (Right Column) */}
            <div className="w-full flex-1 md:w-[45%] lg:w-[35%] h-[50vh] md:h-full flex flex-col bg-[#000000]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#27272A] shrink-0">
                <div className="flex items-center space-x-3">
                  <img src={selectedInstant.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex items-center text-[13px] font-semibold text-zinc-100">
                    <span className="cursor-pointer hover:text-zinc-300">{selectedInstant.authorUsername}</span>
                  </div>
                </div>
                <button className="text-zinc-100 hover:text-zinc-400 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Comments Section (Scrollable) */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                {/* Caption as first comment */}
                {selectedInstant.caption && (
                  <div className="flex items-start space-x-3">
                    <img src={selectedInstant.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 text-[13px] text-zinc-100 leading-snug break-words">
                      <span className="font-semibold mr-1.5">{selectedInstant.authorUsername}</span>
                      <span>{selectedInstant.caption}</span>
                      <div className="mt-2.5 text-[11px] text-zinc-500 font-medium">
                        {selectedInstant.timestamp}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actual Comments */}
                {selectedInstant.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 group">
                    <img src={comment.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 text-[13px] text-zinc-100 leading-snug break-words">
                      <span className="font-semibold mr-1.5">{comment.authorUsername}</span>
                      <span>{comment.text}</span>
                      <div className="mt-2.5 text-[11px] text-zinc-500 font-medium flex items-center space-x-3">
                        <span>{comment.timestamp || '1d'}</span>
                        <button className="hover:text-zinc-300">Like</button>
                        <button className="hover:text-zinc-300">Reply</button>
                      </div>
                    </div>
                    <button className="text-zinc-500 hover:text-zinc-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center">
                       <Heart className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#27272A] p-4 flex flex-col shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button className="text-zinc-100 hover:text-zinc-400 transition-colors">
                      <Heart className="w-[26px] h-[26px]" />
                    </button>
                    <button className="text-zinc-100 hover:text-zinc-400 transition-colors -ml-1">
                      <MessageCircle className="w-[26px] h-[26px]" />
                    </button>
                    <button className="text-zinc-100 hover:text-zinc-400 transition-colors">
                      <Send className="w-[26px] h-[26px]" />
                    </button>
                  </div>
                  <button className="text-zinc-100 hover:text-zinc-400 transition-colors">
                    <Bookmark className="w-[26px] h-[26px]" />
                  </button>
                </div>
                <span className="text-[13px] font-semibold text-zinc-100 mb-1.5">{selectedInstant.likes.toLocaleString()} likes</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{selectedInstant.timestamp || 'JULY 2'}</span>
              </div>

              {/* Add comment */}
              <div className="border-t border-[#27272A] p-4 flex items-center shrink-0">
                <button className="text-zinc-100 hover:text-zinc-400 transition-colors mr-3">
                  <svg aria-label="Emoji" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                </button>
                <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent text-[13px] text-zinc-100 focus:outline-none placeholder-zinc-500" />
                <button className="text-blue-500 font-semibold text-[13px] hover:text-white transition-colors ml-3 opacity-60 hover:opacity-100">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
