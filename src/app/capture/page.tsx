"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Camera, Zap, ZapOff, RefreshCw, Image as ImageIcon, 
  ChevronDown, Globe, Users, Lock, X, MessageSquare, Sparkles, ChevronLeft, MoreVertical, Trash
} from 'lucide-react';
import Drawer from '@/components/Drawer';

const MOCK_TRAVEL_CAPTURES = [
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop', // Sydney Opera House
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop', // Kyoto Fushimi Inari
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop', // Positano Italy
  'https://images.unsplash.com/photo-1500835595397-b0db40478b03?q=80&w=600&auto=format&fit=crop', // Swiss Alps valley
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop', // Dubai Desert
];

export default function Capture() {
  const router = useRouter();
  const { currentUser, captureInstant, deleteInstant, playShutterSound, groups } = useApp();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flash, setFlash] = useState(false);
  const [zoom, setZoom] = useState<'1x' | '2x'>('1x');
  const [audience, setAudience] = useState<'Public' | 'Friends' | string>('Public');
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [flashing, setFlashing] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [showLastInstant, setShowLastInstant] = useState(false);

  // Start WebRTC Camera stream
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("Camera mediaDevices not supported in this environment.");
        setCameraActive(false);
        return;
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          aspectRatio: { ideal: 0.5625 } // 9:16 vertical profile
        },
        audio: false
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera hardware access denied/unavailable. Using simulation.", err);
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, currentUser]);

  const toggleFlip = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Capture trigger
  const handleShutter = () => {
    playShutterSound();
    setFlashing(true);
    setTimeout(() => setFlashing(false), 200);

    let capturedUrl = '';
    
    if (cameraActive && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          capturedUrl = canvas.toDataURL('image/jpeg');
        }
      } catch (e) {
        console.error("Canvas draw failed", e);
      }
    }

    // Fallback if camera not working
    if (!capturedUrl) {
      capturedUrl = MOCK_TRAVEL_CAPTURES[presetIndex];
      setPresetIndex((presetIndex + 1) % MOCK_TRAVEL_CAPTURES.length);
    }

    // Default caption based on selected audience/vibe
    const captionsList = [
      "Live from the road! 🗺️✨",
      "Sunset views right now. 🌅",
      "Exploration mode is ON. 🥾⛰️",
      "Vibe check: Approved. 🥂🎒",
      "Lost in translation but loving it. 🗼🍜"
    ];
    const defaultCaption = caption.trim() || captionsList[Math.floor(Math.random() * captionsList.length)];

    captureInstant(capturedUrl, 'image', defaultCaption, audience);
    setCaption('');
  };

  // Media upload fallback
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const capturedUrl = reader.result as string;
        captureInstant(capturedUrl, 'image', caption || "Uploaded an Instant 📸", audience);
        setCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return null;

  // Find audience label
  const getAudienceLabel = () => {
    if (audience === 'Public') return 'Public';
    if (audience === 'Friends') return 'Friends';
    const group = groups.find(g => g.id === audience);
    return group ? group.name : audience;
  };

  // Find audience label

  return (
    <div className="flex flex-col bg-[#0c0c14] w-full h-screen relative select-none">
      
      {/* TOP HEADER */}
      <div className="flex justify-between items-center px-5 pt-8 pb-4">
        <button 
          onClick={() => router.back()}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="flex items-center">
           {/* Only one button on the top right side as requested */}
           <button onClick={() => setShowLastInstant(true)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
             <Sparkles className="w-6 h-6 text-zinc-200" />
           </button>
        </div>
      </div>

      {/* VIEWFINDER AREA */}
      <div className="flex-1 px-4 overflow-hidden flex flex-col justify-center relative items-center">
        <div className="w-full max-w-[420px] aspect-[4/5] bg-zinc-950 rounded-[72px] relative overflow-hidden shadow-2xl border-4 border-[#0c0c14]">
          {/* Shutter flash animation */}
          {flashing && (
            <div className="absolute inset-0 bg-white z-50 animate-shutter-flash" />
          )}

          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            // Fallback content
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black relative">
               <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
               <div className="w-24 h-24 border border-zinc-800 rounded-full flex justify-center items-center">
                 <Camera className="w-8 h-8 text-zinc-700" />
               </div>
            </div>
          )}

        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="px-8 pb-12 pt-4 flex flex-col items-center space-y-6">
        
        {/* Caption Input */}
        <div className="w-full max-w-[320px] z-20">
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full px-5 py-3 text-sm text-center text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all"
          />
        </div>

        {/* Shutter Row */}
        <div className="w-full max-w-[320px] flex justify-between items-center">
          {/* Left: Flash */}
          <button 
            onClick={() => setFlash(!flash)}
            className="w-[52px] h-[52px] rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center active:scale-95 transition-transform"
          >
            {flash ? <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> : <ZapOff className="w-6 h-6 text-zinc-400" />}
          </button>
          
          {/* Center: Shutter */}
          <div className="relative flex justify-center items-center">
            <button
              onClick={handleShutter}
              className="w-[84px] h-[84px] rounded-full border-[5px] border-zinc-800 flex justify-center items-center active:scale-95 transition-all bg-transparent"
            >
              <div className="w-[66px] h-[66px] rounded-full bg-white shadow-inner" />
            </button>
          </div>

          {/* Right: Flip Camera */}
          <button 
            onClick={toggleFlip}
            className="w-[52px] h-[52px] rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center active:scale-95 transition-transform"
          >
            <RefreshCw className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Audience Selector (Pill) */}
        <div className="relative w-full flex justify-center pb-4">
            <button
              onClick={() => setAudienceOpen(!audienceOpen)}
              className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/80 rounded-full flex items-center space-x-2.5 text-[13px] font-bold text-white transition-all shadow-md"
            >
              {audience === 'Friends' ? (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-green-400">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              ) : (
                <div className="w-4 h-4 bg-zinc-400 rounded-full flex items-center justify-center">
                  <Globe className="w-2.5 h-2.5 text-zinc-900" />
                </div>
              )}
              <span>{audience === 'Friends' ? 'Close Friends' : getAudienceLabel()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            
            {/* Dropdown Menu */}
            {audienceOpen && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-52 bg-zinc-900 rounded-3xl shadow-xl py-2 z-30 animate-fade-in-up border border-zinc-800 overflow-hidden">
                <button
                  onClick={() => { setAudience('Public'); setAudienceOpen(false); }}
                  className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-zinc-800 flex items-center space-x-3 transition-colors"
                >
                  <Globe className="w-5 h-5 text-zinc-300" />
                  <span>Public Feed</span>
                </button>
                <button
                  onClick={() => { setAudience('Friends'); setAudienceOpen(false); }}
                  className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-zinc-800 flex items-center space-x-3 transition-colors"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span>Close Friends</span>
                </button>
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => { setAudience(group.id); setAudienceOpen(false); }}
                    className="w-full px-5 py-3 text-left text-sm font-bold hover:bg-zinc-800 flex items-center space-x-3 border-t border-zinc-800/50 transition-colors"
                  >
                    <Users className="w-5 h-5 text-accent-purple" />
                    <span className="truncate">{group.name}</span>
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* All Instants Modal */}
      {showLastInstant && (
        <div className="absolute inset-0 z-50 bg-[#0c0c14] flex flex-col animate-fade-in">
          {/* Top Header of Modal */}
          <div className="flex justify-between items-center px-5 pt-8 pb-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
            <h2 className="text-white font-bold text-lg pl-2">Your Instants</h2>
            <button onClick={() => setShowLastInstant(false)} className="text-white p-2 hover:bg-white/10 rounded-full transition-all">
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Instants List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            {currentUser?.instants && currentUser.instants.length > 0 ? (
              currentUser.instants.map(instant => (
                <div key={instant.id} className="w-full max-w-[420px] mx-auto bg-zinc-950 rounded-[48px] relative overflow-hidden shadow-2xl border-4 border-zinc-900">
                  {/* Delete Button */}
                  <button 
                    onClick={() => deleteInstant(instant.id)}
                    className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-red-500/90 transition-colors"
                  >
                    <Trash className="w-6 h-6 text-white" />
                  </button>
                  
                  {instant.type === 'video' ? (
                    <video src={instant.url} className="w-full aspect-[4/5] object-cover" autoPlay loop muted playsInline />
                  ) : (
                    <img src={instant.url} alt="Instant" className="w-full aspect-[4/5] object-cover" />
                  )}
                  {instant.caption && (
                    <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                      <div className="w-full bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-sm text-center text-white shadow-lg">
                        {instant.caption}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-zinc-500 h-full text-sm font-bold flex flex-col items-center justify-center space-y-3 pt-20">
                <Camera className="w-10 h-10 text-zinc-700" />
                <p>No instants taken yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
