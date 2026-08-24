'use client';

import React from 'react';
import {
  PROGRESSION_METHODS,
  GOBLET_SQUAT_PROGRESSION,
  EFFORT_GUIDELINES
} from '@/data/workoutData';
import { TrendingUp, Target, AlertTriangle, ArrowRight, Check, Zap } from 'lucide-react';

export default function ProgressionView() {
  return (
    <div className="space-y-6">
      {/* 1. Progression Principles Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              How to Progress With Only 6 kg Dumbbells
            </h2>
            <p className="text-xs text-slate-400">
              Unlocking progressive overload without needing heavier dumbbells
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Because the dumbbell weight remains fixed at 6 kg, muscular hypertrophy is achieved through <strong>metabolic stress, mechanical tension under time, unilateral leverage</strong>, and <strong>strict technical execution</strong>.
        </p>

        {/* 7 Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROGRESSION_METHODS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 text-[10px] font-black flex items-center justify-center border border-indigo-500/30">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white">{item.method}</h4>
              </div>
              <p className="text-xs font-semibold text-indigo-300 bg-indigo-950/40 p-2 rounded-xl border border-indigo-900/40 mt-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{item.example}</span>
              </p>
            </div>
          ))}
        </div>

        {/* 2. Goblet Squat Progression Example */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/30 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Real-World Case Study
            </span>
            <h4 className="text-sm font-bold text-white">
              5-Week Goblet Squat Progression Model
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mt-4">
            {GOBLET_SQUAT_PROGRESSION.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 relative flex flex-col justify-between"
              >
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  {step.week}
                </div>
                <div className="text-xs font-bold text-white">
                  {step.desc}
                </div>
                {idx < GOBLET_SQUAT_PROGRESSION.length - 1 && (
                  <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 italic">
            This creates substantial progressive overload and hypertrophy stimulus even though the dumbbell weight never changes.
          </p>
        </div>
      </div>

      {/* 3. Effort Target & Reps in Reserve */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Effort Targets &amp; Reps In Reserve (RIR)
            </h3>
            <p className="text-xs text-slate-400">
              Guidelines on how close to failure each exercise set should be taken
            </p>
          </div>
        </div>

        {/* Guidelines Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-2/5">Exercise Category</th>
                <th className="py-3 px-4">Effort Guideline / Target RIR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {EFFORT_GUIDELINES.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {row.type}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-200 font-semibold">
                    {row.guideline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Important Alert */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-0.5">
              ⚠️ Important Fatigue Management:
            </strong>
            Do not turn every set into complete muscle failure. Stopping 1&ndash;2 reps before failure preserves form, protects connective tissue, and allows you to train consistently 6 days per week.
          </div>
        </div>
      </div>
    </div>
  );
}
