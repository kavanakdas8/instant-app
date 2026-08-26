"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import {
  Heart, MessageCircle, Send, Volume2, VolumeX, AlertCircle,
  Compass, MessageSquare, Camera, ChevronLeft, ChevronRight, MoreHorizontal, Bell, Sparkles
} from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function Feed() {
  const router = useRouter();
  const { currentUser, feed, likePost, addComment, notifications, addNotification } = useApp();
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [muted, setMuted] = useState(true); // default to muted for autoplay compatibility

  // Desktop states
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingActiveCard, setIsPlayingActiveCard] = useState(true);

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

  const activeCard = feed[activeDeckIndex];

  // Autoplay video on deck index changes
  useEffect(() => {
    setIsPlayingActiveCard(true);
    if (activeCard && activeCard.type === 'video' && activeVideoRef.current) {
      activeVideoRef.current.load();
      activeVideoRef.current.play().then(() => setIsPlayingActiveCard(true)).catch(() => setIsPlayingActiveCard(false));
    }
  }, [activeDeckIndex, feed]);

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
    if (feed.length === 0) return;
    setActiveDeckIndex((prev) => (prev + 1) % feed.length);
  };

  const handlePrevCard = () => {
    if (feed.length === 0) return;
    setActiveDeckIndex((prev) => (prev - 1 + feed.length) % feed.length);
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
    // Simulate link copying
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const activePost = feed.find(p => p.id === selectedPostId);

  if (!currentUser) return null;

  return (
    <div className="flex-1 flex flex-col bg-black relative">
      {/* ============================================================== */}
      {/* MOBILE PORTRAIT VIEW (md:hidden)                               */}
      {/* ============================================================== */}
      <div className="md:hidden flex flex-col flex-1 relative bg-black">
        {/* Top Feed Header */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-4 z-30 select-none">
          <span className="text-lg font-black tracking-wider uppercase text-white">Instants</span>
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
          {feed.length === 0 ? (
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
            feed.map((post) => (
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
              <span className="text-xl font-black tracking-wider uppercase text-white select-none">Instants</span>
              <button
                onClick={() => setMuted(!muted)}
                className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all active:scale-95"
                title={muted ? "Unmute Feed" : "Mute Feed"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
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
                className="w-full flex items-center space-x-3 px-4 py-3 bg-[#18181B] text-white rounded-xl text-xs font-bold transition-all border border-[#27272A]"
              >
                <Compass className="w-4 h-4 text-accent-cyan" />
                <span>Feed</span>
              </button>

              <div
                onClick={() => router.push('/chats')}
                className="w-full flex flex-col px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40 rounded-xl text-xs font-bold transition-all group cursor-pointer"
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-zinc-500 group-hover:text-zinc-350" />
                    <span>Chats</span>
                  </div>
                </div>

                {/* Sub-sections / Badges for Groups and Personal Messages */}
                <div className="w-full pl-7 mt-2 space-y-1.5 border-l border-zinc-800 text-left">
                  <div 
                    onClick={(e) => { e.stopPropagation(); router.push('/chats?tab=groups'); }}
                    className="flex items-center justify-between text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider py-0.5 hover:bg-zinc-900/50 rounded px-1 -mx-1"
                  >
                    <span>Groups</span>
                    <span className="bg-accent-pink/15 text-accent-pink px-2 py-0.5 rounded-full text-[8px] font-black">3</span>
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); router.push('/chats?tab=dms'); }}
                    className="flex items-center justify-between text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider py-0.5 hover:bg-zinc-900/50 rounded px-1 -mx-1"
                  >
                    <span>DMs</span>
                    <span className="bg-accent-cyan/15 text-accent-cyan px-2 py-0.5 rounded-full text-[8px] font-black">2</span>
                  </div>
                </div>
              </div>

              {/* Notifications Option */}
              <button
                onClick={() => router.push('/notifications')}
                className="w-full flex items-center justify-between px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40 rounded-xl text-xs font-bold transition-all border border-transparent"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-zinc-505" />
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
          {feed.length === 0 ? (
            <div className="max-w-md text-center space-y-4">
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
            <div className="w-full flex items-center justify-center">
              <div className="w-full max-w-[420px] flex flex-col items-center justify-center relative pb-12">


                {/* Stacked Cards */}
                <div className="relative w-full aspect-[4/5] max-w-[360px] flex justify-center items-center select-none">
                  {/* Third Card */}
                  {feed.length > 2 && (
                    <div className="absolute -top-4 left-4 w-full h-full scale-[0.92] bg-zinc-950 border border-zinc-800 rounded-[40px] overflow-hidden z-0 pointer-events-none transform rotate-3 shadow-md">
                      {feed[(activeDeckIndex + 2) % feed.length].type === 'video' ? (
                        <video src={feed[(activeDeckIndex + 2) % feed.length].url} className="w-full h-full object-cover brightness-[0.4]" />
                      ) : (
                        <img src={feed[(activeDeckIndex + 2) % feed.length].url} className="w-full h-full object-cover brightness-[0.4]" />
                      )}
                    </div>
                  )}

                  {/* Second Card */}
                  {feed.length > 1 && (
                    <div className="absolute -top-2 left-1 w-full h-full scale-[0.96] bg-zinc-950 border border-zinc-800 rounded-[48px] overflow-hidden z-10 pointer-events-none transform -rotate-2 shadow-lg">
                      {feed[(activeDeckIndex + 1) % feed.length].type === 'video' ? (
                        <video src={feed[(activeDeckIndex + 1) % feed.length].url} className="w-full h-full object-cover brightness-[0.6]" />
                      ) : (
                        <img src={feed[(activeDeckIndex + 1) % feed.length].url} className="w-full h-full object-cover brightness-[0.6]" />
                      )}
                    </div>
                  )}

                  {/* Top Active Card */}
                  <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-[54px] relative overflow-hidden z-20 shadow-2xl flex flex-col justify-center animate-fade-in-up">
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
                    <div className="absolute left-5 top-5 z-20 flex items-center space-x-3 drop-shadow-md">
                      <img
                        src={activeCard.authorAvatar}
                        alt={activeCard.authorUsername}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-800 shadow-sm"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-black text-white leading-tight">@{activeCard.authorUsername}</h3>
                      </div>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute left-6 right-6 bottom-6 z-20 text-left drop-shadow-md">
                      {activeCard.caption && (
                        <p className="text-sm font-medium text-white line-clamp-2 mb-1.5">
                          {activeCard.caption}
                        </p>
                      )}
                      <p className="text-[11px] text-zinc-300 font-bold font-mono">{activeCard.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Minimalist Action Controls */}
                <div className="w-full max-w-[360px] flex items-center justify-between mt-6 px-1">
                  {/* Comment Bar */}
                  <div 
                    onClick={() => handleOpenComments(activeCard.id)}
                    className="flex-1 mr-3 bg-[#18181B] border border-[#27272A] rounded-full py-3.5 px-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-sm hover:bg-zinc-900/80"
                  >
                    <span className="text-sm font-medium text-zinc-400">Add a comment...</span>
                    <div className="flex items-center space-x-1.5 text-zinc-500 bg-[#27272A] px-2.5 py-1 rounded-full">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold font-mono">{activeCard.comments.length}</span>
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

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Drawer */}
      <Drawer
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
        title="Comments"
      >
        {activePost && (
          <div className="flex flex-col h-full">
            {/* Comments List */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
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
                      className="w-6 h-6 rounded-full object-cover border border-zinc-900"
                    />
                    <div className="flex-1 bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-zinc-200">@{comment.authorUsername}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form at bottom of drawer */}
            <form onSubmit={handlePostComment} className="border-t border-zinc-900/60 pt-3 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-[#080808] border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/10"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="p-2.5 bg-white text-black font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-200 active:scale-95 transition-all text-xs"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </Drawer>

      {/* Share Toast Notification */}
      {shareSuccess && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full shadow-lg z-50 flex items-center space-x-2 animate-fade-in-up">
          <Send className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Post link copied to clipboard!</span>
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
          <span className="text-sm font-medium text-zinc-400">Add a comment...</span>
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
