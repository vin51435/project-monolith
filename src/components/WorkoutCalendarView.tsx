'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  CheckCircle2,
  Dumbbell,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  PlusCircle,
  X
} from 'lucide-react';
import { WORKOUT_DAYS } from '@/data/workoutData';

export interface WorkoutHistoryEntry {
  date: string; // 'YYYY-MM-DD'
  dayId: string;
  dayNumber: number;
  dayTitle: string;
  completedSetsCount: number;
  totalSetsCount: number;
  timestamp: number;
  notes?: string;
}

export const HISTORY_STORAGE_KEY = 'nexus_workout_history_v1';

export default function WorkoutCalendarView() {
  const [history, setHistory] = useState<Record<string, WorkoutHistoryEntry>>({});
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showManualLogModal, setShowManualLogModal] = useState<boolean>(false);
  const [manualDayId, setManualDayId] = useState<string>('day-1');

  // Load history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: Record<string, WorkoutHistoryEntry>) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch {}
  };

  // Calculate Streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      if (history[dateKey]) {
        streak++;
      } else if (i === 0) {
        // Today not logged yet, check yesterday
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const totalWorkoutsCount = Object.keys(history).length;
  const currentStreak = calculateStreak();

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Count workouts in current viewed month
  const thisMonthKeyPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const thisMonthWorkoutsCount = Object.keys(history).filter((k) =>
    k.startsWith(thisMonthKeyPrefix)
  ).length;

  const handleManualLog = () => {
    const targetDay = WORKOUT_DAYS.find((d) => d.id === manualDayId) || WORKOUT_DAYS[0];
    const totalSets = targetDay.exercises
      ? targetDay.exercises.reduce((acc, ex) => acc + ex.sets, 0)
      : 18;

    const newEntry: WorkoutHistoryEntry = {
      date: selectedDateStr,
      dayId: targetDay.id,
      dayNumber: targetDay.dayNumber,
      dayTitle: targetDay.title,
      completedSetsCount: totalSets,
      totalSetsCount: totalSets,
      timestamp: Date.now(),
      notes: 'Logged via Calendar',
    };

    const updated = { ...history, [selectedDateStr]: newEntry };
    saveHistory(updated);
    setShowManualLogModal(false);
  };

  const handleDeleteEntry = (dateKey: string) => {
    if (window.confirm(`Remove workout log for ${dateKey}?`)) {
      const updated = { ...history };
      delete updated[dateKey];
      saveHistory(updated);
    }
  };

  const selectedEntry = history[selectedDateStr];

  // Recent history sorted descending
  const recentLogs = Object.values(history).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* 1. Stat Summary Banners */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Streak */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Streak</p>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </h3>
          </div>
        </div>

        {/* Total Logged */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Workouts</p>
            <h3 className="text-lg sm:text-xl font-black text-white">{totalWorkoutsCount} Done</h3>
          </div>
        </div>

        {/* This Month */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">This Month</p>
            <h3 className="text-lg sm:text-xl font-black text-white">{thisMonthWorkoutsCount} Sessions</h3>
          </div>
        </div>

        {/* Consistency Rate */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Pace</p>
            <h3 className="text-lg sm:text-xl font-black text-white">6 Days / Wk</h3>
          </div>
        </div>
      </div>

      {/* 2. Interactive Monthly Calendar */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonthDate(new Date())}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-bold transition active:scale-95"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <div key={i} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[44px] sm:min-h-[64px] rounded-2xl bg-slate-950/20 border border-transparent" />
          ))}

          {/* Actual days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;
            const entry = history[dateStr];
            const hasWorkout = Boolean(entry);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`relative min-h-[48px] sm:min-h-[68px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between text-left group active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-950/90 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400'
                    : hasWorkout
                    ? 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-700/60 shadow-sm'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'px-1.5 py-0.2 rounded-lg bg-indigo-600 text-white font-black'
                        : isSelected
                        ? 'text-white font-black'
                        : hasWorkout
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasWorkout && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                {hasWorkout ? (
                  <div className="mt-1">
                    <p className="text-[10px] font-bold text-emerald-300 truncate hidden sm:block">
                      Day {entry.dayNumber}: {entry.dayTitle.split('(')[0]}
                    </p>
                    <p className="text-[9px] text-emerald-400/80 font-medium hidden sm:block">
                      {entry.completedSetsCount} sets
                    </p>
                    <div className="sm:hidden flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 hidden sm:block text-[9px] text-slate-600 font-medium">
                    {isToday ? 'Today' : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Date Detail & Action Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm sm:text-base font-bold text-white">
              Selected Day: {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
          </div>

          <button
            onClick={() => setShowManualLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{selectedEntry ? 'Edit / Re-Log' : 'Log Workout'}</span>
          </button>
        </div>

        {selectedEntry ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/60">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-900/80 text-emerald-300 text-[10px] font-black border border-emerald-700">
                    COMPLETED
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Day {selectedEntry.dayNumber}: {selectedEntry.dayTitle}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Recorded: <strong>{selectedEntry.completedSetsCount} / {selectedEntry.totalSetsCount} Sets Completed</strong>
                </p>
                {selectedEntry.notes && (
                  <p className="text-[11px] text-slate-400 italic mt-0.5">{selectedEntry.notes}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDeleteEntry(selectedDateStr)}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline self-end sm:self-center"
            >
              Delete Log
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">No workout recorded on this date.</p>
            <p className="text-xs text-slate-500">
              Complete sets on the active workout screen or tap <strong>Log Workout</strong> above to record a session manually.
            </p>
          </div>
        )}
      </div>

      {/* 4. Recent Workout Timeline Feed */}
      {recentLogs.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm sm:text-base font-bold text-white">Recent Workout History</h4>
            </div>
            <span className="text-xs text-slate-400">{recentLogs.length} Total Entries</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {recentLogs.slice(0, 10).map((log) => (
              <div
                key={log.date}
                onClick={() => setSelectedDateStr(log.date)}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-500/30">
                    D{log.dayNumber}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">{log.dayTitle}</h5>
                    <p className="text-[11px] text-slate-400">
                      {new Date(log.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} &bull; {log.completedSetsCount} sets completed
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  ✓ Recorded
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Log Modal */}
      {showManualLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Workout for {selectedDateStr}</h3>
              <button
                onClick={() => setShowManualLogModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Routine Completed:</label>
              <select
                value={manualDayId}
                onChange={(e) => setManualDayId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                {WORKOUT_DAYS.map((d) => (
                  <option key={d.id} value={d.id}>
                    Day {d.dayNumber}: {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowManualLogModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleManualLog}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Save Workout Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
