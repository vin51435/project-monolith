'use client';

import React, { useState, useEffect } from 'react';
import { NIGHT_ROUTINE_ITEMS, NightRoutineItem } from '@/data/workoutData';
import { formatLocalDateKey } from '@/components/WorkoutCalendarView';
import {
  Moon,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export default function NightRoutineView() {
  const STORAGE_KEY = 'nexus_night_routine_v1';
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 1. Load saved night routine on mount, automatically clearing when a new day starts
  useEffect(() => {
    try {
      const todayStr = formatLocalDateKey(new Date());
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only restore if the saved checklist belongs to today's local date
        if (parsed.date === todayStr && parsed.items && typeof parsed.items === 'object') {
          setCheckedItems(parsed.items);
        } else {
          // New day has begun: automatically clear yesterday's checklist
          localStorage.removeItem(STORAGE_KEY);
          setCheckedItems({});
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => {
      const next = {
        ...prev,
        [id]: !prev[id],
      };
      try {
        const todayStr = formatLocalDateKey(new Date());
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            date: todayStr,
            timestamp: Date.now(),
            items: next,
          })
        );
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const resetNightRoutine = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = NIGHT_ROUTINE_ITEMS.length;

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Daily Habit
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  ~10&ndash;20 Minutes
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Daily Night Routine
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                A daily maintenance and decompression session designed to promote spinal health, posture correction, and accelerated recovery without impairing your main PPL workouts.
              </p>
            </div>
          </div>

          {/* Checklist Progress */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <div className="text-left sm:text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tonight&apos;s Checklist
              </div>
              <div className="text-base sm:text-lg font-black text-indigo-400">
                {completedCount} / {totalCount} Done
              </div>
            </div>
            {completedCount > 0 && (
              <button
                onClick={resetNightRoutine}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-400 py-1 px-2 rounded-xl bg-slate-950 border border-slate-800 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* 2. Golden Rule Quote Card */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-950 to-slate-950 border-l-4 border-l-indigo-500 border border-slate-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            The Golden Rule of Night Training
          </div>
          <ul className="space-y-1 text-slate-300 list-disc list-inside">
            <li>
              <strong className="text-white">Daily =</strong> mobility, posture, light core, light skill work, and walking.
            </li>
            <li>
              <strong className="text-white">PPL Workout =</strong> actual high-intensity muscle-building overload.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Night Routine Items List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-3.5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Prescribed Nightly Sequence
        </h3>

        {/* Mobile / Responsive Card list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NIGHT_ROUTINE_ITEMS.map((item: NightRoutineItem) => {
            const isDone = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-950 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.exercise}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-900 border border-slate-800 text-indigo-300">
                        {item.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      <span className="text-slate-300 font-semibold">Dose:</span> {item.setsReps} &bull;{' '}
                      <span className="text-slate-300 font-semibold">Purpose:</span> {item.purpose}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Notes & Danger Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {/* Technique Tip */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-300 block mb-1">
                💡 Light Pull-Ups on &ldquo;Off&rdquo; Pull Day:
              </strong>
              That is fine, provided they are genuinely light for skill refinement:
              <br />
              &bull; <strong>Pull Day:</strong> 4 hard sets
              <br />
              &bull; <strong>Next night:</strong> 1&ndash;2 easy sets &times; 3&ndash;5 reps
            </div>
          </div>

          {/* Danger Alert */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-300 block mb-1">
                🚫 Do NOT do High-Intensity Failure Sets at Night:
              </strong>
              Never perform 3&ndash;4 sets to failure at night. That is no longer recovery/skill work; it impairs muscular repair and overtaxes your central nervous system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
