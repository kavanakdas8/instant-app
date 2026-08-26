"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Bell, ArrowLeft, Check, Compass, MessageSquare, Camera } from 'lucide-react';

export default function Notifications() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, notifications, markNotificationsAsRead } = useApp();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    // Mark all as read when entering the page
    if (currentUser) {
      markNotificationsAsRead();
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const userNotifications = notifications.filter(n => n.recipientUsername === currentUser.username);
  const unreadCount = notifications.filter(n => n.recipientUsername === currentUser.username && !n.read).length;

  return (
    <div className="flex-1 flex flex-col bg-black text-white min-h-screen">
      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col flex-grow bg-black pb-20">
        {/* Top header */}
        <div className="h-14 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center px-4 sticky top-0 z-30 select-none">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/feed')}
              className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-zinc-100">Notifications</h1>
          </div>
          
          {userNotifications.some(n => !n.read) && (
            <button 
              onClick={markNotificationsAsRead}
              className="py-1 px-3 bg-accent-pink/10 hover:bg-accent-pink/20 border border-accent-pink/40 text-accent-pink rounded-xl text-[10px] font-bold flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Read All</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-grow">
          {userNotifications.length === 0 ? (
            <div className="py-24 text-center">
              <Bell className="w-10 h-10 text-zinc-800 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-zinc-500 font-bold">No notifications yet</p>
              <p className="text-[10px] text-zinc-600 mt-1">Interactions with your Instants will appear here.</p>
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-3.5 bg-zinc-955 border rounded-2xl flex items-center justify-between transition-all animate-fade-in-up ${
                  notif.read ? 'border-zinc-900' : 'border-accent-pink/35 bg-accent-pink/5'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <img src={notif.senderAvatar} alt={notif.senderUsername} className="w-7 h-7 rounded-full object-cover border border-zinc-900 shadow-sm" />
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-300 leading-snug">
                      <span className="font-bold text-white">@{notif.senderUsername}</span>
                      {" "}reacted <span className="text-base select-all">{notif.emoji}</span> to your Instant
                    </p>
                    <span className="text-[9px] text-zinc-500 font-bold block mt-0.5">{notif.timestamp}</span>
                  </div>
                </div>
                
                <div className="w-10 h-12 rounded-lg overflow-hidden border border-zinc-900 shrink-0 bg-zinc-950">
                  <img src={notif.postUrl} alt="Post thumbnail" className="w-full h-full object-cover" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex min-h-screen w-full bg-[#000000] text-white">
        {/* Left Column (Sidebar Navigation — Fixed, 260px width) */}
        <aside className="w-[260px] bg-[#000000] border-r border-[#27272A] p-6 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
          <div className="flex flex-col">
            {/* Brand Header */}
            <div className="mb-8 flex items-center">
              <span className="text-xl font-black tracking-wider uppercase text-white select-none">Instants</span>
            </div>

            {/* User Profile Card */}
            <div 
              onClick={() => router.push(`/profile/${currentUser.username}`)}
              className="flex items-center space-x-3 bg-[#18181B] border border-[#27272A] hover:border-zinc-700/60 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] mb-8"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border border-zinc-900" />
              <div className="min-w-0">
                <h3 className="text-xs font-black text-zinc-150 truncate leading-tight">{currentUser.name}</h3>
                <p className="text-[10px] text-zinc-500 font-bold">@{currentUser.username}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              <button 
                onClick={() => router.push('/feed')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40 rounded-xl text-xs font-bold transition-all border border-transparent"
              >
                <Compass className="w-4 h-4 text-zinc-505" />
                <span>Feed</span>
              </button>

              <button 
                onClick={() => router.push('/chats')}
                className="w-full flex flex-col px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40 rounded-xl text-xs font-bold transition-all group"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-zinc-500 group-hover:text-zinc-350" />
                    <span>Chats</span>
                  </div>
                </div>
                
                {/* Sub-sections / Badges for Groups and Personal Messages */}
                <div className="w-full pl-7 mt-2 space-y-1.5 border-l border-zinc-800 text-left">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider py-0.5">
                    <span>Groups</span>
                    <span className="bg-accent-pink/15 text-accent-pink px-2 py-0.5 rounded-full text-[8px] font-black">3</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider py-0.5">
                    <span>DMs</span>
                    <span className="bg-accent-cyan/15 text-accent-cyan px-2 py-0.5 rounded-full text-[8px] font-black">2</span>
                  </div>
                </div>
              </button>

              {/* Notifications Link (Active) */}
              <button 
                onClick={() => router.push('/notifications')}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#18181B] text-white rounded-xl text-xs font-bold transition-all border border-[#27272A]"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-accent-cyan" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-accent-pink text-white px-2 py-0.5 rounded-full text-[8px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => router.push('/capture')}
              className="w-full py-3.5 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-90 active:scale-[0.98] text-black font-black rounded-2xl text-xs flex items-center justify-center space-x-2.5 transition-all shadow-md shadow-accent-pink/5"
            >
              <Camera className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Capture Instant</span>
            </button>
          </div>
        </aside>

        {/* Main Content Space */}
        <div className="flex-1 ml-[260px] flex items-center justify-center p-8 bg-[#000000]">
          <div className="max-w-2xl w-full bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-2xl flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-[#27272A] mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Notifications Inbox</h2>
                <p className="text-xs text-zinc-500 mt-1">Interactions with your shared Instants feed items.</p>
              </div>
              {userNotifications.some(n => !n.read) && (
                <button 
                  onClick={markNotificationsAsRead}
                  className="py-1.5 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 text-accent-cyan" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Notifications items */}
            <div className="space-y-4 overflow-y-auto max-h-[420px] no-scrollbar">
              {userNotifications.length === 0 ? (
                <div className="py-20 text-center flex flex-col justify-center items-center h-full">
                  <Bell className="w-12 h-12 text-zinc-800 mb-3 animate-pulse" />
                  <p className="text-sm text-zinc-400 font-bold">Your inbox is clean</p>
                  <p className="text-xs text-zinc-650 mt-1">Reactions from others will appear here.</p>
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 bg-black/40 border rounded-2xl flex items-center justify-between transition-all hover:border-zinc-800 animate-fade-in-up ${
                      notif.read ? 'border-zinc-900' : 'border-accent-pink/35 bg-accent-pink/5'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img src={notif.senderAvatar} alt={notif.senderUsername} className="w-7 h-7 rounded-full object-cover border border-zinc-900 shadow-md" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-200 leading-snug">
                          <span className="font-bold text-white">@{notif.senderUsername}</span>
                          {" "}reacted <span className="text-base select-all">{notif.emoji}</span> to your shared travel Instant.
                        </p>
                        <span className="text-[9px] text-zinc-500 font-bold block mt-1">{notif.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="w-11 h-14 rounded-lg overflow-hidden border border-zinc-900 shrink-0 bg-zinc-950 shadow-sm ml-4">
                      <img src={notif.postUrl} alt="Post thumbnail" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
