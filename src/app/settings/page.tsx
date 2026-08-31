"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { 
  Settings, Compass, UserCheck, Users, PlusSquare, Bell, Send, Upload, Eye, EyeOff, Check
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-[260px] bg-[#000000] border-r border-[#27272A] p-6 flex-col justify-between fixed top-0 bottom-0 left-0 z-30">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo className="w-6 h-6 text-white" />
              <span className="text-xl font-black tracking-wider uppercase text-white select-none">Instants</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mt-2">
            <button
              onClick={() => router.push('/feed?tab=explore')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <Compass className="w-6 h-6 text-zinc-400" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => router.push('/feed?tab=following')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <UserCheck className="w-6 h-6 text-zinc-400" />
              <span>Following</span>
            </button>

            <button
              onClick={() => router.push('/feed?tab=friends')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <Users className="w-6 h-6 text-zinc-400" />
              <span>Friends</span>
            </button>

            <button
              onClick={() => router.push('/capture')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <PlusSquare className="w-6 h-6 text-zinc-400" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => router.push('/notifications')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <Bell className="w-6 h-6 text-zinc-400" />
              <span>Activity</span>
            </button>

            <button
              onClick={() => router.push('/chats')}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <Send className="w-6 h-6 text-zinc-400" />
              <span>Messages</span>
            </button>

            <button
              onClick={() => router.push(`/profile/${currentUser.username}`)}
              className="w-full flex items-center space-x-4 px-3 py-3 text-zinc-300 hover:bg-zinc-900 rounded-xl text-[15px] font-bold transition-all"
            >
              <img src={currentUser.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-zinc-700" />
              <span>Profile</span>
            </button>

            <button
              className="w-full flex items-center space-x-4 px-3 py-3 bg-[#18181B] text-white border border-[#27272A] rounded-xl text-[15px] font-bold transition-all mt-auto"
            >
              <Settings className="w-6 h-6 text-white" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Space */}
      <div className="flex-1 md:ml-[260px] p-4 md:p-8 relative min-h-screen pb-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: General Information */}
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">General Information</h2>
            
            {/* Avatar & Upload */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold transition-colors text-white mb-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
                <p className="text-xs text-zinc-500">JPG, PNG or GIF • Max size 2MB<br/>Recommended 200 × 200 px</p>
              </div>
            </div>

            {/* BASIC INFO */}
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">First Name</label>
                <input type="text" defaultValue={currentUser.name.split(' ')[0] || ''} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Last Name</label>
                <input type="text" defaultValue={currentUser.name.split(' ').slice(1).join(' ') || ''} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-300 mb-1.5">Email</label>
                <input type="email" defaultValue={`${currentUser.username}@demo.com`} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Phone</label>
                <input type="text" defaultValue="+1(000) 000-00000" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Default Language</label>
                <select className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors appearance-none">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-300 mb-1.5">Theme</label>
                <select className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors appearance-none">
                  <option>System Default</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
            </div>

            {/* SOCIAL PROFILES */}
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">Facebook</label>
                <input type="text" placeholder="Facebook.com/username" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1.5">LinkedIn</label>
                <input type="text" placeholder="linkedin.com/in/username" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            {/* Change password */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">Change password</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">Old password</label>
                  <div className="relative">
                    <input type={showOldPassword ? "text" : "password"} defaultValue="password123" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors pr-10" />
                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">New password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} placeholder="estiaqnoot@1" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors pr-10" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1.5">Repeat New Password</label>
                  <div className="relative">
                    <input type={showRepeatPassword ? "text" : "password"} placeholder="Confirm new password" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors pr-10" />
                    <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                      {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Auth */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">Two-Factor Auth</h2>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-4 rounded-xl border border-blue-500/50 bg-blue-500/10 cursor-pointer transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Disabled</div>
                    <div className="text-xs text-zinc-400 mt-0.5">2FA is currently off</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded border border-zinc-600 flex items-center justify-center"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-200">Email Authentication</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Code sent to<br/>{currentUser.username}@demo.com</div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded border border-zinc-600 flex items-center justify-center"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-200">Google Authenticator</div>
                    <div className="text-xs text-zinc-500 mt-0.5">Scan QR code with app</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Action */}
        <div className="max-w-6xl mx-auto mt-6 flex justify-end">
          <button className="px-6 py-2.5 bg-[#1F2937] hover:bg-[#374151] border border-zinc-700 rounded-lg text-sm font-semibold text-white shadow-lg transition-colors">
            Save All Changes
          </button>
        </div>
      </div>

    </div>
  );
}
