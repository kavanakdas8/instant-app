"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import { LogOut, Grid, MapPin, Heart, MessageCircle, AlertCircle, ShieldAlert, Settings, Bookmark, UserSquare, Link as LinkIcon, Compass, UserCheck, Users, PlusSquare, Bell, Send, MoreHorizontal, X } from 'lucide-react';
import Drawer from '@/components/Drawer';
import Logo from '@/components/Logo';

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
  const decodedUsername = decodeURIComponent(String(username));
  const isMe = currentUser.username === decodedUsername;
  
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
        bio: decodedUsername === 'kento_tokyo' 
          ? 'Solo Tokyo explorer. Looking for the best ramen and hidden alleys. 🍜🇯🇵'
          : decodedUsername === 'emma_in_europe'
          ? 'Backpacker traveling across Europe. Currently in Florence! 🍕🗺️'
          : 'Exploring the world one Instant at a time.',
        instants: feed.filter(p => p.authorUsername === decodedUsername)
      };
    } else {
      // Fallback
      profileUser = {
        name: decodedUsername.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        username: decodedUsername,
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
  const totalFollowers = isMe ? 992 : 124;
  const totalFollowing = isMe ? 63 : 15;

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
                onClick={() => router.push('/feed?tab=following')}
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
              >
                <UserCheck className="w-6 h-6 text-zinc-400" />
                <span>Following</span>
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
      {/* Desktop & Mobile Responsive Profile Header */}
      <div className="flex flex-col md:flex-row md:items-start items-center mb-10 md:mb-12">
        {/* Avatar */}
        <div className="md:w-[280px] w-full flex justify-center md:justify-center md:mr-8 mb-6 md:mb-0">
          <div className="w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex-shrink-0 cursor-pointer">
            <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 md:pt-2 w-full">
          {/* Row 1: Username & Actions */}
          <div className="flex flex-col md:flex-row md:items-center items-start mb-4 md:mb-5 w-full">
            <h1 className="text-xl md:text-[20px] font-normal text-zinc-100 mr-5 md:mr-8 mb-3 md:mb-0 md:min-w-fit flex-shrink-0">
              {profileUser.username}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 md:mt-1">
              {!isMe && (
                <>
                  <button className="px-6 py-1.5 rounded-lg bg-accent-cyan text-black font-semibold text-sm hover:bg-accent-cyan/90 transition-all shrink-0">
                    Follow
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-[#363636] hover:bg-[#262626] text-white text-sm font-semibold transition-all shrink-0">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Row 2: Stats (Desktop) */}
          <div className="hidden md:flex items-center space-x-10 mb-5">
            <span className="text-base text-zinc-100"><span className="font-semibold">{totalInstants}</span> instants</span>
            <span className="text-base text-zinc-100"><span className="font-semibold">{totalFollowers}</span> followers</span>
            <span className="text-base text-zinc-100"><span className="font-semibold">{totalFollowing}</span> following</span>
          </div>

          {/* Row 3: Bio (Desktop) */}
          <div className="hidden md:block">
            <h2 className="text-[14px] font-semibold text-zinc-100">{profileUser.name}</h2>
            <div className="text-[14px] text-zinc-400 mt-1 whitespace-pre-wrap leading-[18px]">
              🎥 Filmmaker | 📸 Photographer<br/>
              Pictures With Questionable Captions
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats & Bio */}
      <div className="md:hidden w-full mb-6 px-2">
        <h2 className="text-sm font-semibold text-zinc-100">{profileUser.name}</h2>
        <div className="text-sm text-zinc-400 mt-1 whitespace-pre-wrap leading-relaxed">
          {profileUser.bio}
        </div>
      </div>
      <div className="md:hidden grid grid-cols-3 gap-3 p-4 bg-zinc-950 border-t border-b border-zinc-900/60 mb-2 text-center w-full">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{totalInstants}</p>
          <p className="text-[11px] text-zinc-500 font-normal">instants</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">{totalFollowers}</p>
          <p className="text-[11px] text-zinc-500 font-normal">followers</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">{totalFollowing}</p>
          <p className="text-[11px] text-zinc-500 font-normal">following</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t border-zinc-800 md:mb-4 mb-2 w-full">
        <div className="flex items-center md:space-x-12 space-x-8">
          <button className="flex items-center space-x-1.5 py-4 border-t-2 border-white text-zinc-100 text-[11px] font-bold tracking-widest -mt-[1px]">
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:block">INSTANTS</span>
          </button>
        </div>
      </div>

      {/* Captured Instants Grid */}
      {totalInstants === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-20 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-zinc-700" />
          <p className="text-sm text-zinc-600">No Instants shared yet by this user.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {profileUser.instants.map((inst) => (
            <div
              key={inst.id}
              onClick={() => setSelectedInstant(inst)}
              className="aspect-square bg-zinc-950 overflow-hidden relative cursor-pointer group transition-all"
            >
              <img src={inst.url} alt="Grid post" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity">
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
