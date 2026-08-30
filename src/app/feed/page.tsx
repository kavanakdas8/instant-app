"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import {
  Heart, MessageCircle, Send, Volume2, VolumeX, AlertCircle,
  Compass, MessageSquare, Camera, ChevronLeft, ChevronRight, MoreHorizontal, Bell, Sparkles, UserCheck, Users, PlusSquare, Search, X, Settings
} from 'lucide-react';
import Drawer from '@/components/Drawer';
import Logo from '@/components/Logo';

export default function Feed() {
  const router = useRouter();
  const { currentUser, feed, likePost, addComment, notifications, addNotification, groups, allUsers, sendGroupMessage, sendPersonalMessage } = useApp();
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<Instant | null>(null);
  const [selectedShareRecipients, setSelectedShareRecipients] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true); // default to muted for autoplay compatibility

  // Desktop states
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingActiveCard, setIsPlayingActiveCard] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'following' | 'friends'>('explore');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'following' || tab === 'friends' || tab === 'explore') {
      setActiveTab(tab);
    }
  }, []);

  const handleTabSwitch = (tab: 'explore' | 'following' | 'friends') => {
    setActiveTab(tab);
    setActiveDeckIndex(0);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `?tab=${tab}`);
    }
  };

  const mockFollowing = ['emma_in_europe', 'alice_adventures'];
  const displayFeed = activeTab === 'following' 
    ? feed.filter(p => mockFollowing.includes(p.authorUsername)) 
    : feed;

  // Ensure activeDeckIndex is within bounds if displayFeed length changes
  useEffect(() => {
    if (displayFeed.length > 0 && activeDeckIndex >= displayFeed.length) {
      setActiveDeckIndex(0);
    }
  }, [displayFeed.length, activeDeckIndex]);

  // Notifications and reaction states
  const [toastMessage, setToastMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const EXTRA_EMOJIS = ['🔥', '🎉', '🙌', '👏', '✨', '💯', '🥺', '👍', '😜', '🚀'];

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const unreadCount = notifications ? notifications.filter(n => n.recipientUsername === currentUser?.username && !n.read).length : 0;

  const showReactToast = (emoji: string) => {
    setToastMessage(`Notified with ${emoji}!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleLikePost = (post: Instant) => {
    likePost(post.id);
    if (!post.likedByCurrentUser) {
      addNotification(post.authorUsername, '❤️', post.id, post.url);
      showReactToast('❤️');
    }
  };

  const handleReactWithEmoji = (post: Instant, emoji: string) => {
    addNotification(post.authorUsername, emoji, post.id, post.url);
    showReactToast(emoji);
  };

  const activeCard = displayFeed.length > 0 ? (displayFeed[activeDeckIndex] || displayFeed[0]) : null;

  // Autoplay video on deck index changes
  useEffect(() => {
    setIsPlayingActiveCard(true);
    if (activeCard && activeCard.type === 'video' && activeVideoRef.current) {
      activeVideoRef.current.load();
      activeVideoRef.current.play().then(() => setIsPlayingActiveCard(true)).catch(() => setIsPlayingActiveCard(false));
    }
  }, [activeDeckIndex, displayFeed, activeCard]);

  const togglePlayActiveCard = () => {
    if (!activeVideoRef.current) return;
    if (isPlayingActiveCard) {
      activeVideoRef.current.pause();
      setIsPlayingActiveCard(false);
    } else {
      activeVideoRef.current.play().then(() => setIsPlayingActiveCard(true)).catch(() => setIsPlayingActiveCard(false));
    }
  };

  const handleNextCard = () => {
    if (displayFeed.length === 0) return;
    setActiveDeckIndex((prev) => (prev + 1) % displayFeed.length);
  };

  const handlePrevCard = () => {
    if (displayFeed.length === 0) return;
    setActiveDeckIndex((prev) => (prev - 1 + displayFeed.length) % displayFeed.length);
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setCommentOpen(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !newComment.trim()) return;
    addComment(selectedPostId, newComment.trim());
    setNewComment('');
  };



  const handleShare = (post: Instant) => {
    setPostToShare(post);
    setSelectedShareRecipients(new Set());
    setShareDrawerOpen(true);
  };

  const toggleShareRecipient = (id: string) => {
    const next = new Set(selectedShareRecipients);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedShareRecipients(next);
  };

  const executeBatchShare = () => {
    if (!postToShare || selectedShareRecipients.size === 0) return;
    
    selectedShareRecipients.forEach(id => {
      if (groups.some(g => g.id === id)) {
        sendGroupMessage(id, "Check out this Instant!", postToShare);
      } else {
        sendPersonalMessage(id, "Check out this Instant!", postToShare);
      }
    });

    setShareSuccess(true);
    setShareDrawerOpen(false);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const activePost = displayFeed.find(p => p.id === selectedPostId);

  if (!currentUser) return null;

  const commentsUI = activePost ? (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4 no-scrollbar">
        {activePost.comments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-550">Be the first to share your thoughts!</p>
          </div>
        ) : (
          activePost.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 items-start animate-fade-in-up">
              <img
                src={comment.authorAvatar}
                alt={comment.author}
                className="w-8 h-8 rounded-full object-cover border border-zinc-900 shadow-sm"
              />
              <div className="flex-1 flex flex-col items-start bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="text-xs font-bold text-zinc-200">@{comment.authorUsername}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handlePostComment} className="border-t border-zinc-900/60 pt-4 pb-2 flex items-center space-x-3 sticky bottom-0 z-10 bg-[#18181B] md:bg-transparent">
        <input
          type="text"
          placeholder="Type a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-[#080808] border border-zinc-800 rounded-2xl px-5 py-3.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/10 shadow-inner"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-3.5 bg-accent-cyan text-black font-black rounded-2xl disabled:opacity-40 hover:bg-white active:scale-95 transition-all text-sm shadow-md"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  ) : null;

  return (
    <div className="h-screen w-full bg-[#000000] text-white flex flex-col overflow-hidden">
      {/* MOBILE APP VIEW (md:hidden)                                   */}
      {/* ============================================================== */}
      <div className="md:hidden h-screen w-full bg-[#000000] relative overflow-hidden flex flex-col font-sans">
        {/* Top Feed Header */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-4 z-30 select-none">
          <div className="flex items-center space-x-2">
            <Logo className="w-6 h-6 text-white" />
            <span className="text-lg font-black tracking-wider uppercase text-white">Instants</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-zinc-900/50 text-zinc-350 hover:text-white"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-900 overflow-hidden" onClick={() => router.push(`/profile/${currentUser.username}`)}>
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Vertical Reels Container */}
        <div className="flex-1 feed-container no-scrollbar">
          {displayFeed.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center px-6 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-zinc-650 animate-bounce" />
              <p className="text-zinc-400 font-medium">No public Instants shared yet.</p>
              <button
                onClick={() => router.push('/capture')}
                className="py-2.5 px-5 bg-gradient-to-r from-accent-pink to-accent-cyan text-black font-bold rounded-xl text-sm"
              >
                Capture First Instant
              </button>
            </div>
          ) : (
            displayFeed.map((post) => (
              <FeedItem
                key={post.id}
                post={post}
                muted={muted}
                onLike={() => handleLikePost(post)}
                onCommentClick={() => handleOpenComments(post.id)}
                onShareClick={() => handleShare(post)}
              />
            ))
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP WEB INTERFACE VIEW (md:flex)                            */}
      {/* ============================================================== */}
      <div className="hidden md:flex min-h-screen w-full bg-[#000000] text-white">
        {/* Left Column (Sidebar Navigation — Fixed, 260px width) */}
        <aside className="w-[260px] bg-[#000000] border-r border-[#27272A] p-6 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
          <div className="flex flex-col">
            {/* Brand Header */}
            <div className="mb-8 flex items-center justify-between animate-fade-in-up">
              <div className="flex items-center space-x-2">
                <Logo className="w-6 h-6 text-white" />
                <span className="text-xl font-black tracking-wider uppercase text-white select-none">Instants</span>
              </div>
              <button
                onClick={() => setMuted(!muted)}
                className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all active:scale-95"
                title={muted ? "Unmute Feed" : "Mute Feed"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 mt-2">
              <button
                onClick={() => handleTabSwitch('explore')}
                className={`w-full flex items-center space-x-4 px-3 py-3 rounded-xl text-[15px] font-bold transition-all ${
                  activeTab === 'explore'
                    ? 'bg-[#18181B] text-white border border-[#27272A]'
                    : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'text-white' : 'text-zinc-400'}`} />
                <span>Explore</span>
              </button>

              <button
                onClick={() => handleTabSwitch('following')}
                className={`w-full flex items-center space-x-4 px-3 py-3 rounded-xl text-[15px] font-bold transition-all ${
                  activeTab === 'following'
                    ? 'bg-[#18181B] text-white border border-[#27272A]'
                    : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <UserCheck className={`w-6 h-6 ${activeTab === 'following' ? 'text-white' : 'text-zinc-400'}`} />
                <span>Following</span>
              </button>

              <button
                onClick={() => handleTabSwitch('friends')}
                className={`w-full flex items-center space-x-4 px-3 py-3 rounded-xl text-[15px] font-bold transition-all ${
                  activeTab === 'friends'
                    ? 'bg-[#18181B] text-white border border-[#27272A]'
                    : 'text-zinc-300 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Users className={`w-6 h-6 ${activeTab === 'friends' ? 'text-white' : 'text-zinc-400'}`} />
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
                {unreadCount > 0 && (
                  <span className="bg-accent-pink text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
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
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
              >
                <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-zinc-700" />
                <span>Profile</span>
              </button>

              <button
                className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all mt-auto"
              >
                <Settings className="w-6 h-6 text-zinc-400" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Space */}
        <div className="flex-1 ml-[260px] flex flex-col bg-[#000000] relative min-h-screen overflow-hidden">
          
          {/* Top Search Bar */}
          <div className="w-full pt-8 pb-4 flex items-center px-8 flex-shrink-0 z-20">
            <div className="relative w-full max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-[#18181B] border border-zinc-800/80 rounded-full py-3 pl-6 pr-12 text-white focus:outline-none focus:border-zinc-700 placeholder-zinc-500 font-medium text-sm transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 rounded-full cursor-pointer hover:bg-zinc-800 transition-all">
                <Search className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex px-8 overflow-hidden pt-8 pb-12">
            {activeTab === 'friends' ? (
              <div className="w-full max-w-4xl mx-auto flex flex-col h-full overflow-y-auto no-scrollbar">
                <h2 className="text-xl font-bold text-white mb-6">Your Friends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUsers.filter(u => u.username !== currentUser.username).map(friend => {
                    const sorted = [currentUser.username, friend.username].sort();
                    const chatId = `${sorted[0]}-${sorted[1]}`;
                    
                    return (
                      <div key={friend.username} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center">
                        <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-zinc-700" />
                        <h3 className="text-sm font-bold text-white">{friend.name}</h3>
                        <p className="text-xs text-zinc-400 mb-4">@{friend.username}</p>
                        <button onClick={() => router.push(`/chats/${chatId}`)} className="w-full py-2 bg-accent-pink/10 text-accent-pink border border-accent-pink/30 hover:bg-accent-pink hover:text-black font-bold text-xs rounded-xl transition-all">
                          Message
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : displayFeed.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                <AlertCircle className="w-12 h-12 text-zinc-650 mx-auto animate-bounce" />
                <h2 className="text-lg font-bold text-zinc-200">No Instants Shared</h2>
                <p className="text-xs text-zinc-500">Capture a moment to start the deck!</p>
                <button
                  onClick={() => router.push('/capture')}
                  className="py-2.5 px-6 bg-gradient-to-r from-accent-pink to-accent-cyan text-black font-black rounded-xl text-xs"
                >
                  Go to Camera
                </button>
              </div>
            ) : (
              <div className="flex-1 flex h-full justify-center lg:justify-start w-full">
                
                {/* Stacked Cards Column */}
                <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out h-full ${commentOpen ? 'flex-1 xl:ml-24' : 'w-full max-w-3xl'}`}>
                  <div className="w-full max-w-[380px] flex flex-col items-center justify-center relative h-full">


                {/* Stacked Cards */}
                <div className="relative w-full aspect-[4/5] max-w-[300px] flex justify-center items-center select-none">
                  {/* Third Card */}
                  {displayFeed.length > 2 && (
                    <div className="absolute -top-4 left-4 w-full h-full scale-[0.92] bg-zinc-950 border border-zinc-800 rounded-[40px] overflow-hidden z-0 pointer-events-none transform rotate-3 shadow-md">
                      {displayFeed[(activeDeckIndex + 2) % displayFeed.length].type === 'video' ? (
                        <video src={displayFeed[(activeDeckIndex + 2) % displayFeed.length].url} className="w-full h-full object-cover brightness-[0.4]" />
                      ) : (
                        <img src={displayFeed[(activeDeckIndex + 2) % displayFeed.length].url} className="w-full h-full object-cover brightness-[0.4]" />
                      )}
                    </div>
                  )}

                  {/* Second Card */}
                  {displayFeed.length > 1 && (
                    <div className="absolute -top-2 left-1 w-full h-full scale-[0.96] bg-zinc-950 border border-zinc-800 rounded-[48px] overflow-hidden z-10 pointer-events-none transform -rotate-2 shadow-lg">
                      {displayFeed[(activeDeckIndex + 1) % displayFeed.length].type === 'video' ? (
                        <video src={displayFeed[(activeDeckIndex + 1) % displayFeed.length].url} className="w-full h-full object-cover brightness-[0.6]" />
                      ) : (
                        <img src={displayFeed[(activeDeckIndex + 1) % displayFeed.length].url} className="w-full h-full object-cover brightness-[0.6]" />
                      )}
                    </div>
                  )}

                  {/* Top Active Card */}
                  {activeCard && (
                    <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-[48px] relative overflow-hidden z-20 shadow-2xl flex flex-col justify-center animate-fade-in-up">
                      {/* Media content */}
                      {activeCard.type === 'video' ? (
                        <div className="w-full h-full relative cursor-pointer" onClick={togglePlayActiveCard}>
                          <video
                            ref={activeVideoRef}
                            src={activeCard.url}
                            loop
                            muted={muted}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {!isPlayingActiveCard && (
                            <div className="absolute inset-0 flex justify-center items-center bg-black/20">
                              <div className="w-12 h-12 bg-black/45 rounded-full flex items-center justify-center backdrop-blur-xs">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1" />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <img
                          src={activeCard.url}
                          alt={activeCard.caption || "Travel capture"}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Left Navigation Chevron Area */}
                      <div className="absolute left-0 top-0 bottom-0 w-1/4 z-30 cursor-pointer" onClick={handlePrevCard} />

                      {/* Right Navigation Chevron Area */}
                      <div className="absolute right-0 top-0 bottom-0 w-1/4 z-30 cursor-pointer" onClick={handleNextCard} />

                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                      {/* Top Info Overlay */}
                      <div className="absolute left-4 top-4 z-20 flex items-center space-x-3 drop-shadow-md">
                        <img
                          src={activeCard.authorAvatar}
                          alt={activeCard.authorUsername}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-800 shadow-sm"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-xs font-black text-white leading-tight">@{activeCard.authorUsername}</h3>
                        </div>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute left-5 right-5 bottom-5 z-20 text-left drop-shadow-md">
                        {activeCard.caption && (
                          <p className="text-xs font-medium text-white line-clamp-2 mb-1.5">
                            {activeCard.caption}
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-300 font-bold font-mono">{activeCard.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimalist Action Controls */}
                {activeCard && (
                  <div className="w-full max-w-[300px] flex items-center justify-between mt-5 px-1">
                    {/* Comment Bar */}
                    <div 
                      onClick={() => handleOpenComments(activeCard.id)}
                      className="flex-1 mr-3 bg-[#18181B] border border-[#27272A] rounded-full py-3 px-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-sm hover:bg-zinc-900/80"
                    >
                      <span className="text-sm font-medium text-zinc-400">Type a comment...</span>
                      <div className="flex items-center space-x-1.5 text-zinc-500 bg-[#27272A] px-2.5 py-1 rounded-full">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold font-mono">{activeCard.comments?.length || 0}</span>
                      </div>
                    </div>

                    {/* Share Icon Button */}
                    <button 
                      onClick={() => handleShare(activeCard)}
                      className="w-[54px] h-[54px] flex-shrink-0 bg-[#18181B] border border-[#27272A] rounded-full flex items-center justify-center text-zinc-400 active:scale-95 transition-all hover:bg-zinc-900/80 shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}

              </div>
            </div>

                {/* Right Side Comments Panel (Desktop) */}
                {commentOpen && activePost && (
                  <div className="hidden md:flex w-[400px] flex-shrink-0 ml-12 bg-[#18181B] rounded-[32px] border border-[#27272A] flex-col overflow-hidden h-full shadow-2xl animate-fade-in relative z-10">
                    {/* Panel Header */}
                    <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-900/50 bg-[#18181B]">
                      <h3 className="text-base font-bold tracking-wide text-zinc-100">
                        {activePost.comments.length} comments
                      </h3>
                      <button
                        onClick={() => setCommentOpen(false)}
                        className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Panel Content */}
                    <div className="flex-1 overflow-hidden p-6 flex flex-col">
                      {commentsUI}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Drawer (Mobile Only) */}
      <div className="md:hidden">
        <Drawer
          isOpen={commentOpen}
          onClose={() => setCommentOpen(false)}
          title="Comments"
          maxHeight="h-[60vh]"
          disableScroll={true}
        >
          {commentsUI}
        </Drawer>
      </div>

      {/* Share Drawer */}
      <Drawer
        isOpen={shareDrawerOpen}
        onClose={() => setShareDrawerOpen(false)}
        title="Share to..."
        className="md:left-[260px]"
        maxHeight="h-[70vh]"
      >
        <div className="flex flex-col h-full relative">
          <div className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
            {/* Groups Section */}
            {groups.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 px-1">Groups</h4>
                <div className="space-y-1">
                  {groups.map(group => {
                    const isSelected = selectedShareRecipients.has(group.id);
                    return (
                      <div key={group.id} className="flex items-center justify-between p-2 hover:bg-zinc-900/50 rounded-xl transition-colors cursor-pointer group" onClick={() => toggleShareRecipient(group.id)}>
                        <div className="flex items-center space-x-3">
                          <img src={group.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                          <span className="text-sm font-semibold text-zinc-200">{group.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-accent-cyan border-accent-cyan' : 'border-zinc-700'}`}>
                          {isSelected && <UserCheck className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* People Section */}
            {allUsers.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 px-1">People</h4>
                <div className="space-y-1">
                  {allUsers.filter(u => u.username !== currentUser?.username).map(user => {
                    const isSelected = selectedShareRecipients.has(user.username);
                    return (
                      <div key={user.username} className="flex items-center justify-between p-2 hover:bg-zinc-900/50 rounded-xl transition-colors cursor-pointer group" onClick={() => toggleShareRecipient(user.username)}>
                        <div className="flex items-center space-x-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-zinc-200">{user.name}</span>
                            <span className="text-[10px] text-zinc-500 font-medium">@{user.username}</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-accent-cyan border-accent-cyan' : 'border-zinc-700'}`}>
                          {isSelected && <UserCheck className="w-3 h-3 text-black" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Sticky Send Button */}
          {selectedShareRecipients.size > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#18181B] via-[#18181B] to-transparent">
              <button 
                onClick={executeBatchShare}
                className="w-full bg-accent-cyan text-black font-black py-3.5 rounded-xl hover:bg-white transition-all active:scale-95 shadow-lg shadow-accent-cyan/10 flex items-center justify-center space-x-2"
              >
                <span>Send to {selectedShareRecipients.size} {selectedShareRecipients.size === 1 ? 'chat' : 'chats'}</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Share Toast Notification */}
      {shareSuccess && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full shadow-lg z-50 flex items-center space-x-2 animate-fade-in-up">
          <Send className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Shared successfully!</span>
        </div>
      )}

      {/* React Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full shadow-lg z-50 flex items-center space-x-2 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-accent-pink animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

/* FeedItem Child Component with IntersectionObserver Autoplay Logic */
interface FeedItemProps {
  post: Instant;
  muted: boolean;
  onLike: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, muted, onLike, onCommentClick, onShareClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (post.type !== 'video') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [post.type]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div ref={containerRef} className="feed-item w-full bg-[#000000] flex flex-col pt-2 pb-6 border-b border-zinc-900/50">
      {/* Edge-to-edge Content Canvas */}
      <div className="w-full relative overflow-hidden aspect-[3/4] bg-zinc-950 rounded-[32px]">
        {post.type === 'video' ? (
          <div className="w-full h-full relative" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={post.url}
              loop
              muted={muted}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Pause overlay Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/10">
                <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-xs">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={post.url}
            alt={post.caption || "Travel capture"}
            className="w-full h-full object-cover"
          />
        )}

        {/* Dark Overlay Vignette for Legibility */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Top Info Overlay */}
        <div className="absolute left-4 top-4 z-20 flex items-center space-x-2.5 drop-shadow-md">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-8 h-8 rounded-full object-cover border border-zinc-800 shadow-sm"
          />
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-white leading-tight">@{post.authorUsername}</h3>
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute left-4 right-4 bottom-5 z-20 select-none">
          {post.caption && (
            <p className="text-sm text-zinc-100 leading-relaxed line-clamp-2 drop-shadow-md mb-1 font-medium">
              {post.caption}
            </p>
          )}
          <p className="text-[11px] text-zinc-300 font-bold font-mono">{post.timestamp}</p>
        </div>
      </div>

      {/* Control Section (Bottom, below the card) */}
      <div className="w-full px-1 pt-4 pb-2 flex items-center justify-between">
        {/* Comment Bar */}
        <div 
          onClick={onCommentClick}
          className="flex-1 mr-3 bg-[#18181B] border border-[#27272A] rounded-full py-3.5 px-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
        >
          <span className="text-sm font-medium text-zinc-400">Type a comment...</span>
          <div className="flex items-center space-x-1.5 text-zinc-500 bg-[#27272A] px-2.5 py-1 rounded-full">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold font-mono">{post.comments.length}</span>
          </div>
        </div>

        {/* Share Icon Button */}
        <button 
          onClick={onShareClick}
          className="w-[52px] h-[52px] flex-shrink-0 bg-[#18181B] border border-[#27272A] rounded-full flex items-center justify-center text-zinc-400 active:scale-95 transition-all shadow-sm hover:bg-zinc-800"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>


    </div>
  );
};
