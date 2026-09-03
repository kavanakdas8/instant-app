"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";

export default function HomePage() {
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
            <Camera className="size-7 text-emerald-400"/>
            <span className="text-xl font-bold tracking-tight font-sans">
              Instants
            </span>
          </div>

          {/* Links */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { name: 'Destinations', dropdown: true, href: '/feed' },
              { name: 'Travel Groups', dropdown: false, href: '/chats' },
              { name: 'Live Map', dropdown: false, href: '/chats' },
              { name: 'Explore', dropdown: false, href: '/feed' },
            ].map((link) => (
              <Link className="group flex min-h-[40px] items-center gap-1.5 text-[14px] font-medium text-white/80 transition-colors duration-200 hover:text-white" href={link.href} key={link.name}>
                {link.name}
                {link.dropdown && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180"/>
                )}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link className="group flex min-h-10 items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2 text-base font-medium text-black shadow-[inset_0_2px_0_1px_rgba(255,255,255,0.5),inset_0px_-2px_0px_1px_rgba(0,0,0,0.3)] transition-[transform,background-color] duration-150 ease-out hover:bg-white/90 active:scale-[0.96]" href="/login">
            Get Started
            <ArrowRight className="h-4 w-4 text-black/80 transition-transform duration-150 ease-out group-hover:translate-x-0.5"/>
          </Link>
        </motion.nav>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <main className="flex flex-1 flex-col items-center justify-start px-6 text-center">
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
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-black">
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

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-2 max-w-[580px] text-sm leading-[1.6] font-normal text-pretty text-zinc-200 will-change-transform sm:text-[18px]"
            >
              Share raw, unedited live moments from destinations like Mysore and Coorg. 
              Find companions, pass vibe checks, and travel together.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex w-full flex-col gap-4 will-change-transform sm:w-auto sm:flex-row"
            >
              <Link className="text-md flex min-h-[48px] items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-black shadow-[inset_0_2px_2px_1px_rgba(255,255,255,0.3),inset_0px_-2px_2px_1px_rgba(0,0,0,0.1)] transition-[transform,background-color] duration-150 ease-out hover:bg-white/90 active:scale-[0.96] sm:w-auto" href="/feed">
                Explore Live Feed
              </Link>
              <Link className="text-md flex min-h-[48px] items-center justify-center rounded-lg border-2 border-white/50 bg-white/5 px-8 py-3 font-medium text-white backdrop-blur-md transition-[transform,background-color,border-color] duration-150 ease-out hover:border-white/40 hover:bg-white/5 active:scale-[0.96] sm:w-auto" href="/login">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
