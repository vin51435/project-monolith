'use client';

import React from 'react';
import { Dumbbell, Timer, Flame, Sparkles, BookOpen, Layers, Lock, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTimer: (seconds?: number, name?: string) => void;
  timerRunning?: boolean;
  onLock?: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenTimer,
  timerRunning = false,
  onLock,
}: HeaderProps) {
  const navTabs = [
    { id: 'today', label: 'Workout Plan', icon: Dumbbell },
    { id: 'night', label: 'Night Routine', icon: Sparkles },
    { id: 'progression', label: 'Progression & Glossary', icon: BookOpen },
    { id: 'library', label: '40 Guides', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20 border border-indigo-400/30">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight">
                  6-Day PPL <span className="text-indigo-400">× 2</span>
                </h1>
                <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  6 kg
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                Hypertrophy &bull; Pull-Up Ledge &bull; Night Routine
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile, handled cleanly by BottomNav) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Timer + Lock */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Rest Timer Button - Fully Illuminated when active */}
            <button
              onClick={() => onOpenTimer(60, 'Rest Interval')}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black border active:scale-95 transition-all duration-300 ${
                timerRunning
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40 animate-pulse ring-2 ring-emerald-400/50'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
              }`}
            >
              <Timer className={`w-3.5 h-3.5 ${timerRunning ? 'text-slate-950' : 'text-indigo-400'}`} />
              <span>Timer</span>

              {/* Radiant Ping Indicator */}
              {timerRunning && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white border border-emerald-600 shadow-sm"></span>
                </span>
              )}
            </button>

            {/* Lock App Button */}
            {onLock && (
              <button
                onClick={onLock}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition active:scale-95"
                title="Lock app"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
