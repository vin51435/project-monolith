'use client';

import React from 'react';
import { Dumbbell, Calendar, Moon, TrendingUp, BookOpen, Layers } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'today', label: 'Workout', icon: Dumbbell },
    { id: 'schedule', label: '7-Day', icon: Calendar },
    { id: 'night', label: 'Night', icon: Moon },
    { id: 'progression', label: 'Progress', icon: TrendingUp },
    { id: 'library', label: '40 Guides', icon: Layers },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] transition active:scale-95 ${
                isActive
                  ? 'text-indigo-400 bg-indigo-950/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] scale-110 transition-transform' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
