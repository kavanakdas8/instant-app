"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Camera, MessageSquare, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useApp();

  // Hide navigation on capture and auth pages to ensure immersive edge-to-edge screen space
  if (
    pathname === '/capture' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/' ||
    !currentUser
  ) {
    return null;
  }

  const navItems = [
    {
      label: 'Feed',
      icon: Compass,
      href: '/feed',
    },
    {
      label: 'Chats',
      icon: MessageSquare,
      href: '/chats',
    },
    {
      label: 'Profile',
      icon: User,
      href: currentUser ? `/profile/${currentUser.username}` : '/login',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-[#080808]/90 backdrop-blur-md border-t border-zinc-900 flex justify-around items-center px-4 z-40">
      {/* Floating Camera Button - Only displayed on Feed page */}
      {pathname === '/feed' && (
        <Link
          href="/capture"
          className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-full shadow-lg shadow-black/50 hover:scale-105 active:scale-95 transition-transform duration-200"
          aria-label="Capture"
        >
          <Camera className="w-6 h-6 stroke-[2]" />
        </Link>
      )}

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors duration-200 ${isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export default Navigation;
