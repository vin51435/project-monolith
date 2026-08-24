'use client';

import React from 'react';
import { WEEKLY_SCHEDULE, WORKOUT_METADATA } from '@/data/workoutData';
import { Calendar, Dumbbell, Clock, Flame, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

interface WeeklyScheduleViewProps {
  onSelectDay: (dayId: string) => void;
}

export default function WeeklyScheduleView({ onSelectDay }: WeeklyScheduleViewProps) {
  const getBadgeColor = (workout: string) => {
    if (workout.startsWith('Push')) return 'bg-blue-950 text-blue-300 border-blue-800';
    if (workout.startsWith('Pull')) return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    if (workout.startsWith('Legs')) return 'bg-amber-950 text-amber-300 border-amber-800';
    return 'bg-purple-950 text-purple-300 border-purple-800';
  };

  return (
    <div className="space-y-6">
      {/* 1. Program Summary Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Program Overview &amp; Strategy
            </h2>
            <p className="text-xs text-slate-400">
              6-Day Push / Pull / Legs Hypertrophy Split
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Dumbbell className="w-3.5 h-3.5" /> Equipment
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {WORKOUT_METADATA.equipment}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" /> Duration
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {WORKOUT_METADATA.duration}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {WORKOUT_METADATA.schedule}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" /> Strategy
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              High reps, tempo &amp; unilateral overload
            </p>
          </div>
        </div>
      </div>

      {/* 2. Weekly Split Cards & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Weekly Schedule
          </h3>
          <span className="text-xs text-slate-400">
            Tap any day to view workout
          </span>
        </div>

        {/* Mobile / Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEEKLY_SCHEDULE.map((item) => {
            const isRest = item.workout === 'Rest';
            return (
              <button
                key={item.id}
                onClick={() => onSelectDay(item.id)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition group active:scale-98 ${
                  isRest
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950/90'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400">
                      {item.day}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${getBadgeColor(
                        item.workout
                      )}`}
                    >
                      {item.workout}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-300 mt-1.5">
                    {item.focus}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-xl bg-slate-900 group-hover:bg-indigo-600/20 text-slate-500 group-hover:text-indigo-400 flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/30 transition shrink-0 ml-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop Table View (Exact fidelity to HTML table) */}
        <div className="hidden md:block mt-6 overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-1/4">Day</th>
                <th className="py-3 px-4 w-1/4">Workout</th>
                <th className="py-3 px-4">Primary Targeted Muscle Groups</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {WEEKLY_SCHEDULE.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectDay(row.id)}
                  className="hover:bg-slate-900/80 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-bold text-white">{row.day}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeColor(
                        row.workout
                      )}`}
                    >
                      {row.workout}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 text-xs sm:text-sm">
                    {row.focus}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-xs font-bold text-indigo-400 group-hover:underline">
                      Open &rarr;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
