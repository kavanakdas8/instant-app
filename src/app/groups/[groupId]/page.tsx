"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp, ChatMessage, TravelGroup, JoinRequest, Instant } from '@/context/AppContext';
import { 
  ArrowLeft, Send, Pin, AlertCircle, Users, Settings, 
  Check, X, Image as ImageIcon, Sparkles, MessageCircle, FileText
} from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function GroupDetails() {
  const router = useRouter();
  const { groupId } = useParams();
  
  const { 
    currentUser, groups, joinRequests, 
    sendGroupMessage, approveJoinRequest, declineJoinRequest,
    pinGroupMessage, unpinGroupMessage
  } = useApp();

  // Find active group
  const group = groups.find(g => g.id === groupId);
  
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);

  // States
  const [inputText, setInputText] = useState('');
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JoinRequest | null>(null);
  const [shareInstantPickerOpen, setShareInstantPickerOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!group) {
      router.push('/groups');
      return;
    }
    // Scroll to bottom of chat
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [group, currentUser]);

  if (!currentUser || !group) return null;

  const isMember = group.members.includes(currentUser.username);
  const isAdmin = group.adminUsername === currentUser.username;

  // Get pending requests for this group
  const groupRequests = joinRequests.filter(r => r.groupId === group.id && r.status === 'pending');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendGroupMessage(group.id, inputText.trim());
    setInputText('');
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleShareInstant = (instant: Instant) => {
    sendGroupMessage(group.id, `Shared a travel Instant 📸`, instant);
    setShareInstantPickerOpen(false);
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Find pinned messages
  const pinnedMessages = group.messages.filter(m => group.pinnedMessages.includes(m.id));

  return (
    <div className="flex-1 flex flex-col bg-[#050505] relative select-none h-screen">
      {/* Group Chat Header */}
      <div className="h-16 bg-[#080808]/90 backdrop-blur-md border-b border-zinc-900 flex justify-between items-center px-4 z-30">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.push('/groups')}
            className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <img src={group.avatar} alt={group.name} className="w-9 h-9 rounded-xl object-cover border border-zinc-900" />
            <div>
              <h2 className="text-xs font-bold text-zinc-100 truncate max-w-[120px]">{group.name}</h2>
              <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{group.vibe}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Admin Reviews Trigger */}
          {isAdmin && (
            <button
              onClick={() => setAdminDrawerOpen(true)}
              className="relative py-1.5 px-3 bg-accent-purple/10 hover:bg-accent-purple/20 border border-accent-purple/40 text-accent-purple rounded-xl text-[10px] font-bold flex items-center space-x-1 transition-all active:scale-95"
            >
              <span>Review Requests</span>
              {groupRequests.length > 0 && (
                <span className="w-2 h-2 bg-accent-pink rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
              )}
            </button>
          )}

          <div className="flex items-center text-zinc-500 text-[10px] font-bold">
            <Users className="w-3.5 h-3.5 mr-1" />
            <span>{group.members.length}</span>
          </div>
        </div>
      </div>

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="bg-zinc-950/90 border-b border-zinc-900/60 py-2 px-4 flex items-center space-x-2 z-20 shadow-sm animate-fade-in-up">
          <Pin className="w-3.5 h-3.5 text-accent-cyan fill-accent-cyan/10 rotate-45" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Pinned Update</p>
            <p className="text-[11px] text-zinc-300 truncate mt-0.5 font-medium">
              "{pinnedMessages[0].text}"
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => unpinGroupMessage(group.id, pinnedMessages[0].id)}
              className="text-[10px] text-zinc-600 hover:text-zinc-400 font-bold underline"
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
            onClick={() => router.push('/groups')}
            className="py-2 px-5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold"
          >
            Browse Other Groups
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {group.messages.length === 0 ? (
            <div className="py-24 text-center">
              <MessageCircle className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
              <p className="text-xs text-zinc-600 font-semibold">Start the discussion! Send a message below.</p>
            </div>
          ) : (
            group.messages.map((message) => {
              const isMe = message.senderId === currentUser.username;
              const isSystem = message.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={message.id} className="w-full text-center py-2 animate-fade-in-up">
                    <span className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-full text-[9px] font-bold tracking-wide">
                      {message.text}
                    </span>
                  </div>
                );
              }

              return (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-2.5 animate-fade-in-up ${
                    isMe ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <img 
                    src={message.senderAvatar} 
                    alt={message.senderName} 
                    className="w-7 h-7 rounded-full object-cover border border-zinc-900 mt-1" 
                  />
                  <div className="max-w-[70%] flex flex-col">
                    <div className={`flex items-center space-x-1.5 mb-1 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-[10px] font-bold text-zinc-400">@{message.senderUsername}</span>
                      <span className="text-[8px] text-zinc-600">{message.timestamp}</span>
                    </div>

                    <div 
                      className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-zinc-100 text-black border-zinc-200 rounded-tr-none' 
                          : 'bg-zinc-950/80 text-zinc-200 border-zinc-900 rounded-tl-none'
                      }`}
                    >
                      {/* Attached Instant rendering */}
                      {message.instant && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-zinc-900/40 relative aspect-[3/4] bg-black">
                          <img src={message.instant.url} alt="Attached" className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs py-0.5 px-1.5 rounded-md text-[8px] text-accent-cyan border border-white/5 uppercase tracking-widest font-bold">
                            Instant
                          </div>
                        </div>
                      )}
                      
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {/* Admin Message Actions (Pinning) */}
                    {isAdmin && (
                      <div className={`flex mt-1 ${isMe ? 'justify-end' : ''}`}>
                        <button
                          onClick={() => {
                            if (group.pinnedMessages.includes(message.id)) {
                              unpinGroupMessage(group.id, message.id);
                            } else {
                              pinGroupMessage(group.id, message.id);
                            }
                          }}
                          className="text-[9px] text-zinc-600 hover:text-zinc-400 font-bold flex items-center space-x-1.5 py-0.5 px-1.5 rounded bg-zinc-950 border border-zinc-900/60"
                        >
                          <Pin className="w-2.5 h-2.5 rotate-45" />
                          <span>{group.pinnedMessages.includes(message.id) ? 'Unpin message' : 'Pin message'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>
      )}

      {/* Input Tray */}
      {isMember && (
        <form onSubmit={handleSendMessage} className="border-t border-zinc-900/80 p-3 bg-[#080808]/95 flex items-center space-x-2 z-10 pb-6">
          {/* Share Instant Attachment Button */}
          <button
            type="button"
            onClick={() => setShareInstantPickerOpen(true)}
            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all"
            title="Attach Instant"
          >
            <ImageIcon className="w-4 h-4 text-accent-cyan" />
          </button>

          <input
            type="text"
            placeholder="Discuss trip itineraries..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-black border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/10"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-white text-black font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-200 active:scale-95 transition-all text-xs"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>
      )}

      {/* Share Instant Attachment Picker Drawer */}
      <Drawer
        isOpen={shareInstantPickerOpen}
        onClose={() => setShareInstantPickerOpen(false)}
        title="Share Live Instant"
      >
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Select one of your Instants to share to chat</p>
          
          {currentUser.instants.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <ImageIcon className="w-8 h-8 text-zinc-800 mb-2" />
              <p className="text-xs text-zinc-600">No Instants captured yet. Capture one first!</p>
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

      {/* ADMIN REVIEW DRAWER */}
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
                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-light">
                  {selectedApplicant.applicantBio}
                </p>
              </div>
            </div>

            {/* Past Instants Grid (To verify authenticity/vibe) */}
            <div>
              <div className="flex items-center space-x-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                <h5 className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                  Past Instants Archive ({selectedApplicant.applicantInstants.length})
                </h5>
              </div>
              
              {selectedApplicant.applicantInstants.length === 0 ? (
                <div className="py-8 bg-zinc-950/40 rounded-xl border border-zinc-900 text-center">
                  <p className="text-xs text-zinc-600">No Instants shared yet by this user.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  {selectedApplicant.applicantInstants.map((inst) => (
                    <div 
                      key={inst.id} 
                      className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative"
                    >
                      <img src={inst.url} alt="Applicant capture" className="w-full h-full object-cover" />
                      {inst.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent text-[8px] text-zinc-300 leading-snug">
                          {inst.caption}
                        </div>
                      )}
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
                  setAdminDrawerOpen(false); // Close drawer to show system join message in chat!
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
                <p className="text-xs text-zinc-600 font-semibold">No pending requests for this group.</p>
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
                    {/* Tiny grid previews representing their profile archive */}
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
    </div>
  );
}
