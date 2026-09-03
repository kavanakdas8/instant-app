"use client";

import React, { useRef, useState } from "react";

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
}

export default function GlareHover({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  className = "",
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setGlarePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      {children}
      {isHovered && glarePosition && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity"
          style={{
            transitionDuration: `${transitionDuration}ms`,
            background: `radial-gradient(circle ${glareSize}px at ${glarePosition.x}px ${glarePosition.y}px, ${glareColor}, transparent 70%)`,
            opacity: glareOpacity,
            transform: `rotate(${glareAngle}deg)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
