"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";

export interface ExploreSlide {
  id: string | number;
  img: string;
  title?: string;
  location?: string;
  creator?: string;
}

interface ExploreDeckCarouselProps {
  slides?: ExploreSlide[];
  onSelect?: (slide: ExploreSlide) => void;
}

const defaultSlides: ExploreSlide[] = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop",
    title: "Misty Valley Morning",
    location: "Kodagu (Coorg)",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop",
    title: "Heritage Courtyard",
    location: "Mysuru",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    title: "Golden Hour Ridge",
    location: "Western Ghats",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    title: "Emerald Lake Trail",
    location: "Ooty",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
    title: "Om Beach Sunset",
    location: "Gokarna",
  },
];

export default function ExploreDeckCarousel({
  slides = defaultSlides,
  onSelect,
}: ExploreDeckCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Determine relative position without applying rotational tilt
  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + slides.length) % slides.length;

    if (diff === 0) {
      return {
        zIndex: 30,
        x: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      };
    }
    if (diff === 1 || diff === -slides.length + 1) {
      return {
        zIndex: 20,
        x: 180,
        scale: 0.88,
        opacity: 0.65,
        filter: "blur(1.5px)",
      };
    }
    if (diff === slides.length - 1 || diff === -1) {
      return {
        zIndex: 20,
        x: -180,
        scale: 0.88,
        opacity: 0.65,
        filter: "blur(1.5px)",
      };
    }
    return {
      zIndex: 10,
      x: diff > 1 && diff < slides.length / 2 ? 300 : -300,
      scale: 0.75,
      opacity: 0,
      filter: "blur(4px)",
    };
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[540px] flex items-center justify-center overflow-hidden select-none py-6">
      {/* Navigation Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous destination card"
        className="absolute left-4 md:left-8 z-40 p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
      >
        <ChevronLeft className="w-5 h-5"/>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next destination card"
        className="absolute right-4 md:right-8 z-40 p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
      >
        <ChevronRight className="w-5 h-5"/>
      </button>

      {/* Cards Canvas */}
      <div className="relative w-[300px] sm:w-[340px] md:w-[380px] h-[460px] flex items-center justify-center">
        {slides.map((slide, index) => {
          const style = getCardStyle(index);
          const isActive = index === currentIndex;

          return (
            <motion.div
              key={slide.id}
              animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                filter: style.filter,
                rotate: 0, // Explicitly keep card upright (no rotation)
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.9,
              }}
              style={{ zIndex: style.zIndex }}
              onClick={() => {
                if (isActive && onSelect) {
                  onSelect(slide);
                } else {
                  setCurrentIndex(index);
                }
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer bg-[#0A0D14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group"
            >
              <img
                src={slide.img}
                alt={slide.title || "Travel Instant"}
                className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 group-hover:scale-105"
              />

              {/* OLED Studio Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

              {/* Top Location Pill */}
              {slide.location && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <MapPin className="w-3.5 h-3.5"/>
                  <span>{slide.location}</span>
                </div>
              )}

              {/* Bottom Card Meta */}
              <div className="absolute bottom-5 left-5 right-5 z-20">
                {slide.title && (
                  <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
                    {slide.title}
                  </h3>
                )}
                {isActive && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-zinc-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400"/>
                    <span>Tap to view destination deck</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Index Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Jump to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-emerald-400"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
