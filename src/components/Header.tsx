'use client';

import React from 'react';
import { Dumbbell, Timer, Flame, Sparkles, BookOpen } from 'lucide-react';

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
    { id: 'progression', label: 'Progression', icon: Flame },
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
    { id: 'library', label: '40 Exercise Guides', icon: Dumbbell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  6-Day PPL <span className="text-indigo-400">× 2</span>
                </h1>
                <span className="hidden xs:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  6 kg Setup
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none">
                Hypertrophy &bull; Pull-Up Ledge &bull; Night Routine
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
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

          {/* Quick Rest Timer Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTimer(60, 'Rest Interval')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border active:scale-95 transition ${
                timerRunning
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-lg shadow-amber-500/25'
                  : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:border-indigo-400'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Rest Timer</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation Scroll */}
        <div className="lg:hidden flex items-center gap-1.5 pb-2.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
