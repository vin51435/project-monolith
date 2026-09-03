'use client';

import React, { useState, useEffect } from 'react';
import {
  WORKOUT_DAYS,
  WorkoutDay,
  DayExercise,
  EXERCISE_DATABASE,
  ExerciseDetail
} from '@/data/workoutData';
import { formatLocalDateKey, WorkoutHistoryEntry, HISTORY_STORAGE_KEY } from '@/components/WorkoutCalendarView';
import ExerciseImage from '@/components/ExerciseImage';
import {
  CheckCircle2,
  Circle,
  Timer,
  Flame,
  Dumbbell,
  Lightbulb,
  Sparkles,
  RefreshCw,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  X
} from 'lucide-react';

interface DayWorkoutViewProps {
  selectedDayId: string;
  setSelectedDayId: (id: string) => void;
  onOpenTimer: (seconds?: number, name?: string, autoStart?: boolean, keepMinimized?: boolean) => void;
}

export default function DayWorkoutView({
  selectedDayId,
  setSelectedDayId,
  onOpenTimer,
}: DayWorkoutViewProps) {
  const STORAGE_KEY = 'nexus_completed_sets_v1';
  const EXPIRATION_MS = 16 * 60 * 60 * 1000; // 16-hour inactivity auto-reset window

  // Store completed sets: key format `dayId-exerciseNum-setIndex`
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, WorkoutHistoryEntry>>({});
  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  
  // Track which exercise cards are expanded inline
  const [expandedExerciseNum, setExpandedExerciseNum] = useState<number | null>(null);

  // Enlarged Image modal lightbox state
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const currentDay: WorkoutDay =
    WORKOUT_DAYS.find((d) => d.id === selectedDayId) || WORKOUT_DAYS[0];

  // Helper to fetch the latest logged history entry for a given day
  const getLatestHistoryEntry = React.useCallback(
    (dayId: string) => {
      const entries = Object.values(workoutHistory).filter((h) => h.dayId === dayId);
      if (entries.length === 0) return null;
      return entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    },
    [workoutHistory]
  );

  // Determine if a history log belongs to the CURRENT active training week/cycle
  const isLogFromCurrentCycle = React.useCallback(
    (log: WorkoutHistoryEntry) => {
      if (!log || !log.date) return false;
      const logTime = new Date(log.date).getTime();
      const nowTime = new Date().setHours(23, 59, 59, 999);
      const ageInDays = (nowTime - logTime) / (1000 * 60 * 60 * 24);

      // Logs older than 6 days are from a previous week/cycle
      if (ageInDays > 6) return false;

      // Check if user explicitly started a new week cycle
      try {
        const cycleStartDate = localStorage.getItem('nexus_cycle_start_date');
        if (cycleStartDate && log.date < cycleStartDate) {
          return false;
        }
      } catch {}

      // If this log is for a later day (e.g. Day 6), but Day 1 was logged more recently (new cycle started),
      // then this Day 6 log is from the previous cycle and must not show as active.
      const day1Log = getLatestHistoryEntry('day-1');
      if (day1Log && log.dayNumber > 1) {
        if (log.date < day1Log.date) {
          return false;
        }
      }

      return true;
    },
    [getLatestHistoryEntry]
  );

  const isSetDone = React.useCallback(
    (dayId: string, exNum: number, setIdx: number) => {
      const key = `${dayId}-${exNum}-${setIdx}`;
      if (completedSets[key] !== undefined) {
        return !!completedSets[key];
      }
      const latestLog = getLatestHistoryEntry(dayId);
      if (latestLog && isLogFromCurrentCycle(latestLog) && latestLog.completedSetsCount >= latestLog.totalSetsCount) {
        return true;
      }
      return false;
    },
    [completedSets, getLatestHistoryEntry, isLogFromCurrentCycle]
  );

  const resetDayProgress = React.useCallback((dayId: string) => {
    setCompletedSets((prev) => {
      const next = { ...prev };
      const targetDay = WORKOUT_DAYS.find((d) => d.id === dayId);
      if (targetDay?.exercises) {
        targetDay.exercises.forEach((ex) => {
          for (let i = 0; i < ex.sets; i++) {
            next[`${dayId}-${ex.num}-${i}`] = false;
          }
        });
      }
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            sets: next,
          })
        );
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const handleResetWeek = React.useCallback(() => {
    if (
      window.confirm(
        "Start a new training week? This will clear active set checkboxes across all 7 days so you can start Day 1 fresh."
      )
    ) {
      const todayStr = formatLocalDateKey(new Date());
      try {
        localStorage.setItem('nexus_cycle_start_date', todayStr);
      } catch {}

      setCompletedSets((prev) => {
        const next: Record<string, boolean> = {};
        WORKOUT_DAYS.forEach((day) => {
          if (day.exercises) {
            day.exercises.forEach((ex) => {
              for (let i = 0; i < ex.sets; i++) {
                next[`${day.id}-${ex.num}-${i}`] = false;
              }
            });
          }
        });
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              sets: next,
            })
          );
          sessionStorage.setItem('nexus_selected_day_id', 'day-1');
          sessionStorage.setItem('nexus_selected_day_date', todayStr);
        } catch {}
        return next;
      });
      setSelectedDayId('day-1');
      window.dispatchEvent(
        new CustomEvent('nexus_reset_progress', {
          detail: { action: 'reset_all' },
        })
      );
    }
  }, [setSelectedDayId]);

  const getDayCompletedCount = React.useCallback(
    (day: WorkoutDay) => {
      if (day.isRest || !day.exercises) return 0;
      let activeCheckedCount = 0;
      let hasExplicitEntry = false;

      day.exercises.forEach((ex) => {
        for (let i = 0; i < ex.sets; i++) {
          const key = `${day.id}-${ex.num}-${i}`;
          if (completedSets[key] !== undefined) {
            hasExplicitEntry = true;
            if (completedSets[key]) {
              activeCheckedCount++;
            }
          }
        }
      });

      if (hasExplicitEntry) {
        return activeCheckedCount;
      }

      // Check if this day was logged in calendar history during the CURRENT cycle
      const latestLog = getLatestHistoryEntry(day.id);
      if (latestLog && isLogFromCurrentCycle(latestLog)) {
        return latestLog.completedSetsCount;
      }

      return 0;
    },
    [completedSets, getLatestHistoryEntry, isLogFromCurrentCycle]
  );

  const getDayTotalSets = React.useCallback((day: WorkoutDay) => {
    if (day.isRest || !day.exercises) return 0;
    return day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  }, []);

  const completedSetsCount = React.useMemo(
    () => getDayCompletedCount(currentDay),
    [getDayCompletedCount, currentDay]
  );
  const totalSetsCount = React.useMemo(
    () => getDayTotalSets(currentDay),
    [getDayTotalSets, currentDay]
  );
  const progressPercent = React.useMemo(
    () => (totalSetsCount > 0 ? (completedSetsCount / totalSetsCount) * 100 : 0),
    [completedSetsCount, totalSetsCount]
  );

  // 1. Load saved sets and calendar history on initial mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const isRecent = parsed.timestamp && Date.now() - parsed.timestamp < EXPIRATION_MS;
        if (isRecent && parsed.sets && typeof parsed.sets === 'object') {
          setCompletedSets(parsed.sets);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      const rawHist = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (rawHist) {
        setWorkoutHistory(JSON.parse(rawHist));
      }
    } catch {
      // Ignore storage read errors
    } finally {
      setIsStorageLoaded(true);
    }
  }, []);

  // 2. Listen for reset / complete / history events
  useEffect(() => {
    const handleResetEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ dayId?: string; action?: string; date?: string }>;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.sets) {
            setCompletedSets(parsed.sets);
          }
        }

        const rawHist = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (rawHist) {
          setWorkoutHistory(JSON.parse(rawHist));
        } else {
          setWorkoutHistory({});
        }
      } catch {}

      if (customEvent.detail?.action === 'reset_today' && customEvent.detail?.dayId) {
        resetDayProgress(customEvent.detail.dayId);
      } else if (customEvent.detail?.action === 'reset_all') {
        const next: Record<string, boolean> = {};
        WORKOUT_DAYS.forEach((day) => {
          if (day.exercises) {
            day.exercises.forEach((ex) => {
              for (let i = 0; i < ex.sets; i++) {
                next[`${day.id}-${ex.num}-${i}`] = false;
              }
            });
          }
        });
        setCompletedSets(next);
      } else if (customEvent.detail?.dayId && customEvent.detail?.action !== 'manual_log' && customEvent.detail?.action !== 'log_done') {
        resetDayProgress(customEvent.detail.dayId);
      }
    };
    window.addEventListener('nexus_reset_progress', handleResetEvent);
    return () => window.removeEventListener('nexus_reset_progress', handleResetEvent);
  }, [resetDayProgress]);

  // 3. Persist completed sets whenever they are updated
  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      if (Object.keys(completedSets).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            sets: completedSets,
          })
        );
      }
    } catch {
      // Ignore storage write errors
    }
  }, [completedSets, isStorageLoaded]);

  // 4. Automatically record workout session to device calendar history
  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      const todayCount = getDayCompletedCount(currentDay);
      const totalSets = getDayTotalSets(currentDay);
      if (todayCount > 0) {
        const todayStr = formatLocalDateKey(new Date());
        const HISTORY_KEY = 'nexus_workout_history_v1';
        const raw = localStorage.getItem(HISTORY_KEY);
        const history = raw ? JSON.parse(raw) : {};

        history[todayStr] = {
          date: todayStr,
          dayId: currentDay.id,
          dayNumber: currentDay.dayNumber,
          dayTitle: currentDay.title,
          completedSetsCount: todayCount,
          totalSetsCount: totalSets,
          timestamp: Date.now(),
        };
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch {
      // Ignore storage write errors
    }
  }, [completedSets, isStorageLoaded, currentDay, getDayCompletedCount, getDayTotalSets]);

  // 5. Log & finalize calendar session when rest timer finishes
  useEffect(() => {
    const handleRestCompleted = (e: Event) => {
      const customEvent = e as CustomEvent<{ exerciseName?: string; completedAt?: number }>;
      try {
        const todayCount = getDayCompletedCount(currentDay);
        const totalSets = getDayTotalSets(currentDay);
        if (todayCount > 0) {
          const todayStr = formatLocalDateKey(new Date());
          const HISTORY_KEY = 'nexus_workout_history_v1';
          const raw = localStorage.getItem(HISTORY_KEY);
          const history = raw ? JSON.parse(raw) : {};

          history[todayStr] = {
            date: todayStr,
            dayId: currentDay.id,
            dayNumber: currentDay.dayNumber,
            dayTitle: currentDay.title,
            completedSetsCount: todayCount,
            totalSetsCount: totalSets,
            timestamp: customEvent.detail?.completedAt || Date.now(),
          };
          localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
      } catch {
        // Ignore storage errors
      }
    };

    window.addEventListener('nexus_rest_completed', handleRestCompleted);
    return () => window.removeEventListener('nexus_rest_completed', handleRestCompleted);
  }, [currentDay, completedSets, getDayCompletedCount, getDayTotalSets]);

  const toggleExpand = React.useCallback((exNum: number) => {
    setExpandedExerciseNum((prev) => (prev === exNum ? null : exNum));
  }, []);

  const toggleSet = React.useCallback((
    dayId: string,
    exNum: number,
    setIndex: number,
    restString: string,
    exName: string
  ) => {
    const key = `${dayId}-${exNum}-${setIndex}`;
    const currentlyDone = isSetDone(dayId, exNum, setIndex);
    const willBeChecked = !currentlyDone;

    setCompletedSets((prev) => {
      const next = { ...prev };
      const latestLog = getLatestHistoryEntry(dayId);
      if (latestLog && latestLog.completedSetsCount >= latestLog.totalSetsCount) {
        const targetDay = WORKOUT_DAYS.find((d) => d.id === dayId);
        if (targetDay?.exercises) {
          targetDay.exercises.forEach((ex) => {
            for (let i = 0; i < ex.sets; i++) {
              const k = `${dayId}-${ex.num}-${i}`;
              if (next[k] === undefined) {
                next[k] = true;
              }
            }
          });
        }
      }

      const targetDay = WORKOUT_DAYS.find((d) => d.id === dayId);
      const targetEx = targetDay?.exercises?.find((e) => e.num === exNum);
      const totalSetsForEx = targetEx?.sets || 4;

      if (!willBeChecked) {
        // Cascading Undo: If undoing Set 2 (index 1), also reset Set 3 (index 2) and all subsequent sets!
        for (let i = setIndex; i < totalSetsForEx; i++) {
          next[`${dayId}-${exNum}-${i}`] = false;
        }
      } else {
        // Checking Set: Mark this set and all prior sets leading up to it as done
        for (let i = 0; i <= setIndex; i++) {
          next[`${dayId}-${exNum}-${i}`] = true;
        }
      }

      return next;
    });

    // If newly completed, parse rest seconds and offer/auto-start timer
    if (willBeChecked) {
      const match = restString.match(/(\d+)/);
      const restSec = match ? parseInt(match[1], 10) : 60;
      onOpenTimer(restSec, exName, true, true);
    }
  }, [isSetDone, getLatestHistoryEntry, onOpenTimer]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Day Selector Carousel / Pills */}
      <div className="bg-slate-950/80 p-2 sm:p-3 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Training Day
            </span>
            <span className="text-xs font-semibold text-indigo-400">
              (Day {currentDay.dayNumber} of 7)
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetWeek}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-amber-300 py-1 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition active:scale-95 shadow-sm"
            title="Start a new training week / reset 7-day cycle"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Start New Week</span>
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
          {WORKOUT_DAYS.map((day) => {
            const isSelected = day.id === currentDay.id;
            const completed = getDayCompletedCount(day);
            const total = getDayTotalSets(day);
            const isDayDone = total > 0 && completed === total;

            return (
              <button
                key={day.id}
                onClick={() => {
                  setSelectedDayId(day.id);
                  setExpandedExerciseNum(null);
                }}
                className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition active:scale-95 text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-bold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 font-medium'
                }`}
              >
                <span className="text-[11px] sm:text-xs opacity-80">
                  Day {day.dayNumber}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate max-w-full">
                  {day.title.split(' ')[0]}
                </span>
                {day.isRest ? (
                  <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">Rest</span>
                ) : (
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    {completed}/{total}
                  </span>
                )}
                {isDayDone && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white font-black shadow-sm">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Day Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-4 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DAY {currentDay.dayNumber}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                ~60 Min Workout
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentDay.title} &mdash; {currentDay.subtitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              Focus: <span className="text-white font-semibold">{currentDay.focus}</span>
            </p>
          </div>

          {/* Progress & Reset Action */}
          {!currentDay.isRest && (
            <div className="flex items-center sm:flex-col items-start sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="text-left sm:text-right">
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Workout Progress
                </div>
                <div className="text-base sm:text-lg font-black text-indigo-400">
                  {completedSetsCount} / {totalSetsCount} Sets ({Math.round(progressPercent)}%)
                </div>
              </div>
              {completedSetsCount > 0 && (
                <button
                  onClick={() => resetDayProgress(currentDay.id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-400 py-1 px-2.5 rounded-xl bg-slate-800/80 border border-slate-700 transition"
                  title="Reset completed sets"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Sets
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!currentDay.isRest && totalSetsCount > 0 && (
          <div className="relative z-10 w-full h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Technique Tip Alert */}
        {currentDay.techniqueTip && (
          <div className="relative z-10 mt-4 p-3 sm:p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-start gap-2.5 sm:gap-3">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-indigo-200 uppercase tracking-wider">
                6 kg Key Technique
              </h4>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-0.5">
                {currentDay.techniqueTip}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. REST DAY CONTENT */}
      {currentDay.isRest && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Full Recovery &amp; Regeneration Day</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              Muscles grow during recovery, not while working out. Keep today active with light movement, clean hydration, and quality sleep.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-2xl mx-auto">
              {currentDay.restActivities?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Activity #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.activity}</h4>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 mt-2 bg-emerald-950/50 py-1 px-2.5 rounded-lg border border-emerald-800/40 inline-block w-fit">
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. WORKOUT EXERCISE CARDS (WITH INLINE DROPDOWN GUIDE) */}
      {!currentDay.isRest && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-indigo-400" />
              Prescribed Sequence ({currentDay.exercises.length} Exercises)
            </h3>
            <span className="text-[11px] sm:text-xs text-indigo-300 font-medium hidden xs:inline">
              Tap card for form guide
            </span>
          </div>

          {currentDay.exercises.map((ex: DayExercise) => {
            const exDetail = EXERCISE_DATABASE.find(
              (d) => d.num === ex.exerciseId || d.name.toLowerCase() === ex.name.toLowerCase()
            );
            const isExpanded = expandedExerciseNum === ex.num;
            const match = ex.rest.match(/(\d+)/);
            const restSec = match ? parseInt(match[1], 10) : 60;

            return (
              <div
                key={ex.num}
                id={`workout-exercise-${ex.num}`}
                className={`bg-slate-900 border rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 transition-all shadow-md space-y-3 ${
                  isExpanded
                    ? 'border-indigo-500/80 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
              >
                {/* Exercise Header: Click to Toggle Inline Guide Dropdown */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => toggleExpand(ex.num)}
                    className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 cursor-pointer group"
                    title={isExpanded ? 'Click to hide details' : 'Click to show form guide'}
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white border border-indigo-500/30 text-indigo-400 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5 transition">
                      {ex.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition tracking-tight flex items-center gap-1.5">
                        <span className="truncate">{ex.name}</span>
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                        <span className="text-slate-300 font-medium">Target:</span> {ex.target}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Dropdown Button */}
                  {exDetail && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(ex.num)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl border shadow-sm shrink-0 transition active:scale-95 ${
                        isExpanded
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-800/60'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide' : 'Form'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* INLINE EXPANDED FORM GUIDE DROPDOWN */}
                {isExpanded && exDetail && (
                  <div className="pt-3 pb-1 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                    {/* Demonstration Visual (Zero-CLS Lazy Loaded) */}
                    <ExerciseImage
                      src={exDetail.image}
                      alt={exDetail.name}
                      onEnlarge={() => setEnlargedImage(exDetail.image)}
                    />

                    {/* Targeted Muscles Breakdown */}
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
                      <h5 className="font-bold text-white text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1 text-indigo-400">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        Targeted Muscles
                      </h5>
                      <p className="text-slate-300">
                        <strong className="text-white">Primary:</strong> {exDetail.primary}
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        <strong className="text-slate-300">Secondary:</strong> {exDetail.secondary}
                      </p>
                    </div>

                    {/* How to Perform Instructions */}
                    <div className="space-y-1.5">
                      <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-300">
                        📋 How to Perform
                      </h5>
                      <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside pl-0.5 leading-relaxed">
                        {exDetail.steps.map((step, idx) => (
                          <li key={idx} className="marker:text-indigo-400 marker:font-bold">
                            {step.replace(/<\/?strong>/g, '')}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Mind-Muscle Cue Card */}
                    <div className="p-3 rounded-xl bg-emerald-950/40 border-l-4 border-l-emerald-500 border border-slate-800 text-xs">
                      <strong className="text-emerald-300 block font-bold mb-0.5">
                        🧠 Mind-Muscle Connection:
                      </strong>
                      <p className="text-emerald-100/90 italic leading-relaxed">
                        &ldquo;{exDetail.cue}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {/* Integrated Metrics & Set Tracker Tray (Single row on desktop, 2-tier on mobile) */}
                <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  {/* Left: Target Reps & Rest Timer Button */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 text-xs shrink-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Reps:
                      </span>
                      <span className="font-bold text-white text-xs">
                        {ex.reps}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTimer(restSec, ex.name, false, false)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 text-xs font-bold active:scale-95 transition"
                      title="Click to start rest timer"
                    >
                      <Timer className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Rest {ex.rest}</span>
                    </button>
                  </div>

                  {/* Right: Interactive Sets Checklist Buttons (Inline row on sm/desktop, grid on mobile) */}
                  <div
                    className={`grid gap-1.5 sm:flex sm:items-center ${
                      ex.sets === 4
                        ? 'grid-cols-4'
                        : ex.sets === 3
                        ? 'grid-cols-3'
                        : 'grid-cols-2'
                    }`}
                  >
                    {Array.from({ length: ex.sets }).map((_, setIdx) => {
                      const isDone = isSetDone(currentDay.id, ex.num, setIdx);

                      return (
                        <button
                          key={setIdx}
                          type="button"
                          onClick={() =>
                            toggleSet(currentDay.id, ex.num, setIdx, ex.rest, ex.name)
                          }
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3.5 rounded-xl border text-xs font-bold transition active:scale-95 sm:min-w-[76px] ${
                            isDone
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm shadow-emerald-600/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                          title={`Mark Set ${setIdx + 1} Done`}
                        >
                          <span>Set {setIdx + 1}</span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enlarged Image Lightbox */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white p-3 rounded-3xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-slate-900 text-white rounded-full border border-slate-700 shadow-xl hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlargedImage}
              alt="Enlarged exercise preview"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
