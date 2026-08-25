'use client';

import React from 'react';
import { Dumbbell, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-200">
                6-Day PPL + Night Routine &bull; 6 kg Edition
              </p>
              <p className="text-[11px] text-slate-500">
                Optimized for home dumbbells, pull-up bar, and floor calisthenics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Static Export
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
          Built with Next.js, Tailwind CSS &amp; TypeScript
        </div>
      </div>
    </footer>
  );
}
