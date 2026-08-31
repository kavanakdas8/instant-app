"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useApp, TravelGroup } from '@/context/AppContext';
import { Search, MapPin, Compass, ArrowRight, UserPlus, CheckCircle, Clock, MessageSquare, PlusCircle, ArrowLeft, Check, ChevronDown, Plus, ChevronLeft } from 'lucide-react';
import Drawer from '@/components/Drawer';

function SearchParamsHandler({
  onTabChange,
  onNewChat
}: {
  onTabChange: (tab: 'groups' | 'dms') => void;
  onNewChat: () => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'groups' || tab === 'dms') {
      onTabChange(tab);
    }
    if (searchParams.get('new') === 'true') {
      onNewChat();
    }
  }, [searchParams, onTabChange, onNewChat]);

  return null;
}

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
      <Suspense fallback={null}>
        <SearchParamsHandler
          onTabChange={setActiveTab}
          onNewChat={() => setNewChatDrawerOpen(true)}
        />
      </Suspense>
      {/* LEFT PANE: Chat List */}
      <div className={`${isChatDetail ? 'hidden lg:flex' : 'flex'} w-full lg:w-[320px] flex-col border-r border-[#1C1C1E] bg-black p-4 select-none pb-20 lg:pb-4`}>
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/feed')}
              className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <span>Messages</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-xs font-bold text-zinc-300">
              {groups.length + userDMs.length}
            </span>
          </div>
          
          <button 
            onClick={() => setNewChatDrawerOpen(true)}
            className="w-8 h-8 rounded-full bg-accent-purple hover:bg-accent-purple/90 text-white flex items-center justify-center transition-colors shadow-lg shadow-accent-purple/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all"
          />
        </div>

        {/* Tabs Segmented Control */}
        <div className="flex bg-zinc-900/50 p-1 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all ${
              activeTab === 'groups'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('dms')}
            className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all ${
              activeTab === 'dms'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            DMs
          </button>
        </div>

        {/* LIST CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 -mx-2 px-2">
          {/* GROUPS TAB CONTENT */}
          {activeTab === 'groups' && (
            <div className="flex flex-col space-y-1">
              {/* Destination Pills filter tab */}
              <div className="flex space-x-2 mb-3 overflow-x-auto no-scrollbar scroll-smooth">
                {destinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setActiveFilter(dest)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                      activeFilter === dest
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900/50 text-zinc-400 border-transparent hover:bg-zinc-900'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>

              {filteredGroups.length === 0 ? (
                <div className="py-16 text-center">
                  <Compass className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No groups found.</p>
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const groupState = getGroupState(group);
                  const isActive = pathname === `/chats/${group.id}`;
                  const lastMessage = group.messages[group.messages.length - 1];
                  
                  return (
                    <div 
                      key={group.id} 
                      onClick={() => {
                         if (groupState === 'joined') {
                           router.push(`/chats/${group.id}`);
                         }
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col space-y-2 animate-fade-in-up group ${
                        isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img 
                          src={group.avatar} 
                          alt={group.name} 
                          className="w-10 h-10 rounded-full object-cover border border-zinc-800 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <h3 className="text-[13px] font-bold text-zinc-100 truncate">{group.name}</h3>
                            <span className="text-[10px] text-zinc-500 shrink-0">{lastMessage?.timestamp || 'New'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {lastMessage ? lastMessage.text : (
                              groupState === 'joined' ? 'Start chatting!' : 'Join to chat'
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Tags row */}
                      <div className="flex items-center space-x-1.5 pl-13">
                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[9px] font-bold rounded-full">
                          {group.destination}
                        </span>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-bold rounded-full">
                          {group.vibe}
                        </span>
                        {groupState === 'pending' && (
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[9px] font-bold rounded-full">
                            Pending
                          </span>
                        )}
                        {groupState === 'none' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              requestToJoinGroup(group.id);
                            }}
                            className="px-2 py-0.5 bg-white text-black text-[9px] font-bold rounded-full hover:bg-zinc-200"
                          >
                            Request to Join
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* DIRECT MESSAGES TAB CONTENT */}
          {activeTab === 'dms' && (
            <div className="flex flex-col space-y-1">
              {userDMs.length === 0 ? (
                <div className="py-20 text-center flex-1 flex flex-col justify-center items-center">
                  <MessageSquare className="w-10 h-10 text-zinc-800 mb-3 animate-pulse" />
                  <p className="text-xs text-zinc-400 font-bold">No active DMs</p>
                </div>
              ) : (
                userDMs.map((chat) => {
                  const otherUsername = chat.usernames.find(u => u !== currentUser.username) || '';
                  const otherUser = allUsers.find(u => u.username === otherUsername);
                  if (!otherUser) return null;
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  const isActive = pathname === `/chats/${chat.id}`;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => router.push(`/chats/${chat.id}`)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col space-y-2 animate-fade-in-up group ${
                        isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                            <h3 className="text-[13px] font-bold text-zinc-100 truncate">{otherUser.name}</h3>
                            <span className="text-[10px] text-zinc-500 shrink-0">{lastMessage?.timestamp || 'New'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {lastMessage ? lastMessage.text : 'No messages yet'}
                          </p>
                        </div>
                      </div>

                      {/* Tags row */}
                      <div className="flex items-center space-x-1.5 pl-13">
                        <span className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-[9px] font-bold rounded-full">
                          Direct
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Chat Details or Empty State */}
      <div className={`${isChatDetail ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-[#050505]`}>
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
          </div>
        </div>
      </Drawer>
    </div>
  );
}
