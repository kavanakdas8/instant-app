"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, Instant } from '@/context/AppContext';
import { Heart, MessageCircle, Send, Plus, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import Drawer from '@/components/Drawer';

export default function Feed() {
  const router = useRouter();
  const { currentUser, feed, likePost, addComment } = useApp();
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [muted, setMuted] = useState(true); // default to muted for autoplay compatibility

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

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
    navigator.clipboard.writeText(`${window.location.origin}/profile/${post.authorUsername}`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const activePost = feed.find(p => p.id === selectedPostId);

  if (!currentUser) return null;

  return (
    <div className="flex-1 flex flex-col bg-black relative">
      {/* Top Feed Header */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center px-4 z-30 select-none">
        <h1 className="text-xl font-black italic bg-gradient-to-r from-accent-pink to-accent-cyan bg-clip-text text-transparent">
          INSTANTS
        </h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-zinc-900/50 text-zinc-300 hover:text-white"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-900 overflow-hidden" onClick={() => router.push(`/profile/${currentUser.username}`)}>
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Vertical Reels Container */}
      <div className="flex-1 feed-container no-scrollbar">
        {feed.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center px-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-zinc-600 animate-bounce" />
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

      {/* Share Toast */}
      {shareSuccess && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full shadow-lg z-50 flex items-center space-x-2 animate-fade-in-up">
          <Send className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

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
                  <p className="text-sm text-zinc-500">Be the first to share your thoughts!</p>
                </div>
              ) : (
                activePost.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 items-start animate-fade-in-up">
                    <img 
                      src={comment.authorAvatar} 
                      alt={comment.author} 
                      className="w-8 h-8 rounded-full object-cover border border-zinc-900" 
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
            className="w-9 h-9 rounded-full object-cover border border-zinc-800" 
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
