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
  Check,
  Activity,
  PlusCircle,
  X,
  Trash2
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

export const formatLocalDateKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const HISTORY_STORAGE_KEY = 'nexus_workout_history_v1';

export default function WorkoutCalendarView() {
  const [history, setHistory] = useState<Record<string, WorkoutHistoryEntry>>({});
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    formatLocalDateKey(new Date())
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
  const saveHistory = React.useCallback((newHistory: Record<string, WorkoutHistoryEntry>) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch {}
  }, []);

  // Calculate Streak (Timezone-Safe Local Calendar)
  const currentStreak = React.useMemo(() => {
    let streak = 0;
    const now = new Date();

    let startIndex = 0;
    const todayKey = formatLocalDateKey(now);
    if (!history[todayKey]) {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const yesterdayKey = formatLocalDateKey(yesterday);
      if (history[yesterdayKey]) {
        startIndex = 1;
      } else {
        return 0;
      }
    }

    for (let i = startIndex; i < 365; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateKey = formatLocalDateKey(d);

      if (history[dateKey]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [history]);

  const totalWorkoutsCount = React.useMemo(() => Object.keys(history).length, [history]);

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = React.useCallback(() => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const nextMonth = React.useCallback(() => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const todayStr = React.useMemo(() => formatLocalDateKey(new Date()), []);

  // Count workouts in current viewed month (Memoized)
  const thisMonthKeyPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const thisMonthWorkoutsCount = React.useMemo(
    () => Object.keys(history).filter((k) => k.startsWith(thisMonthKeyPrefix)).length,
    [history, thisMonthKeyPrefix]
  );

  const handleManualLog = React.useCallback(() => {
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
  }, [manualDayId, selectedDateStr, history, saveHistory]);

  const handleDeleteEntry = React.useCallback((dateKey: string) => {
    if (window.confirm(`Remove workout log for ${dateKey}?`)) {
      const updated = { ...history };
      delete updated[dateKey];
      saveHistory(updated);
    }
  }, [history, saveHistory]);

  const selectedEntry = history[selectedDateStr];

  // Recent history sorted descending (Memoized)
  const recentLogs = React.useMemo(
    () =>
      Object.values(history).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [history]
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto animate-fadeIn">
      {/* 1. Stat Summary Banners */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* Active Streak */}
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Streak</p>
            <h3 className="text-sm sm:text-lg font-black text-white truncate">
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </h3>
          </div>
        </div>

        {/* Total Logged */}
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Total Done</p>
            <h3 className="text-sm sm:text-lg font-black text-white truncate">{totalWorkoutsCount} Done</h3>
          </div>
        </div>

        {/* This Month */}
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">This Month</p>
            <h3 className="text-sm sm:text-lg font-black text-white truncate">{thisMonthWorkoutsCount} Sessions</h3>
          </div>
        </div>

        {/* Target Pace */}
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-md">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">Pace</p>
            <h3 className="text-sm sm:text-lg font-black text-white truncate">6 Days / Wk</h3>
          </div>
        </div>
      </div>

      {/* 2. Interactive Monthly Calendar */}
      <div className="p-3.5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 sm:space-y-4">
        {/* Month Header Navigation */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={prevMonth}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentMonthDate(new Date())}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-[11px] sm:text-xs font-bold transition active:scale-95"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <div key={i} className="py-0.5">
              <span className="sm:hidden">{d}</span>
              <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
            </div>
          ))}
        </div>

        {/* Days Grid: Uniform, Clean Aspect-Ratio Tiles */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-xl sm:rounded-2xl bg-transparent" />
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
                className={`relative aspect-square rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center justify-center text-center group active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-950/95 border-indigo-500 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400 z-10'
                    : hasWorkout
                    ? 'bg-emerald-950/60 hover:bg-emerald-950/80 border-emerald-700/80 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80 text-slate-400'
                }`}
              >
                {/* Day Number */}
                <span
                  className={`text-xs sm:text-sm leading-none font-bold ${
                    isToday && !hasWorkout
                      ? 'text-indigo-400 font-black'
                      : isSelected
                      ? 'text-white font-black'
                      : hasWorkout
                      ? 'text-emerald-300 font-black'
                      : 'text-slate-300'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Clean Status Accent Indicator */}
                {hasWorkout ? (
                  <div className="mt-1 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  </div>
                ) : isToday ? (
                  <div className="mt-1 flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-indigo-400" />
                  </div>
                ) : (
                  <div className="mt-1 w-1.5 h-1.5 opacity-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-800/70 text-[10px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span>Workout Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm border border-indigo-400" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* 3. Selected Date Detail & Action Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
          </div>

          <button
            onClick={() => setShowManualLogModal(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-bold transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{selectedEntry ? 'Re-Log' : 'Log Workout'}</span>
          </button>
        </div>

        {selectedEntry ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {(() => {
                    const pct =
                      selectedEntry.totalSetsCount > 0
                        ? Math.round(
                            (selectedEntry.completedSetsCount /
                              selectedEntry.totalSetsCount) *
                              100,
                          )
                        : 100;
                    return (
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${
                          pct === 100
                            ? "bg-emerald-900/80 text-emerald-300 border-emerald-700"
                            : "bg-indigo-900/80 text-indigo-300 border-indigo-700"
                        }`}
                      >
                        {pct}% DONE
                      </span>
                    );
                  })()}
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    Day {selectedEntry.dayNumber}: {selectedEntry.dayTitle}
                  </h4>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                  Recorded: <strong>{selectedEntry.completedSetsCount} / {selectedEntry.totalSetsCount} Sets Completed</strong> (
                  {selectedEntry.totalSetsCount > 0
                    ? Math.round(
                        (selectedEntry.completedSetsCount /
                          selectedEntry.totalSetsCount) *
                          100,
                      )
                    : 100}
                  %)
                </p>
                {/* Mini Progress Bar */}
                <div className="w-full max-w-xs bg-slate-800/90 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        selectedEntry.totalSetsCount > 0
                          ? Math.min(
                              100,
                              Math.round(
                                (selectedEntry.completedSetsCount /
                                  selectedEntry.totalSetsCount) *
                                  100,
                              ),
                            )
                          : 100
                      }%`,
                    }}
                  />
                </div>
                {selectedEntry.notes && (
                  <p className="text-[10px] sm:text-[11px] text-slate-400 italic mt-1">{selectedEntry.notes}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleDeleteEntry(selectedDateStr)}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 self-end sm:self-center py-1 px-2 rounded-lg bg-rose-950/40 border border-rose-900/60 shrink-0"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Log</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-300">No workout recorded on this date.</p>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Complete sets on the active workout screen or tap <strong>Log Workout</strong> above to record a session.
            </p>
          </div>
        )}
      </div>

      {/* 4. Recent Workout Timeline Feed */}
      {recentLogs.length > 0 && (
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">Recent Workout History</h4>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400">{recentLogs.length} Total</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {recentLogs.slice(0, 10).map((log) => {
              const percent =
                log.totalSetsCount > 0
                  ? Math.round((log.completedSetsCount / log.totalSetsCount) * 100)
                  : 100;

              return (
                <div
                  key={log.date}
                  onClick={() => setSelectedDateStr(log.date)}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-[11px] sm:text-xs border border-indigo-500/30 shrink-0">
                      D{log.dayNumber}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] xs:max-w-[220px] sm:max-w-none">
                        {log.dayTitle}
                      </h5>
                      <p className="text-[10px] sm:text-[11px] text-slate-400">
                        {new Date(log.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}{" "}
                        &bull; {log.completedSetsCount} / {log.totalSetsCount} sets
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black shrink-0 flex items-center gap-1 border ${
                      percent === 100
                        ? "bg-emerald-950/90 text-emerald-300 border-emerald-700/80"
                        : percent >= 50
                        ? "bg-indigo-950/90 text-indigo-300 border-indigo-700/80"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    <span>{percent}%</span>
                    {percent === 100 && <Check className="w-3 h-3 text-emerald-400" />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Log Modal */}
      {showManualLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white">Log Workout for {selectedDateStr}</h3>
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
