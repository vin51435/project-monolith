'use client';

import React from 'react';
import { Dumbbell, Timer, Flame, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTimer: (seconds?: number, name?: string) => void;
  timerRunning?: boolean;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenTimer,
  timerRunning = false,
}: HeaderProps) {
  const navTabs = [
    { id: 'today', label: 'Workout Plan', icon: Dumbbell },
    { id: 'schedule', label: '7-Day Split', icon: Flame },
    { id: 'night', label: 'Night Routine', icon: Sparkles },
    { id: 'progression', label: 'Progression & Glossary', icon: BookOpen },
    { id: 'library', label: '40 Guides', icon: Layers },
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

          {/* Rest Timer Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTimer(60, 'Rest Interval')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border active:scale-95 transition ${
                timerRunning
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-md shadow-amber-500/25'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Timer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
