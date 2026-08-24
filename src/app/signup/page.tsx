"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sun, Moon, Camera, ArrowRight, Check, AlertCircle } from 'lucide-react';

const STORY_CIRCLES = [
  {
    id: 's1',
    url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[20%] left-[15%] w-20 h-20 rounded-full border-2 border-white/40 shadow-xl animate-float-1',
    delay: '0s'
  },
  {
    id: 's2',
    url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[10%] right-[20%] w-24 h-24 rounded-full border-2 border-white/30 shadow-xl animate-float-2',
    delay: '1.2s'
  },
  {
    id: 's3',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    className: 'absolute bottom-[20%] left-[22%] w-28 h-28 rounded-full border-4 border-white/50 shadow-2xl animate-float-3',
    delay: '2.5s'
  },
  {
    id: 's4',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=150&q=80',
    className: 'absolute bottom-[15%] right-[15%] w-16 h-16 rounded-full border-2 border-white/20 shadow-xl animate-float-4',
    delay: '3.8s'
  },
  {
    id: 's5',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80',
    className: 'absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-accent-pink/50 shadow-2xl animate-float-1',
    delay: '0.5s'
  }
];

export default function Signup() {
  const router = useRouter();
  const { signup } = useApp();
  
  // Step navigation (1: Form details, 2: Setup Camera)
  const [step, setStep] = useState<1 | 2>(1);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
        cameraStream.getTracks().forEach(track => track.stop());
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
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and Last name are required');
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
      setStep(2); // Proceed to camera setup page
    }, 800);
  };

  const handleStartCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' } });
      setCameraStream(stream);
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Webcam permission denied or unavailable:", err);
      setCameraPermission('denied');
      setError('Camera access denied. Showing a simulated video feed instead.');
    }
  };

  const handleCompleteRegistration = () => {
    setLoading(true);
    
    // Stop camera streams
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`.replace(/[^a-z0-9_]/g, '');
    const bioText = 'New adventurer sharing real life on Instants.';

    setTimeout(() => {
      const success = signup(`${firstName} ${lastName}`, username, bioText);
      setLoading(false);
      if (success) {
        router.push('/feed');
      } else {
        setError('Registration failed. Please try again.');
        setStep(1);
      }
    }, 1000);
  };

  // Color mapping variables based on theme state
  const isLight = theme === 'light';
  const bgColor = isLight ? 'bg-[#F8FAFC]' : 'bg-slate-950'; // Off-white signup background
  const cardBg = isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800';
  const textColor = isLight ? 'text-slate-900' : 'text-zinc-100';
  const subTextColor = isLight ? 'text-slate-500' : 'text-zinc-400';
  const inputBg = isLight ? 'bg-slate-50' : 'bg-slate-950';
  const inputBorder = isLight ? 'border-slate-200 focus:border-purple-500 focus:ring-purple-200' : 'border-slate-800 focus:border-purple-600 focus:ring-purple-950';
  const labelColor = isLight ? 'text-slate-500' : 'text-zinc-400';
  const dividerBorder = isLight ? 'border-slate-100' : 'border-slate-800';

  return (
    <div className={`flex-1 flex flex-col lg:flex-row min-h-screen ${bgColor} ${textColor} transition-colors duration-300 font-sans`}>
      
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

      {/* LEFT COLUMN: Reskinned Brand Image Area with Story Circle Art */}
      <div className="w-full lg:w-[45%] xl:w-[45%] min-h-[320px] lg:min-h-screen bg-slate-950 bg-gradient-to-br from-indigo-950 via-slate-900 to-[#FF2E93]/20 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center z-10">
          <span className="text-lg font-black tracking-wider uppercase text-white">Instants</span>
        </div>

        {/* Dynamic Story Circles Composition (Floating circles in the center) */}
        <div className="relative w-full h-[260px] lg:h-[400px] flex items-center justify-center my-6 z-10">
          {STORY_CIRCLES.map((circle) => (
            <div
              key={circle.id}
              className={`${circle.className} overflow-hidden bg-cover bg-center cursor-pointer transition-all duration-500 hover:scale-[1.1] hover:border-accent-cyan/80`}
              style={{ 
                backgroundImage: `url(${circle.url})`,
                animationDelay: circle.delay
              }}
            >
              {/* Semi-transparent blur overlay ring inside circle */}
              <div className="w-full h-full bg-black/5 hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>

        {/* Visual Brand Text */}
        <div className="z-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
            Start sharing real life on Instants.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-sm leading-relaxed">
            Create candid logs, invite your closest friends, and join travel vibes that match yours.
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* RIGHT COLUMN: Interactive Registration / Camera Setup Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-screen">
        
        <div className={`w-full max-w-[480px] p-6 sm:p-8 rounded-3xl border shadow-md ${cardBg} transition-all duration-300`}>
          
          {/* STEP 1: CREATE ACCOUNT */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Create Account</h1>
                <p className={`text-xs ${subTextColor}`}>Fill in details to set up your candid profile.</p>
              </div>

              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                {/* Name Row (Side by side) */}
                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`block w-full px-3.5 py-2.5 ${inputBg} border ${inputBorder} rounded-xl text-sm transition-all focus:outline-none focus:ring-2`}
                      required
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-accent-pink to-accent-cyan hover:opacity-95 active:scale-[0.98] text-black text-sm font-bold rounded-xl shadow-lg shadow-accent-pink/20 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins */}
              <div className="mt-6">
                <div className="relative flex py-2 items-center">
                  <div className={`flex-grow border-t ${dividerBorder}`}></div>
                  <span className={`flex-shrink mx-4 text-[9px] uppercase font-bold tracking-widest ${subTextColor}`}>
                    or
                  </span>
                  <div className={`flex-grow border-t ${dividerBorder}`}></div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mt-3">
                  <button 
                    type="button" 
                    onClick={() => { setFirstName('Emma'); setLastName('Watson'); setEmail('emma_in_europe@email.com'); setPassword('password123'); setStep(2); }}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-semibold ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                    }`}
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Sign up with Facebook</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setFirstName('Kento'); setLastName('Sato'); setEmail('kento_tokyo@email.com'); setPassword('password123'); setStep(2); }}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-semibold ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-950 border-slate-800 text-zinc-300 hover:bg-slate-900'
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Sign up with X</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-xs">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-accent-cyan hover:underline">
                  Log in
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: SETUP CAMERA */}
          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-accent-pink mb-4">
                <Camera className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-center mb-1">Setup Your Camera</h2>
              <p className={`text-xs ${subTextColor} text-center max-w-sm mb-5 leading-relaxed`}>
                Instants requires real-time capturing to post. Grant camera permission to set up your profile snap.
              </p>

              {/* Camera Preview Box */}
              <div className="w-[220px] h-[220px] rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-800 relative bg-slate-950 shadow-inner flex flex-col justify-center items-center mb-6">
                
                {/* Active Webcam Feed */}
                {cameraPermission === 'granted' && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}

                {/* Simulated/No Stream fallback */}
                {cameraPermission !== 'granted' && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-500 relative select-none">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=200&q=80')` }} />
                    <div className="absolute inset-0 bg-black/60" />
                    
                    <div className="z-10 flex flex-col items-center space-y-2">
                      <Camera className="w-8 h-8 text-zinc-500 animate-pulse" />
                      <p className="text-[10px] font-semibold text-zinc-300">Camera Feed Simulator</p>
                      <div className="flex space-x-1 items-center bg-black/50 px-2 py-0.5 rounded border border-white/5">
                        <span className="w-1.5 h-1.5 bg-[#FF2E93] rounded-full animate-ping" />
                        <span className="text-[8px] text-white/80 font-bold font-mono">REC STANDBY</span>
                      </div>
                    </div>
                  </div>
                )}
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
                    className="w-full py-3 bg-white text-black hover:bg-zinc-100 text-sm font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Allow Camera Access</span>
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
                      <span>{cameraPermission === 'granted' ? 'Save & Start Sharing' : 'Skip & Start Sharing'}</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`w-full py-2.5 text-xs font-semibold ${subTextColor} hover:text-slate-300 transition-colors`}
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
