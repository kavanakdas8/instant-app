"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Camera, Zap, ZapOff, RefreshCw, Image as ImageIcon, 
  ChevronDown, Globe, Users, Lock, X, MessageSquare, Sparkles 
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
  const { currentUser, captureInstant, playShutterSound, groups } = useApp();
  
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

  // Start WebRTC Camera stream
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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

  // Preview thumbnail of last capture
  const lastCapture = currentUser.instants[0];

  return (
    <div className="flex-1 flex flex-col bg-black justify-between p-4 pb-6 select-none relative overflow-hidden h-screen">
      {/* Outer rounded edge-to-edge camera frame canvas */}
      <div 
        className={`flex-1 rounded-[2.5rem] bg-[#080808] relative overflow-hidden flex flex-col justify-between border-2 border-zinc-900 transition-transform duration-300 ${
          zoom === '2x' ? 'scale-[1.03]' : ''
        }`}
      >
        {/* Shutter flash animation screen overlay */}
        {flashing && (
          <div className="absolute inset-0 bg-white z-50 animate-shutter-flash" />
        )}

        {/* Viewfinder Canvas */}
        <div className="absolute inset-0 z-0">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            // Futuristic scenic simulation fallback background
            <div className="w-full h-full bg-zinc-950 relative flex flex-col items-center justify-center text-center p-6">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-pink/10 to-accent-cyan/10 animate-pulse duration-3000" />
              
              {/* Rotating target lines grid */}
              <div className="w-48 h-48 rounded-full border border-dashed border-zinc-800 flex items-center justify-center animate-spin duration-[20s] relative">
                <div className="absolute w-4 h-0.5 bg-accent-cyan left-[-2px]"></div>
                <div className="absolute w-4 h-0.5 bg-accent-cyan right-[-2px]"></div>
                <div className="absolute h-4 w-0.5 bg-accent-pink top-[-2px]"></div>
                <div className="absolute h-4 w-0.5 bg-accent-pink bottom-[-2px]"></div>
              </div>

              <div className="absolute flex flex-col items-center space-y-2 mt-4 max-w-[250px] z-10">
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
                  <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase">Simulating lens</span>
                </div>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  No device camera active. Shutter will capture preset landscape photos.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top bar overlay controls */}
        <div className="relative top-4 left-0 right-0 px-4 flex justify-between items-center z-20">
          {/* User Profile thumbnail (Left) */}
          <button 
            onClick={() => router.push(`/profile/${currentUser.username}`)}
            className="w-9 h-9 rounded-full border-2 border-white/90 overflow-hidden shadow-lg active:scale-90 transition-all"
          >
            <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
          </button>

          {/* Audience selector pill (Center) */}
          <div className="relative">
            <button
              onClick={() => setAudienceOpen(!audienceOpen)}
              className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-2 text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
            >
              {audience === 'Public' && <Globe className="w-3.5 h-3.5 text-accent-cyan" />}
              {audience === 'Friends' && <Lock className="w-3.5 h-3.5 text-accent-pink" />}
              {audience !== 'Public' && audience !== 'Friends' && <Users className="w-3.5 h-3.5 text-accent-purple" />}
              <span>{getAudienceLabel()}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {/* Audience selection floating menu */}
            {audienceOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0c0c0c]/95 backdrop-blur-lg border border-zinc-900 rounded-2xl shadow-xl py-2 z-30 animate-fade-in-up">
                <button
                  onClick={() => { setAudience('Public'); setAudienceOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-zinc-900 flex items-center space-x-2.5"
                >
                  <Globe className="w-4 h-4 text-accent-cyan" />
                  <span>Public Feed</span>
                </button>
                <button
                  onClick={() => { setAudience('Friends'); setAudienceOpen(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-zinc-900 flex items-center space-x-2.5"
                >
                  <Lock className="w-4 h-4 text-accent-pink" />
                  <span>Friends Only</span>
                </button>
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => { setAudience(group.id); setAudienceOpen(false); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-zinc-900 flex items-center space-x-2.5 border-t border-zinc-900/50"
                  >
                    <Users className="w-4 h-4 text-accent-purple" />
                    <span className="truncate">{group.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment icon (Right) */}
          <button 
            onClick={() => router.push('/feed')}
            className="w-9 h-9 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder overlays (Flash & Zoom) */}
        <div className="relative px-6 flex justify-between items-start z-10 pointer-events-none mt-10">
          {/* Flash Toggle */}
          <button
            onClick={() => setFlash(!flash)}
            className="pointer-events-auto w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/5 flex items-center justify-center text-white active:scale-90 transition-all"
          >
            {flash ? (
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <ZapOff className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoom(zoom === '1x' ? '2x' : '1x')}
            className="pointer-events-auto px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 text-xs font-bold text-white tracking-widest active:scale-90 transition-all"
          >
            {zoom}
          </button>
        </div>

        {/* Caption text area overlays */}
        <div className="relative px-6 pb-6 z-20 w-full">
          <input
            type="text"
            placeholder="Add a vibe caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-accent-cyan/80 focus:ring-1 focus:ring-accent-cyan/10"
          />
        </div>
      </div>

      {/* Bottom controls outside rounded frame */}
      <div className="mt-5 flex justify-between items-center px-6 select-none relative z-20">
        {/* Media gallery picker (Left) */}
        <div className="w-12 flex justify-start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 transition-all active:scale-95 overflow-hidden"
          >
            {lastCapture ? (
              <img src={lastCapture.url} alt="Latest" className="w-full h-full object-cover scale-[1.05]" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Large Shutter Button (Center) */}
        <div className="relative flex justify-center items-center">
          {/* Neon outer glowing ring */}
          <div className="absolute w-20 h-20 bg-transparent rounded-full border-2 border-accent-cyan/60 animate-glow-pulse" />
          <button
            onClick={handleShutter}
            className="relative w-16 h-16 bg-white hover:bg-zinc-200 active:scale-90 rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-full border border-black/10 bg-transparent" />
          </button>
        </div>

        {/* Camera Flip Toggle (Right) */}
        <div className="w-12 flex justify-end">
          <button
            onClick={toggleFlip}
            className="w-11 h-11 bg-zinc-950 border border-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-800 transition-all active:scale-90"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Drawer trigger for History */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setHistoryOpen(true)}
          className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-full flex items-center space-x-2 text-xs font-bold text-zinc-400 active:scale-95 transition-all shadow-md"
        >
          {lastCapture && (
            <div className="w-4 h-4 rounded-full overflow-hidden border border-zinc-800 flex-shrink-0">
              <img src={lastCapture.url} alt="Prev" className="w-full h-full object-cover" />
            </div>
          )}
          <span>History</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
        </button>
      </div>

      {/* History Drawer Slider */}
      <Drawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Your Captured Instants"
      >
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold border-b border-zinc-900/60 pb-1.5">
            Past captures archive ({currentUser.instants.length})
          </p>

          {currentUser.instants.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
              <Camera className="w-8 h-8 text-zinc-700" />
              <p className="text-xs text-zinc-600">No photos captured yet. Press the shutter button above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {currentUser.instants.map((inst) => (
                <div 
                  key={inst.id} 
                  className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative group cursor-pointer"
                >
                  <img src={inst.url} alt={inst.caption} className="w-full h-full object-cover" />
                  
                  {/* Glass indicator overlays */}
                  <div className="absolute top-1 left-1.5 py-0.5 px-1.5 bg-black/60 rounded-md text-[8px] text-zinc-400 border border-white/5">
                    {inst.audience === 'Public' ? 'Public' : 'Group'}
                  </div>

                  {inst.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/90 to-transparent text-[8px] text-zinc-300 truncate">
                      {inst.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
