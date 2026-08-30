"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Camera, ArrowRight, Check, AlertCircle, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import LiveMapCluster from '@/components/LiveMapCluster';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
];

function SignupParamsHandler({
  onEmailFound
}: {
  onEmailFound: (email: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      onEmailFound(emailParam);
    }
  }, [searchParams, onEmailFound]);

  return null;
}

export default function Signup() {
  const router = useRouter();
  const { signup } = useApp();

  // Step navigation (1: Form details, 2: Setup Camera / Avatar)
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[4]);

  // States
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Camera integration state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set initial theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('instants-auth-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Cleanup camera tracks on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('instants-auth-theme', nextTheme);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate account setup delay
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Proceed to camera/avatar setup page
    }, 500);
  };

  const handleStartCamera = async () => {
    setError('');
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('denied');
        setError('Camera access not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: 'user' }
      });
      setCameraStream(stream);
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      setCameraPermission('denied');
      setError('Camera permission unavailable. Choose an avatar or proceed with default.');
    }
  };

  const handleCompleteRegistration = () => {
    setLoading(true);

    // Stop camera streams
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const baseUsername = email.includes('@')
      ? email.split('@')[0]
      : `${firstName}_${lastName || 'traveler'}`;
    const cleanUsername = baseUsername.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now()}`;
    const bioText = bio.trim() || 'New adventurer sharing real life on Instants. 🌍✨';

    setTimeout(() => {
      const success = signup(fullName, cleanUsername, bioText, selectedAvatar);
      setLoading(false);
      if (success) {
        router.push('/feed');
      } else {
        setError('Registration failed. Please try again.');
        setStep(1);
      }
    }, 700);
  };

  // Color mapping variables based on theme state
  const isLight = theme === 'light';
  const bgColor = isLight ? 'bg-white' : 'bg-[#000000]';
  const cardBg = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-none';
  const textColor = isLight ? 'text-slate-900' : 'text-zinc-100';
  const subTextColor = isLight ? 'text-slate-500' : 'text-zinc-400';
  const inputBg = isLight ? 'bg-slate-50' : 'bg-slate-950';
  const inputBorder = isLight
    ? 'border-slate-200 focus:border-purple-500 focus:ring-purple-200'
    : 'border-slate-800 focus:border-purple-600 focus:ring-purple-950';
  const labelColor = isLight ? 'text-slate-600' : 'text-zinc-400';
  const dividerBorder = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`relative flex-1 flex flex-col lg:flex-row min-h-screen ${bgColor} ${textColor} transition-colors duration-300 font-sans`}>
      
      {/* Full Page Grid Background */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 ${isLight ? 'opacity-10' : 'opacity-[0.05]'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${isLight ? '#000000' : '#ffffff'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isLight ? '#000000' : '#ffffff'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <Suspense fallback={null}>
        <SignupParamsHandler
          onEmailFound={(emailVal) => {
            setEmail(emailVal);
            if (emailVal.includes('@')) {
              const namePart = emailVal.split('@')[0].split('.')[0];
              if (namePart && !firstName) {
                setFirstName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
              }
            }
          }}
        />
      </Suspense>

      {/* Theme Toggle Floating Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-50 p-2.5 rounded-full border shadow-sm transition-all duration-300 ${
          isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
        }`}
        aria-label="Toggle Theme"
      >
        {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* LEFT COLUMN: Reskinned Brand Image Area with Live Map Cluster */}
      <div className="w-full lg:w-[45%] xl:w-[45%] min-h-[320px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden transition-colors duration-300 z-10">
        {/* Brand Logo & Name */}
        <div className="flex items-center z-10 space-x-2">
          <Logo className={`w-8 h-8 drop-shadow-md ${isLight ? 'text-slate-900' : 'text-white'}`} />
          <span className={`text-lg font-black tracking-wider uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Instants</span>
        </div>

        {/* Interactive Live Map Cluster */}
        <LiveMapCluster theme={theme} />

        {/* Visual Brand Text */}
        <div className="z-10 text-left">
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Start sharing real life on Instants.
          </h2>
          <p className={`text-xs sm:text-sm max-w-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            Create candid logs, invite your closest friends, and join travel vibes that match yours.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* RIGHT COLUMN: Interactive Registration / Camera Setup Form Area */}
      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-screen z-10">
        <div className={`w-full max-w-[480px] p-6 sm:p-8 rounded-3xl border shadow-md ${cardBg} transition-all duration-300`}>
          {/* STEP 1: CREATE ACCOUNT */}
          {step === 1 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">Create Account</h1>
                  <p className={`text-xs ${subTextColor}`}>Fill in details to set up your candid profile.</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                  Step 1/2
                </span>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Row (Side by side) */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="firstName" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe (optional)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                    required
                  />
                </div>

                {/* Bio Field (Optional) */}
                <div>
                  <label htmlFor="bio" className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
                    Short Bio (Optional)
                  </label>
                  <input
                    id="bio"
                    type="text"
                    placeholder="E.g. Solo hiker, café lover & travel photographer 🎒"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-95 active:scale-[0.98] text-black text-sm font-bold rounded-xl shadow-lg shadow-accent-pink/20 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Profile Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account */}
              <div className="mt-6 text-center text-xs font-medium pt-4 border-t border-slate-100 dark:border-slate-800">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-accent-cyan hover:underline ml-1">
                  Log in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: SETUP CAMERA / AVATAR */}
          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`text-xs font-semibold ${subTextColor} hover:text-slate-300 transition-colors`}
                >
                  ← Back to details
                </button>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                  Step 2/2
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-accent-pink mb-3">
                <Camera className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-center mb-1">Set Your Profile Picture</h2>
              <p className={`text-xs ${subTextColor} text-center max-w-sm mb-5 leading-relaxed`}>
                Choose an avatar preset or allow camera access to take your profile snap.
              </p>

              {/* Avatar / Camera Preview Box */}
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-accent-pink/40 relative bg-slate-950 shadow-xl flex flex-col justify-center items-center mb-4">
                {/* Active Webcam Feed */}
                {cameraPermission === 'granted' ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                ) : (
                  <img src={selectedAvatar} alt="Selected Avatar" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Avatar Preset Grid */}
              <div className="w-full mb-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 text-center">
                  Select an Avatar Preset
                </p>
                <div className="flex justify-center space-x-2.5">
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(url);
                        if (cameraStream) {
                          cameraStream.getTracks().forEach((track) => track.stop());
                          setCameraStream(null);
                          setCameraPermission('prompt');
                        }
                      }}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform ${
                        selectedAvatar === url && cameraPermission !== 'granted'
                          ? 'border-accent-pink scale-110 shadow-md shadow-accent-pink/30'
                          : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="w-full p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                {cameraPermission !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleStartCamera}
                    className="w-full py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Or Snap Live Webcam Photo</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                  className={`w-full py-3.5 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-95 text-black text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                    loading ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Complete Signup & Start Exploring</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
