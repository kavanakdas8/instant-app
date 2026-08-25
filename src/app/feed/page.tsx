"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import { 
  Heart, MessageCircle, Send, Plus, Volume2, VolumeX, AlertCircle,
  Compass, MessageSquare, User, Camera, ChevronLeft, ChevronRight, MoreHorizontal 
} from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function Feed() {
  const router = useRouter();
  const { currentUser, feed, likePost, addComment } = useApp();
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [muted, setMuted] = useState(true); // default to muted for autoplay compatibility

  // Desktop states
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [desktopComment, setDesktopComment] = useState('');
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingActiveCard, setIsPlayingActiveCard] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

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

  const handleDesktopPostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard || !desktopComment.trim()) return;
    addComment(activeCard.id, desktopComment.trim());
    setDesktopComment('');
  };

  const handleShare = (post: Instant) => {
    // Simulate link copying
    navigator.clipboard.writeText(`${window.location.origin}/profile/${post.authorUsername}`);
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
                onLike={() => likePost(post.id)}
                onCommentClick={() => handleOpenComments(post.id)}
                onShareClick={() => handleShare(post)}
              />
            ))
          )}
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
                        className="w-6.5 h-6.5 rounded-full object-cover border border-zinc-900" 
                      />
                      <div className="flex-1 bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-2xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-zinc-200">@{comment.authorUsername}</span>
                          <span className="text-[10px] text-zinc-600">{comment.timestamp}</span>
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
                  placeholder={`Comment as @${currentUser.username}...`}
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
      </div>

      {/* ============================================================== */}
      {/* DESKTOP WEB INTERFACE VIEW (md:flex)                            */}
      {/* ============================================================== */}
      <div className="hidden md:flex min-h-screen w-full bg-[#000000] text-white">
        {/* Left Column (Sidebar Navigation — Fixed, 260px width) */}
        <aside className="w-[260px] bg-[#000000] border-r border-[#27272A] p-6 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
          <div className="flex flex-col">
            {/* Brand Header */}
            <div className="mb-8 flex items-center animate-fade-in-up">
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
                className="w-full flex items-center space-x-3 px-4 py-3 bg-[#18181B] text-white rounded-xl text-xs font-bold transition-all border border-[#27272A]"
              >
                <Compass className="w-4 h-4 text-accent-cyan" />
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
            
            {/* Audio Toggle in Sidebar */}
            <button 
              onClick={() => setMuted(!muted)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 border border-[#27272A] hover:bg-[#18181B] rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{muted ? "Unmute Feed" : "Mute Feed"}</span>
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
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Card Deck Component (lg:col-span-7) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
                {/* Physical Cards Stack Deck */}
                <div className="relative w-full max-w-[380px] aspect-[3/4] flex justify-center items-center select-none">
                  
                  {/* Third Card (Subtle placeholder behind) */}
                  <div className="absolute -top-6 left-4 w-full h-full scale-[0.95] bg-[#111827] border border-[#27272A]/70 rounded-3xl opacity-30 z-0 pointer-events-none transform rotate-1.5 shadow-md" />

                  {/* Second Card (Subtle placeholder behind) */}
                  <div className="absolute -top-3 left-2 w-full h-full scale-[0.98] bg-[#18181B] border border-[#27272A] rounded-3xl opacity-60 z-10 pointer-events-none transform -rotate-1 shadow-lg" />

                  {/* Top Active Card */}
                  <div className="w-full h-full bg-zinc-950 border border-zinc-900 rounded-3xl relative overflow-hidden z-20 shadow-2xl flex flex-col justify-center animate-fade-in-up">
                    
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80 pointer-events-none" />

                    {/* Top-Left Avatar & User Handle Overlay */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2.5 z-20">
                      <img 
                        src={activeCard.authorAvatar} 
                        alt={activeCard.author} 
                        className="w-7 h-7 rounded-full object-cover border border-zinc-800 shadow-md" 
                      />
                      <div>
                        <h4 className="text-[11px] font-black text-white drop-shadow-md">@{activeCard.authorUsername}</h4>
                        <p className="text-[8px] text-accent-cyan font-bold tracking-widest mt-0.5">{activeCard.audience}</p>
                      </div>
                    </div>

                    {/* Bottom-Left Caption & Timestamp Overlay */}
                    <div className="absolute left-4 right-4 bottom-4 z-20">
                      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 drop-shadow-sm">{activeCard.timestamp}</p>
                      {activeCard.caption && (
                        <p className="text-xs text-zinc-200 leading-relaxed bg-black/35 p-2.5 rounded-xl border border-white/5 backdrop-blur-xs line-clamp-2">
                          {activeCard.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Left Navigation Chevron */}
                  <button 
                    onClick={handlePrevCard}
                    className="absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#18181B] hover:bg-zinc-850 border border-[#27272A] rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 z-30 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Right Navigation Chevron */}
                  <button 
                    onClick={handleNextCard}
                    className="absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#18181B] hover:bg-zinc-855 border border-[#27272A] rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 z-30 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reactions, Share & Comments Area (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-[#18181B] border border-[#27272A] rounded-3xl p-6 flex flex-col h-[520px] shadow-2xl relative">
                
                {/* Action Bar Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                  {/* Left: Reaction Icons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => likePost(activeCard.id)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm active:scale-90 transition-all ${
                        activeCard.likedByCurrentUser 
                          ? 'bg-accent-pink/15 border-accent-pink/50 text-accent-pink' 
                          : 'bg-[#27272A] border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                      }`}
                      title={`${activeCard.likes} Likes`}
                    >
                      ❤️
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#27272A] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-sm active:scale-90 transition-transform">
                      👀
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#27272A] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-sm active:scale-90 transition-transform">
                      😂
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#27272A] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-sm active:scale-90 transition-transform">
                      😮
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#27272A] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold active:scale-90 transition-transform">
                      +
                    </button>
                  </div>

                  {/* Share button beside reactions */}
                  <button 
                    onClick={() => handleShare(activeCard)}
                    className="flex items-center space-x-1.5 py-1.5 px-3.5 bg-[#27272A] hover:bg-zinc-800 border border-zinc-800 rounded-full text-[10px] font-black text-zinc-350 hover:text-white transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Scrollable list of recent comments */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mt-4 no-scrollbar">
                  <h3 className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-2">Recent Comments ({activeCard.comments.length})</h3>
                  {activeCard.comments.length === 0 ? (
                    <div className="py-16 text-center flex flex-col justify-center items-center h-full">
                      <MessageCircle className="w-8 h-8 text-zinc-800 mb-2 animate-pulse" />
                      <p className="text-xs text-zinc-650 font-bold">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    activeCard.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 items-start animate-fade-in-up">
                        <img 
                          src={comment.authorAvatar} 
                          alt={comment.author} 
                          className="w-6 h-6 rounded-full object-cover border border-zinc-900 shadow-sm" 
                        />
                        <div className="flex-1 bg-black/40 border border-zinc-900/60 p-2.5 rounded-2xl">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-zinc-400">@{comment.authorUsername}</span>
                            <span className="text-[8px] text-zinc-655">{comment.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-zinc-350 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop comments input section */}
                <form onSubmit={handleDesktopPostComment} className="border-t border-[#27272A] pt-4 flex items-center space-x-2 mt-auto">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={desktopComment}
                    onChange={(e) => setDesktopComment(e.target.value)}
                    className="flex-1 bg-black border border-[#27272A] rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/10"
                  />
                  <button
                    type="submit"
                    disabled={!desktopComment.trim()}
                    className="p-2.5 bg-white text-black font-black rounded-xl disabled:opacity-40 hover:bg-zinc-200 active:scale-95 transition-all text-xs"
                  >
                    Send
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
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
    <div ref={containerRef} className="feed-item w-full bg-zinc-950 relative overflow-hidden flex flex-col justify-center">
      {/* Content Canvas */}
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* Right Action Tray */}
      <div className="absolute right-4 bottom-24 flex flex-col space-y-5 items-center z-20 select-none">
        {/* Like Widget */}
        <button 
          onClick={onLike}
          className="flex flex-col items-center group active:scale-75 transition-transform duration-200"
        >
          <div className="w-11 h-11 bg-black/40 border border-zinc-800/40 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-zinc-900/60">
            <Heart 
              className={`w-5 h-5 transition-colors ${
                post.likedByCurrentUser 
                  ? 'fill-accent-pink text-accent-pink stroke-none' 
                  : 'text-zinc-200'
              }`} 
            />
          </div>
          <span className="text-[10px] font-bold text-zinc-300 mt-1 shadow-sm">
            {post.likes}
          </span>
        </button>

        {/* Comment Drawer Trigger */}
        <button 
          onClick={onCommentClick}
          className="flex flex-col items-center group active:scale-75 transition-transform duration-200"
        >
          <div className="w-11 h-11 bg-black/40 border border-zinc-800/40 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-zinc-900/60">
            <MessageCircle className="w-5 h-5 text-zinc-200" />
          </div>
          <span className="text-[10px] font-bold text-zinc-300 mt-1 shadow-sm">
            {post.comments.length}
          </span>
        </button>

        {/* Share Widget */}
        <button 
          onClick={onShareClick}
          className="flex flex-col items-center group active:scale-75 transition-transform duration-200"
        >
          <div className="w-11 h-11 bg-black/40 border border-zinc-800/40 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-zinc-900/60">
            <Send className="w-4.5 h-4.5 text-zinc-200 translate-x-[-1px] translate-y-[1px]" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wide">Share</span>
        </button>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute left-4 right-20 bottom-8 z-20 select-none">
        <div className="flex items-center space-x-2.5 mb-2.5">
          <img 
            src={post.authorAvatar} 
            alt={post.author} 
            className="w-7 h-7 rounded-full object-cover border border-zinc-800" 
          />
          <div>
            <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
              <span>@{post.authorUsername}</span>
              <span className="w-1 h-1 bg-zinc-400 rounded-full" />
              <span className="text-[10px] text-zinc-400 font-normal">{post.timestamp}</span>
            </h3>
            <p className="text-[10px] text-accent-cyan font-bold tracking-wider uppercase mt-0.5">
              {post.audience}
            </p>
          </div>
        </div>
        
        {post.caption && (
          <p className="text-xs text-zinc-200 leading-relaxed line-clamp-2 bg-black/20 p-2 rounded-xl backdrop-blur-2xs border border-white/5">
            {post.caption}
          </p>
        )}
      </div>
    </div>
  );
};
