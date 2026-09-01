"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp, ChatMessage, TravelGroup, JoinRequest, Instant, PersonalChat } from '@/context/AppContext';
import { 
  ArrowLeft, Send, Pin, AlertCircle, Users, Settings, 
  Check, X, Sparkles, MessageCircle, FileText, Phone, MoreVertical, Paperclip, Download,
  MapPin, Calendar, Camera, ThumbsUp, Plus, Heart
} from 'lucide-react';
import Drawer from '@/components/Drawer';
import { TripLiveMap } from '@/components/TripLiveMap';

export default function ChatDetails() {
  const router = useRouter();
  const { chatId } = useParams();
  
  const { 
    currentUser, groups, joinRequests, personalChats, allUsers,
    sendGroupMessage, approveJoinRequest, declineJoinRequest,
    pinGroupMessage, unpinGroupMessage, sendPersonalMessage,
    addItineraryStop, voteItineraryStop, toggleLocationSharing
  } = useApp();

  // Find active group
  const group = groups.find(g => g.id === chatId);
  
  // Find active personal chat or resolve participant
  let personalChat = personalChats.find(c => c.id === chatId);
  let participant = null;
  let isDM = false;

  if (group) {
    isDM = false;
  } else if (chatId && typeof chatId === 'string') {
    isDM = true;
    const usernames = chatId.split('-');
    if (currentUser) {
      const participantUsername = usernames.find(u => u !== currentUser.username);
      participant = allUsers.find(u => u.username === participantUsername);
      
      // If conversation doesn't exist yet but participant is valid, mock a placeholder personalChat
      if (!personalChat && participant) {
        personalChat = {
          id: chatId,
          usernames: [currentUser.username, participant.username],
          messages: []
        };
      }
    }
  }

  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);

  // States
  const [inputText, setInputText] = useState('');
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JoinRequest | null>(null);
  const [expandedInstant, setExpandedInstant] = useState<Instant | null>(null);
  const [shareInstantPickerOpen, setShareInstantPickerOpen] = useState(false);
  const [itineraryOpen, setItineraryOpen] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!group && !participant) {
      router.push('/chats');
      return;
    }
    // Scroll to bottom of chat
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [group, personalChat, currentUser]);

  if (!currentUser || (!group && !participant)) return null;

  // Group specific properties
  const isMember = group ? group.members.includes(currentUser.username) : true;
  const isAdmin = group ? group.adminUsername === currentUser.username : false;
  const groupRequests = group ? joinRequests.filter(r => r.groupId === group.id && r.status === 'pending') : [];
  const pinnedMessages = group ? group.messages.filter(m => group.pinnedMessages.includes(m.id)) : [];
  const activeMembersCount = group ? allUsers.filter(u => group.members.includes(u.username) && u.isLocationShared).length : 0;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isDM && participant) {
      sendPersonalMessage(participant.username, inputText.trim());
    } else if (group) {
      sendGroupMessage(group.id, inputText.trim());
    }

    setInputText('');
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleShareInstant = (instant: Instant) => {
    if (isDM && participant) {
      sendPersonalMessage(participant.username, `Shared a travel Instant 📸`, instant);
    } else if (group) {
      sendGroupMessage(group.id, `Shared a travel Instant 📸`, instant);
    }
    setShareInstantPickerOpen(false);
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const messages = isDM ? (personalChat?.messages || []) : (group?.messages || []);

  // Compute Members List for Right Pane
  let membersList: {username: string, name: string, avatar: string, role?: string}[] = [];
  if (group) {
    membersList = group.members.map(u => {
      const user = allUsers.find(x => x.username === u);
      return {
        username: u,
        name: user?.name || u,
        avatar: user?.avatar || '',
        role: u === group.adminUsername ? 'Admin' : 'Member'
      };
    });
  } else if (isDM && participant) {
    membersList = [
      { username: currentUser.username, name: currentUser.name, avatar: currentUser.avatar, role: 'Me' },
      { username: participant.username, name: participant.name, avatar: participant.avatar, role: 'Participant' }
    ];
  }

  // Mock files based on UI (or map from instants if you prefer)
  const sharedFiles = [
    { name: 'itinerary.pdf', type: 'PDF', size: '2mb', ext: 'pdf' },
    { name: 'Screenshot-3817.png', type: 'PNG', size: '4mb', ext: 'png' },
    { name: 'budget_2025.xlsx', type: 'XLSX', size: '24mb', ext: 'xlsx' }
  ];

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden">
      
      {/* MAIN CHAT COLUMN */}
      <div className="flex-1 flex flex-col bg-[#050505] relative select-none h-full border-r border-[#1C1C1E] min-w-0">
        
        {/* Chat Header */}
        <div className="h-20 border-b border-zinc-900 flex justify-between items-center px-6 shrink-0 bg-[#050505] z-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/chats')}
              className="lg:hidden p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            {isDM && participant ? (
              <div className="flex items-center space-x-3">
                <img src={participant.avatar} alt={participant.name} className="w-11 h-11 rounded-full object-cover border border-zinc-800" />
                <div>
                  <h2 className="text-[15px] font-bold text-zinc-100">{participant.name}</h2>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <p className="text-[11px] text-zinc-400 font-bold">Online</p>
                  </div>
                </div>
              </div>
            ) : group ? (
              <div className="flex items-center space-x-3">
                <img src={group.avatar} alt={group.name} className="w-11 h-11 rounded-full object-cover border border-zinc-800" />
                <div>
                  <h2 className="text-[15px] font-bold text-zinc-100">{group.name}</h2>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <p className="text-[11px] text-zinc-400 font-bold">Active Group</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center space-x-3">
            {!isDM && group && (
              <button
                onClick={() => setMapOpen(prev => !prev)}
                className={`relative py-1.5 px-3 rounded-full text-[11px] font-bold flex items-center space-x-2 transition-all border shadow-lg backdrop-blur-md ${
                  mapOpen 
                    ? 'bg-emerald-500 text-slate-900 border-emerald-400' 
                    : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border-zinc-700'
                }`}
              >
                <span>📍 Live Map</span>
                <div className="flex items-center space-x-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${mapOpen ? 'bg-emerald-900' : 'bg-emerald-400'}`} />
                  <span className={mapOpen ? 'text-emerald-900' : 'text-emerald-400'}>{activeMembersCount} Active</span>
                </div>
              </button>
            )}

            {!isDM && isAdmin && (
              <button
                onClick={() => setAdminDrawerOpen(true)}
                className="relative py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-[11px] font-bold flex items-center space-x-1 transition-all"
              >
                <span>Requests</span>
                {groupRequests.length > 0 && (
                  <span className="w-2 h-2 bg-accent-pink rounded-full absolute -top-1 -right-1 animate-pulse" />
                )}
              </button>
            )}
            <button className="flex items-center space-x-2 bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple px-4 py-2 rounded-xl transition-all font-bold text-sm">
              <Phone className="w-4 h-4 fill-accent-purple/50" />
              <span className="hidden sm:inline">Call</span>
            </button>
          </div>
        </div>

        {/* Live Map Drawer */}
        {!isDM && group && mapOpen && (
          <TripLiveMap 
            group={group} 
            users={allUsers} 
            currentUser={currentUser}
            toggleLocationSharing={toggleLocationSharing}
            onDropInstant={() => router.push(`/capture?groupId=${group.id}&location=current`)}
            onClose={() => setMapOpen(false)}
          />
        )}

        {/* Admin Review Banner */}
        {!isDM && group && isAdmin && groupRequests.length > 0 && (
          <div className="bg-accent-pink/10 border-b border-accent-pink/20 py-3 px-6 flex items-center justify-between z-0 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔔</span>
              <p className="text-sm text-accent-pink font-bold">
                {groupRequests.length} pending join request{groupRequests.length !== 1 && 's'} for this trip
              </p>
            </div>
            <button 
              onClick={() => setAdminDrawerOpen(true)}
              className="px-4 py-1.5 bg-accent-pink text-black text-xs font-black rounded-lg hover:bg-accent-pink/90 transition-colors shadow-[0_0_15px_rgba(255,42,133,0.3)]"
            >
              Review Applicants
            </button>
          </div>
        )}

        {/* Trip Overview Banner (Groups only) */}
        {!isDM && group && (
          <div className="bg-zinc-950/50 border-b border-zinc-900/50 flex flex-col z-0 shrink-0">
            <div 
              className="py-3 px-6 flex items-center justify-between cursor-pointer hover:bg-zinc-900/30 transition-colors"
              onClick={() => setItineraryOpen(!itineraryOpen)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 bg-black/40 px-2.5 py-1 rounded-md border border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="text-[11px] font-bold text-zinc-200">{group.destination}</span>
                </div>
                {group.travelDates && (
                  <div className="flex items-center space-x-1.5 text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">{group.travelDates}</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center space-x-1.5 text-zinc-500">
                  <span className="text-[10px] font-black tracking-widest uppercase">• {group.members.length} Travelers Active</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase">Itinerary</span>
                <div className={`transition-transform duration-300 ${itineraryOpen ? 'rotate-180' : ''}`}>
                  <ArrowLeft className="w-4 h-4 -rotate-90 text-zinc-500" />
                </div>
              </div>
            </div>

            {/* Expandable Itinerary */}
            {itineraryOpen && (
              <div className="px-6 py-4 bg-black/40 border-t border-zinc-900/50 animate-fade-in-up">
                <div className="flex flex-col space-y-3">
                  {group.itinerary && group.itinerary.length > 0 ? (
                    group.itinerary.map(stop => (
                      <div key={stop.id} className="flex items-center justify-between bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
                        <span className="text-[13px] font-semibold text-zinc-200">{stop.name}</span>
                        <button 
                          onClick={() => voteItineraryStop(group.id, stop.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                            currentUser && stop.votedBy.includes(currentUser.username)
                              ? 'bg-accent-pink/10 border-accent-pink/30 text-accent-pink'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${currentUser && stop.votedBy.includes(currentUser.username) ? 'fill-accent-pink' : ''}`} />
                          <span className="text-[11px] font-bold">{stop.votes}</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-zinc-500 italic">No stops planned yet. Add one below!</p>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="text"
                      value={newStopName}
                      onChange={(e) => setNewStopName(e.target.value)}
                      placeholder="Add a stop (e.g. Abbey Falls)..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-cyan"
                    />
                    <button 
                      onClick={() => {
                        if(newStopName.trim()) {
                          addItineraryStop(group.id, newStopName.trim());
                          setNewStopName('');
                        }
                      }}
                      disabled={!newStopName.trim()}
                      className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pinned Messages Banner (Groups only) */}
        {!isDM && group && pinnedMessages.length > 0 && (
          <div className="bg-zinc-900/50 border-b border-zinc-900 py-2.5 px-6 flex items-center space-x-3 z-0 shrink-0">
            <Pin className="w-4 h-4 text-accent-purple fill-accent-purple/20 rotate-45 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-zinc-300 truncate font-medium">
                <span className="text-zinc-500 font-bold mr-2">Pinned</span>
                {pinnedMessages[0].text}
              </p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => unpinGroupMessage(group.id, pinnedMessages[0].id)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 font-bold ml-4 shrink-0"
              >
                Unpin
              </button>
            )}
          </div>
        )}

        {/* Message Area */}
        {!isMember ? (
          <div className="flex-1 flex flex-col justify-center items-center px-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-zinc-700 animate-bounce" />
            <h3 className="text-sm font-bold text-zinc-300">Access Denied</h3>
            <p className="text-xs text-zinc-500 max-w-[240px]">
              You must be an approved member to participate in this group chat room.
            </p>
            <button
              onClick={() => router.push('/chats')}
              className="py-2 px-5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold"
            >
              Browse Other Groups
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {messages.length === 0 ? (
              <div className="py-24 text-center">
                <MessageCircle className="w-10 h-10 text-zinc-800 mx-auto mb-3 animate-pulse" />
                <p className="text-sm text-zinc-500 font-bold">Start the discussion!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => {
                  const isMe = message.senderId === currentUser.username;
                  const isSystem = message.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={message.id} className="w-full flex justify-center py-2 animate-fade-in-up">
                        <span className="px-4 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold tracking-wide">
                          {message.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={message.id} 
                      className={`flex items-end space-x-3 animate-fade-in-up ${
                        isMe ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <img 
                        src={message.senderAvatar} 
                        alt={message.senderName} 
                        className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 mb-1" 
                      />
                      <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Sender info above bubble for non-DM groups when not self */}
                        {!isMe && !isDM && (
                          <span className="text-[11px] font-bold text-zinc-500 mb-1 ml-1">{message.senderName}</span>
                        )}
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-accent-purple text-white rounded-br-sm' 
                              : 'bg-zinc-900 text-zinc-100 rounded-bl-sm'
                          }`}
                        >
                          {/* Attached Instant rendering */}
                          {message.instant && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-black/20 relative aspect-[3/4] bg-black">
                              <img src={message.instant.url} alt="Attached" className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs py-0.5 px-2 rounded-md text-[9px] text-white uppercase tracking-widest font-bold">
                                Instant
                              </div>
                            </div>
                          )}
                          
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        </div>
                        
                        <div className={`flex items-center space-x-2 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                          <span className="text-[9px] text-zinc-600 font-bold">{message.timestamp}</span>
                          {!isDM && group && isAdmin && (
                            <button
                              onClick={() => {
                                if (group.pinnedMessages.includes(message.id)) {
                                  unpinGroupMessage(group.id, message.id);
                                } else {
                                  pinGroupMessage(group.id, message.id);
                                }
                              }}
                              className="text-[9px] text-zinc-500 hover:text-zinc-300 font-bold flex items-center space-x-1"
                            >
                              <span>{group.pinnedMessages.includes(message.id) ? 'Unpin' : 'Pin'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        )}

        {/* Input Tray */}
        {isMember && (
          <div className="p-4 bg-[#050505] shrink-0 border-t border-zinc-900/50">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 bg-zinc-900/80 rounded-2xl p-1.5 border border-zinc-800">
              <button
                type="button"
                onClick={() => setShareInstantPickerOpen(true)}
                className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                title="Attach"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {!isDM && group && (
                <button
                  type="button"
                  onClick={() => router.push(`/capture?groupId=${group.id}`)}
                  className="p-2.5 text-accent-cyan hover:text-white hover:bg-accent-cyan/20 rounded-xl transition-all"
                  title="Capture Instant to Group"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              
              <input
                type="text"
                placeholder={isDM && participant ? `Message @${participant.username}...` : "Type a message..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent border-none px-2 text-[15px] text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 text-accent-purple disabled:opacity-40 hover:text-white hover:bg-accent-purple rounded-xl transition-all disabled:hover:bg-transparent disabled:hover:text-accent-purple"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* RIGHT PANE: Directory */}
      <div className="hidden xl:flex w-[300px] flex-col bg-[#000000] overflow-y-auto no-scrollbar p-5 pb-8 shrink-0 border-l border-zinc-900">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[17px] font-bold text-white tracking-tight">Directory</h2>
          <button className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-[13px] font-black text-zinc-100">Team Members</h3>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] font-bold text-zinc-400">
              {membersList.length}
            </span>
          </div>
          
          <div className="space-y-4">
            {membersList.map((member) => (
              <div key={member.username} className="flex items-center space-x-3 group cursor-pointer">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-zinc-800 group-hover:border-zinc-600 transition-colors" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{member.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Files */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-[13px] font-black text-zinc-100">Files</h3>
            <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] font-bold text-zinc-400">
              {sharedFiles.length}
            </span>
          </div>

          <div className="space-y-4">
            {sharedFiles.map((file, i) => (
              <div key={i} className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#080808] border border-zinc-900 flex items-center justify-center text-accent-purple shrink-0 group-hover:bg-zinc-900 transition-colors">
                  <FileText className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{file.name}</p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{file.type}</span>
                    <span className="text-[10px] text-zinc-600 font-bold">{file.size}</span>
                  </div>
                </div>
                <button className="text-zinc-600 group-hover:text-accent-purple transition-colors p-2 shrink-0">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trip Gallery */}
        {!isDM && group && group.recentInstants.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-[13px] font-black text-zinc-100">Trip Gallery</h3>
              <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] font-bold text-zinc-400">
                {group.recentInstants.length}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {group.recentInstants.map((url, i) => (
                <div 
                  key={i} 
                  className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative cursor-pointer hover:border-accent-cyan transition-colors"
                  onClick={() => setExpandedInstant({
                    id: `mock-id-${i}`,
                    url,
                    type: url.includes('.mp4') ? 'video' : 'image',
                    timestamp: 'Just now',
                    author: 'Group Member',
                    authorUsername: 'group_member',
                    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    audience: 'Group',
                    likes: 0,
                    comments: []
                  })}
                >
                  {url.includes('.mp4') ? (
                    <video src={url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Instant Attachment Picker Drawer */}
      <Drawer
        isOpen={shareInstantPickerOpen}
        onClose={() => setShareInstantPickerOpen(false)}
        title="Share Live Instant"
      >
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-505 font-bold uppercase tracking-wider">Select one of your Instants to share to chat</p>
          
          {currentUser.instants.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <FileText className="w-8 h-8 text-zinc-800 mb-2" />
              <p className="text-xs text-zinc-500">No Instants captured yet. Capture one first!</p>
              <button 
                onClick={() => router.push('/capture')}
                className="mt-3 py-1.5 px-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Go to Capture
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {currentUser.instants.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => handleShareInstant(inst)}
                  className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative cursor-pointer group hover:border-accent-cyan active:scale-95 transition-all"
                >
                  <img src={inst.url} alt="Capture" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] bg-white text-black font-bold py-1 px-2.5 rounded-full">Share</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      {/* ADMIN REVIEW DRAWER (Groups only) */}
      {!isDM && group && (
        <Drawer
          isOpen={adminDrawerOpen}
          onClose={() => {
            setAdminDrawerOpen(false);
            setSelectedApplicant(null);
          }}
          title={`Review Requests (${groupRequests.length})`}
        >
          {selectedApplicant ? (
            /* PREVIEW MODAL - INSPECT CANDIDATE DETAILS & INSTANTS HISTORY */
            <div className="space-y-5 animate-fade-in-up">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-[10px] text-accent-cyan font-bold tracking-wider uppercase flex items-center space-x-1"
              >
                <span>← Back to requests</span>
              </button>

              {/* Applicant Profile */}
              <div className="flex space-x-4 items-start bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
                <img 
                  src={selectedApplicant.applicantAvatar} 
                  alt={selectedApplicant.applicantName} 
                  className="w-12 h-12 rounded-full object-cover border border-zinc-800" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-100">{selectedApplicant.applicantName}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono">@{selectedApplicant.username}</p>
                  
                  {selectedApplicant.applicantMessage && (
                    <div className="mt-2.5 mb-2 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 relative">
                      <div className="absolute -top-2 left-3 bg-zinc-950 px-1">
                        <span className="text-[8px] uppercase tracking-widest text-accent-cyan font-bold">Intro Message</span>
                      </div>
                      <p className="text-[11px] text-zinc-200 italic leading-relaxed">
                        "{selectedApplicant.applicantMessage}"
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-light">
                    {selectedApplicant.applicantBio}
                  </p>
                </div>
              </div>

              {/* Past Instants Grid */}
              <div>
                <div className="flex items-center space-x-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                  <h5 className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                    Past Instants Archive ({selectedApplicant.applicantInstants.length})
                  </h5>
                </div>
                
                {selectedApplicant.applicantInstants.length === 0 ? (
                  <div className="py-8 bg-zinc-950/40 rounded-xl border border-zinc-900 text-center">
                    <p className="text-xs text-zinc-650">No Instants shared yet by this user.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3.5">
                    {selectedApplicant.applicantInstants.map((inst) => (
                      <div 
                        key={inst.id} 
                        onClick={() => setExpandedInstant(inst)}
                        className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative cursor-pointer hover:border-accent-cyan transition-colors"
                      >
                        <img src={inst.url} alt="Applicant capture" className="w-full h-full object-cover" />
                        {inst.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent text-[8px] text-zinc-300 leading-snug">
                            {inst.caption}
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decisions Bar */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-900/60">
                <button
                  onClick={() => {
                    declineJoinRequest(selectedApplicant.id);
                    setSelectedApplicant(null);
                  }}
                  className="py-3 bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4 text-accent-pink" />
                  <span>Decline</span>
                </button>

                <button
                  onClick={() => {
                    approveJoinRequest(selectedApplicant.id);
                    setSelectedApplicant(null);
                    setAdminDrawerOpen(false);
                  }}
                  className="py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ) : (
            /* REQUESTS LIST */
            <div className="space-y-3">
              {groupRequests.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
                  <p className="text-xs text-zinc-650 font-semibold">No pending requests for this group.</p>
                </div>
              ) : (
                groupRequests.map((request) => (
                  <div 
                    key={request.id}
                    onClick={() => setSelectedApplicant(request)}
                    className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between hover:border-zinc-800 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={request.applicantAvatar} alt="Applicant" className="w-9 h-9 rounded-full object-cover border border-zinc-850" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-150 truncate">{request.applicantName}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">@{request.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2.5">
                      <div className="flex -space-x-1">
                        {request.applicantInstants.slice(0, 2).map((inst, idx) => (
                          <div key={idx} className="w-5 h-6 rounded-md border border-zinc-900 overflow-hidden bg-zinc-950">
                            <img src={inst.url} alt="vibe" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-accent-cyan font-bold tracking-wide">Review →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Drawer>
      )}

      {/* Expanded Instant Modal */}
      {expandedInstant && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in">
          <button 
            onClick={() => setExpandedInstant(null)}
            className="absolute top-6 right-6 p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-full text-white transition-colors z-10 backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-lg h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-zinc-950">
            {expandedInstant.type === 'video' ? (
              <video 
                src={expandedInstant.url} 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                playsInline
                muted={false}
              />
            ) : (
              <img src={expandedInstant.url} alt="Instant full" className="w-full h-full object-cover" />
            )}
            
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-center space-x-3 mb-3">
                <img src={expandedInstant.authorAvatar} alt="author" className="w-8 h-8 rounded-full border border-white" />
                <span className="text-white font-bold text-sm">@{expandedInstant.authorUsername}</span>
              </div>
              {expandedInstant.caption && (
                <p className="text-white text-sm">{expandedInstant.caption}</p>
              )}
              {expandedInstant.destination && (
                <div className="mt-3">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded text-white backdrop-blur-sm">📍 {expandedInstant.destination}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
