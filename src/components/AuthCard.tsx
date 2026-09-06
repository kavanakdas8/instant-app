"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdPerson, MdEmail, MdLock, MdArrowForward } from "react-icons/md";
import { FaGoogle, FaApple } from "react-icons/fa";

interface AuthCardProps {
  initialMode?: "signin" | "signup";
}

export default function AuthCard({ initialMode = "signin" }: AuthCardProps) {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(initialMode === "signin");

  const toggleMode = () => {
    const nextMode = !isSignIn;
    setIsSignIn(nextMode);
    window.history.replaceState(null, "", nextMode ? "/login" : "/signup");
  };

  const formVariants = {
    initial: {
      opacity: 0,
      scale: 0.96,
      filter: "blur(8px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      filter: "blur(8px)",
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Image: Uncompressed Coastal Cliffs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Moody coastal cliffs"
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/70 to-black/90 backdrop-blur-[2px]" />
      </div>

      {/* Outer Shell Card with layout animation for smooth height adjustment */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl p-1.5 sm:p-2 bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="rounded-[1.4rem] p-6 sm:p-8 bg-[#090A0F]/85 border border-white/[0.06] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            {isSignIn ? (
              /* ─── Sign In Form ─── */
              <motion.div
                key="signin"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
                    Welcome back, explorer
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Enter your credentials to access your trips, feed, and passport.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <FaGoogle className="h-4 w-4" /> Google
                  </button>
                  <button
                    type="button"
                    className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <FaApple className="h-4 w-4" /> Apple
                  </button>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 border-t border-white/10" />
                  <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
                    or continue with email
                  </span>
                  <div className="flex-1 border-t border-white/10" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    router.push("/feed");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Email
                    </label>
                    <div className="relative">
                      <MdEmail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        placeholder="alex@company.io"
                        required
                        className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Password
                    </label>
                    <div className="relative">
                      <MdLock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-white/10 bg-white/5 accent-rose-500"
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      className="text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-transform active:scale-[0.98]"
                  >
                    Sign in to Instants
                    <MdArrowForward className="h-4 w-4" />
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-zinc-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-rose-400 hover:text-rose-300 font-medium hover:underline transition-colors ml-1"
                  >
                    Sign up
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ─── Sign Up Form ─── */
              <motion.div
                key="signup"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans sm:text-3xl">
                    Create your travel passport
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Join thousands of travelers sharing live moments and joining group trips.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <FaGoogle className="h-4 w-4" /> Google
                  </button>
                  <button
                    type="button"
                    className="h-11 w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <FaApple className="h-4 w-4" /> Apple
                  </button>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 border-t border-white/10" />
                  <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
                    or sign up with email
                  </span>
                  <div className="flex-1 border-t border-white/10" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    router.push("/feed");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        First name
                      </label>
                      <div className="relative">
                        <MdPerson className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Alex"
                          required
                          className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                        Last name
                      </label>
                      <div className="relative">
                        <MdPerson className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Rivera"
                          required
                          className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Email
                    </label>
                    <div className="relative">
                      <MdEmail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="email"
                        placeholder="alex@company.io"
                        required
                        className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Password
                    </label>
                    <div className="relative">
                      <MdLock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        type="password"
                        placeholder="Min. 8 characters"
                        minLength={8}
                        required
                        className="w-full h-11 bg-white/[0.03] border border-white/10 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 rounded-xl text-sm text-white placeholder:text-zinc-600 pl-10 pr-3 transition-colors outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Use at least 8 characters with letters and numbers.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-transform active:scale-[0.98]"
                  >
                    Get started for free
                    <MdArrowForward className="h-4 w-4" />
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-zinc-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-rose-400 hover:text-rose-300 font-medium hover:underline transition-colors ml-1"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
