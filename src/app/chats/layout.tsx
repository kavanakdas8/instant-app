"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useApp, TravelGroup } from '@/context/AppContext';
import { Search, MapPin, Compass, ArrowRight, UserPlus, CheckCircle, Clock, MessageSquare, PlusCircle, ArrowLeft, Check } from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, groups, joinRequests, requestToJoinGroup, personalChats, allUsers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'groups' | 'dms'>('groups');
  const [newChatDrawerOpen, setNewChatDrawerOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');

  // Check if we are viewing a specific chat
  const isChatDetail = pathname !== '/chats';

  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'groups' || tab === 'dms') {
      setActiveTab(tab);
    }
    if (searchParams.get('new') === 'true') {
      setNewChatDrawerOpen(true);
    }
  }, [searchParams]);

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

  // Get active DMs for the current user
  const userDMs = personalChats.filter(chat => chat.usernames.includes(currentUser.username));

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
    <div className="flex h-screen w-full bg-[#000000]">
      {/* LEFT PANE: Chat List */}
      {/* On mobile, hide this if we are in a chat detail view. On desktop, always show it (md:flex). */}
      <div className={`${isChatDetail ? 'hidden md:flex' : 'flex'} w-full md:w-[360px] flex-col border-r border-[#27272A] bg-black px-4 pt-6 select-none pb-20 md:pb-0`}>
        {/* Page Header */}
        <div className="mb-6 flex items-start space-x-3">
          <button 
            onClick={() => router.back()}
            className="p-1.5 mt-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors active:scale-95 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>Inbox & Chats</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Chat with group members or send direct messages to other travelers.
            </p>
          </div>
        </div>

        {/* Tabs Segmented Control */}
        <div className="flex border-b border-zinc-900 mb-6 bg-zinc-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg transition-all ${
              activeTab === 'groups'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            Travel Groups
          </button>
          <button
            onClick={() => setActiveTab('dms')}
            className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg transition-all ${
              activeTab === 'dms'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            Direct Messages
          </button>
        </div>

        {/* LIST CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
          {/* GROUPS TAB CONTENT */}
          {activeTab === 'groups' && (
            <div className="flex flex-col space-y-4">
              {/* Search Input */}
              <div className="relative mb-1">
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
              <div className="flex space-x-2 mb-2 overflow-x-auto no-scrollbar scroll-smooth">
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
                        className="bg-[#080808] p-5 rounded-2xl border border-zinc-900 hover:border-zinc-800/80 transition-all flex flex-col justify-between animate-fade-in-up"
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
                                onClick={() => router.push(`/chats/${group.id}`)}
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
          )}

          {/* DIRECT MESSAGES TAB CONTENT */}
          {activeTab === 'dms' && (
            <div className="flex flex-col space-y-4">
              {/* New Chat Banner Header */}
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Your Conversations</h2>
                <button
                  onClick={() => setNewChatDrawerOpen(true)}
                  className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 border border-zinc-800"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Start New Chat</span>
                </button>
              </div>

              {/* DM list */}
              {userDMs.length === 0 ? (
                <div className="py-20 text-center flex-1 flex flex-col justify-center items-center">
                  <MessageSquare className="w-10 h-10 text-zinc-800 mb-3 animate-pulse" />
                  <p className="text-xs text-zinc-400 font-bold">No active direct messages</p>
                  <p className="text-[10px] text-zinc-650 mt-1 max-w-[220px]">
                    Click "Start New Chat" to reach out to fellow adventurers!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDMs.map((chat) => {
                    const otherUsername = chat.usernames.find(u => u !== currentUser.username) || '';
                    const otherUser = allUsers.find(u => u.username === otherUsername);
                    if (!otherUser) return null;
                    const lastMessage = chat.messages[chat.messages.length - 1];

                    return (
                      <div
                        key={chat.id}
                        onClick={() => router.push(`/chats/${chat.id}`)}
                        className={`bg-[#080808] p-4 rounded-2xl border ${pathname === `/chats/${chat.id}` ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-900'} hover:border-zinc-800 cursor-pointer transition-all flex items-center justify-between group animate-fade-in-up`}
                      >
                        <div className="flex space-x-3.5 items-center min-w-0 flex-1">
                          <img
                            src={otherUser.avatar}
                            alt={otherUser.name}
                            className="w-11 h-11 rounded-full object-cover border border-zinc-900 group-hover:border-zinc-700 transition-colors"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">
                              {otherUser.name}
                            </h3>
                            <p className="text-[9px] text-zinc-500 font-bold">@{otherUser.username}</p>
                            <p className="text-[11px] text-zinc-400 truncate mt-1.5 max-w-[200px]">
                              {lastMessage ? lastMessage.text : 'No messages yet'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 pl-2 shrink-0">
                          <span className="text-[9px] text-zinc-600 font-bold uppercase">
                            {lastMessage ? lastMessage.timestamp : ''}
                          </span>
                          <span className="text-[10px] text-accent-cyan font-bold tracking-wide flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                            <span>Chat</span>
                            <ArrowRight className="w-3.5 h-3.5 text-accent-cyan" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Chat Details or Empty State */}
      {/* On mobile, hidden if we are just viewing the list. On desktop, always show (md:flex) */}
      <div className={`${isChatDetail ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#050505]`}>
        {children}
      </div>

      {/* New Chat Drawer */}
      <Drawer
        isOpen={newChatDrawerOpen}
        onClose={() => {
          setNewChatDrawerOpen(false);
          setNewChatSearch('');
        }}
        title="New message"
      >
        <div className="flex flex-col h-[70vh] md:h-[500px]">
          {/* Search Bar */}
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3 mb-3">
            <span className="text-sm font-bold text-zinc-200">To:</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={newChatSearch}
              onChange={(e) => setNewChatSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
            />
          </div>

          {/* List of People and Groups */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-4">
            {/* Users */}
            {allUsers
              .filter(u => u.username !== currentUser.username && (u.name.toLowerCase().includes(newChatSearch.toLowerCase()) || u.username.toLowerCase().includes(newChatSearch.toLowerCase())))
              .map((user) => (
                  <div
                    key={user.username}
                    onClick={() => {
                      setNewChatDrawerOpen(false);
                      setNewChatSearch('');
                      const sorted = [currentUser.username, user.username].sort();
                      const chatId = `${sorted[0]}-${sorted[1]}`;
                      router.push(`/chats/${chatId}`);
                    }}
                    className="p-3 hover:bg-zinc-900/50 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-zinc-900" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">{user.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-medium">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                )
              )}

            {/* Groups */}
            {groups
              .filter(g => g.name.toLowerCase().includes(newChatSearch.toLowerCase()))
              .map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setNewChatDrawerOpen(false);
                      setNewChatSearch('');
                      router.push(`/chats/${group.id}`);
                    }}
                    className="p-3 hover:bg-zinc-900/50 rounded-xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-xl object-cover border border-zinc-900" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">{group.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Travel Group</p>
                      </div>
                    </div>
                  </div>
                )
              )}
              
            {/* Empty State */}
            {allUsers.filter(u => u.username !== currentUser.username && (u.name.toLowerCase().includes(newChatSearch.toLowerCase()) || u.username.toLowerCase().includes(newChatSearch.toLowerCase()))).length === 0 && 
             groups.filter(g => g.name.toLowerCase().includes(newChatSearch.toLowerCase())).length === 0 && (
               <div className="py-8 text-center text-xs text-zinc-500">No accounts or groups found.</div>
             )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
