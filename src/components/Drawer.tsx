"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string; // e.g. "h-[80vh]"
  className?: string; // Add className for custom positioning
  disableScroll?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "h-[75vh]",
  className = "",
  disableScroll = false
}) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`absolute inset-0 z-50 overflow-hidden flex flex-col justify-end ${className}`}>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`w-full ${maxHeight} bg-black/60 backdrop-blur-2xl border-t border-zinc-900/50 rounded-t-[32px] flex flex-col relative z-10 shadow-2xl overflow-hidden`}
          >
            {/* Drag indicator pill */}
            <div className="pt-3 pb-2 w-full flex justify-center cursor-row-resize" onClick={onClose}>
              <div className="w-12 h-1 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors" />
            </div>

            {/* Header */}
            <div className="px-4 pb-3 flex justify-between items-center border-b border-zinc-900/50">
              <h3 className="text-base font-semibold tracking-wide text-zinc-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-200 active:scale-90 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className={`flex-1 ${disableScroll ? 'overflow-hidden flex flex-col' : 'overflow-y-auto no-scrollbar'} p-4`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default Drawer;
