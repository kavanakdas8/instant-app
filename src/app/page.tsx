"use client";

import HeroLanding from "@/components/HeroLanding";
import FooterLanding from "@/components/FooterLanding";
import { motion, type Variants } from "framer-motion";

export default function HomePage() {
  const bgVariants: Variants = {
    hidden: { opacity: 0, scale: 1.05 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0 },
    },
  };

  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Background Image covering the whole page */}
      <motion.div
        variants={bgVariants}
        initial="hidden"
        animate="show"
        className="pointer-events-none fixed inset-0 z-0 will-change-transform select-none"
      >
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400&auto=format&fit=crop"
          alt="Moody midnight alpine vista with starfield"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/75" />
      </motion.div>

      <div className="relative z-10">
        <HeroLanding />
        <FooterLanding />
      </div>
    </main>
  );
}
