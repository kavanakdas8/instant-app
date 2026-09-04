"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

function GlareButton({ href, children }: { href: string; children: React.ReactNode }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setGlarePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      href={href}
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative inline-flex min-h-[48px] w-full items-center justify-center overflow-hidden rounded-xl bg-transparent border border-white/50 px-8 py-3 text-base font-semibold text-white backdrop-blur-md transition-all duration-150 hover:bg-white/10 active:scale-95 sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]"
    >
      <span className="relative z-10 select-none">{children}</span>

      {/* Dynamic Glare Overlay */}
      {isHovered && glarePos && (
        <span
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 120px at ${glarePos.x}px ${glarePos.y}px, rgba(255, 255, 255, 0.4), transparent 75%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </Link>
  );
}

export default function HeroLanding() {
  // Nav: drops from top with blur
  const navVariants: Variants = {
    hidden: { opacity: 0, y: -20, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 22, stiffness: 180, delay: 0.05 },
    },
  };

  // Background: slow fade in with scale down
  const bgVariants: Variants = {
    hidden: { opacity: 0, scale: 1.05 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0 },
    },
  };

  // Container for stagger
  const contentContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  // General item rise up
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 24, stiffness: 100 },
    },
  };

  // Title lines: dramatic rise up
  const titleLineVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 28, stiffness: 80, mass: 1.2 },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans antialiased selection:bg-white/20 selection:text-white bg-black">
      {/* ── Background Image ──────────────────────────────────────────────── */}
      <motion.div
        variants={bgVariants}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-0 z-0 will-change-transform select-none"
      >
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400&auto=format&fit=crop"
          alt="Moody midnight alpine vista with starfield"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/75" />
      </motion.div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <motion.nav
          variants={navVariants}
          initial="hidden"
          animate="show"
          className="flex w-full items-center justify-between px-6 py-5 sm:px-8 md:px-12 lg:px-16"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 text-white">
            <span className="text-xl font-bold tracking-tight font-sans">
              Instants
            </span>
          </div>

        </motion.nav>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-start px-6 text-center">
          <motion.div
            variants={contentContainerVariants}
            initial="hidden"
            animate="show"
            className="flex max-w-[800px] flex-col items-center pt-12 xl:pt-20"
          >
            {/* Trusted / Live Badge */}
            <motion.div
              variants={itemVariants}
              className="will-change-transform"
            >
              <div className="flex items-center gap-2 rounded-full bg-transparent border border-white/20 px-4 py-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-white">
                  Live Moments • Unfiltered Travel
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 className="mt-2 text-[2.75rem] leading-[1.1] font-normal tracking-[-0.02em] text-balance text-white sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem]">
              <motion.span
                variants={titleLineVariants}
                className="block will-change-transform"
              >
                Turn Your Travels Into
              </motion.span>
              <motion.span
                variants={titleLineVariants}
                className="block will-change-transform bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-400 bg-clip-text text-transparent"
              >
                Unfiltered Instants
              </motion.span>
            </motion.h1>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex w-full flex-col gap-4 will-change-transform sm:w-auto sm:flex-row"
            >
              <GlareButton href="/signup">Get Started</GlareButton>
              <GlareButton href="/login">Sign In</GlareButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
